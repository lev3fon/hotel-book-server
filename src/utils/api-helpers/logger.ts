import bunyanFormat from 'bunyan-format';
import bunyan, { LoggerOptions } from 'bunyan';
import config from "../../config";


const streams: LoggerOptions['streams'] = [
  {
    level: 'info',
    stream: bunyanFormat({
      outputMode: config.logger.outputMode as never,
    }, process.stdout),
  },
  {
    level: 'warn',
    stream: bunyanFormat({
      outputMode: config.logger.outputMode as never,
    }, process.stdout),
  },
  {
    level: 'error',
    stream: bunyanFormat({
      outputMode: config.logger.outputMode as never,
    }, process.stdout),
  },
];

export const logger = bunyan.createLogger({
  name: config.logger.name,
  streams,
  serializers: bunyan.stdSerializers,
});
