import React, { useState, useRef } from 'react';
import { useBurnStore } from '../store/burnStore';
import { getDefaultBodyAreas } from '../utils/calculations';

interface BodyDiagramProps {
  onNext: () => void;
  onBack: () => void;
}

export const BodyDiagram: React.FC<BodyDiagramProps> = ({ onNext, onBack }) => {
  const { data, updateBodyArea, updateData } = useBurnStore();
  const areas = data.bodyAreas;
  const totalBSA = Object.values(areas).reduce((sum, val) => sum + val, 0);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [hoveredValue, setHoveredValue] = useState<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const isInfant = data.age < 5;

  // Area definitions for interactive clicking (with SVG coordinates and max percentages)
  const areaDefinitions = isInfant ? {
    // 1-year-old diagram areas (more detailed)
    head: { label: 'Cabeza', maxValue: 19, color: '#fca5a5' },
    torsoAnterior: { label: 'Tórax Anterior', maxValue: 13, color: '#fbbf24' },
    torsoPosterior: { label: 'Tórax Posterior', maxValue: 13, color: '#f97316' },
    rightArm: { label: 'Brazo Derecho', maxValue: 6.5, color: '#60a5fa' },
    leftArm: { label: 'Brazo Izquierdo', maxValue: 6.5, color: '#60a5fa' },
    rightLeg: { label: 'Pierna Derecha', maxValue: 16.5, color: '#34d399' },
    leftLeg: { label: 'Pierna Izquierda', maxValue: 16.5, color: '#34d399' },
    genitals: { label: 'Genitales', maxValue: 1, color: '#c084fc' },
  } : {
    // 10+ years (adult) diagram areas
    head: { label: 'Cabeza', maxValue: 9, color: '#fca5a5' },
    torsoAnterior: { label: 'Tórax Anterior', maxValue: 18, color: '#fbbf24' },
    torsoPosterior: { label: 'Tórax Posterior', maxValue: 18, color: '#f97316' },
    rightArm: { label: 'Brazo Derecho', maxValue: 9, color: '#60a5fa' },
    leftArm: { label: 'Brazo Izquierdo', maxValue: 9, color: '#60a5fa' },
    rightLeg: { label: 'Pierna Derecha', maxValue: 18, color: '#34d399' },
    leftLeg: { label: 'Pierna Izquierda', maxValue: 18, color: '#34d399' },
    genitals: { label: 'Genitales', maxValue: 1, color: '#c084fc' },
  };

  const handleAreaClick = (areaKey: string, percentageAtPoint: number) => {
    const currentValue = areas[areaKey as keyof typeof areas];
    const maxValue = areaDefinitions[areaKey as keyof typeof areaDefinitions]?.maxValue || 10;
    
    // Toggle: if already selected at this value, deselect; otherwise set to the calculated value
    const newValue = Math.abs(currentValue - percentageAtPoint) < 0.1 ? 0 : percentageAtPoint;
    updateBodyArea(areaKey as keyof typeof areas, Math.min(newValue, maxValue));
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGElement>, areaKey: string) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const maxValue = areaDefinitions[areaKey as keyof typeof areaDefinitions]?.maxValue || 10;
    const svgWidth = svgRef.current.clientWidth;
    
    // Calculate proportional percentage based on cursor position within the SVG
    const proportion = Math.min(Math.max(x / svgWidth, 0), 1);
    const calculatedValue = Math.round(proportion * maxValue * 10) / 10;
    
    setHoveredArea(areaKey);
    setHoveredValue(calculatedValue);
  };

  const handleSvgMouseLeave = () => {
    setHoveredArea(null);
    setHoveredValue(0);
  };

  const handleUseDefaults = () => {
    const defaults = getDefaultBodyAreas(data.age);
    updateData({ 
      bodyAreas: defaults,
      estimatedBSA: Object.values(defaults).reduce((sum, val) => sum + val, 0)
    });
  };

  const handleClear = () => {
    const empty = {
      head: 0,
      torsoAnterior: 0,
      torsoPosterior: 0,
      rightArm: 0,
      leftArm: 0,
      rightLeg: 0,
      leftLeg: 0,
      genitals: 0,
    };
    updateData({ bodyAreas: empty, estimatedBSA: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Mapa Interactivo de Área Quemada
      </h2>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Instrucciones:</strong> Haz clic sobre el diagrama del cuerpo para marcar las áreas quemadas.
          Los valores se calcularán automáticamente según donde hagas clic. Si marcas solo parte de una sección, verás un porcentaje proporcional.
        </p>
        <p className="text-xs text-gray-600">
          Por ejemplo: si marcas solo la mitad del tórax (8%), verás ~4%.
        </p>
      </div>

      {/* Interactive SVG Diagram */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-300 mb-6">
        <svg
          ref={svgRef}
          viewBox="0 0 400 600"
          className="w-full max-w-md mx-auto"
        >
          {/* Head */}
          <g
            onMouseMove={(e) => handleSvgMouseMove(e, 'head')}
            onMouseLeave={handleSvgMouseLeave}
            onClick={() => handleAreaClick('head', hoveredValue)}
            className="cursor-pointer hover:opacity-75 transition-opacity"
          >
            <circle
              cx="200"
              cy="80"
              r="40"
              fill={hoveredArea === 'head' ? '#fca5a5' : '#fecaca'}
              stroke={areas.head > 0 ? '#dc2626' : '#999'}
              strokeWidth="2"
            />
            <text x="200" y="85" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#000">
              {hoveredArea === 'head' ? hoveredValue.toFixed(1) : areas.head > 0 ? areas.head.toFixed(1) : '?'}%
            </text>
          </g>

          {/* Torso Anterior */}
          <g
            onMouseMove={(e) => handleSvgMouseMove(e, 'torsoAnterior')}
            onMouseLeave={handleSvgMouseLeave}
            onClick={() => handleAreaClick('torsoAnterior', hoveredValue)}
            className="cursor-pointer hover:opacity-75 transition-opacity"
          >
            <rect
              x="150"
              y="140"
              width="100"
              height="100"
              fill={hoveredArea === 'torsoAnterior' ? '#fbbf24' : '#fcd34d'}
              stroke={areas.torsoAnterior > 0 ? '#d97706' : '#999'}
              strokeWidth="2"
            />
            <text x="200" y="195" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#000">
              {hoveredArea === 'torsoAnterior' ? hoveredValue.toFixed(1) : areas.torsoAnterior > 0 ? areas.torsoAnterior.toFixed(1) : '?'}%
            </text>
          </g>

          {/* Right Arm */}
          <g
            onMouseMove={(e) => handleSvgMouseMove(e, 'rightArm')}
            onMouseLeave={handleSvgMouseLeave}
            onClick={() => handleAreaClick('rightArm', hoveredValue)}
            className="cursor-pointer hover:opacity-75 transition-opacity"
          >
            <rect
              x="70"
              y="160"
              width="60"
              height="100"
              fill={hoveredArea === 'rightArm' ? '#60a5fa' : '#93c5fd'}
              stroke={areas.rightArm > 0 ? '#0284c7' : '#999'}
              strokeWidth="2"
            />
            <text x="100" y="215" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">
              {hoveredArea === 'rightArm' ? hoveredValue.toFixed(1) : areas.rightArm > 0 ? areas.rightArm.toFixed(1) : '?'}%
            </text>
          </g>

          {/* Left Arm */}
          <g
            onMouseMove={(e) => handleSvgMouseMove(e, 'leftArm')}
            onMouseLeave={handleSvgMouseLeave}
            onClick={() => handleAreaClick('leftArm', hoveredValue)}
            className="cursor-pointer hover:opacity-75 transition-opacity"
          >
            <rect
              x="270"
              y="160"
              width="60"
              height="100"
              fill={hoveredArea === 'leftArm' ? '#60a5fa' : '#93c5fd'}
              stroke={areas.leftArm > 0 ? '#0284c7' : '#999'}
              strokeWidth="2"
            />
            <text x="300" y="215" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">
              {hoveredArea === 'leftArm' ? hoveredValue.toFixed(1) : areas.leftArm > 0 ? areas.leftArm.toFixed(1) : '?'}%
            </text>
          </g>

          {/* Right Leg */}
          <g
            onMouseMove={(e) => handleSvgMouseMove(e, 'rightLeg')}
            onMouseLeave={handleSvgMouseLeave}
            onClick={() => handleAreaClick('rightLeg', hoveredValue)}
            className="cursor-pointer hover:opacity-75 transition-opacity"
          >
            <rect
              x="155"
              y="270"
              width="40"
              height="120"
              fill={hoveredArea === 'rightLeg' ? '#34d399' : '#86efac'}
              stroke={areas.rightLeg > 0 ? '#059669' : '#999'}
              strokeWidth="2"
            />
            <text x="175" y="340" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">
              {hoveredArea === 'rightLeg' ? hoveredValue.toFixed(1) : areas.rightLeg > 0 ? areas.rightLeg.toFixed(1) : '?'}%
            </text>
          </g>

          {/* Left Leg */}
          <g
            onMouseMove={(e) => handleSvgMouseMove(e, 'leftLeg')}
            onMouseLeave={handleSvgMouseLeave}
            onClick={() => handleAreaClick('leftLeg', hoveredValue)}
            className="cursor-pointer hover:opacity-75 transition-opacity"
          >
            <rect
              x="205"
              y="270"
              width="40"
              height="120"
              fill={hoveredArea === 'leftLeg' ? '#34d399' : '#86efac'}
              stroke={areas.leftLeg > 0 ? '#059669' : '#999'}
              strokeWidth="2"
            />
            <text x="225" y="340" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">
              {hoveredArea === 'leftLeg' ? hoveredValue.toFixed(1) : areas.leftLeg > 0 ? areas.leftLeg.toFixed(1) : '?'}%
            </text>
          </g>

          {/* Genitals */}
          <g
            onMouseMove={(e) => handleSvgMouseMove(e, 'genitals')}
            onMouseLeave={handleSvgMouseLeave}
            onClick={() => handleAreaClick('genitals', hoveredValue)}
            className="cursor-pointer hover:opacity-75 transition-opacity"
          >
            <rect
              x="180"
              y="255"
              width="40"
              height="12"
              fill={hoveredArea === 'genitals' ? '#c084fc' : '#e9d5ff'}
              stroke={areas.genitals > 0 ? '#a855f7' : '#999'}
              strokeWidth="1"
            />
            <text x="200" y="264" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#000">
              {hoveredArea === 'genitals' ? hoveredValue.toFixed(1) : areas.genitals > 0 ? areas.genitals.toFixed(1) : '?'}%
            </text>
          </g>

          {/* Posterior Body (hidden, shown as reference) */}
          <g opacity="0.3">
            <rect
              x="150"
              y="140"
              width="100"
              height="100"
              fill="none"
              stroke="#666"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            <text x="200" y="125" textAnchor="middle" fontSize="10" fill="#666">
              Posterior
            </text>
          </g>
        </svg>

        <p className="text-center text-xs text-gray-600 mt-4">
          {isInfant ? 'Diagrama Lund-Browder para menores de 5 años' : 'Diagrama para mayores de 10 años'}
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6 border-2 border-blue-200">
        <p className="text-center text-lg font-bold text-blue-700 mb-3">
          Total: {totalBSA.toFixed(1)}% de SCQ
        </p>
        <p className="text-center text-xs text-gray-600">
          {totalBSA === 100 ? (
            <span className="text-green-600 font-semibold">✓ Total correcto (100%)</span>
          ) : totalBSA > 100 ? (
            <span className="text-red-600">⚠ Excede 100% ({(totalBSA - 100).toFixed(1)}% de más)</span>
          ) : (
            <span className="text-orange-600">⚠ Por debajo de 100% ({(100 - totalBSA).toFixed(1)}% de menos)</span>
          )}
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={handleUseDefaults}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-semibold transition-colors"
        >
          Usar Valores por Defecto
        </button>
        <button
          onClick={handleClear}
          className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 font-semibold transition-colors"
        >
          Limpiar
        </button>
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
          disabled={totalBSA === 0}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
            totalBSA > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Ver Resultados
        </button>
      </div>
    </div>
  );
};
