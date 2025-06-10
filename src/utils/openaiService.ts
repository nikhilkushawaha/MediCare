
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Add your API key here or in .env
  dangerouslyAllowBrowser: true // Only for frontend usage, ideally this should be on the server
});

export interface SymptomCheckerResponse {
  matchedSymptoms: string[];
  possibleConditions: string[];
  severity: 'mild' | 'moderate' | 'severe';
  recommendation: string;
  confidence: number;
}

// Function to check symptoms using OpenAI
export const checkSymptomsWithAI = async (symptoms: string[]): Promise<SymptomCheckerResponse> => {
  try {
    // Default fallback response
    let fallbackResponse: SymptomCheckerResponse = {
      matchedSymptoms: symptoms,
      possibleConditions: ["Please consult a doctor for proper diagnosis"],
      severity: "moderate",
      recommendation: "We recommend consulting with a healthcare professional for an accurate diagnosis.",
      confidence: 50
    };

    // Basic validation
    if (!symptoms || symptoms.length === 0) {
      return {
        ...fallbackResponse,
        matchedSymptoms: [],
        recommendation: "Please provide at least one symptom for analysis."
      };
    }

    // Format the prompt for OpenAI
    const prompt = `
      As a medical AI assistant, analyze these symptoms: ${symptoms.join(", ")}.
      
      Provide a structured medical analysis in JSON format with the following fields:
      1. matchedSymptoms: A list of recognized medical symptoms
      2. possibleConditions: A list of 2-4 possible medical conditions
      3. severity: Either "mild", "moderate", or "severe"
      4. recommendation: Medical advice for the patient
      5. confidence: A number between 0-100 representing diagnostic confidence
      
      Important: Include a clear disclaimer that this is not a definitive diagnosis.
    `;

    // Call OpenAI API
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    // Parse the response
    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      console.error("Empty response from OpenAI");
      return fallbackResponse;
    }

    try {
      const parsedResponse = JSON.parse(responseContent);
      return {
        matchedSymptoms: parsedResponse.matchedSymptoms || symptoms,
        possibleConditions: parsedResponse.possibleConditions || fallbackResponse.possibleConditions,
        severity: parsedResponse.severity || "moderate",
        recommendation: parsedResponse.recommendation || fallbackResponse.recommendation,
        confidence: parsedResponse.confidence || 50
      };
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      return fallbackResponse;
    }
  } catch (error) {
    console.error("Error in OpenAI service:", error);
    return {
      matchedSymptoms: symptoms,
      possibleConditions: ["Error in symptom analysis"],
      severity: "moderate",
      recommendation: "We encountered an error analyzing your symptoms. Please try again later or consult a healthcare professional.",
      confidence: 0
    };
  }
};
