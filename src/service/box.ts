import ServiceBase from './service-base'
import CSMError from '../error'
import cli from 'cli-ux'
import path from 'node:path'

const express = require('express')

import fs from 'node:fs'
import {GSheetRowData} from './sheet'
import {BoxConfig, Settings} from '../utils/settings'
import BoxNodeSDK from 'box-node-sdk/lib/box-node-sdk'
// import TokenCache from '../utils/token-cache'
import BoxClient from 'box-node-sdk/lib/box-client'
import BoxTokenStore from '../utils/BoxTokenStore'

export default class BoxManager extends ServiceBase {
  private sdk: BoxNodeSDK
  // private saClient: BoxClient

  // private tokenCache
  private boxConfig: BoxConfig
  private boxTokenStore: BoxTokenStore<BoxTokenInfo>

  constructor(settings: Settings) {
    super(settings)
    // this.tokenCache = new TokenCache<TokenInfo>(Settings.CONFIG_FOLDER_PATH, 'box', 1)
    this.boxTokenStore = new BoxTokenStore(Settings.CONFIG_FOLDER_PATH)
    this.boxConfig = this.settings.settingsInfo.box
    const {CLIENT_ID, CLIENT_SECRET} = this.settings.settingsInfo.box
    // const config = fs.readJSONSync(settings.settingsInfo.boxAuthConfigFilePath)
    // this.sdk = BoxSDKNode.getPreconfiguredInstance(config)
    this.sdk = new BoxNodeSDK({clientID: CLIENT_ID, clientSecret: CLIENT_SECRET})
    // this.saClient = this.sdk.getAppAuthClient('enterprise')
  }

  async login() {
    // this.tokenCache.clear()
    this.boxTokenStore.clear(err => {
      console.log('failed to clear boxTokenStore', err)
    })
    await this.getToken()
  }

  async getClient() {
    const tokenInfo = await this.getToken()
    // const client = this.sdk.getBasicClient(tokenInfo.accessToken)
    const client = this.sdk.getPersistentClient(tokenInfo, this.boxTokenStore)
    return client
  }

  async getToken(): Promise<BoxTokenInfo> {
    // let tokenInfo = this.tokenCache.read()
    // if (tokenInfo) {
    //   return tokenInfo
    // }

    const app = express()

    // Promiseのハンドラ内部に渡される第一引数 resolveを外だしにして、後から使えるようにする。
    // 取り出したresolveを実行すると、pの処理が終了する。
    let resolve: any
    const p = new Promise(_resolve => {
      resolve = _resolve
    })

    // ローカスのサーバーで/redirectが呼び出されたときの処理
    app.get('/callback', function (req: any, res: any) {
      // 上で取り出したresolveを呼び出す
      resolve(req.query.code)
      res.end('OK. go back to CLI')
    })
    // サーバーを立ち上げる
    const server = await app.listen(3000)

    const loginUrl = this.sdk.getAuthorizeURL({
      // eslint-disable-next-line camelcase
      client_id: this.boxConfig.CLIENT_ID,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line camelcase
      response_type: 'code',
    })

    // Boxの認証画面をブラウザで開く。
    cli.open(loginUrl)

    // redirectの処理で、認可コードを取りだしてresolveが呼び出されるのを待つ
    const code = await p
    // 取り出した認可コードを表示
    console.log(`the code is ${code}`)
    // 不要になったので待たずにサーバーを停止
    server.close(() => {
      // console.log('server stopped')
    })
    // 認可コードからアクセストークン類を取り出す（ここから通常のBOX APIの利用方法）
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tokenInfo = await this.sdk.getTokensAuthorizationCodeGrant(code) as BoxTokenInfo
    if (!tokenInfo) {
      throw new CSMError('failed to get tokenInfo')
    }

    // this.tokenCache.write(tokenInfo)
    return tokenInfo
  }

  async upload(sharedURL: string, outFolder: string, row: GSheetRowData) {
    const client = await this.getClient()

    let boxFolder
    try {
      boxFolder = await client.sharedItems.get(sharedURL)
    } catch (error) {
      throw new CSMError(`failed to open shared link: ${sharedURL}`, error)
    }

    const items = fs.readdirSync(outFolder)
    const queue = []
    for (const item of items) {
      const filePath = path.join(outFolder, item)
      const p = this.uploadFile(filePath, item, boxFolder, row, client)
      queue.push(p)
    }

    await Promise.all(queue)
  }

  private async uploadFile(filePath: string, fileName: string, boxFolder: any, row: GSheetRowData, client: BoxClient) {
    console.log(
      `uploading to box: sheet[${row.rowNumber}] item: [${filePath}] to Box folder [id:${boxFolder.id}, name:${boxFolder.name}])`, fileName,
    )
    const stream = fs.createReadStream(filePath)

    try {
      const items = await client.files.uploadFile(boxFolder.id, fileName, stream)
      const file = items.entries[0]
      console.log(`uploaded file ( id: ${file.id} , name: ${file.name})`)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (error.statusCode === 409) {
        console.log(`${fileName} が既に、folder: ${boxFolder.id}に存在します。アップロードを取りやめます。`)
        return
      }

      throw new CSMError(`failed to upload ${filePath}`, error)
    }
  }
}

export interface BoxTokenInfo {
  accessToken: string
  refreshToken: string
  accessTokenTTLMS: number
  acquiredAtMS: number
}
