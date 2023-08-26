import { z } from 'zod';
import { Preference } from './preference';

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type User = z.infer<typeof UserSchema>;
export type UserWithPreferences = User & { preference: Preference };
