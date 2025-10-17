
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

  // Campos obligatorios
  phone_number: z.string().min(1, { message: "El número de teléfono es obligatorio." }),
  country: z.string().min(1, { message: "El país es obligatorio." }),
  industry: z.string().min(1, { message: "La industria es obligatoria." }),
  size: z.string().min(1, { message: "El tamaño de la empresa es obligatorio." }),
  address: z.string().min(1, { message: "La dirección es obligatoria." }),
  dedication: z.string().min(1, { message: "La dedicación es obligatoria." }),

  // Campos opcionales
  foundation_date: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url({ message: "Por favor, introduce una URL válida." }).optional().or(z.literal('')),
  logo: z.any().optional(),
  accessible_infrastructure_ids: z.array(z.string()).optional(),
  inclusive_program_ids: z.array(z.string()).optional(),
});

export type EmployerRegisterSchema = z.infer<typeof employerRegisterSchema>;
