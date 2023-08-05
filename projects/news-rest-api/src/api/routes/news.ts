import { Router } from 'express';
import newsAxiosInstance from '../../lib/axios';

const rotuer = Router();

rotuer.get('/', async (req, res) => {
  try {
    const news = await newsAxiosInstance.get('/news');
    res.json({ data: news.data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    req.log.error(error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default rotuer;
