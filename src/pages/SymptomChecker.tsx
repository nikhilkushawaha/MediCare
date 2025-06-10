
import React from 'react';
import SymptomChecker from '@/components/symptomChecker/SymptomChecker';

export default function SymptomCheckerPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Health Mate</h1>
        <p className="text-muted-foreground">
          Use our AI-powered tool to check your symptoms and get preliminary guidance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SymptomChecker />
        </div>
        
        <div className="space-y-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">How It Works</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Enter all your symptoms in the text field</li>
              <li>Our AI will analyze your symptoms</li>
              <li>Review the possible conditions and recommendations</li>
              <li>Consult with a doctor for proper diagnosis</li>
            </ol>
          </div>
          
          <div className="bg-yellow-500/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Important Disclaimer</h3>
            <p>
              This symptom checker is for informational purposes only and is not a qualified medical opinion. 
              Always consult with a healthcare professional for proper medical advice and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
