import { z } from 'zod';

export const registrarSchema = z
  .object({
    username: z
      .string({
        required_error: 'El nombre de usuario es obligatorio.',
      })
      .min(3, {
        message: 'El nombre de usuario debe tener al menos 3 caracteres.',
      }),
    email: z
      .string({
        required_error: 'El correo electrónico es obligatorio.',
      })
      .email({
        message: 'El correo electrónico no es válido.',
      }),
    password: z
      .string({
        required_error: 'La contraseña es obligatoria.',
      })
      .min(6, {
        message: 'La contraseña debe tener al menos 6 caracteres.',
      }),
    confirmPassword: z.string({
      required_error: 'Debes confirmar tu contraseña.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'El correo electrónico es obligatorio.',
    })
    .email({
      message: 'El correo electrónico no es válido.',
    }),
  password: z.string({
    required_error: 'La contraseña es obligatoria.',
  }),
});
