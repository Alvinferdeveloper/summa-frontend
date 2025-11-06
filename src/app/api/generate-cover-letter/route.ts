
import { ProfileData } from '@/app/(job-seeker)/profile/hooks/useMyProfile';
import apiClient from '@/lib/apiServer';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

const getProfile = async()=> {
    const { data } = await apiClient.get<ProfileData>('/v1/profile/me');
    return data;
}

export async function POST(req: Request) {
  const { job } = await req.json();
  const profile = await getProfile();

  const result = streamText({
    model: google('gemini-2.0-flash'),
    prompt: `
      Actúa como un asesor de carrera experto y redactor profesional de cartas de presentación para un portal de empleo enfocado en la inclusión.
Tu tarea es redactar una carta de presentación escrita en primera persona, como si fuera redactada directamente por el candidato.

Datos del candidato:
Nombre: ${profile.first_name} ${profile.last_name}
Puesto al que postula: "${job.title}"
Empresa: "${job.employer.company_name}"

Descripción del puesto:
"""
${job.description}
"""

Información del candidato:
"""
${profile}
"""

📝 Instrucciones

Tono: Profesional, entusiasta y seguro, transmitiendo autenticidad y motivación.

Extensión: No más de dos párrafos breves.

Contenido:

Primer párrafo: Explica por qué el candidato encaja en el puesto, conectando sus habilidades, experiencia o valores con los requisitos y la misión de la empresa. Si faltan detalles sobre sus habilidades, enfatiza su entusiasmo, compromiso y afinidad con los valores de la organización.

Segundo párrafo: Cierra con una llamada a la acción amable, expresando el deseo de conversar o entrevistarse para aportar valor al equipo.

Estilo:

Redacta en primera persona, con naturalidad y fluidez.

Evita sonar genérico o mecánico; la carta debe parecer escrita realmente por el candidato.

No dejes campos vacíos ni instrucciones visibles.

Al final, genera solo la carta de presentación completa, sin títulos ni explicaciones.
    `
  });

  return result.toUIMessageStreamResponse();
}

