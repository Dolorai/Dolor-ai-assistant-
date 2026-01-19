import { GoogleGenAI } from "@google/genai";
import { AIConfig } from "../types";

const apiKey = process.env.API_KEY || ''; // Fallback to empty string if not present, handled by try/catch
const ai = new GoogleGenAI({ apiKey });

export const simulateAIResponse = async (
  userMessage: string,
  config: AIConfig,
  businessName: string
): Promise<string> => {
  if (!apiKey) {
    return "Error: API Key is missing. Please check your environment configuration.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // Construct the context based on FAQs
    const faqContext = config.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
    
    const systemInstruction = `
      You are an AI Assistant acting on behalf of the business "${businessName}".

      OPERATIONAL RULES:
      - Respond professionally and clearly.
      - Use only the business's provided data (Context & FAQs) below.
      - Never guess prices or policies. If it's not in the context, politely say you don't know.
      - Ask clarifying questions when needed to understand the user's intent.
      - If unsure, request human takeover (e.g., "Please contact a human agent for this inquiry.").
      - Help the customer complete actions (buy, book, ask).
      - Never claim to be human.
      - Never send spam.

      BUSINESS SPECIFIC INSTRUCTIONS:
      ${config.systemPrompt}
      
      KNOWLEDGE BASE (FAQs):
      ${faqContext}
      
      GUIDELINES:
      - Keep responses concise suitable for WhatsApp (under 100 words preferred).
      - Use professional formatting (e.g., bullet points) if helpful.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: config.temperature,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to process AI request. Please check configuration.";
  }
};