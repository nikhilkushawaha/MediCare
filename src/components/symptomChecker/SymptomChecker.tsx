
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ArrowRight, Plus, X, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkSymptomsWithAI, SymptomCheckerResponse } from '@/utils/openaiService';
import { SymptomCheckerResult } from '@/utils/types';
import { useToast } from '@/components/ui/use-toast';

const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;

export default function SymptomChecker() {
  const { toast } = useToast();
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<SymptomCheckerResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('openai_api_key') || openaiKey);
  const [isApiKeyRequired, setIsApiKeyRequired] = useState<boolean>(!localStorage.getItem(openaiKey));

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSymptom();
    }
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setIsApiKeyRequired(false);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been securely saved in your browser.",
      });
    } else {
      toast({
        title: "API Key Required",
        description: "Please enter a valid OpenAI API key.",
        variant: "destructive"
      });
    }
  };

  const checkUserSymptoms = async () => {
    if (symptoms.length === 0) {
      toast({
        title: "No Symptoms Provided",
        description: "Please enter at least one symptom to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    setIsChecking(true);
    
    try {
      // Call OpenAI service
      const aiResponse: SymptomCheckerResponse = await checkSymptomsWithAI(symptoms);
      
      // Convert to our app's format
      const formattedResult: SymptomCheckerResult = {
        inputSymptoms: symptoms,
        matchedSymptoms: aiResponse.matchedSymptoms,
        possibleConditions: aiResponse.possibleConditions,
        severity: aiResponse.severity,
        recommendation: aiResponse.recommendation,
        confidence: aiResponse.confidence
      };
      
      setResult(formattedResult);
    } catch (error) {
      console.error("Error checking symptoms:", error);
      toast({
        title: "Error",
        description: "There was an error analyzing your symptoms. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const resetChecker = () => {
    setSymptoms([]);
    setResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-500';
      case 'moderate': return 'bg-orange-500';
      case 'severe': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isApiKeyRequired) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">AI Symptom Checker</CardTitle>
          <CardDescription>
            To use our AI-powered symptom checker, you need to provide an OpenAI API key.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Key Required</AlertTitle>
            <AlertDescription>
              Your API key will be stored locally in your browser and is not sent to our servers.
              You can get an API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI website</a>.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              type="password"
            />
          </div>
          
          <Button onClick={saveApiKey} className="w-full">
            Save API Key & Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">AI Symptom Checker</CardTitle>
        <CardDescription>
          Enter your symptoms to get a preliminary assessment. This is not a substitute for professional medical advice.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!result ? (
          <>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter a symptom (e.g., headache, fever)"
                value={currentSymptom}
                onChange={(e) => setCurrentSymptom(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={addSymptom} disabled={!currentSymptom.trim()}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            {symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {symptoms.map((symptom) => (
                  <Badge key={symptom} className="flex items-center gap-1 px-3 py-1.5">
                    {symptom}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeSymptom(symptom)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="pt-4">
              <Button 
                onClick={checkUserSymptoms} 
                disabled={symptoms.length === 0 || isChecking} 
                className="w-full"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    Check Symptoms
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important Notice</AlertTitle>
              <AlertDescription>
                This is an automated preliminary assessment and not a medical diagnosis. 
                Always consult with a healthcare professional for proper medical advice.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h3 className="font-medium">Confidence Score:</h3>
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${Math.min(result.confidence, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{Math.round(result.confidence)}%</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Symptoms Identified:</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.matchedSymptoms.map((symptom, idx) => (
                  <Badge key={idx} variant="outline">{symptom}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Possible Conditions:</h3>
              <ul className="list-disc pl-5 mt-1">
                {result.possibleConditions.map((condition, idx) => (
                  <li key={idx}>{condition}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">Severity:</h3>
              <Badge className={`mt-1 ${getSeverityColor(result.severity)}`}>
                {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
              </Badge>
            </div>
            
            <div>
              <h3 className="font-medium">Recommendation:</h3>
              <p className="text-sm mt-1">{result.recommendation}</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {result && (
          <Button variant="outline" onClick={resetChecker}>
            Check New Symptoms
          </Button>
        )}
        <div className="text-xs text-muted-foreground">
          Powered by OpenAI
        </div>
      </CardFooter>
    </Card>
  );
}

// Label component for API key input
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium leading-none">
      {children}
    </label>
  );
}
