import axios, {AxiosInstance} from 'axios'
import * as fs from 'fs-extra'
import {DateTime} from 'luxon'
import path from 'node:path'

import TokenCache from '../utils/token-cache'
import ServiceBase from './service-base'
import {Settings, TableauConfig} from '../utils/settings'
import CSMError from '../error'

export default class TableauManager extends ServiceBase {
  private axios: AxiosInstance
  private tokenCache
  private tableauConfig: TableauConfig

  constructor(settings: Settings) {
    super(settings)

    this.tableauConfig = this.settings.settingsInfo.tableau

    const {URL, API_VERSION} = this.tableauConfig
    this.tokenCache = new TokenCache<Credentials>(Settings.CONFIG_FOLDER_PATH, 'tableau')

    this.axios = axios.create({
      baseURL: `${URL}/api/${API_VERSION}`,
      timeout: 0,
    })
  }

  async login() {
    this.tokenCache.clear()
    await this.getCredentials(true)
  }

  private async getCredentials(force = false): Promise<Credentials> {
    const cachedToken = await this.tokenCache.read()
    if (!force && cachedToken) {
      this.axios.defaults.headers.common['X-Tableau-Auth'] = cachedToken.token
      return cachedToken
    }

    const signIn = {
      credentials: {
        personalAccessTokenName: this.tableauConfig.PAT_NAME,
        personalAccessTokenSecret: this.tableauConfig.PAT,
        site: {
          contentUrl: 'box',
        },
      },
    }

    const authRes = await this.axios.post('/auth/signin', signIn)
    const {credentials} = authRes.data

    this.tokenCache.write(credentials)

    this.axios.defaults.headers.common['X-Tableau-Auth'] = credentials.token

    return credentials
  }

  // eslint-disable-next-line max-params
  private async getOverviewPDF(
    credentials: Credentials,
    eid: string,
    startDate: string,
    endDate: string,
    outFolder: string,
  ): Promise<void> {
    console.debug(`getting overview pdf for EID:${eid} start`)

    const {VIEW_ID_OVERVIEW} = this.tableauConfig
    const today = TableauManager.getTodayString()
    const res = await this.axios.get(
      `sites/${credentials.site.id}/views/${VIEW_ID_OVERVIEW}/pdf?vf_EID=${eid}&vf_Start Date=${startDate}&vf_End Date=${endDate}`,
      {responseType: 'stream'},
    )

    const outFile = path.join(outFolder, `Overview_EID${eid}_${today}.pdf`)
    res.data.pipe(fs.createWriteStream(outFile))
    console.log(`getting overview pdf for EID:${eid} done`)
    console.log(outFile)
  }

  private static getTodayString() {
    const dt = DateTime.now()
    const today = dt.toISODate()
    return today
  }

  // eslint-disable-next-line max-params
  private async getProductActionPDF(
    credentials: Credentials,
    eid: string,
    startDate: string,
    _endDate: string,
    outFolder: string,
  ): Promise<void> {
    console.debug(`getting product action pdf for EID:${eid} start`)

    const {VIEW_ID_PRODUCT_ACTION} = this.tableauConfig
    const res = await this.axios.get(
      `sites/${credentials.site.id}/views/${VIEW_ID_PRODUCT_ACTION}/pdf?vf_EID=${eid}&vf_Date=${startDate}&vf_Date Range=3 months`,
      {responseType: 'stream'},
    )

    const today = TableauManager.getTodayString()
    const outFile = path.join(outFolder, `Product_Actions_EID${eid}_${today}.pdf`)

    res.data.pipe(
      fs.createWriteStream(outFile),
    )

    console.log(`getting product action pdf for EID:${eid} done`)
    console.log(outFile)
  }

  async downloadPDF(eid: string, startDate: string, endDate: string, outFolder: string) {
    const credentials = await this.getCredentials()

    const promise1 = this.getOverviewPDF(credentials, eid, startDate, endDate, outFolder)
    const promise2 = this.getProductActionPDF(credentials, eid, startDate, endDate, outFolder)

    try {
      await Promise.all([promise1, promise2])
    } catch (error) {
      console.error(JSON.stringify(error))
      throw new CSMError('Failed to download pdfs', error)
    }

    // return outFolder
  }
}

interface Credentials {
  site: {
    id: string;
    contentUrl: string;
  };
  user: {
    id: string;
  };
  token: string;
  estimatedTimeToExpiration: string;
}

// interface TableauToken {
//   exp: number;
//   credentials: Credentials;
// }
