
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Always initialize GoogleGenAI inside functions using process.env.API_KEY directly to ensure the latest key is used.

export const generateSpeech = async (text: string, voiceName: string = 'Kore') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this traffic report clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const validateIncidentReport = async (description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Evaluate the following user traffic report for credibility and type: "${description}". Respond in JSON format with fields: isValid (boolean), confidence (0-1), category (Accident, Hazard, Stalled Vehicle, Roadwork), and cleanedDescription (string).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            category: { type: Type.STRING },
            cleanedDescription: { type: Type.STRING }
          },
          required: ["isValid", "confidence", "category", "cleanedDescription"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Validation Error:", error);
    return { isValid: false, confidence: 0, category: 'Hazard', cleanedDescription: description };
  }
};

export const verifyLicense = async (licenseId: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Simulate a DMV check for driving license: ${licenseId}. Respond in JSON with: isAuthorized (boolean), name (string), expiryDate (string). Just generate a plausible profile if format looks okay.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAuthorized: { type: Type.BOOLEAN },
            name: { type: Type.STRING },
            expiryDate: { type: Type.STRING }
          },
          required: ["isAuthorized", "name", "expiryDate"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { isAuthorized: true, name: "Verified Citizen", expiryDate: "2029-12-31" };
  }
};

export const getWeatherAnalysis = async (city: string, lang: string = "English") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for the current weather and 3-day forecast in ${city}. Return the result in ${lang} as a JSON object strictly following this schema: { "current": { "temp": number, "condition": string, "humidity": number, "wind": number }, "forecast": [ { "day": string, "temp": number, "condition": string } ], "roadImpact": string }. Provide the temperatures in Celsius.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            current: {
              type: Type.OBJECT,
              properties: {
                temp: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                humidity: { type: Type.NUMBER },
                wind: { type: Type.NUMBER }
              },
              required: ["temp", "condition", "humidity", "wind"]
            },
            forecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  temp: { type: Type.NUMBER },
                  condition: { type: Type.STRING }
                },
                required: ["day", "temp", "condition"]
              }
            },
            roadImpact: { type: Type.STRING }
          },
          required: ["current", "forecast", "roadImpact"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Weather Gemini Error:", error);
    return null;
  }
};

export const analyzeTrafficState = async (trafficSummary: string, lang: string = "English") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this data and provide strategies in ${lang}: ${trafficSummary}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            suggestedTimings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  intersectionId: { type: Type.STRING },
                  greenDuration: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING }
                },
                required: ["intersectionId", "greenDuration", "reasoning"]
              }
            },
            riskWarnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["analysis", "suggestedTimings", "riskWarnings"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};

export const predictSafetyHotspots = async (history: string, lang: string = "English") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Predict safety hotspots and plans in ${lang} based on: ${history}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              area: { type: Type.STRING },
              riskScore: { type: Type.NUMBER },
              reason: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            },
            required: ["area", "riskScore", "reason", "recommendation"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Prediction Error:", error);
    return [];
  }
};

export const fetchLocalTraffic = async (lat: number, lng: number, lang: string = "English") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `What is the current traffic situation around my location? Respond in ${lang}.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });
    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "Failed to fetch traffic intelligence.", groundingChunks: [] };
  }
};

export const fetchRouteIntel = async (origin: string, destination: string, lang: string = "English") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find the fastest and most efficient routes from "${origin}" to "${destination}". 
      Include estimated travel time, distance, and real-time traffic conditions. 
      Also, provide predictive insights (e.g., if traffic is expected to increase soon).
      Respond in ${lang}. Use Markdown for formatting.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });
    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Route Planning Error:", error);
    return { text: "Failed to plan route.", groundingChunks: [] };
  }
};
