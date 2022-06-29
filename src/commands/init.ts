import {Command, Flags} from '@oclif/core'
import {Settings} from '../utils/settings'

export default class Init extends Command {
  static description = '設定ファイルの雛形を生成します。'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    force: Flags.boolean({char: 'f', default: false, description: '設定ファイルを強制的に作り直し'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Init)

    await Settings.setup(flags.force)
  }
}
