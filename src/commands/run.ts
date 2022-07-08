import {Command, Flags} from '@oclif/core'
import {Settings} from '../utils/settings'
import {GSheetManager, GSheetRowData} from '../service/sheet'
// import BoxManager from '../service/box'
// import {DateTime} from 'luxon'
// import * as fs from 'fs-extra'
// import path from 'node:path'
// const notifier = require('node-notifier')

export default class Run extends Command {
  static description = 'Google Sheetの情報を取得、TableauからPDFをダウンロード、Boxにアップロードします。'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    sheet: Flags.boolean({char: 's', description: 'Google Sheetの情報だけを表示します。', default: false}),
  }

  static args = [
    {name: 'fromRow', description: 'Google Sheetの対象行', default: 2},
    {
      name: 'toRow',
      description: 'Google Sheetの対象終了行。指定しない場合は、指定行の1行のみ処理。',
    },
  ]

  public async run(): Promise<void> {
    try {
      const {args, flags} = await this.parse(Run)

      const fromRow = Number(args.fromRow)
      const toRow = Number(args.toRow) || fromRow

      console.log(`fromRow: ${fromRow}, toRow: ${toRow}`)
      if (flags.sheet) {
        console.log('Google Sheetの情報だけ読み出します。')
      } else {
        console.log('Google Sheetの情報を読み出し、TableauからPDFをダウンロードし、Boxにアップロードします。')
      }

      const settings = new Settings()
      settings.load()

      const sheet = new GSheetManager(settings)
      // const box = new BoxManager(settings)

      // const downloadFolder = settings.settingsInfo.downloadsFolderPath
      // const today = DateTime.now().startOf('second').toISO({
      //   suppressMilliseconds: true,
      //   includeOffset: false,
      //   format: 'basic',
      // })

      const sleepFunc = (m:any) => {
        // eslint-disable-next-line no-promise-executor-return
        return new Promise(resolve => setTimeout(resolve, m))
      }

      await sheet.getData(fromRow, toRow, async (row: GSheetRowData) => {
        this.log(`=============== start processing sheet row: ${row.rowNumber} ===============`)

        this.log('user', row.email, row.name)
        this.log('score', row.score)

        const score2 = row.score.match(/\d+/)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (score2[0] && score2[0] > 45) {
          this.log('****** Exam Passed !! *******')
          this.log('generating certification !!')
          await sleepFunc(2000)
          this.log('Sending the certification to user!!')
          await sleepFunc(1000)
        } else {
          this.log('Exam Failed ...')
          this.log('Sending notification to user')
          await sleepFunc(1000)
        }

        // this.log(JSON.stringify(row, null, 2))

        // if (flags.sheet) {
        //   return
        // }

        // const outFolder = path.join(downloadFolder, today, `row${row.rowNumber}_${row.companyName}_${row.name}`)
        // fs.mkdirsSync(outFolder)
        // await tableau.downloadPDF(row.eid, row.startDate, row.endDate, outFolder)
        // if (!flags.tableau) {
        //   await box.upload(row.sharedURL, outFolder, row)
        // }
      })

      console.log('処理が正常終了しました！')
      // notifier.notify({
      //   title: 'csm run 終了',
      //   message: '処理が終わりました。',
      //   sound: true,
      //   wait: true,
      // })
    } catch ({message, stack}) {
      console.error(message)
      console.error(stack)

      // notifier.notify({
      //   title: 'エラー発生',
      //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //   // @ts-ignore
      //   message: message,
      // })
    }
  }
}
