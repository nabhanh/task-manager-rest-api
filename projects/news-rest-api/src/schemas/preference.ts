import { z } from 'zod';

const PreferenceSchema = z.object({
  userId: z.number(),
  newsSources: z.array(z.string()),
  newsCategories: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  read: z.array(z.string()),
  favorite: z.array(z.string())
});

export type Preference = z.infer<typeof PreferenceSchema>;
const categories = [
  'sport',
  'tech',
  'world',
  'finance',
  'politics',
  'business',
  'economics',
  'entertainment',
  'beauty',
  'travel',
  'music',
  'food',
  'science'
] as const;
export const PreferencePutSchema = z.object({
  body: z.object({
    newsSources: z.array(z.string()),
    newsCategories: z.enum(categories)
  })
});
