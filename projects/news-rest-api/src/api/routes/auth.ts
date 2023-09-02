import { Router } from 'express';
import { omitProperties } from '../../lib/objectFunctions';
import { UserWithPreferences } from '../../schemas/user';
import validator from '../../lib/validator';
import { LoginSchema, RegisterSchema } from '../../schemas/auth';
import { writeFileSync } from 'node:fs';
import users from '../../users.json';
import sendMail from '../../lib/mailer';

const router = Router();

router.post('/register', validator(RegisterSchema), async (req, res) => {
  try {
    req.log.info('Registering a new user');
    const { email, password, name } = req.body;
    const user = users.find(user => user.email === email);
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const { genSalt, hash } = await import('bcrypt');
    const salt = await genSalt(Number(process.env.SALT_ROUNDS || 10));
    const hashedPassword = await hash(password, salt);

    const newUser: UserWithPreferences = {
      id: users.length + 1,
      email,
      name,
      password: hashedPassword,
      isConfirmed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preference: {
        userId: users.length + 1,
        newsSources: [] as string[],
        newsCategories: [] as string[],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        read: [] as string[],
        favorite: [] as string[]
      }
    };

    users.push(newUser as never);
    writeFileSync(
      __dirname + '/../../users.json',
      JSON.stringify(users, null, 2)
    );

    //send confirmation email
    const { sign } = await import('jsonwebtoken');
    const token = sign({ id: newUser.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d'
    });

    const confirmationUrl = `http://localhost:${
      process.env.PORT || 3000
    }/auth/confirm?token=${token}}`;
    await sendMail(
      email,
      'Confirm your email',
      `Please click on this link to confirm your email: ${confirmationUrl}`
    );

    res.status(201).json({
      data: {
        ...omitProperties(newUser, ['password'])
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/confirm', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const { verify } = await import('jsonwebtoken');
    const { id } = verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as { id: number };

    const user = users.find(
      user => user.id === id
    ) as unknown as UserWithPreferences;

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    user.isConfirmed = true;

    writeFileSync(
      __dirname + '/../../users.json',
      JSON.stringify(users, null, 2)
    );

    res.status(200).json({ message: 'Email confirmed' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    req.log.error(e.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/resend-confirmation', async (req, res) => {
  try {
    const { email } = req.body;
    const user = users.find(user => user.email === email);

    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (user.isConfirmed) {
      return res.status(400).json({ message: 'Email already confirmed' });
    }

    //send confirmation email
    const { sign } = await import('jsonwebtoken');
    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d'
    });

    const confirmationUrl = `http://localhost:${
      process.env.PORT || 3000
    }/auth/confirm?token=${token}}`;
    await sendMail(
      email,
      'Confirm your email',
      `Please click on this link to confirm your email: ${confirmationUrl}`
    );

    res.status(200).json({ message: 'Email sent' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    req.log.error(e.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/login', validator(LoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);

    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // if (!user.isConfirmed) {
    //   return res.status(400).json({ message: 'Email not confirmed' });
    // }

    const { compare } = await import('bcrypt');
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    //create a token
    const { sign } = await import('jsonwebtoken');
    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, {
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
