import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { searchJobsOnServer } from '@/lib/server-job-search';
import {
  getAllWorkSchedules,
  getAllWorkModels,
  getAllCategories,
  getAllContractTypes,
  getAllExperienceLevels,
  getAllDisabilityTypes
} from '@/lib/server-filter';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

const getAllFiltersData = async () => {
  const [
    categories,
    workSchedules,
    contractTypes,
    experienceLevels,
    workModels,
    disabilityTypes
  ] = await Promise.all([
    getAllCategories(),
    getAllWorkSchedules(),
    getAllContractTypes(),
    getAllExperienceLevels(),
    getAllWorkModels(),
    getAllDisabilityTypes(),
  ]);

  return {
    categories,
    workSchedules,
    contractTypes,
    experienceLevels,
    workModels,
    disabilityTypes,
  };
};

export async function POST(req: Request) {
  const { messages } = await req.json();
  const modelMessages = convertToModelMessages(messages);
  const {
    categories,
    workModels,
    contractTypes,
    experienceLevels,
    workSchedules,
    disabilityTypes
  } = await getAllFiltersData();

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: `Eres un asistente de búsqueda de empleo amigable y proactivo para la plataforma Summa. Tu objetivo es ayudar a los usuarios a encontrar el trabajo ideal conversando con ellos de forma natural y clara.

    **Instrucciones importantes:**

    No pidas identificadores numéricos (como category_id, contract_type_id, etc.). Son datos internos del sistema. Solo pide o usa nombres, tipos o valores relevantes, por ejemplo: “tiempo completo”, “desarrollo web” o “salario de 5000 dólares”.
    Siempre utiliza la herramienta searchJobs para realizar las búsquedas. Tu tarea es traducir las solicitudes del usuario en los parámetros adecuados para esta herramienta.
    Después de ejecutar la búsqueda, responde al usuario con un resumen natural y claro de los resultados. Si no hay coincidencias, sugiere formas de ampliar o ajustar la búsqueda.
    Cuando uses la herramienta, describe los trabajos relevantes devueltos por searchJobs con lenguaje fluido y sin símbolos especiales (como asteriscos, guiones o comillas innecesarias).
    No incluyas caracteres especiales en tus respuestas (por ejemplo: * , _ , ** , - , •). Redacta de manera que el texto sea fácil de escuchar con lectores de pantalla.

    Mantén un tono conversacional, empático y profesional en todo momento.
    No pregunt

    **Información necesaria para comprender cómo realizar las búsquedas con la herramienta:**

    Categorías:
  ${categories.map(c => `${c.id}: ${c.name}`).join('\n')}

    Jornadas:
  ${workSchedules.map(s => `${s.id}: ${s.name}`).join('\n')}

    Niveles de experiencia:
  ${experienceLevels.map(e => `${e.id}: ${e.name}`).join('\n')}

    Tipos de contrato:
  ${contractTypes.map(c => `${c.id}: ${c.name}`).join('\n')}

    Tipos de discapacidad:
  ${disabilityTypes.map(d => `${d.id}: ${d.name}`).join('\n')}

    Modelos de trabajo:
  ${workModels.map(m => `${m.id}: ${m.name}`).join('\n')}
    `,
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
          const data = await searchJobsOnServer(filters);
          return data.data;
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
