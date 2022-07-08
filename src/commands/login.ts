import {Command, Flags} from '@oclif/core'
import {Settings} from '../utils/settings'
import {GSheetManager} from '../service/sheet'
// import TableauManager from '../service/tableau'
import BoxManager from '../service/box'

export default class Login extends Command {
  static description = '各サービスにログインし、トークンをキャッシュします'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    box: Flags.boolean({char: 'b', description: 'boxにログイン', default: false}),
    sheet: Flags.boolean({char: 's', description: 'sheetにログイン', default: false}),
    // tableau: Flags.boolean({char: 't', description: 'tableauにログイン', default: false}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Login)

    const runAll = (!flags.box && !flags.sheet)
    console.log(runAll)
    // const name = flags.name ?? 'world'
    // this.log(`hello ${name} from /Users/hkobayashi/develop/tools/csm-tools/src/commands/login.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }

    const settings = new Settings()
    settings.load()

    // if (flags.box || runAll) {
    //   console.log('Boxにログインします')
    //   const box = new BoxManager(settings)
    //   await box.login()
    //   console.log('Boxにログインしました')
    // }

    if (flags.sheet || runAll) {
      console.log('Google Sheetにログインします')
      const sheet = new GSheetManager(settings)
      await sheet.login()
      console.log('Google Sheetにログインしました')
    }

    // if (flags.tableau || runAll) {
    //   console.log('tableauにログインします')
    //   const tableau = new TableauManager(settings)
    //   await tableau.login()
    //   console.log('tableauにログインしました')
    // }
  }
}
