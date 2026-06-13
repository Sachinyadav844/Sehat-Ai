export class Logger {
  static info(message: string, context: string = "app"): void {
    console.info(`[${new Date().toISOString()}] [INFO] [${context}] ${message}`);
  }

  static warn(message: string, context: string = "app"): void {
    console.warn(`[${new Date().toISOString()}] [WARN] [${context}] ${message}`);
  }

  static error(message: string, context: string = "app", error?: Error): void {
    console.error(`[${new Date().toISOString()}] [ERROR] [${context}] ${message}`);
    if (error) {
      console.error(error.stack ?? error.message);
    }
  }

  static debug(message: string, context: string = "app"): void {
    if (process.env.DEBUG === "true") {
      console.debug(`[${new Date().toISOString()}] [DEBUG] [${context}] ${message}`);
    }
  }
}
