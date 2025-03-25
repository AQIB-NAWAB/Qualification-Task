import config from "../config/config";

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const levels: { [key in LogLevel]: number } = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = levels[config.logging.level as LogLevel] || levels.info;

const log = (level: LogLevel, ...args: any[]): void => {
  if (levels[level] <= currentLevel) {
    console[level](...args);
  }
};

const logger = {
  error: (...args: any[]) => log('error', ...args),
  warn: (...args: any[]) => log('warn', ...args),
  info: (...args: any[]) => log('info', ...args),
  debug: (...args: any[]) => log('debug', ...args)
};

export default logger;
