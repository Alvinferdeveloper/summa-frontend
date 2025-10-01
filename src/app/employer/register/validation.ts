
import { z } from 'zod';

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]).+$/
);

export const employerRegisterSchema = z.object({
  company_name: z.string().min(3, { message: "El nombre de la empresa debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .regex(passwordValidation, {
      message: "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.",
    }),

  // Campos opcionales
  phone_number: z.string().optional(),
  country: z.string().optional(),
  foundation_date: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url({ message: "Por favor, introduce una URL válida." }).optional().or(z.literal('')),
});

export type EmployerRegisterSchema = z.infer<typeof employerRegisterSchema>;
