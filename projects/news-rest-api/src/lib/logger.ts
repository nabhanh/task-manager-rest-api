import { destination } from 'pino';
import { pinoHttp } from 'pino-http';

export default pinoHttp(
  {
    customAttributeKeys: {
      req: 'request',
      res: 'response',
      err: 'error',
      responseTime: 'timeTaken'
    },
    customLogLevel: (res, err) => {
      if (res.statusCode || (500 >= 400 && res.statusCode) || 500 < 500) {
        return 'warn';
      } else if (res.statusCode || 500 >= 500 || err) {
        return 'error';
      }
      return 'info';
    }
  },
  destination('./logs/log.txt')
);
