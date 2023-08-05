import { z } from 'zod';

const PreferenceSchema = z.object({
  userId: z.number(),
  newsSources: z.array(z.string()),
  newsCategories: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Preference = z.infer<typeof PreferenceSchema>;

export const PreferencePutSchema = z.object({
  body: z.object({
    newsSources: z.array(z.string()),
    newsCategories: z.array(z.string())
  })
});
