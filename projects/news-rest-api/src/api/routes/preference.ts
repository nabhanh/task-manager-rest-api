import { Router } from 'express';
import { auth } from '../middlewares/auth';
import users from '../../users.json';
import validator from '../../lib/validator';
import { PreferencePutSchema } from '../../schemas/preference';
import { writeFileSync } from 'node:fs';

const router = Router();

router.get('/', auth, (req, res) => {
  return res.json({ data: req.user?.preference });
});

router.put('/', auth, validator(PreferencePutSchema), async (req, res) => {
  try {
    const { newsSources, newsCategories } = req.body;
    const { user } = req;
    if (!user) {
      // this is to satisfy typescript
      throw new Error();
    }
    user.preference.newsSources = newsSources;
    user.preference.newsCategories = newsCategories;
    user.preference.updatedAt = new Date().toISOString();
    const index = users.findIndex(u => u.id === user.id);
    users[index] = user as never;
    writeFileSync('./users.json', JSON.stringify(users, null, 2));
    return res.json({ data: user.preference });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    req.log.error(error.message);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
