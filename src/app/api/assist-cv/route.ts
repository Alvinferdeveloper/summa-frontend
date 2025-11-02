
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})


interface AssistCvRequest {
  task: 'generate-summary' | 'rewrite-description';
  context: {
    profileData?: any;
    informalText: string;
  };
}

const getSummaryPrompt = (profileData: any, informalText: string) => `
  Actúa como un experto en redacción de CVs y coach de carrera para una plataforma de empleo inclusiva. Tu tarea es crear un resumen de perfil profesional y atractivo.

  Basándote en los siguientes datos del perfil de un candidato y su descripción informal, genera un párrafo de resumen conciso y profesional. Destaca sus fortalezas clave y su propuesta de valor única. Usa un tono profesional pero accesible.

  **Datos del Perfil (en formato JSON):**
  ${JSON.stringify(profileData, null, 2)}

  **Descripción informal del candidato:**
  "${informalText}"

  **Instrucciones Adicionales:**
  - El resumen debe tener entre 3 y 5 frases.
  - Comienza con una frase potente que resuma su rol o principal habilidad.
  - No menciones directamente la discapacidad, a menos que el candidato lo haya hecho en su descripción informal de una manera que la presente como una fortaleza.

  **Resumen Profesional Generado:**
`;

const getRewritePrompt = (informalText: string) => `
  Eres un experto en redacción de currículums con formato profesional tipo Harvard, 
  con un enfoque inclusivo y respetuoso hacia personas con discapacidad. 
  Tu tarea es transformar la siguiente descripción informal en una lista de viñetas (bullet points) 
  claras, concisas y fieles al contenido original, listas para incluir directamente en un CV.

  **Objetivo:**
  Redactar únicamente las viñetas que representen con precisión las habilidades, responsabilidades 
  y aportes del candidato, sin inventar ni exagerar información.

  **Instrucciones de estilo:**
  - Crea entre 2 y 4 viñetas.
  - Escribe en **primera persona implícita**: inicia cada viñeta con un **verbo de acción en pasado** (ej.: Desarrollé, Implementé, Apoyé, Colaboré, Orgánice).
  - Usa un tono profesional, positivo y centrado en las capacidades y logros del candidato.
  - **Solo cuantifica logros o resultados si la descripción original los menciona explícitamente.**
  - Evita pronombres personales (yo, mi, etc.) y lenguaje subjetivo (creo, pienso).
  - Cada viñeta debe comenzar con un guion (“- ”) y estar en una nueva línea.
  - No incluyas texto fuera de las viñetas (sin explicaciones, introducciones ni comentarios).

  **Descripción informal del candidato:**
  "${informalText}"

  **Salida esperada:**
  Una lista de viñetas profesionales redactadas en primera persona implícita, listas para colocar directamente en un CV.
`;

export async function POST(req: Request) {
  try {
    const { task, context }: AssistCvRequest = await req.json();

    let prompt = '';

    switch (task) {
      case 'generate-summary':
        if (!context.profileData) {
          return new Response('Error: profileData es requerido para esta tarea', { status: 400 });
        }
        prompt = getSummaryPrompt(context.profileData, context.informalText);
        break;

      case 'rewrite-description':
        prompt = getRewritePrompt(context.informalText);
        break;

      default:
        return new Response('Error: Tarea no válida', { status: 400 });
    }

    const result = streamText({
      model: google('gemini-2.0-flash'),
      prompt: prompt,
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error(error);
    return new Response('Error procesando la solicitud', { status: 500 });
  }
}
