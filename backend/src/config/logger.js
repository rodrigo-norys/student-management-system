import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Logger único da aplicação. Em produção emite JSON cru no stdout (o Docker captura
// e persiste); em dev formata legível via pino-pretty. Em teste fica sem transport
// (evita worker thread) e silenciado via LOG_LEVEL. Nível controlado por LOG_LEVEL.
const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  transport:
    isProduction || isTest
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
});

export default logger;
