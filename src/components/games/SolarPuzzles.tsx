import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Zap, Cloud, Award, RotateCcw, CheckCircle, Move } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';
interface SolarPuzzlesProps {
  onBack: () => void;
  userName?: string;
  onPointsUpdated: () => Promise<void>;
  addPointsForUser: (points: number) => Promise<void>;
  onComplete?: (score: number) => void;
}
interface Panel {
  id: string;
  x: number;
  y: number;
  angle: number;
  shaded: boolean;
  efficiency: number;
}
const SolarPuzzles = ({ onBack,userName,onPointsUpdated,addPointsForUser,onComplete }: SolarPuzzlesProps) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(1);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [panels, setPanels] = useState<Panel[]>([]);
  const [sunAngle, setSunAngle] = useState(45);
  const [weatherCondition, setWeatherCondition] = useState<'sunny' | 'cloudy' | 'rainy'>('sunny');
  const [totalEfficiency, setTotalEfficiency] = useState(0);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [pointsUpdated, setPointsUpdated] = useState(false);
  const weatherEffects = {
    sunny: { multiplier: 1, icon: '☀️', color: 'text-yellow-500' },
    cloudy: { multiplier: 0.6, icon: '☁️', color: 'text-gray-500' },
    rainy: { multiplier: 0.3, icon: '🌧️', color: 'text-blue-500' }
  };
  useEffect(() => {
  if (gameComplete && !pointsUpdated) {
    const ecoPoints = Math.floor(score / 8); 
    (async () => {
      try {
        await addPointsForUser(ecoPoints);
        await onPointsUpdated();
        setPointsUpdated(true);
      } catch (err) {
        console.error('EcoPoints update failed:', err);
      }
    })();
  }
}, [gameComplete, score, addPointsForUser, onPointsUpdated, pointsUpdated]);
  useEffect(() => {
    initializePuzzle();
  }, [currentPuzzle]);
  const calculateEfficiency = (panel: Panel) => {
    const weather = weatherEffects[weatherCondition];
    const angleDiff = Math.abs(panel.angle - sunAngle);
    const angleEfficiency = Math.max(0, 100 - (angleDiff * 2));
    const shadingPenalty = panel.shaded ? 0.2 : 1;
    return angleEfficiency * shadingPenalty * weather.multiplier;
  };
  useEffect(() => {
    if (panels.length > 0) {
      let total = 0;
      const weather = weatherEffects[weatherCondition];
      
      panels.forEach(panel => {
        total += calculateEfficiency(panel);
      });      
      setTotalEfficiency(total);
      const maxPossible = panels.length * 100 * weather.multiplier;
      const efficiencyPercentage = (total / maxPossible) * 100;     
      if (efficiencyPercentage > 80 && !puzzleComplete) {
        setPuzzleComplete(true);
        const puzzleScore = Math.round(efficiencyPercentage) * (currentPuzzle + 1);
        setScore(prev => prev + puzzleScore);
      }
    }
  }, [panels, sunAngle, weatherCondition, puzzleComplete]);
  const initializePuzzle = () => {
    const newPanels: Panel[] = [];
    const puzzleConfigs = {
      1: { count: 4, obstacles: 1 }, // Basic placement
      2: { count: 6, obstacles: 2 }, // With shading
      3: { count: 8, obstacles: 3 }  // Complex optimization
    };
    const config = puzzleConfigs[currentPuzzle as keyof typeof puzzleConfigs];   
    for (let i = 0; i < config.count; i++) {
      newPanels.push({
        id: `panel-${i}`,
        x: 20 + (i % 4) * 20,
        y: 20 + Math.floor(i / 4) * 30,
        angle: 0,
        shaded: i < config.obstacles, // First few panels start shaded
        efficiency: 0
      });
    }    
    setPanels(newPanels);
    setPuzzleComplete(false);
  };
  const updatePanelAngle = (panelId: string, newAngle: number) => {
    setPanels(prev => prev.map(panel => 
      panel.id === panelId ? { ...panel, angle: newAngle } : panel
    ));
  };
  const togglePanelShading = (panelId: string) => {
    setPanels(prev => prev.map(panel => 
      panel.id === panelId ? { ...panel, shaded: !panel.shaded } : panel
    ));
  };
  const nextPuzzle = () => {
    if (currentPuzzle < 3) {
      setCurrentPuzzle(prev => prev + 1);
    } else {
      setGameComplete(true);
      setTimeout(() => onComplete?.(score), 2000);
    }
  };
  const resetGame = () => {
    setCurrentPuzzle(1);
    setScore(0);
    setGameComplete(false);
    setSunAngle(45);
    setWeatherCondition('sunny');
    setPointsUpdated(false);
    initializePuzzle();
  };
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency > 80) return 'text-green-600';
    if (efficiency > 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-5xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sun size={24} />
                Power Puzzles: Solar Edition
              </CardTitle>
              <p className="text-yellow-100 mt-1">Optimize solar panel placement - Puzzle {currentPuzzle}/3</p>
            </div>
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {!gameComplete ? (
              <motion.div
                key="puzzle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Control Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-yellow-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sun className="text-yellow-600" size={20} />
                        <span className="font-medium">Sun Position</span>
                      </div>
                      <Slider
                        value={[sunAngle]}
                        onValueChange={([value]) => setSunAngle(value)}
                        max={90}
                        min={0}
                        step={5}
                        className="mb-2"
                      />
                      <div className="text-sm text-gray-600 text-center">{sunAngle}°</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Cloud className="text-blue-600" size={20} />
                        <span className="font-medium">Weather</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {Object.entries(weatherEffects).map(([condition, { icon, color }]) => (
                          <Button
                            key={condition}
                            variant={weatherCondition === condition ? "default" : "outline"}
                            onClick={() => setWeatherCondition(condition as any)}
                            className="p-2 text-xs"
                          >
                            <span className="text-base">{icon}</span>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`${puzzleComplete ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <CardContent className="p-4 text-center">
                      <Zap className={`mx-auto mb-2 ${puzzleComplete ? 'text-green-600' : 'text-gray-600'}`} size={20} />
                      <div className={`text-2xl ${getEfficiencyColor(totalEfficiency / panels.length)}`}>
                        {Math.round(totalEfficiency / Math.max(panels.length, 1))}%
                      </div>
                      <div className="text-sm text-gray-600">Avg Efficiency</div>
                    </CardContent>
                  </Card>
                </div>
                {/* Solar Farm Display */}
                <Card className="bg-gradient-to-b from-sky-100 to-green-100">
                  <CardContent className="p-4">
                    <div className="relative w-full h-80 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #90EE90 100%)' }}>
                      {/* Sun */}
                      <motion.div
                        className="absolute text-yellow-400"
                        style={{ 
                          left: `${20 + (sunAngle / 90) * 60}%`,
                          top: `${10 + (90 - sunAngle) / 90 * 30}%`
                        }}
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        <Sun size={32} />
                      </motion.div>
                      {/* Weather overlay */}
                      {weatherCondition !== 'sunny' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-4xl opacity-60">
                            {weatherCondition === 'cloudy' ? '☁️☁️☁️' : '🌧️💧💧'}
                          </div>
                        </div>
                      )}
                      {/* Solar Panels */}
                      {panels.map((panel) => (
                        <div
                          key={panel.id}
                          className="absolute group"
                          style={{
                            left: `${panel.x}%`,
                            top: `${panel.y}%`,
                            transform: `translate(-50%, -50%) rotate(${panel.angle}deg)`
                          }}
                        >
                          <motion.div
                            className={`w-12 h-8 rounded cursor-pointer transition-all ${
                              panel.shaded 
                                ? 'bg-gray-600 border-2 border-gray-700'
                                : `bg-blue-600 border-2 border-blue-700`
                            }`}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => togglePanelShading(panel.id)}
                          />                          
                          {/* Efficiency indicator */}
                          <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold ${
                            getEfficiencyColor(calculateEfficiency(panel))
                          }`}>
                            {Math.round(calculateEfficiency(panel))}%
                          </div>                         
                          {/* Angle controls */}
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white rounded px-2 py-1 shadow-lg">
                              <input
                                type="range"
                                min="0"
                                max="90"
                                value={panel.angle}
                                onChange={(e) => updatePanelAngle(panel.id, parseInt(e.target.value))}
                                className="w-16 h-2"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-600 space-y-2">
                      <div>💡 <strong>Tips:</strong></div>
                      <div>• Click panels to remove/add shading (buildings, trees)</div>
                      <div>• Hover over panels to adjust their angle</div>
                      <div>• Match panel angles close to sun position for max efficiency</div>
                      <div>• Current weather: <span className={weatherEffects[weatherCondition].color}>{weatherEffects[weatherCondition].icon} {weatherCondition}</span> (×{weatherEffects[weatherCondition].multiplier})</div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Goal: Achieve 80%+ average efficiency to complete puzzle
                  </div>                  
                  {puzzleComplete && (
                    <Button 
                      onClick={nextPuzzle}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      {currentPuzzle < 3 ? 'Next Puzzle' : 'Complete Game'}
                      <Zap size={16} className="ml-2" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="space-y-4">
                  <CheckCircle className="text-green-600 mx-auto" size={64} />
                  <h2 className="text-2xl font-bold text-gray-800">Solar Engineer Complete!</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <Card className="bg-yellow-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-yellow-600">{score}</div>
                        <div className="text-sm text-yellow-600">Total Score</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-green-600">3/3</div>
                        <div className="text-sm text-green-600">Puzzles Solved</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">☀️ Solar Energy Facts:</h4>
                    <ul className="text-sm text-orange-700 text-left space-y-1">
                      <li>• Solar panels work best when facing the sun directly</li>
                      <li>• Even 10% shading can reduce panel efficiency by 50%</li>
                      <li>• Optimal tilt angle equals your latitude for year-round efficiency</li>
                      <li>• Modern panels can generate power even on cloudy days</li>
                      <li>• Regular cleaning increases efficiency by 5-15%</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={resetGame} variant="outline">
                    <RotateCcw size={16} className="mr-2" />
                    Play Again
                  </Button>
                  <Button onClick={onBack} className="bg-yellow-600 hover:bg-yellow-700">
                    <Award size={16} className="mr-2" />
                    Claim Rewards
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};
export default SolarPuzzles;