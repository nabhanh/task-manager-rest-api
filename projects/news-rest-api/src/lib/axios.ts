import axios from 'axios';
import { NEWS_API_KEY, NEWS_API_URL } from '../lib/constants';
import { setupCache } from 'axios-cache-interceptor';
import { logger } from './logger';

// Note on axios-cache-interceptor:
// This is a simple axios interceptor that caches GET requests in memory.
// It is not a full-fledged caching solution, but it is good enough for our use case.
// It is also very easy to use, as you can see in the following snippet:
// import axios from 'axios';
// import { setupCache } from 'axios-cache-interceptor';
//
// const cache = setupCache({
//   ttl: 15 * 60 * 1000, ttl is the time to live in milliseconds
// });
//

const instance = setupCache(
  axios.create({
    baseURL: NEWS_API_URL,
    params: {
      apiKey: NEWS_API_KEY,
      query: {
        $query: {
          lang: 'eng'
        }
      }
    }
  }),
  {
    ttl: 15 * 60 * 1000, // 15 minutes
    methods: ['get', 'head', 'options']
  }
);

instance.interceptors.request.use(request => {
  logger.info(JSON.stringify(request, null, 2));
  return request;
});

export default instance;
