import path from 'node:path'
import fs from 'fs-extra'
import os from 'node:os'

export default class BoxTokenStore<T> {
  private readonly filePath: string

  /*
   * function TokenStore() {
   * 	// The token store constructor should create a specific store instance
   * 	// for the user in question — it may need to take in a user ID or other
   * 	// identifier.
   * }
   */
  constructor(configFolder: string) {
    this.filePath = path.join(configFolder, 'box_token_cache.json')
  }

  /*
   * TokenStore.prototype.read = function(callback) {
   * 	// Read the user's tokens from your data store and
   * 	// call the callback.
   * 	// callback(error) if some error occured
   * 	// callback(null, tokenInfo) if the read succeeded
   * };
   */
  read(callback: (err: any, tokenInfo: T | null) => any) {
    try {
      if (!fs.existsSync(this.filePath)) {
        callback(new Error('TokenStore is empty'), null)
      }

      const tokenInfo = fs.readJSONSync(this.filePath, 'utf8') as T
      callback(null, tokenInfo) // success
    } catch (error) {
      callback(error, null) // error
    }
  }

  /*
   * TokenStore.prototype.write = function(tokenInfo, callback) {
   * 	// Write the token information to the store.
   * 	// The tokenInfo argument is an Object, and can be
   * 	// serialized as JSON for storage.
   * 	// Call the callback after the write.
   * 	// callback(error) if some error occured
   * 	// callback(null) if the write succeeded
   * };
   */
  write(tokenInfo: T, callback: (err: any) => any) {
    try {
      fs.writeJSONSync(this.filePath, tokenInfo, {
        spaces: 2,
        EOL: os.EOL,
      })
      callback(null) // success
    } catch (error) {
      callback(error) // error
    }
  }

  /*
   * TokenStore.prototype.clear = function(callback) {
   * 	// Delete the user's token information from the store,
   * 	// and call the callback after the write.
   * 	// callback(error) if some error occured
   * 	// callback(null) if the deletion succeeded
   * };
   */
  clear(callback: (err: any) => any) {
    try {
      fs.removeSync(this.filePath)
      callback(null) // success
    } catch (error) {
      callback(error) // error
    }
  }
}

