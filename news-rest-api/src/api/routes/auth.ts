import { Router } from "express";
import users from "../../users.json";
import { compare, genSalt, hash } from 'bcrypt-ts';

const router = Router();


router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    const salt = await genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await hash(password, salt);

    const newUser = {
        id: users.length + 1,
        email,
        name,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    //create a token
    const jwt = await import('jsonwebtoken');
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created' });

});


router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const user = users.find((user) => user.email === email);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });

    }

    //create a token
    const jwt = await import('jsonwebtoken');
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.json({ token });

});





export default router;