import * as redis from 'redis';
import { env, logger } from './';

const REDIS_URL = env('REDIS_URL');
export const client = redis.createClient({
  url: REDIS_URL,
});

client.on('error', (err) => {
  logger.error(`Error connecting to redis ${err}`);
  client.quit();
});

client.on('connect', () => {
  logger.info(`Connected to Redis! ${REDIS_URL}`);
});

// export const asyncClient = {
//     get: util.promisify(client.get).bind(client),
//     set: util.promisify(client.set).bind(client),
//     expire: util.promisify(client.expire).bind(client),
//     del: util.promisify(client.del).bind(client),
//     incr: util.promisify(client.incr).bind(client),
//     ttl: util.promisify(client.ttl).bind(client),
//     multi: util.promisify(client.multi).bind(client),
//     rename: util.promisify(client.rename).bind(client),
// };
