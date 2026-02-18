import React, { useRef } from 'react';
import { useBurnStore } from '../store/burnStore';
import { calculateFluidNeeds, getBurnClassification, getAgeGroup } from '../utils/calculations';
import { Printer } from 'lucide-react';

interface ClinicalSummaryProps {
  onBack: () => void;
  onReset: () => void;
}

export const ClinicalSummary: React.FC<ClinicalSummaryProps> = ({ onBack, onReset }) => {
  const { data } = useBurnStore();
  const printRef = useRef<HTMLDivElement>(null);
  const totalBSA = Object.values(data.bodyAreas).reduce((sum, val) => sum + val, 0);
  const fluidNeeds = calculateFluidNeeds(data.weight, totalBSA);
  const classification = getBurnClassification(totalBSA);
  const ageGroup = getAgeGroup(data.age);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '', 'width=900,height=600');
      if (printWindow) {
        printWindow.document.write(printRef.current.innerHTML);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div ref={printRef} className="bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen Clínico - Evaluación de Quemaduras</h2>

        {/* Patient Information */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Información del Paciente</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Edad</p>
              <p className="font-bold text-lg">{data.age} años ({ageGroup})</p>
            </div>
            <div>
              <p className="text-gray-600">Peso</p>
              <p className="font-bold text-lg">{data.weight} kg</p>
            </div>
            <div>
              <p className="text-gray-600">Hora del Accidente</p>
              <p className="font-bold text-lg">{data.accidentTime}</p>
            </div>
            <div>
              <p className="text-gray-600">Lugar</p>
              <p className="font-bold text-lg">{data.location || 'No especificado'}</p>
            </div>
            {data.servicio && (
              <>
                <div>
                  <p className="text-gray-600">Servicio</p>
                  <p className="font-bold text-lg">{data.servicio}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Burn Assessment */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Evaluación de Quemadura</h3>
          <div className={`px-4 py-3 rounded-lg font-bold text-center text-xl mb-4 ${
            classification === 'Menor' ? 'bg-green-100 text-green-800' :
            classification === 'Moderada' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {classification.toUpperCase()}: {totalBSA.toFixed(1)}% de SCQ
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-3 rounded">
              <p className="text-gray-600">Cabeza Anterior</p>
              <p className="font-bold text-lg">{data.bodyAreas.headAnterior.toFixed(1)}%</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="text-gray-600">Cabeza Posterior</p>
              <p className="font-bold text-lg">{data.bodyAreas.headPosterior.toFixed(1)}%</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="text-gray-600">Tórax Anterior</p>
              <p className="font-bold text-lg">{(data.bodyAreas.torsoLeftAnterior + data.bodyAreas.torsoRightAnterior).toFixed(1)}%</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="text-gray-600">Tórax Posterior</p>
              <p className="font-bold text-lg">{(data.bodyAreas.torsoLeftPosterior + data.bodyAreas.torsoRightPosterior).toFixed(1)}%</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="text-gray-600">Brazo Derecho</p>
              <p className="font-bold text-lg">{(data.bodyAreas.rightArmAnterior + data.bodyAreas.rightArmPosterior).toFixed(1)}%</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="text-gray-600">Brazo Izquierdo</p>
              <p className="font-bold text-lg">{(data.bodyAreas.leftArmAnterior + data.bodyAreas.leftArmPosterior).toFixed(1)}%</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="text-gray-600">Pierna Derecha</p>
              <p className="font-bold text-lg">{(data.bodyAreas.rightLegAnterior + data.bodyAreas.rightLegPosterior).toFixed(1)}%</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="text-gray-600">Pierna Izquierda</p>
              <p className="font-bold text-lg">{(data.bodyAreas.leftLegAnterior + data.bodyAreas.leftLegPosterior).toFixed(1)}%</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="text-gray-600">Genitales Anterior</p>
              <p className="font-bold text-lg">{data.bodyAreas.genitalAnterior.toFixed(1)}%</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="text-gray-600">Genitales Posterior</p>
              <p className="font-bold text-lg">{data.bodyAreas.genitalPosterior.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Parkland Formula */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-amber-900 mb-4">Fórmula de Parkland</h3>
          <p className="text-sm text-gray-700 mb-3">
            <strong>Cálculo:</strong> 4 mL × {data.weight} kg × {totalBSA.toFixed(1)}% = <strong className="text-2xl text-amber-700">{fluidNeeds.totalIn24h} mL</strong> en 24 horas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border-l-4 border-amber-500 p-4 rounded">
              <h4 className="font-bold text-amber-900 mb-2">Primeras 8 Horas</h4>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Volumen:</strong> {fluidNeeds.first8h} mL
              </p>
              <p className="text-sm text-gray-700">
                <strong>Velocidad:</strong> {fluidNeeds.rateFirst8h} mL/hora
              </p>
            </div>
            <div className="bg-white border-l-4 border-blue-500 p-4 rounded">
              <h4 className="font-bold text-blue-900 mb-2">Próximas 16 Horas</h4>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Volumen:</strong> {fluidNeeds.remaining16h} mL
              </p>
              <p className="text-sm text-gray-700">
                <strong>Velocidad:</strong> {fluidNeeds.rateRemaining16h} mL/hora
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Recommendations */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recomendaciones Clínicas</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Mantener vía aérea permeable y oxigenación adecuada</li>
            <li>✓ Monitorizar diuresis (objetivo: 0.5 mL/kg/h en niños, 1 mL/kg/h en adultos)</li>
            <li>✓ Realizar cambios de fluidos según respuesta clínica</li>
            <li>✓ Cobertura temprana de heridas para prevenir infección</li>
            <li>✓ Evaluación y manejo del dolor</li>
            <li>✓ Evaluación de necesidades nutricionales</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-300 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
        >
          Volver
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Printer size={20} />
          Imprimir
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          Nuevo Caso
        </button>
      </div>
    </div>
  );
};
