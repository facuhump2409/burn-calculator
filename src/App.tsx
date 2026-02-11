import React, { useState } from 'react';
import { PatientData } from './components/PatientData';
import { BodyDiagram } from './components/BodyDiagram';
import { Results } from './components/Results';
import { ClinicalSummary } from './components/ClinicalSummary';
import { useBurnStore } from './store/burnStore';

type Step = 'patient' | 'body' | 'results' | 'summary';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('patient');
  const { reset } = useBurnStore();

  const handleNext = (nextStep: Step) => {
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    reset();
    setCurrentStep('patient');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Regla de 3 Pediatrica
          </h1>
          <p className="text-gray-600">
            Calculadora de Quemaduras Pediátricas
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-center items-center mb-8">
            {(['patient', 'body', 'results', 'summary'] as const).map(
              (step, index) => {
                const stepLabels = {
                  patient: 'Datos',
                  body: 'Mapa',
                  results: 'Resultados',
                  summary: 'Resumen',
                };
                const isActive = currentStep === step;

                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center w-16">
                      {stepLabels[step]}
                    </p>
                    {index < 3 && (
                      <div
                        className={`w-16 h-1 mt-4 ${
                          isActive ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 md:p-8">
          {currentStep === 'patient' && (
            <PatientData onNext={() => handleNext('body')} />
          )}
          {currentStep === 'body' && (
            <BodyDiagram
              onNext={() => handleNext('results')}
              onBack={() => handleNext('patient')}
            />
          )}
          {currentStep === 'results' && (
            <Results
              onNext={() => handleNext('summary')}
              onBack={() => handleNext('body')}
            />
          )}
          {currentStep === 'summary' && (
            <ClinicalSummary
              onBack={() => handleNext('results')}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            Calculadora de Quemaduras Pediátricas • Basada en Fórmula de Parkland
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
