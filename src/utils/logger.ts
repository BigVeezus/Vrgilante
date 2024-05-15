import winston from 'winston';
import { env } from './misc';

const transports = {
  file: new winston.transports.File({
    filename: 'logs/combined.log',
    level: 'silly',
  }),
  console: new winston.transports.Console({
    format: winston.format.combine(winston.format.cli(), winston.format.splat()),
  }),
};

if (env('APP_ENV') !== 'development') {
  transports.console = new winston.transports.Console();
}

const logger = winston.createLogger({
  level: 'info',
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: [transports.file, transports.console],
  silent: false, // If true, all logs are suppressed
});

export { logger };
