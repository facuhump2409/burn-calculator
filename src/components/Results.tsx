import React from 'react';
import { useBurnStore } from '../store/burnStore';
import { calculateFluidNeeds, getBurnClassification } from '../utils/calculations';

interface ResultsProps {
  onNext: () => void;
  onBack: () => void;
}

export const Results: React.FC<ResultsProps> = ({ onNext, onBack }) => {
  const { data } = useBurnStore();
  const totalBSA = Object.values(data.bodyAreas).reduce((sum, val) => sum + val, 0);
  const fluidNeeds = calculateFluidNeeds(data.weight, totalBSA);
  const classification = getBurnClassification(totalBSA);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Resultados - Plan de Resucitación</h2>

      {/* Burn Classification */}
      <div className="mb-6">
        <div className={`px-4 py-3 rounded-lg font-semibold text-center ${
          classification === 'Menor' ? 'bg-green-100 text-green-800' :
          classification === 'Moderada' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          Quemadura {classification}: {totalBSA.toFixed(1)}% de SCQ
        </div>
      </div>

      {/* Parkland Formula */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Fórmula de Parkland</h3>
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <p>
            <strong>Cálculo:</strong> 4 mL × {data.weight} kg × {totalBSA.toFixed(1)}% = <span className="text-xl font-bold text-blue-600">{fluidNeeds.totalIn24h} mL en 24 horas</span>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            (La mitad de la cantidad se administra en las primeras 8 horas desde el accidente)
          </p>
        </div>

        {/* Fluid Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* First 8 Hours */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <h4 className="font-bold text-amber-900 mb-2">Primeras 8 horas</h4>
            <p className="text-sm text-gray-700">
              <strong>Total:</strong> {fluidNeeds.first8h} mL
            </p>
            <p className="text-sm text-gray-700">
              <strong>Velocidad:</strong> {fluidNeeds.rateFirst8h} mL/hora
            </p>
          </div>

          {/* Remaining 16 Hours */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-bold text-blue-900 mb-2">Próximas 16 horas</h4>
            <p className="text-sm text-gray-700">
              <strong>Total:</strong> {fluidNeeds.remaining16h} mL
            </p>
            <p className="text-sm text-gray-700">
              <strong>Velocidad:</strong> {fluidNeeds.rateRemaining16h} mL/hora
            </p>
          </div>
        </div>
      </div>

      {/* Burn Area Distribution */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución de Áreas Quemadas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <p className="text-xs text-gray-600">Cabeza Anterior</p>
            <p className="text-lg font-bold text-red-600">{data.bodyAreas.headAnterior.toFixed(1)}%</p>
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <p className="text-xs text-gray-600">Cabeza Posterior</p>
            <p className="text-lg font-bold text-red-600">{data.bodyAreas.headPosterior.toFixed(1)}%</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <p className="text-xs text-gray-600">Tórax Anterior</p>
            <p className="text-lg font-bold text-yellow-600">{(data.bodyAreas.torsoLeftAnterior + data.bodyAreas.torsoRightAnterior).toFixed(1)}%</p>
          </div>
          <div className="bg-orange-50 p-3 rounded border border-orange-200">
            <p className="text-xs text-gray-600">Tórax Posterior</p>
            <p className="text-lg font-bold text-orange-600">{(data.bodyAreas.torsoLeftPosterior + data.bodyAreas.torsoRightPosterior).toFixed(1)}%</p>
          </div>
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-xs text-gray-600">Brazos</p>
            <p className="text-lg font-bold text-blue-600">{(data.bodyAreas.rightArmAnterior + data.bodyAreas.leftArmAnterior + data.bodyAreas.rightArmPosterior + data.bodyAreas.leftArmPosterior).toFixed(1)}%</p>
          </div>
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <p className="text-xs text-gray-600">Piernas</p>
            <p className="text-lg font-bold text-green-600">{(data.bodyAreas.rightLegAnterior + data.bodyAreas.leftLegAnterior + data.bodyAreas.rightLegPosterior + data.bodyAreas.leftLegPosterior).toFixed(1)}%</p>
          </div>
          <div className="bg-purple-50 p-3 rounded border border-purple-200">
            <p className="text-xs text-gray-600">Genitales Anterior</p>
            <p className="text-lg font-bold text-purple-600">{data.bodyAreas.genitalAnterior.toFixed(1)}%</p>
          </div>
          <div className="bg-purple-100 p-3 rounded border border-purple-300">
            <p className="text-xs text-gray-600">Genitales Posterior</p>
            <p className="text-lg font-bold text-purple-700">{data.bodyAreas.genitalPosterior.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-300 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
        >
          Volver
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          Ver Resumen Clínico
        </button>
      </div>
    </div>
  );
};
