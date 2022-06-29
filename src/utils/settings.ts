import * as fs from 'fs-extra'
import path from 'node:path'
import os from 'node:os'
import CSMError from '../error'

export class Settings {
  get settingsInfo(): SettingsInfo {
    if (!this._settingsInfo) {
      throw new CSMError('something is wrong with this._settings')
    }

    return this._settingsInfo
  }

  static CONFIG_FOLDER_PATH = path.join(os.homedir(), '.csm')
  static SETTINGS_FILE_PATH = path.join(Settings.CONFIG_FOLDER_PATH, 'settings.json')

  private _settingsInfo: SettingsInfo | undefined

  static async check(): Promise<boolean> {
    if (!fs.existsSync(Settings.CONFIG_FOLDER_PATH)) {
      console.log(`${Settings.CONFIG_FOLDER_PATH} が有りません`)
      return false
    }

    if (!fs.existsSync(Settings.SETTINGS_FILE_PATH)) {
      console.log(`${Settings.CONFIG_FOLDER_PATH} が有りません`)
      return false
    }

    // settings.json
    const settingsJson: SettingsInfo = await fs.readJSONSync(Settings.SETTINGS_FILE_PATH)

    // sheet config
    const sheetConfig = await fs.readJSONSync(settingsJson.sheetAuthConfigFilePath)
    if (!sheetConfig || !sheetConfig.installed || !sheetConfig.installed.client_id) {
      console.log(`${settingsJson.sheetAuthConfigFilePath} の内容が正しく有りません`)
      return false
    }

    return true
  }

  load() {
    const checkResult = Settings.check()
    if (!checkResult) {
      throw new CSMError('設定フォルダ、または設定ファイル類が正しくありません')
    }

    const settingsInfo: SettingsInfo = fs.readJSONSync(Settings.SETTINGS_FILE_PATH)
    this._settingsInfo = settingsInfo
  }

  static async setup(force: boolean): Promise<void> {
    try {
      // 設定ホーム作る
      fs.ensureDirSync(Settings.CONFIG_FOLDER_PATH)
      console.log('==================================')
      console.log(`設定ホームフォルダ: ${Settings.CONFIG_FOLDER_PATH}`)

      // デフォルトのsettings.json
      console.log('==================================')
      if (!fs.existsSync(Settings.SETTINGS_FILE_PATH) || force) {
        const settings: SettingsInfo = {
          // boxAuthConfigFilePath: path.join(Settings.CONFIG_FOLDER_PATH, 'box-auth-config.json'),
          sheetAuthConfigFilePath: path.join(Settings.CONFIG_FOLDER_PATH, 'sheet-auth-config.json'),
          downloadsFolderPath: path.join(os.homedir(), 'Downloads', 'CSM-Downloads'),
          tableau: {
            // PAT: 'yprUmxFxTLibZjtCANktOA==:os8aXwrOEBAUC604YOMWpQ9vF4vmD0k6',
            PAT_NAME: 'Tableau-PAT',
            PAT: '<your PAT>',
            URL: 'https://us-west-2b.online.tableau.com/',
            API_VERSION: '3.14',
            VIEW_ID_OVERVIEW: 'dcdd3a4a-a281-40d7-b813-7c2181435d16',
            VIEW_ID_PRODUCT_ACTION: '3f84cade-5f7f-4acf-98c4-c1c7c42f603c',
          },
          sheet: {
            SCOPES: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            SPREAD_SHEET_ID: '10cyEIHhwoVmvlkINiEfz5m_UaYF2KMQtcJZ0ozcMb1I',
          },
          box: {
            CLIENT_ID: 'i5hzl48pus5j157t3xw4sgfnr13zbh52',
            CLIENT_SECRET: 'C9hnG37Znyjc4twlenDPlOj50pSRn7ej',
          },
        }

        fs.writeJSONSync(Settings.SETTINGS_FILE_PATH, settings, {
          spaces: 2,
          EOL: os.EOL,
        })
        console.log(`設定ファイル: ${Settings.SETTINGS_FILE_PATH} を作成しました。`)
      }

      const settingsJson: SettingsInfo = await fs.readJSONSync(Settings.SETTINGS_FILE_PATH)

      // sheet config
      if (!fs.existsSync(settingsJson.sheetAuthConfigFilePath)) {
        fs.writeJSONSync(settingsJson.sheetAuthConfigFilePath, {})
        console.log('==================================')
        console.log(
          `Google Sheet用 configファイルをダウンロードし、${settingsJson.sheetAuthConfigFilePath} として保存するか、
          settings.jsonのsheetAuthConfigFilePathを書き換えてください。`,
        )
      }
    } catch (error) {
      throw new CSMError('Could not initialize CLI home directory', error)
    }
  }
}

export interface SettingsInfo {
  sheetAuthConfigFilePath: string;
  downloadsFolderPath: string;
  tableau: TableauConfig;
  sheet: SheetConfig;
  box: BoxConfig;
}

export interface TableauConfig {
  PAT_NAME: string;
  PAT: string;
  URL: string;
  API_VERSION: string;
  VIEW_ID_OVERVIEW: string;
  VIEW_ID_PRODUCT_ACTION: string;
}

export interface SheetConfig {
  SCOPES: string[];
  SPREAD_SHEET_ID: string;
}

export interface BoxConfig {
  CLIENT_ID: string,
  CLIENT_SECRET: string
}
