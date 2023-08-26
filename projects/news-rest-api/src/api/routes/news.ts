import { Router } from 'express';
import newsAxiosInstance from '../../lib/axios';
import users from '../../users.json';
import { writeFileSync } from 'node:fs';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const {
      pageSize,
      page,
      filterType
    }: {
      pageSize?: string;
      page?: string;
      filterType?: 'category' | 'source';
    } = req.query;
    const categories = req.user?.preference.newsCategories as string[];
    const sources = req.user?.preference.newsSources as string[];
    const params: Record<string, unknown> = {
      articlesCount: pageSize || 10,
      articlesPage: page || 1,
      dateStart: new Date().toISOString().split('T')[0]
    };
    if (filterType === 'category' && categories.length > 0) {
      params.categoryUri = categories.join(',');
    }
    if (filterType === 'source' && sources.length > 0) {
      params.sourceUri = sources.join(',');
    }

    const news = await newsAxiosInstance.get('/article/getArticles', {
      params
    });

    res.json({ data: news.data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    req.log.error(error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/:id/:type', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const type = req.params.type;
    if (type !== 'favorite' && type !== 'read')
      return res.status(404).json({ message: 'Not found' });
    const { user } = req;
    if (!user) {
      throw new Error();
    }
    if (type === 'favorite') user.preference.favorite.push(id);
    if (type === 'read') user.preference.read.push(id);
    user.preference.updatedAt = new Date().toISOString();
    const index = users.findIndex(u => u.id === user.id);
    users[index] = user as never;
    writeFileSync('../users.json', JSON.stringify(users, null, 2));
    return res.json({ data: user.preference });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    req.log.error(error.message);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/read', auth, async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      throw new Error();
    }
    const readIds = user.preference.read;
    const readArticles = await Promise.all(
      readIds.map(id => {
        const article = newsAxiosInstance.get(`/article/getArticle`, {
          params: {
            articleUri: id
          }
        });
        return article;
      })
    );
    return res.json({ data: readArticles.map(a => a.data) });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    req.log.error(error.message);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/favorite', auth, async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      throw new Error();
    }
    const favoriteIds = user.preference.favorite;
    const favoriteArticles = await Promise.all(
      favoriteIds.map(id => {
        const article = newsAxiosInstance.get(`/article/getArticle`, {
          params: {
            articleUri: id
          }
        });
        return article;
      })
    );
    return res.json({ data: favoriteArticles.map(a => a.data) });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    req.log.error(error.message);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/search/:query', auth, async (req, res) => {
  try {
    const query = req.params.query;
    const news = await newsAxiosInstance.get('/article/getArticles', {
      params: {
        articlesCount: req.query.pageSize || 10,
        articlesPage: req.params.page || 1,
        keyword: query
      }
    });

    res.json({ data: news.data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    req.log.error(error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
