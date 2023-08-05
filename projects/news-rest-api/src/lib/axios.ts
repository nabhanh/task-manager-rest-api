import axios from 'axios';
import { NEWS_API_KEY, NEWS_API_URL } from '../lib/constants';

const newsAxiosInstance = axios.create({
  baseURL: NEWS_API_URL,
  headers: {
    Authorization: `Bearer ${NEWS_API_KEY}`
  }
});

export default newsAxiosInstance;
