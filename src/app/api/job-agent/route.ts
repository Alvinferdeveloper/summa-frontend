import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { searchJobsOnServer } from '@/lib/server-job-search';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export async function POST(req: Request) {
  const { messages } = await req.json();
  const modelMessages = convertToModelMessages(messages);

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: `res un asistente de búsqueda de empleo amigable y proactivo para la plataforma Summa. Tu objetivo es ayudar a los usuarios a encontrar el trabajo perfecto conversando con ellos.

    **Instrucciones Clave:**
    1.  **NUNCA** pidas IDs numéricos (category_id, contract_type_id, etc.) al usuario. Los IDs son detalles internos. Pide solo los nombres, tipos o valores relevantes (ej. "tiempo completo", "desarrollo", "$5000").
    2.  **SIEMPRE** usa la herramienta searchJobs para buscar. Tu rol es mapear las peticiones del usuario a los parámetros de la herramienta.
    3.  Después de la búsqueda, resume los resultados de forma amigable. Si no hay resultados, sugiere una ampliación de la búsqueda.
    4. Siempre reponde, cuando ejecutes la tools responde al usuario describiendole los trabajos relevantes que encontraste`,
    messages: modelMessages,
    tools: {
      searchJobs: tool({
        description: 'Busca y filtra trabajos en la base de datos. Usa esto siempre que el usuario pida buscar empleos o quiera refinar una búsqueda existente.',
        inputSchema: z.object({
          is_urgent: z.boolean().optional().describe('Filtra por trabajos marcados como urgentes.'),
          category_id: z.number().optional().describe('El ID de la categoría de empleo.'),
          work_schedule_id: z.number().optional().describe('El ID del tipo de jornada ejm. Tiempo completo, Medio tiempo, etc.'),
          contract_type_id: z.number().optional().describe('El ID del tipo de contrato.'),
          salary: z.number().optional().describe('El salario mínimo deseado.'),
          experience_level_id: z.number().optional().describe('El ID del nivel de experiencia.'),
          work_model_id: z.number().optional().describe('El ID del modelo de trabajo.'),
          disability_type_id: z.number().optional().describe('El ID del tipo de discapacidad relevante.'),
        }),
        execute: async (filters) => {
          console.log('Ejecutando búsqueda de trabajos con filtros:', filters);
          const data = await searchJobsOnServer(filters);
          console.log('Trabajos encontrados:', data.data.length);
          return data.data;
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
