import fs from 'fs-extra'
import cli from 'cli-ux'
import {google, Auth} from 'googleapis'
import {DateTime} from 'luxon'
import TokenCache from '../utils/token-cache'
import CSMError from '../error'
import ServiceBase from './service-base'
import {Settings} from '../utils/settings'

// spread sheetは、2100行目以降しか相手にしない
const SHEET_START_ROW = 2100

class GSheetManager extends ServiceBase {
  private readonly tokenCache

  constructor(settings: Settings) {
    super(settings)

    this.tokenCache = new TokenCache<Auth.Credentials>(Settings.CONFIG_FOLDER_PATH, 'sheet')
  }

  async login() {
    this.tokenCache.clear()
    await this.authorize(true)
  }

  private async authorize(force = false): Promise<Auth.OAuth2Client> {
    const credInfoBuffer = fs.readFileSync(this.settings.settingsInfo.sheetAuthConfigFilePath)
    const credential: GSheetCredential = JSON.parse(credInfoBuffer.toString())

    // eslint-disable-next-line camelcase
    const {client_secret, client_id, redirect_uris} = credential.installed
    // eslint-disable-next-line camelcase
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
    const tokenInfo = this.tokenCache.read()
    if (tokenInfo && !force) {
      oAuth2Client.setCredentials(tokenInfo)
      return oAuth2Client
    }

    await this.getNewToken(oAuth2Client)
    return oAuth2Client
  }

  private async getNewToken(oAuth2Client: Auth.OAuth2Client) {
    const scope = this.settings.settingsInfo.sheet.SCOPES
    const authUrl = oAuth2Client.generateAuthUrl({
      // eslint-disable-next-line camelcase
      access_type: 'offline',
      scope: scope,
    })

    await cli.anykey('認証のためプラウザを開きます。何かキーを押してください。')
    await cli.open(authUrl)
    cli.log('それか、↓このURLを開いてもいいです。')
    cli.url('google auth', authUrl)

    const code = await cli.prompt('画面のトークンをここに貼り付けてください。')

    const tokenResponse = await oAuth2Client.getToken(code).catch(error => {
      throw new CSMError('failed to get token from google', error)
    })
    oAuth2Client.setCredentials(tokenResponse.tokens)
    this.tokenCache.write(tokenResponse.tokens)
  }

  public async getData(fromRow: number, toRow: number, processRow: (row: GSheetRowData) => any) {
    if (fromRow <= 0 || fromRow > toRow || SHEET_START_ROW > fromRow) {
      throw new CSMError(`Range specified is invalid fromRow: ${fromRow}, toRow: ${toRow}`)
    }

    const range = `answers!A${fromRow}:Y${toRow}`
    const oAuth2Client = await this.authorize()
    const sheets = google.sheets({version: 'v4', auth: oAuth2Client})

    let sheetData
    try {
      const spreadsheetId = this.settings.settingsInfo.sheet.SPREAD_SHEET_ID
      sheetData = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      })
    } catch (error) {
      throw new CSMError('g-sheet sheets.spreadsheets.values.get', error)
    }

    const rows = sheetData.data.values
    if (!rows || rows.length === 0) {
      console.warn('No data found in the google sheet')
      return
    }

    // const queue = []
    let i = -1
    for (const row of rows) {
      i++
      const args = makeRowArgs(row, fromRow + i)
      // const p = processRow(args)
      // eslint-disable-next-line no-await-in-loop
      await processRow(args)
      // queue.push(p)
    }
    // await Promise.all(queue)
  }
}

function colValue(row: string[]) {
  return function (col: string) {
    const i = col.charCodeAt(0) - 65 // "A".charCodeAt(0) : 65
    return row[i]
  }
}

function makeRowArgs(row: string[], rowNumber: number): GSheetRowData {
  const col = colValue(row)
  const mark = col('A')
  const timeStamp = col('B')
  const companyName = col('G')
  const eid = col('H')
  const sharedURL = col('W')
  const dateRange = col('K')
  const comment = col('S')
  const {startDate, endDate} = getDateRange(dateRange)

  return {
    rowNumber,
    mark,
    timeStamp,
    companyName,
    eid,
    sharedURL,
    dateRange,
    comment,
    startDate,
    endDate,
  }
}

function getDateRange(range: string) {
  const num = Number(range.charAt(0))
  const dt = DateTime.now()
  const startDate = dt.minus({months: num}).startOf('month').toISODate()
  const endDate = dt.minus({months: 1}).endOf('month').toISODate()
  return {startDate, endDate}
}

interface GSheetCredential {
  installed: {
    // eslint-disable-next-line camelcase
    client_id: string;
    // eslint-disable-next-line camelcase
    project_id: string;
    // eslint-disable-next-line camelcase
    auth_uri: string;
    // eslint-disable-next-line camelcase
    token_uri: string;
    // eslint-disable-next-line camelcase
    auth_provider_x509_cert_url: string;
    // eslint-disable-next-line camelcase
    client_secret: string;
    // eslint-disable-next-line camelcase
    redirect_uris: [string, string];
  };
}

interface GSheetRowData {
  rowNumber: number;
  mark: string;
  timeStamp: string;
  companyName: string;
  eid: string;
  sharedURL: string;
  dateRange: string;
  comment: string;
  startDate: string;
  endDate: string;
}

export {GSheetManager, GSheetRowData}
