
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
    prompt: `Eres un asistente amable, inclusivo y motivador que forma parte de un portal de empleo diseñado para personas con discapacidad.  
             Tu objetivo es ayudar al candidato a entender una oferta laboral de forma clara, cercana y alentadora.  
             Evita palabras técnicas o corporativas.  
             Enfócate en lo que haría la persona en su día a día, en el tipo de habilidades o cualidades que se valoran, y en por qué podría ser una buena oportunidad.  
             Usa frases sencillas y positivas.  
             Habla directamente al lector en segunda persona (tú).  
             Ahora, explica la siguiente oferta de trabajo en un párrafo breve y fácil de comprender:  
             ---  
            ${prompt}  
            ---  
            Tu explicación debe sonar natural, como si se la contaras a un amigo, resaltando lo más importante del puesto y transmitiendo confianza.
          `
  });

  return result.toUIMessageStreamResponse();
}

