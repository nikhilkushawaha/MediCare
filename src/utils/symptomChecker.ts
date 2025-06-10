
import { toast } from "@/components/ui/use-toast";

// This is a simplified symptom checker that simulates using a pre-trained model
// In a real application, you'd integrate with a proper medical AI API or model

// Sample symptom database based on common symptoms and conditions
const symptomDatabase = [
  {
    symptoms: ["fever", "cough", "shortness of breath", "fatigue", "body aches"],
    possibleConditions: ["Common Cold", "Influenza", "COVID-19", "Pneumonia"],
    severity: "moderate",
    recommendation: "Please consult a doctor promptly for proper diagnosis and treatment."
  },
  {
    symptoms: ["headache", "nausea", "sensitivity to light", "blurred vision"],
    possibleConditions: ["Migraine", "Tension Headache", "Cluster Headache"],
    severity: "mild",
    recommendation: "Rest in a dark room, consider over-the-counter pain relievers, and consult a doctor if symptoms persist."
  },
  {
    symptoms: ["abdominal pain", "nausea", "vomiting", "diarrhea", "fever"],
    possibleConditions: ["Gastroenteritis", "Food Poisoning", "Appendicitis", "Stomach Flu"],
    severity: "moderate",
    recommendation: "Stay hydrated, avoid solid foods, and consult a doctor if symptoms worsen or persist."
  },
  {
    symptoms: ["chest pain", "shortness of breath", "dizziness", "sweating", "nausea"],
    possibleConditions: ["Angina", "Heart Attack", "Panic Attack", "Pulmonary Embolism"],
    severity: "severe",
    recommendation: "Seek emergency medical attention immediately."
  },
  {
    symptoms: ["rash", "itching", "redness", "swelling"],
    possibleConditions: ["Allergic Reaction", "Eczema", "Contact Dermatitis", "Hives"],
    severity: "mild",
    recommendation: "Avoid potential allergens, consider antihistamines, and consult a doctor if symptoms persist."
  }
];

export interface SymptomCheckerResult {
  inputSymptoms: string[];
  matchedSymptoms: string[];
  possibleConditions: string[];
  severity: string;
  recommendation: string;
  confidence: number;
}

export const checkSymptoms = (userSymptoms: string[]): SymptomCheckerResult => {
  try {
    // Convert user symptoms to lowercase for case-insensitive matching
    const normalizedUserSymptoms = userSymptoms.map(s => s.toLowerCase().trim());
    
    // Find the best matching symptom group
    let bestMatch = {
      entry: symptomDatabase[0],
      matchedCount: 0,
      confidence: 0
    };
    
    for (const entry of symptomDatabase) {
      const matchedSymptoms = entry.symptoms.filter(s => 
        normalizedUserSymptoms.some(us => us.includes(s) || s.includes(us))
      );
      
      const matchedCount = matchedSymptoms.length;
      const confidence = matchedCount / Math.max(entry.symptoms.length, normalizedUserSymptoms.length);
      
      if (confidence > bestMatch.confidence) {
        bestMatch = { entry, matchedCount, confidence };
      }
    }
    
    // Return the result
    return {
      inputSymptoms: userSymptoms,
      matchedSymptoms: bestMatch.entry.symptoms.filter(s => 
        normalizedUserSymptoms.some(us => us.includes(s) || s.includes(us))
      ),
      possibleConditions: bestMatch.entry.possibleConditions,
      severity: bestMatch.entry.severity,
      recommendation: bestMatch.entry.recommendation,
      confidence: bestMatch.confidence * 100 // Convert to percentage
    };
  } catch (error) {
    console.error("Error in symptom checking:", error);
    toast({
      title: "Error",
      description: "There was an error processing your symptoms. Please try again.",
      variant: "destructive"
    });
    
    return {
      inputSymptoms: userSymptoms,
      matchedSymptoms: [],
      possibleConditions: [],
      severity: "unknown",
      recommendation: "Unable to process symptoms. Please consult a healthcare professional.",
      confidence: 0
    };
  }
};
