// Shared input validation & sanitization (zod).
// All user-supplied strings are trimmed, length-capped, and checked before use.

import { z } from 'zod';

export const MAX = {
  email: 320,
  password: 128,
  name: 100,
  subject: 200,
  message: 5000,
  reason: 1000,
} as const;

export const emailSchema = z
  .string()
  .trim()
  .min(3, 'Email requis')
  .max(MAX.email, 'Email trop long')
  .email('Adresse email invalide');

export const passwordSchema = z
  .string()
  .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
  .max(MAX.password, 'Mot de passe trop long');

export const nameSchema = z
  .string()
  .trim()
  .max(MAX.name, 'Nom trop long')
  // letters (incl. accents), spaces, hyphens, apostrophes only
  .regex(/^[\p{L}\p{M}\s'’-]*$/u, 'Le nom contient des caractères non autorisés');

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: nameSchema.optional().or(z.literal('')),
});

export const contactSchema = z.object({
  name: nameSchema.min(1, 'Nom requis'),
  email: emailSchema,
  subject: z.string().trim().max(MAX.subject, 'Sujet trop long').optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Message requis').max(MAX.message, 'Message trop long (5000 caractères max)'),
});

export const reportSchema = z.object({
  reason: z.string().trim().min(1, 'Raison requise').max(MAX.reason, 'Texte trop long'),
});

/** Returns the first validation error message, or null if valid. */
export function firstError(result: { success: boolean; error?: z.ZodError }): string | null {
  if (result.success || !result.error) return null;
  return result.error.issues[0]?.message ?? 'Saisie invalide';
}
