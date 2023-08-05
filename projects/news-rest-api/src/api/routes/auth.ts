import { Router } from 'express';
import users from '../../users.json';
import { omitProperties } from '../../lib/objectFunctions';
import { UserWithPreferences } from '../../schemas/user';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const { genSalt, hash } = await import('bcrypt-ts');

    const salt = await genSalt(Number(process.env.SALT_ROUNDS || 10));
    const hashedPassword = await hash(password, salt);

    const newUser: UserWithPreferences = {
      id: users.length + 1,
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preference: {
        userId: users.length + 1,
        newsSources: [] as string[],
        newsCategories: [] as string[],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    users.push(newUser);

    const { sign } = await import('jsonwebtoken');

    const token = sign({ id: newUser.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h'
    });
    res.status(201).setHeader('X-Auth-Token', token).json({ data: newUser });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    req.log.error(error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);

    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const { compare } = await import('bcrypt-ts');
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    //create a token
    const { sign } = await import('jsonwebtoken');
    const token = sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '12h'
    });

    res
      .status(200)
      .setHeader('X-Auth-Token', token)
      .json({ data: { ...omitProperties(user, ['password']) } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    req.log.error(e.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
