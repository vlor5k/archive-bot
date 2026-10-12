// Written by Claude

type Level = "debug" | "info" | "warn" | "error";

const levels: Level[] = ["debug", "info", "warn", "error"];

export class Logger {
  constructor(
    private name = "app",
    private minLevel: Level = (process.env.LOG_LEVEL as Level) || "info"
  ) {}

  private log(level: Level, message: string, ...args: unknown[]) {
    if (levels.indexOf(level) < levels.indexOf(this.minLevel)) return;
    const time = new Date().toISOString();
    console[level](`${time} [${level.toUpperCase()}] [${this.name}]`, message, ...args);
  }

  debug(message: string, ...args: unknown[]) { this.log("debug", message, ...args); }
  info(message: string, ...args: unknown[]) { this.log("info", message, ...args); }
  warn(message: string, ...args: unknown[]) { this.log("warn", message, ...args); }
  error(message: string, ...args: unknown[]) { this.log("error", message, ...args); }
}

export const logger = new Logger();