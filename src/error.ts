export default class CSMError extends Error {
  private cause: any

  constructor(message: string, cause?: any) {
    super(message)
    this.name = 'CLIError'
    this.cause = cause

    if (cause) {
      this.stack = `${this.name}: ${this.message}\nCaused by: ${cause.stack}`
    }
  }
}
