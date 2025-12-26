
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeBodyPhoto(imageBuffer: string, metrics: { weight: number, height: number }) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBuffer.split(',')[1],
              mimeType: "image/jpeg"
            }
          },
          {
            text: `Analiza esta foto de progreso físico. El usuario pesa ${metrics.weight}kg y mide ${metrics.height}cm. Proporciona una estimación visual de composición corporal, consejos de postura y sugerencias de entrenamiento para mejorar puntos débiles. Responde en un tono motivador y profesional.`
          }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "No se pudo realizar el análisis en este momento. Inténtalo más tarde.";
  }
}

export async function getExerciseHistoryStats(exerciseName: string) {
    // Simulating thinking capability to generate insight
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Basado en un historial simulado de ${exerciseName}, proporciona un breve resumen de 2 frases sobre la progresión típica de fuerza para este movimiento y un consejo técnico clave.`,
        config: {
            tools: [{googleSearch: {}}]
        }
    });
    return response.text;
}
