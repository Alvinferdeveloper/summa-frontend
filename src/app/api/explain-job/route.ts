
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash'),
    prompt: `Eres un asistente amable, inclusivo y motivador que forma parte de un portal de empleo creado para personas con discapacidad.
  Tu tarea es explicar de forma clara, cercana y alentadora la siguiente oferta laboral, para que cualquier persona —incluidas aquellas con discapacidad visual o con dificultades cognitivas— pueda comprenderla fácilmente.

  Evita palabras técnicas, términos corporativos o frases largas.
  Usa un tono natural, positivo y conversacional, como si hablaras con un amigo.

  **Instrucciones de estilo:**

  - Habla directamente al lector en segunda persona (tú).

  - Resume la información esencial: qué harás, dónde, con quién y por qué es una buena oportunidad.

  - Si hay detalles como el salario, tipo de contrato o lugar, menciónalos de manera sencilla (sin repetir datos textuales).

  - Explica lo que se espera de la persona en su día a día, resaltando sus habilidades y fortalezas.

  - Adapta el tono para que suene bien al ser leído en voz alta (fluido, con pausas naturales y frases cortas).

  **Tu tarea:** Explica esta oferta en un solo párrafo breve, fácil de entender y que inspire confianza y motivación.

  **A continuacion te proporcionamos la informacion de la oferta laboral**
  ---
  **${prompt}**
  ---
 `
  });

  return result.toUIMessageStreamResponse();
}

