import React, { useState, useRef } from 'react';
import { useBurnStore } from '../store/burnStore';
import { getDefaultBodyAreas } from '../utils/calculations';
import { adultAreaDefinitions, childAreaDefinitions } from '../utils/bodyAreaDefinitions';

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
  const isChild = data.age < 10;


  const handleAreaClick = (areaKey: string, percentageAtPoint: number) => {
    const currentValue = areas[areaKey as keyof typeof areas];
    const areaDefs = isAdult ? adultAreaDefinitions : childAreaDefinitions;
    const maxValue = areaDefs[areaKey as keyof typeof areaDefs]?.maxValue || 10;
    
    const newValue = Math.abs(currentValue - percentageAtPoint) < 0.1 ? 0 : percentageAtPoint;
    updateBodyArea(areaKey as keyof typeof areas, Math.min(newValue, maxValue));
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGElement>, areaKey: string) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const areaDefs = isAdult ? adultAreaDefinitions : childAreaDefinitions;
    const maxValue = areaDefs[areaKey as keyof typeof areaDefs]?.maxValue || 10;
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
    const empty = getDefaultBodyAreas(data.age);
    // Set all values to 0
    Object.keys(empty).forEach(key => {
      (empty as any)[key] = 0;
    });
    updateData({ bodyAreas: empty, estimatedBSA: 0 });
  };

  const handleDirectInput = (areaKey: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const areaDefs = isAdult ? adultAreaDefinitions : childAreaDefinitions;
    const maxValue = areaDefs[areaKey as keyof typeof areaDefs]?.maxValue || 10;
    
    const clampedValue = Math.min(Math.max(numValue, 0), maxValue);
    updateBodyArea(areaKey as keyof typeof areas, clampedValue);
  };

  const getAreaDefinitions = () => isAdult ? adultAreaDefinitions : childAreaDefinitions;
  const areaDefs = getAreaDefinitions();

  // Helper to render SVG area
  const renderSVGArea = (
    areaKey: string,
    shape: 'rect' | 'circle',
    shapeProps: any,
    fontSize: number = 12
  ) => {
    const def = areaDefs[areaKey as keyof typeof areaDefs];
    if (!def) return null;

    const currentValue = areas[areaKey as keyof typeof areas];
    const displayValue = hoveredArea === areaKey ? hoveredValue : currentValue;

    return (
      <g
        onMouseMove={(e) => handleSvgMouseMove(e, areaKey)}
        onMouseLeave={handleSvgMouseLeave}
        onClick={() => handleAreaClick(areaKey, hoveredValue)}
        className="cursor-pointer hover:opacity-75 transition-opacity"
      >
        {shape === 'circle' ? (
          <circle
            {...shapeProps}
            fill={hoveredArea === areaKey ? def.color : def.color + 'CC'}
            stroke={currentValue > 0 ? '#991b1b' : '#999'}
            strokeWidth="2"
          />
        ) : (
          <rect
            {...shapeProps}
            fill={hoveredArea === areaKey ? def.color : def.color + 'CC'}
            stroke={currentValue > 0 ? '#991b1b' : '#999'}
            strokeWidth="2"
          />
        )}
        <text
          x={shape === 'circle' ? shapeProps.cx : shapeProps.x + shapeProps.width / 2}
          y={shape === 'circle' ? shapeProps.cy + 5 : shapeProps.y + shapeProps.height / 2 + 5}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="bold"
          fill="#000"
        >
          {displayValue > 0 ? displayValue.toFixed(1) : '?'}%
        </text>
      </g>
    );
  };

  const renderChildFrontView = () => (
    <svg ref={svgRef} viewBox="0 0 400 700" className="w-full max-w-lg mx-auto">
      {/* Head - split left/right */}
      {renderSVGArea('headLeftAnterior', 'circle', { cx: 180, cy: 60, r: 25 }, 11)}
      {renderSVGArea('headRightAnterior', 'circle', { cx: 220, cy: 60, r: 25 }, 11)}
      
      {/* Torso - split left/right */}
      {renderSVGArea('torsoLeftAnterior', 'rect', { x: 155, y: 100, width: 45, height: 70 }, 10)}
      {renderSVGArea('torsoRightAnterior', 'rect', { x: 200, y: 100, width: 45, height: 70 }, 10)}
      
      {/* Abdomen - split left/right */}
      {renderSVGArea('abdomenLeftAnterior', 'rect', { x: 155, y: 175, width: 45, height: 65 }, 10)}
      {renderSVGArea('abdomenRightAnterior', 'rect', { x: 200, y: 175, width: 45, height: 65 }, 10)}

      {renderSVGArea('genitalAnterior', 'rect', { x: 187, y: 240, width: 26, height: 12 }, 9)}
      
      {/* Right arm - hand, forearm, upper arm */}
      {renderSVGArea('rightHandAnterior', 'rect', { x: 75, y: 235, width: 35, height: 30 }, 9)}
      {renderSVGArea('rightForearmAnterior', 'rect', { x: 80, y: 180, width: 40, height: 55 }, 9)}
      {renderSVGArea('rightUpperArmAnterior', 'rect', { x: 95, y: 110, width: 50, height: 70 }, 10)}
      
      {/* Left arm - hand, forearm, upper arm */}
      {renderSVGArea('leftHandAnterior', 'rect', { x: 290, y: 235, width: 35, height: 30 }, 9)}
      {renderSVGArea('leftForearmAnterior', 'rect', { x: 280, y: 180, width: 40, height: 55 }, 9)}
      {renderSVGArea('leftUpperArmAnterior', 'rect', { x: 255, y: 110, width: 50, height: 70 }, 10)}
      
      {/* Right leg - thigh, lower leg, foot */}
      {renderSVGArea('rightThighAnterior', 'rect', { x: 150, y: 245, width: 40, height: 80 }, 10)}
      {renderSVGArea('rightLowerLegAnterior', 'rect', { x: 150, y: 325, width: 38, height: 80 }, 9)}
      {renderSVGArea('rightFootAnterior', 'rect', { x: 148, y: 405, width: 40, height: 25 }, 9)}
      
      {/* Left leg - thigh, lower leg, foot */}
      {renderSVGArea('leftThighAnterior', 'rect', { x: 210, y: 245, width: 40, height: 80 }, 10)}
      {renderSVGArea('leftLowerLegAnterior', 'rect', { x: 212, y: 325, width: 38, height: 80 }, 9)}
      {renderSVGArea('leftFootAnterior', 'rect', { x: 212, y: 405, width: 40, height: 25 }, 9)}
    </svg>
  );

  const renderChildBackView = () => (
    <svg ref={svgRef} viewBox="0 0 400 700" className="w-full max-w-lg mx-auto">
      {/* Head - split left/right */}
      {renderSVGArea('headLeftPosterior', 'circle', { cx: 180, cy: 60, r: 25 }, 11)}
      {renderSVGArea('headRightPosterior', 'circle', { cx: 220, cy: 60, r: 25 }, 11)}
      
      {/* Torso - split left/right */}
      {renderSVGArea('torsoLeftPosterior', 'rect', { x: 155, y: 100, width: 45, height: 70 }, 10)}
      {renderSVGArea('torsoRightPosterior', 'rect', { x: 200, y: 100, width: 45, height: 70 }, 10)}
      
      {/* Abdomen/buttocks - split left/right */}
      {renderSVGArea('abdomenLeftPosterior', 'rect', { x: 155, y: 175, width: 45, height: 65 }, 10)}
      {renderSVGArea('abdomenRightPosterior', 'rect', { x: 200, y: 175, width: 45, height: 65 }, 10)}

      {renderSVGArea('genitalPosterior', 'rect', { x: 187, y: 240, width: 26, height: 12 }, 9)}
      
      {/* Right arm - hand, forearm, upper arm */}
      {renderSVGArea('rightHandPosterior', 'rect', { x: 75, y: 235, width: 35, height: 30 }, 9)}
      {renderSVGArea('rightForearmPosterior', 'rect', { x: 80, y: 180, width: 40, height: 55 }, 9)}
      {renderSVGArea('rightUpperArmPosterior', 'rect', { x: 95, y: 110, width: 50, height: 70 }, 10)}
      
      {/* Left arm - hand, forearm, upper arm */}
      {renderSVGArea('leftHandPosterior', 'rect', { x: 290, y: 235, width: 35, height: 30 }, 9)}
      {renderSVGArea('leftForearmPosterior', 'rect', { x: 280, y: 180, width: 40, height: 55 }, 9)}
      {renderSVGArea('leftUpperArmPosterior', 'rect', { x: 255, y: 110, width: 50, height: 70 }, 10)}
      
      {/* Right leg - thigh, lower leg, foot */}
      {renderSVGArea('rightThighPosterior', 'rect', { x: 150, y: 245, width: 40, height: 80 }, 10)}
      {renderSVGArea('rightLowerLegPosterior', 'rect', { x: 150, y: 325, width: 38, height: 80 }, 9)}
      {renderSVGArea('rightFootPosterior', 'rect', { x: 148, y: 405, width: 40, height: 25 }, 9)}
      
      {/* Left leg - thigh, lower leg, foot */}
      {renderSVGArea('leftThighPosterior', 'rect', { x: 210, y: 245, width: 40, height: 80 }, 10)}
      {renderSVGArea('leftLowerLegPosterior', 'rect', { x: 212, y: 325, width: 38, height: 80 }, 9)}
      {renderSVGArea('leftFootPosterior', 'rect', { x: 212, y: 405, width: 40, height: 25 }, 9)}
    </svg>
  );

  const renderAdultFrontView = () => (
    <svg ref={svgRef} viewBox="0 0 400 700" className="w-full max-w-lg mx-auto">
      {/* Head */}
      {renderSVGArea('headAnterior', 'circle', { cx: 200, cy: 60, r: 35 }, 14)}
      
      {/* Torso - split left/right */}
      {renderSVGArea('torsoLeftAnterior', 'rect', { x: 150, y: 110, width: 50, height: 80 }, 11)}
      {renderSVGArea('torsoRightAnterior', 'rect', { x: 200, y: 110, width: 50, height: 80 }, 11)}
      
      {/* Abdomen - split left/right */}
      {renderSVGArea('abdomenLeftAnterior', 'rect', { x: 150, y: 200, width: 50, height: 75 }, 11)}
      {renderSVGArea('abdomenRightAnterior', 'rect', { x: 200, y: 200, width: 50, height: 75 }, 11)}

      {renderSVGArea('genitalAnterior', 'rect', { x: 187, y: 275, width: 26, height: 12 }, 9)}
      
      {/* Right arm - hand, forearm, upper arm */}
      {renderSVGArea('rightHandAnterior', 'rect', { x: 70, y: 235, width: 35, height: 30 }, 10)}
      {renderSVGArea('rightForearmAnterior', 'rect', { x: 75, y: 180, width: 40, height: 55 }, 10)}
      {renderSVGArea('rightUpperArmAnterior', 'rect', { x: 90, y: 115, width: 50, height: 65 }, 10)}
      
      {/* Left arm - hand, forearm, upper arm */}
      {renderSVGArea('leftHandAnterior', 'rect', { x: 295, y: 235, width: 35, height: 30 }, 10)}
      {renderSVGArea('leftForearmAnterior', 'rect', { x: 285, y: 180, width: 40, height: 55 }, 10)}
      {renderSVGArea('leftUpperArmAnterior', 'rect', { x: 260, y: 115, width: 50, height: 65 }, 10)}
      
      {/* Right leg - thigh, lower leg, foot */}
      {renderSVGArea('rightThighAnterior', 'rect', { x: 150, y: 280, width: 40, height: 85 }, 11)}
      {renderSVGArea('rightLowerLegAnterior', 'rect', { x: 150, y: 365, width: 38, height: 70 }, 10)}
      {renderSVGArea('rightFootAnterior', 'rect', { x: 148, y: 435, width: 40, height: 25 }, 10)}
      
      {/* Left leg - thigh, lower leg, foot */}
      {renderSVGArea('leftThighAnterior', 'rect', { x: 210, y: 280, width: 40, height: 85 }, 11)}
      {renderSVGArea('leftLowerLegAnterior', 'rect', { x: 212, y: 365, width: 38, height: 70 }, 10)}
      {renderSVGArea('leftFootAnterior', 'rect', { x: 212, y: 435, width: 40, height: 25 }, 10)}
    </svg>
  );

  const renderAdultBackView = () => (
    <svg ref={svgRef} viewBox="0 0 400 700" className="w-full max-w-lg mx-auto">
      {/* Head */}
      {renderSVGArea('headPosterior', 'circle', { cx: 200, cy: 60, r: 35 }, 14)}
      
      {/* Torso - split left/right */}
      {renderSVGArea('torsoLeftPosterior', 'rect', { x: 150, y: 110, width: 50, height: 80 }, 11)}
      {renderSVGArea('torsoRightPosterior', 'rect', { x: 200, y: 110, width: 50, height: 80 }, 11)}
      
      {/* Abdomen/buttocks - split left/right */}
      {renderSVGArea('abdomenLeftPosterior', 'rect', { x: 150, y: 200, width: 50, height: 75 }, 11)}
      {renderSVGArea('abdomenRightPosterior', 'rect', { x: 200, y: 200, width: 50, height: 75 }, 11)}

      {renderSVGArea('genitalPosterior', 'rect', { x: 187, y: 275, width: 26, height: 12 }, 9)}
      
      {/* Right arm - hand, forearm, upper arm */}
      {renderSVGArea('rightHandPosterior', 'rect', { x: 70, y: 235, width: 35, height: 30 }, 10)}
      {renderSVGArea('rightForearmPosterior', 'rect', { x: 75, y: 180, width: 40, height: 55 }, 10)}
      {renderSVGArea('rightUpperArmPosterior', 'rect', { x: 90, y: 115, width: 50, height: 65 }, 10)}
      
      {/* Left arm - hand, forearm, upper arm */}
      {renderSVGArea('leftHandPosterior', 'rect', { x: 295, y: 235, width: 35, height: 30 }, 10)}
      {renderSVGArea('leftForearmPosterior', 'rect', { x: 285, y: 180, width: 40, height: 55 }, 10)}
      {renderSVGArea('leftUpperArmPosterior', 'rect', { x: 260, y: 115, width: 50, height: 65 }, 10)}
      
      {/* Right leg - thigh, lower leg, foot */}
      {renderSVGArea('rightThighPosterior', 'rect', { x: 150, y: 280, width: 40, height: 85 }, 11)}
      {renderSVGArea('rightLowerLegPosterior', 'rect', { x: 150, y: 365, width: 38, height: 70 }, 10)}
      {renderSVGArea('rightFootPosterior', 'rect', { x: 148, y: 435, width: 40, height: 25 }, 10)}
      
      {/* Left leg - thigh, lower leg, foot */}
      {renderSVGArea('leftThighPosterior', 'rect', { x: 210, y: 280, width: 40, height: 85 }, 11)}
      {renderSVGArea('leftLowerLegPosterior', 'rect', { x: 212, y: 365, width: 38, height: 70 }, 10)}
      {renderSVGArea('leftFootPosterior', 'rect', { x: 212, y: 435, width: 40, height: 25 }, 10)}
    </svg>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Mapa Interactivo de Área Quemada
        <span className="text-sm text-blue-600 ml-2">(Subdivisiones detalladas)</span>
      </h2>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Instrucciones:</strong> Haz clic sobre el diagrama del cuerpo para marcar las áreas quemadas.
          Los valores se calcularán automáticamente según donde hagas clic.
        </p>
        <p className="text-xs text-blue-700 font-semibold">
          {isChild 
            ? 'Para niños menores de 10 años: cabeza dividida en 4 cuadrantes, brazos y piernas en 3 secciones cada uno.'
            : 'Para personas de 10 años o más: brazos y piernas divididos en 3 secciones cada uno (mano, antebrazo/pierna inferior, brazo/muslo).'}
        </p>
      </div>

      {/* Direct Input Fields */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-300">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Especificar Porcentajes Directamente</h3>
        
        {/* Front/Anterior Section */}
        <div className="mb-6">
          <h4 className="text-base font-bold text-blue-700 mb-3 pb-2 border-b-2 border-blue-300">
            Vista Frontal (Anterior)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(areaDefs)
              .filter(([_key, def]) => def.side === 'front' && def.includeInUI !== false)
              .sort((a, b) => a[1].label.localeCompare(b[1].label))
              .map(([key, def]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
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
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                    <span className="text-xs text-gray-600 w-12">
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
              .filter(([_key, def]) => def.side === 'back' && def.includeInUI !== false)
              .sort((a, b) => a[1].label.localeCompare(b[1].label))
              .map(([key, def]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
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
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0"
                    />
                    <span className="text-xs text-gray-600 w-12">
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

      {/* Diagram section */}
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
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300 flex flex-col items-center">
            <h3 className="text-center text-lg font-bold text-gray-700 mb-4">Vista Frontal</h3>
            {isChild ? renderChildFrontView() : renderAdultFrontView()}
          </div>
        )}

        {/* Back view */}
        {viewMode === 'back' && (
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300 flex flex-col items-center">
            <h3 className="text-center text-lg font-bold text-gray-700 mb-4">Vista Posterior</h3>
            {isChild ? renderChildBackView() : renderAdultBackView()}
          </div>
        )}
      </div>

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
            <span className="text-orange-600">⚠ Menos de 100% ({(100 - totalBSA).toFixed(1)}% restante)</span>
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
