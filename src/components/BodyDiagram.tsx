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
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');
  const svgRef = useRef<SVGSVGElement>(null);

  const isAdult = data.age >= 10;

  // Area definitions for adult (10+) with separate anterior and posterior
  // Each front/back shows half of the total percentage (e.g., 4.5% front + 4.5% back = 9% total)
  const adultAreaDefinitions = {
    // Front body areas - each shows 50% of total
    headAnterior: { label: 'Cabeza Anterior', maxValue: 4.5, color: '#fca5a5', side: 'front' },
    torsoAnterior: { label: 'Tórax Anterior', maxValue: 4.5, color: '#fbbf24', side: 'front' },
    abdomenAnterior: { label: 'Abdomen Anterior', maxValue: 4.5, color: '#fbbf24', side: 'front' },
    rightArmAnterior: { label: 'Brazo D. Anterior', maxValue: 2.25, color: '#60a5fa', side: 'front' },
    leftArmAnterior: { label: 'Brazo I. Anterior', maxValue: 2.25, color: '#60a5fa', side: 'front' },
    rightLegAnterior: { label: 'Pierna D. Anterior', maxValue: 4.5, color: '#34d399', side: 'front' },
    leftLegAnterior: { label: 'Pierna I. Anterior', maxValue: 4.5, color: '#34d399', side: 'front' },
    genitalAnterior: { label: 'Genitales Anterior', maxValue: 0.5, color: '#c084fc', side: 'front' },
    
    // Back body areas - each shows 50% of total
    headPosterior: { label: 'Cabeza Posterior', maxValue: 4.5, color: '#fca5a5', side: 'back' },
    torsoPosterior: { label: 'Tórax Posterior', maxValue: 4.5, color: '#f97316', side: 'back' },
    abdomenPosterior: { label: 'Abdomen Posterior', maxValue: 4.5, color: '#f97316', side: 'back' },
    rightArmPosterior: { label: 'Brazo D. Posterior', maxValue: 2.25, color: '#60a5fa', side: 'back' },
    leftArmPosterior: { label: 'Brazo I. Posterior', maxValue: 2.25, color: '#60a5fa', side: 'back' },
    rightLegPosterior: { label: 'Pierna D. Posterior', maxValue: 4.5, color: '#34d399', side: 'back' },
    leftLegPosterior: { label: 'Pierna I. Posterior', maxValue: 4.5, color: '#34d399', side: 'back' },
    genitalPosterior: { label: 'Genitales Posterior', maxValue: 0.5, color: '#c084fc', side: 'back' },
  };

  // Area definitions for children < 10 with front/back - using 1-year-old Lund-Browder percentages
  // Each front/back shows 50% of total percentage
  const childAreaDefinitions = {
    // Front body areas - each shows 50% of total
    headAnterior: { label: 'Cabeza Anterior', maxValue: 4.5, color: '#fca5a5', side: 'front' },
    torsoAnterior: { label: 'Tórax Anterior', maxValue: 4, color: '#fbbf24', side: 'front' },
    abdomenAnterior: { label: 'Abdomen Anterior', maxValue: 4, color: '#fbbf24', side: 'front' },
    rightArmAnterior: { label: 'Brazo D. Anterior', maxValue: 0.75, color: '#60a5fa', side: 'front' },
    leftArmAnterior: { label: 'Brazo I. Anterior', maxValue: 0.75, color: '#60a5fa', side: 'front' },
    rightLegAnterior: { label: 'Pierna D. Anterior', maxValue: 3, color: '#34d399', side: 'front' },
    leftLegAnterior: { label: 'Pierna I. Anterior', maxValue: 3, color: '#34d399', side: 'front' },
    genitalAnterior: { label: 'Genitales Anterior', maxValue: 0.5, color: '#c084fc', side: 'front' },
    
    // Back body areas - each shows 50% of total
    headPosterior: { label: 'Cabeza Posterior', maxValue: 4.5, color: '#fca5a5', side: 'back' },
    torsoPosterior: { label: 'Tórax Posterior', maxValue: 4, color: '#f97316', side: 'back' },
    abdomenPosterior: { label: 'Abdomen Posterior', maxValue: 4, color: '#f97316', side: 'back' },
    rightArmPosterior: { label: 'Brazo D. Posterior', maxValue: 0.75, color: '#60a5fa', side: 'back' },
    leftArmPosterior: { label: 'Brazo I. Posterior', maxValue: 0.75, color: '#60a5fa', side: 'back' },
    rightLegPosterior: { label: 'Pierna D. Posterior', maxValue: 3, color: '#34d399', side: 'back' },
    leftLegPosterior: { label: 'Pierna I. Posterior', maxValue: 3, color: '#34d399', side: 'back' },
    genitalPosterior: { label: 'Genitales Posterior', maxValue: 0.5, color: '#c084fc', side: 'back' },
  };

  const handleAreaClick = (areaKey: string, percentageAtPoint: number) => {
    const currentValue = areas[areaKey as keyof typeof areas];
    const maxValue = isAdult 
      ? adultAreaDefinitions[areaKey as keyof typeof adultAreaDefinitions]?.maxValue || 10
      : childAreaDefinitions[areaKey as keyof typeof childAreaDefinitions]?.maxValue || 10;
    
    const newValue = Math.abs(currentValue - percentageAtPoint) < 0.1 ? 0 : percentageAtPoint;
    updateBodyArea(areaKey as keyof typeof areas, Math.min(newValue, maxValue));
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGElement>, areaKey: string) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const maxValue = isAdult
      ? adultAreaDefinitions[areaKey as keyof typeof adultAreaDefinitions]?.maxValue || 10
      : childAreaDefinitions[areaKey as keyof typeof childAreaDefinitions]?.maxValue || 10;
    const svgWidth = svgRef.current.clientWidth;
    
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
      headAnterior: 0,
      headPosterior: 0,
      torsoAnterior: 0,
      torsoPosterior: 0,
      abdomenAnterior: 0,
      abdomenPosterior: 0,
      rightArmAnterior: 0,
      leftArmAnterior: 0,
      rightArmPosterior: 0,
      leftArmPosterior: 0,
      rightLegAnterior: 0,
      leftLegAnterior: 0,
      rightLegPosterior: 0,
      leftLegPosterior: 0,
      genitalAnterior: 0,
      genitalPosterior: 0,
    };
    updateData({ bodyAreas: empty, estimatedBSA: 0 });
  };

  const handleDirectInput = (areaKey: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const maxValue = isAdult
      ? adultAreaDefinitions[areaKey as keyof typeof adultAreaDefinitions]?.maxValue || 10
      : childAreaDefinitions[areaKey as keyof typeof childAreaDefinitions]?.maxValue || 10;
    
    const clampedValue = Math.min(Math.max(numValue, 0), maxValue);
    updateBodyArea(areaKey as keyof typeof areas, clampedValue);
  };

  const getAreaDefinitions = () => isAdult ? adultAreaDefinitions : childAreaDefinitions;
  const areaDefs = getAreaDefinitions();

  // Render diagram with front and back views
  const renderBodyDiagram = () => (
    <div className="space-y-6">
      {/* View selector */}
      <div className="flex gap-2 justify-center mb-4">
        <button
          onClick={() => setViewMode('front')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            viewMode === 'front'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Vista Frontal
        </button>
        <button
          onClick={() => setViewMode('back')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            viewMode === 'back'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Vista Posterior
        </button>
      </div>

      {/* Front view */}
      {viewMode === 'front' && (
        <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
          <h3 className="text-center text-lg font-bold text-gray-700 mb-4">Vista Frontal</h3>
          <svg
            ref={svgRef}
            viewBox="0 0 400 700"
            className="w-full max-w-sm mx-auto"
          >
            {/* Head Anterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'headAnterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('headAnterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <circle
                cx="200"
                cy="60"
                r="35"
                fill={hoveredArea === 'headAnterior' ? '#fca5a5' : '#fecaca'}
                stroke={areas.headAnterior > 0 ? '#dc2626' : '#999'}
                strokeWidth="2"
              />
              <text x="200" y="65" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">
                {hoveredArea === 'headAnterior' ? hoveredValue.toFixed(1) : areas.headAnterior > 0 ? areas.headAnterior.toFixed(1) : '?'}%
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
                y="110"
                width="100"
                height="80"
                fill={hoveredArea === 'torsoAnterior' ? '#fbbf24' : '#fcd34d'}
                stroke={areas.torsoAnterior > 0 ? '#d97706' : '#999'}
                strokeWidth="2"
              />
              <text x="200" y="158" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#000">
                {hoveredArea === 'torsoAnterior' ? hoveredValue.toFixed(1) : areas.torsoAnterior > 0 ? areas.torsoAnterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Abdomen Anterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'abdomenAnterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('abdomenAnterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="150"
                y="200"
                width="100"
                height="75"
                fill={hoveredArea === 'abdomenAnterior' ? '#fbbf24' : '#fcd34d'}
                stroke={areas.abdomenAnterior > 0 ? '#d97706' : '#999'}
                strokeWidth="2"
              />
              <text x="200" y="242" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#000">
                {hoveredArea === 'abdomenAnterior' ? hoveredValue.toFixed(1) : areas.abdomenAnterior > 0 ? areas.abdomenAnterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Right Arm Anterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'rightArmAnterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('rightArmAnterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="70"
                y="130"
                width="50"
                height="140"
                fill={hoveredArea === 'rightArmAnterior' ? '#60a5fa' : '#93c5fd'}
                stroke={areas.rightArmAnterior > 0 ? '#0284c7' : '#999'}
                strokeWidth="2"
              />
              <text x="95" y="205" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#000">
                {hoveredArea === 'rightArmAnterior' ? hoveredValue.toFixed(1) : areas.rightArmAnterior > 0 ? areas.rightArmAnterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Left Arm Anterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'leftArmAnterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('leftArmAnterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="280"
                y="130"
                width="50"
                height="140"
                fill={hoveredArea === 'leftArmAnterior' ? '#60a5fa' : '#93c5fd'}
                stroke={areas.leftArmAnterior > 0 ? '#0284c7' : '#999'}
                strokeWidth="2"
              />
              <text x="305" y="205" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#000">
                {hoveredArea === 'leftArmAnterior' ? hoveredValue.toFixed(1) : areas.leftArmAnterior > 0 ? areas.leftArmAnterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Right Leg Anterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'rightLegAnterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('rightLegAnterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="150"
                y="290"
                width="40"
                height="150"
                fill={hoveredArea === 'rightLegAnterior' ? '#34d399' : '#86efac'}
                stroke={areas.rightLegAnterior > 0 ? '#059669' : '#999'}
                strokeWidth="2"
              />
              <text x="170" y="370" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#000">
                {hoveredArea === 'rightLegAnterior' ? hoveredValue.toFixed(1) : areas.rightLegAnterior > 0 ? areas.rightLegAnterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Left Leg Anterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'leftLegAnterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('leftLegAnterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="210"
                y="290"
                width="40"
                height="150"
                fill={hoveredArea === 'leftLegAnterior' ? '#34d399' : '#86efac'}
                stroke={areas.leftLegAnterior > 0 ? '#059669' : '#999'}
                strokeWidth="2"
              />
              <text x="230" y="370" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#000">
                {hoveredArea === 'leftLegAnterior' ? hoveredValue.toFixed(1) : areas.leftLegAnterior > 0 ? areas.leftLegAnterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Genitals Anterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'genitalAnterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('genitalAnterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="180"
                y="280"
                width="40"
                height="12"
                fill={hoveredArea === 'genitalAnterior' ? '#c084fc' : '#e9d5ff'}
                stroke={areas.genitalAnterior > 0 ? '#a855f7' : '#999'}
                strokeWidth="1"
              />
              <text x="200" y="289" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#000">
                {hoveredArea === 'genitalAnterior' ? hoveredValue.toFixed(1) : areas.genitalAnterior > 0 ? areas.genitalAnterior.toFixed(1) : '?'}%
              </text>
            </g>
          </svg>
        </div>
      )}

      {/* Back view */}
      {viewMode === 'back' && (
        <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
          <h3 className="text-center text-lg font-bold text-gray-700 mb-4">Vista Posterior</h3>
          <svg
            ref={svgRef}
            viewBox="0 0 400 700"
            className="w-full max-w-sm mx-auto"
          >
            {/* Head Posterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'headPosterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('headPosterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <circle
                cx="200"
                cy="60"
                r="35"
                fill={hoveredArea === 'headPosterior' ? '#fca5a5' : '#fecaca'}
                stroke={areas.headPosterior > 0 ? '#dc2626' : '#999'}
                strokeWidth="2"
              />
              <text x="200" y="65" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">
                {hoveredArea === 'headPosterior' ? hoveredValue.toFixed(1) : areas.headPosterior > 0 ? areas.headPosterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Torso Posterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'torsoPosterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('torsoPosterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="150"
                y="110"
                width="100"
                height="80"
                fill={hoveredArea === 'torsoPosterior' ? '#f97316' : '#fed7aa'}
                stroke={areas.torsoPosterior > 0 ? '#c2410c' : '#999'}
                strokeWidth="2"
              />
              <text x="200" y="158" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#000">
                {hoveredArea === 'torsoPosterior' ? hoveredValue.toFixed(1) : areas.torsoPosterior > 0 ? areas.torsoPosterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Abdomen Posterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'abdomenPosterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('abdomenPosterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="150"
                y="200"
                width="100"
                height="75"
                fill={hoveredArea === 'abdomenPosterior' ? '#f97316' : '#fed7aa'}
                stroke={areas.abdomenPosterior > 0 ? '#c2410c' : '#999'}
                strokeWidth="2"
              />
              <text x="200" y="242" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#000">
                {hoveredArea === 'abdomenPosterior' ? hoveredValue.toFixed(1) : areas.abdomenPosterior > 0 ? areas.abdomenPosterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Right Arm Posterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'rightArmPosterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('rightArmPosterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="70"
                y="130"
                width="50"
                height="140"
                fill={hoveredArea === 'rightArmPosterior' ? '#60a5fa' : '#93c5fd'}
                stroke={areas.rightArmPosterior > 0 ? '#0284c7' : '#999'}
                strokeWidth="2"
              />
              <text x="95" y="205" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#000">
                {hoveredArea === 'rightArmPosterior' ? hoveredValue.toFixed(1) : areas.rightArmPosterior > 0 ? areas.rightArmPosterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Left Arm Posterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'leftArmPosterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('leftArmPosterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="280"
                y="130"
                width="50"
                height="140"
                fill={hoveredArea === 'leftArmPosterior' ? '#60a5fa' : '#93c5fd'}
                stroke={areas.leftArmPosterior > 0 ? '#0284c7' : '#999'}
                strokeWidth="2"
              />
              <text x="305" y="205" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#000">
                {hoveredArea === 'leftArmPosterior' ? hoveredValue.toFixed(1) : areas.leftArmPosterior > 0 ? areas.leftArmPosterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Right Leg Posterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'rightLegPosterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('rightLegPosterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="150"
                y="290"
                width="40"
                height="150"
                fill={hoveredArea === 'rightLegPosterior' ? '#34d399' : '#86efac'}
                stroke={areas.rightLegPosterior > 0 ? '#059669' : '#999'}
                strokeWidth="2"
              />
              <text x="170" y="370" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#000">
                {hoveredArea === 'rightLegPosterior' ? hoveredValue.toFixed(1) : areas.rightLegPosterior > 0 ? areas.rightLegPosterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Left Leg Posterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'leftLegPosterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('leftLegPosterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="210"
                y="290"
                width="40"
                height="150"
                fill={hoveredArea === 'leftLegPosterior' ? '#34d399' : '#86efac'}
                stroke={areas.leftLegPosterior > 0 ? '#059669' : '#999'}
                strokeWidth="2"
              />
              <text x="230" y="370" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#000">
                {hoveredArea === 'leftLegPosterior' ? hoveredValue.toFixed(1) : areas.leftLegPosterior > 0 ? areas.leftLegPosterior.toFixed(1) : '?'}%
              </text>
            </g>

            {/* Genitals Posterior */}
            <g
              onMouseMove={(e) => handleSvgMouseMove(e, 'genitalPosterior')}
              onMouseLeave={handleSvgMouseLeave}
              onClick={() => handleAreaClick('genitalPosterior', hoveredValue)}
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <rect
                x="180"
                y="280"
                width="40"
                height="12"
                fill={hoveredArea === 'genitalPosterior' ? '#c084fc' : '#e9d5ff'}
                stroke={areas.genitalPosterior > 0 ? '#a855f7' : '#999'}
                strokeWidth="1"
              />
              <text x="200" y="289" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#000">
                {hoveredArea === 'genitalPosterior' ? hoveredValue.toFixed(1) : areas.genitalPosterior > 0 ? areas.genitalPosterior.toFixed(1) : '?'}%
              </text>
            </g>
          </svg>
        </div>
      )}
    </div>
  );

  // Render simple child diagram (< 10 years)
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
          {isAdult && 'Para mayores de 10 años: selecciona vista frontal o posterior para marcar ambas caras del cuerpo.'}
        </p>
      </div>

      {/* Direct Input Fields - Organized by Front/Back */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-300">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Especificar Porcentajes Directamente</h3>
        
        {/* Front/Anterior Section */}
        <div className="mb-6">
          <h4 className="text-base font-bold text-blue-700 mb-3 pb-2 border-b-2 border-blue-300">
            Vista Frontal (Anterior)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(areaDefs)
              .filter(([, def]) => def.side === 'front' || def.side === 'both')
              .map(([key, def]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    {def.label.replace(' Anterior', '').replace(' Posterior', '')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={def.maxValue}
                      step="0.1"
                      value={areas[key as keyof typeof areas] || ''}
                      onChange={(e) => handleDirectInput(key, e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                    <span className="text-xs text-gray-600 w-8">
                      /{def.maxValue.toFixed(1)}
                    </span>
                  </div>
                  {areas[key as keyof typeof areas] > def.maxValue && (
                    <p className="text-xs text-red-600 mt-1">Excede máximo</p>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Back/Posterior Section */}
        <div>
          <h4 className="text-base font-bold text-orange-700 mb-3 pb-2 border-b-2 border-orange-300">
            Vista Posterior (Dorsal)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(areaDefs)
              .filter(([, def]) => def.side === 'back' || def.side === 'both')
              .map(([key, def]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    {def.label.replace(' Anterior', '').replace(' Posterior', '')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={def.maxValue}
                      step="0.1"
                      value={areas[key as keyof typeof areas] || ''}
                      onChange={(e) => handleDirectInput(key, e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0"
                    />
                    <span className="text-xs text-gray-600 w-8">
                      /{def.maxValue.toFixed(1)}
                    </span>
                  </div>
                  {areas[key as keyof typeof areas] > def.maxValue && (
                    <p className="text-xs text-red-600 mt-1">Excede máximo</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Diagram section - Front/Back view for all ages */}
      {renderBodyDiagram()}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6 border-2 border-blue-200 mt-6">
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
