import fs from 'fs-extra'
import path from 'node:path'
import CSMError from '../error'
import {DateTime} from 'luxon'
import os from 'node:os'

export default class TokenCache<T> {
  private readonly filePath: string
  private readonly expiresIn: number

  constructor(configFolder: string, environmentName: string, expiresIn = 12) {
    this.expiresIn = expiresIn
    this.filePath = path.join(configFolder, `${environmentName}_token_cache.json`)
  }

  read(): T | undefined {
    if (!fs.existsSync(this.filePath)) {
      return undefined
    }

    const stat = fs.statSync(this.filePath)
    if (stat.size < 10) {
      return undefined
    }

    const dt = DateTime.now()

    try {
      const tokenContainer = <TokenContainer<T>>fs.readJSONSync(this.filePath, 'utf8')
      const exp = DateTime.fromMillis(tokenContainer.exp)
      // console.debug(tokenContainer.exp, exp.toISO(), '← savedTime')
      // console.debug(dt.toMillis(), dt.toISO(), '← now')
      if (exp > dt) {
        // 再利用OK
        return tokenContainer.payload
      }

      return undefined
    } catch (error) {
      throw new CSMError('failed to read token cache from : ' + this.filePath, error)
    }
  }

  write(tokenInfo: T) {
    try {
      const dt = DateTime.now()
      const exp = dt.plus({hours: this.expiresIn})
      const tokenContainer: TokenContainer<T> = {
        exp: exp.toMillis(),
        expDebug: exp.toISO(),
        payload: tokenInfo,
      }
      this.clear()
      fs.writeJSONSync(this.filePath, tokenContainer, {
        spaces: 2,
        EOL: os.EOL,
      })
    } catch (error) {
      throw new CSMError('failed to write token cache : ' + this.filePath, error)
    }
  }

  clear() {
    try {
      fs.removeSync(this.filePath)
    } catch (error) {
      throw new CSMError('failed to clear token cache : ' + this.filePath, error)
    }
  }
}

export interface TokenContainer<T> {
  exp: number,
  expDebug: string,
  payload: T
}
