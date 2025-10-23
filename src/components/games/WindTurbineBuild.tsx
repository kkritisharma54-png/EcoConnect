import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Target, Zap, Wrench, Award, ArrowLeft, RotateCcw, Settings, Wind, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';

interface WindTurbineBuildProps {
  onBack: () => void;
  userName?: string;
  onComplete?: (score: number, maxScore: number, timeElapsed: number) => void;
}

interface TurbineComponent {
  id: string;
  name: string;
  description: string;
  efficiency: number;
  cost: number;
  icon: string;
}

interface WindCondition {
  speed: number;
  direction: number;
  consistency: number;
}

interface TurbineDesign {
  bladeLength: number;
  towerHeight: number;
  generatorType: string;
  materials: string;
}

const bladeOptions: TurbineComponent[] = [
  {
    id: 'small-blades',
    name: 'Small Blades (20m)',
    description: 'Good for low wind areas, lower power output',
    efficiency: 60,
    cost: 20,
    icon: '🌀'
  },
  {
    id: 'medium-blades',
    name: 'Medium Blades (40m)',
    description: 'Balanced design for most conditions',
    efficiency: 80,
    cost: 40,
    icon: '🌪️'
  },
  {
    id: 'large-blades',
    name: 'Large Blades (60m)',
    description: 'Maximum power in high wind areas',
    efficiency: 100,
    cost: 60,
    icon: '🌊'
  }
];

const generatorOptions: TurbineComponent[] = [
  {
    id: 'basic-generator',
    name: 'Basic Generator',
    description: 'Standard efficiency, low cost',
    efficiency: 70,
    cost: 15,
    icon: '⚡'
  },
  {
    id: 'advanced-generator',
    name: 'Advanced Generator',
    description: 'High efficiency with smart controls',
    efficiency: 90,
    cost: 35,
    icon: '🔋'
  },
  {
    id: 'premium-generator',
    name: 'Premium Generator',
    description: 'Maximum efficiency with AI optimization',
    efficiency: 110,
    cost: 55,
    icon: '✨'
  }
];

const materialOptions: TurbineComponent[] = [
  {
    id: 'steel',
    name: 'Steel Construction',
    description: 'Durable but heavy, good for stable conditions',
    efficiency: 85,
    cost: 25,
    icon: '🏗️'
  },
  {
    id: 'carbon-fiber',
    name: 'Carbon Fiber',
    description: 'Lightweight and strong, handles variable winds',
    efficiency: 95,
    cost: 45,
    icon: '🧬'
  },
  {
    id: 'composite',
    name: 'Composite Materials',
    description: 'Best performance in all conditions',
    efficiency: 105,
    cost: 65,
    icon: '💎'
  }
];

const WindTurbineBuild = ({ onBack, userName = 'Player', onComplete }: WindTurbineBuildProps) => {
  const [gameState, setGameState] = useState<'menu' | 'design' | 'testing' | 'completed'>('menu');
  const [budget, setBudget] = useState(200);
  const [selectedBlades, setSelectedBlades] = useState<TurbineComponent | null>(null);
  const [selectedGenerator, setSelectedGenerator] = useState<TurbineComponent | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<TurbineComponent | null>(null);
  const [towerHeight, setTowerHeight] = useState(50);
  const [turbineAngle, setTurbineAngle] = useState(0);
  const [windConditions, setWindConditions] = useState<WindCondition>({
    speed: 15,
    direction: 180,
    consistency: 80
  });
  const [powerOutput, setPowerOutput] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalCost, setTotalCost] = useState(0);
  const [testResults, setTestResults] = useState<{
    lowWind: number;
    mediumWind: number;
    highWind: number;
    averageOutput: number;
  } | null>(null);

  useEffect(() => {
    calculateTotalCost();
  }, [selectedBlades, selectedGenerator, selectedMaterial, towerHeight]);

  useEffect(() => {
    if (gameState === 'testing') {
      calculatePowerOutput();
    }
  }, [windConditions, selectedBlades, selectedGenerator, selectedMaterial, towerHeight, turbineAngle]);

  const startDesign = () => {
    setGameState('design');
    setStartTime(Date.now());
    setScore(0);
    setBudget(200);
    setSelectedBlades(null);
    setSelectedGenerator(null);
    setSelectedMaterial(null);
    setTowerHeight(50);
    setTurbineAngle(0);
    setTestResults(null);
  };

  const calculateTotalCost = () => {
    let cost = 0;
    if (selectedBlades) cost += selectedBlades.cost;
    if (selectedGenerator) cost += selectedGenerator.cost;
    if (selectedMaterial) cost += selectedMaterial.cost;
    cost += Math.floor(towerHeight / 10) * 5; // Tower cost based on height
    setTotalCost(cost);
  };

  const canAfford = () => {
    return totalCost <= budget;
  };

  const isDesignComplete = () => {
    return selectedBlades && selectedGenerator && selectedMaterial && canAfford();
  };

  const startTesting = () => {
    if (!isDesignComplete()) return;
    setGameState('testing');
    runTests();
  };

  const runTests = () => {
    // Test under different wind conditions
    const tests = [
      { name: 'lowWind', speed: 8, consistency: 60 },
      { name: 'mediumWind', speed: 15, consistency: 80 },
      { name: 'highWind', speed: 25, consistency: 70 }
    ];

    const results = { lowWind: 0, mediumWind: 0, highWind: 0, averageOutput: 0 };

    tests.forEach(test => {
      const output = calculatePowerForConditions(test.speed, test.consistency);
      results[test.name as keyof typeof results] = output;
    });

    results.averageOutput = (results.lowWind + results.mediumWind + results.highWind) / 3;
    setTestResults(results);

    // Calculate final score
    const efficiencyScore = Math.min(results.averageOutput / 100, 1) * 500;
    const budgetBonus = Math.max(0, budget - totalCost) * 2;
    const designBonus = calculateDesignBonus();
    const finalScore = Math.round(efficiencyScore + budgetBonus + designBonus);
    
    setScore(finalScore);
  };

  const calculatePowerForConditions = (windSpeed: number, consistency: number) => {
    if (!selectedBlades || !selectedGenerator || !selectedMaterial) return 0;

    // Base calculation factors
    const windPower = Math.pow(windSpeed, 3) / 1000; // Wind power is proportional to cube of speed
    const bladeEfficiency = selectedBlades.efficiency / 100;
    const generatorEfficiency = selectedGenerator.efficiency / 100;
    const materialEfficiency = selectedMaterial.efficiency / 100;
    const heightBonus = Math.min(towerHeight / 100, 1.5); // Height bonus up to 150%
    const consistencyFactor = consistency / 100;
    
    // Calculate optimal angle difference
    const angleDifference = Math.abs(windConditions.direction - turbineAngle);
    const angleEfficiency = Math.cos((angleDifference * Math.PI) / 180);

    const power = windPower * bladeEfficiency * generatorEfficiency * materialEfficiency * 
                  heightBonus * consistencyFactor * angleEfficiency * 10;

    return Math.max(0, Math.round(power));
  };

  const calculatePowerOutput = () => {
    const power = calculatePowerForConditions(windConditions.speed, windConditions.consistency);
    setPowerOutput(power);
    
    // Calculate overall efficiency
    const maxPossible = calculatePowerForConditions(30, 100); // Maximum theoretical output
    const eff = maxPossible > 0 ? (power / maxPossible) * 100 : 0;
    setEfficiency(Math.round(eff));
  };

  const calculateDesignBonus = () => {
    let bonus = 0;
    
    // Bonus for balanced design
    if (selectedBlades && selectedGenerator && selectedMaterial) {
      const avgEfficiency = (selectedBlades.efficiency + selectedGenerator.efficiency + selectedMaterial.efficiency) / 3;
      if (avgEfficiency > 90) bonus += 100;
      else if (avgEfficiency > 80) bonus += 50;
    }
    
    // Bonus for optimal tower height
    if (towerHeight >= 80 && towerHeight <= 120) bonus += 50;
    
    return bonus;
  };

  const completeGame = () => {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = 800; // Maximum possible score
    
    setGameState('completed');
    onComplete?.(score, maxScore, timeElapsed);
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setBudget(200);
    setSelectedBlades(null);
    setSelectedGenerator(null);
    setSelectedMaterial(null);
    setTowerHeight(50);
    setTurbineAngle(0);
    setTestResults(null);
    setPowerOutput(0);
    setEfficiency(0);
  };

  const generateRandomWind = () => {
    setWindConditions({
      speed: Math.floor(Math.random() * 20) + 5,
      direction: Math.floor(Math.random() * 360),
      consistency: Math.floor(Math.random() * 40) + 60
    });
  };

  if (gameState === 'menu') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-purple-700 hover:text-purple-800 hover:bg-purple-50"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full">
                  <Target size={48} className="text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-purple-800 mb-4">Build Your Own Wind Turbine</CardTitle>
              <p className="text-purple-700 text-lg">
                Design and build a wind turbine from scratch! Choose components, set the height, and test your design 
                under different wind conditions to maximize power generation.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-4 text-center">
                  <Wrench className="text-blue-600 mx-auto mb-2" size={32} />
                  <h4 className="text-blue-800 mb-2">Design Phase</h4>
                  <p className="text-sm text-blue-700">Choose blades, generator, materials and height</p>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-4 text-center">
                  <Wind className="text-green-600 mx-auto mb-2" size={32} />
                  <h4 className="text-green-800 mb-2">Testing Phase</h4>
                  <p className="text-sm text-green-700">Test performance under various wind conditions</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-4 text-center">
                  <Zap className="text-orange-600 mx-auto mb-2" size={32} />
                  <h4 className="text-orange-800 mb-2">Optimization</h4>
                  <p className="text-sm text-orange-700">Adjust angle and settings for maximum power</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6">
                <h4 className="text-purple-800 mb-3">Engineering Challenge:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-700">
                  <div>• Work within a $200 budget</div>
                  <div>• Balance cost vs. performance</div>
                  <div>• Consider wind conditions and tower height</div>
                  <div>• Optimize blade angle for wind direction</div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={startDesign}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3 text-lg"
                >
                  <Wrench size={20} className="mr-2" />
                  Start Building
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'design') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-purple-700 hover:text-purple-800 hover:bg-purple-50"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className={`text-lg px-3 py-1 ${canAfford() ? 'text-green-700' : 'text-red-700'}`}>
                Budget: ${budget - totalCost} / ${budget}
              </Badge>
              <Badge variant="outline" className="text-purple-700">
                Total Cost: ${totalCost}
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Component Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Blade Selection */}
              <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">1. Choose Turbine Blades</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bladeOptions.map((blade) => (
                    <Card
                      key={blade.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedBlades?.id === blade.id
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                      onClick={() => setSelectedBlades(blade)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{blade.icon}</div>
                          <div className="flex-1">
                            <h4 className="text-blue-800 mb-1">{blade.name}</h4>
                            <p className="text-xs text-blue-600 mb-2">{blade.description}</p>
                            <div className="flex gap-2">
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                {blade.efficiency}% efficiency
                              </Badge>
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                ${blade.cost}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Generator Selection */}
              <Card className="bg-white/90 backdrop-blur-sm border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-800">2. Choose Generator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {generatorOptions.map((generator) => (
                    <Card
                      key={generator.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedGenerator?.id === generator.id
                          ? 'border-yellow-400 bg-yellow-50'
                          : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                      }`}
                      onClick={() => setSelectedGenerator(generator)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{generator.icon}</div>
                          <div className="flex-1">
                            <h4 className="text-yellow-800 mb-1">{generator.name}</h4>
                            <p className="text-xs text-yellow-600 mb-2">{generator.description}</p>
                            <div className="flex gap-2">
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                {generator.efficiency}% efficiency
                              </Badge>
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                ${generator.cost}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Material Selection */}
              <Card className="bg-white/90 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">3. Choose Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {materialOptions.map((material) => (
                    <Card
                      key={material.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedMaterial?.id === material.id
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                      onClick={() => setSelectedMaterial(material)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{material.icon}</div>
                          <div className="flex-1">
                            <h4 className="text-green-800 mb-1">{material.name}</h4>
                            <p className="text-xs text-green-600 mb-2">{material.description}</p>
                            <div className="flex gap-2">
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                {material.efficiency}% efficiency
                              </Badge>
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                ${material.cost}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Design Configuration */}
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-800">4. Tower Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-purple-700 mb-2 block">
                      Tower Height: {towerHeight}m
                    </label>
                    <Slider
                      value={[towerHeight]}
                      onValueChange={(value) => setTowerHeight(value[0])}
                      min={30}
                      max={150}
                      step={10}
                      className="w-full"
                    />
                    <div className="text-xs text-purple-600 mt-1">
                      Cost: ${Math.floor(towerHeight / 10) * 5}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-800">Design Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Blades:</span>
                      <span>{selectedBlades?.name || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Generator:</span>
                      <span>{selectedGenerator?.name || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Materials:</span>
                      <span>{selectedMaterial?.name || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tower Height:</span>
                      <span>{towerHeight}m</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg">
                      <span>Total Cost:</span>
                      <span className={canAfford() ? 'text-green-600' : 'text-red-600'}>
                        ${totalCost}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining Budget:</span>
                      <span className={canAfford() ? 'text-green-600' : 'text-red-600'}>
                        ${budget - totalCost}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={startTesting}
                    disabled={!isDesignComplete()}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                  >
                    <Settings size={20} className="mr-2" />
                    Start Testing
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'testing' && testResults) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-green-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-green-700 hover:text-green-800 hover:bg-green-50"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-700">
                Current Output: {powerOutput}kW
              </Badge>
              <Badge variant="outline" className="text-green-700">
                Efficiency: {efficiency}%
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Test Results */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Performance Test Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-4 text-center">
                      <div className="text-2xl text-blue-800 mb-1">{testResults.lowWind}kW</div>
                      <div className="text-sm text-blue-600">Low Wind (8 mph)</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-4 text-center">
                      <div className="text-2xl text-green-800 mb-1">{testResults.mediumWind}kW</div>
                      <div className="text-sm text-green-600">Medium Wind (15 mph)</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg p-4 text-center">
                      <div className="text-2xl text-orange-800 mb-1">{testResults.highWind}kW</div>
                      <div className="text-sm text-orange-600">High Wind (25 mph)</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 text-center">
                    <div className="text-3xl text-yellow-800 mb-1">{Math.round(testResults.averageOutput)}kW</div>
                    <div className="text-yellow-600">Average Power Output</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Live Wind Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl text-blue-800 mb-1">{windConditions.speed} mph</div>
                      <div className="text-sm text-blue-600">Wind Speed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-blue-800 mb-1">{windConditions.direction}°</div>
                      <div className="text-sm text-blue-600">Wind Direction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-blue-800 mb-1">{windConditions.consistency}%</div>
                      <div className="text-sm text-blue-600">Consistency</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={generateRandomWind}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Wind size={16} className="mr-2" />
                      Change Wind Conditions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Turbine Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-green-700 mb-2 block">
                      Turbine Angle: {turbineAngle}°
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setTurbineAngle(Math.max(0, turbineAngle - 15))}
                        className="border-green-300"
                      >
                        <ChevronDown size={16} />
                      </Button>
                      <Slider
                        value={[turbineAngle]}
                        onValueChange={(value) => setTurbineAngle(value[0])}
                        min={0}
                        max={360}
                        step={15}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setTurbineAngle(Math.min(360, turbineAngle + 15))}
                        className="border-green-300"
                      >
                        <ChevronUp size={16} />
                      </Button>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Wind direction: {windConditions.direction}°
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                    <h4 className="text-green-800 mb-2">Current Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Power Output:</span>
                        <span className="text-green-700">{powerOutput}kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efficiency:</span>
                        <span className="text-green-700">{efficiency}%</span>
                      </div>
                      <Progress value={efficiency} className="w-full mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-800">Final Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl text-purple-800 mb-2">{score}</div>
                    <div className="text-purple-600">Engineering Points</div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Performance:</span>
                      <span>{Math.round((testResults.averageOutput / 100) * 500)} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget Bonus:</span>
                      <span>{Math.max(0, budget - totalCost) * 2} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Design Bonus:</span>
                      <span>{calculateDesignBonus()} pts</span>
                    </div>
                  </div>

                  <Button
                    onClick={completeGame}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                  >
                    Complete Project
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'completed' && testResults) {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = 800;
    const percentage = Math.round((score / maxScore) * 100);
    const ecoPoints = Math.floor(score / 4);

    return (
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border-purple-200 shadow-xl">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <div className="p-4 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full">
                  <Award size={48} className="text-white" />
                </div>
              </motion.div>
              <CardTitle className="text-3xl text-purple-800 mb-2">Wind Turbine Complete!</CardTitle>
              <p className="text-purple-700">
                Excellent engineering work, {userName}! Your wind turbine design is ready for deployment.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4">
                    <div className="text-2xl text-purple-800 mb-1">{score}/{maxScore}</div>
                    <div className="text-purple-600">Engineering Score ({percentage}%)</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                    <div className="text-2xl text-green-800 mb-1">{Math.round(testResults.averageOutput)}kW</div>
                    <div className="text-green-600">Average Power Output</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4">
                    <div className="text-2xl text-blue-800 mb-1">${budget - totalCost}</div>
                    <div className="text-blue-600">Budget Remaining</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
                    <div className="text-2xl text-orange-800 mb-1">+{ecoPoints}</div>
                    <div className="text-orange-600">Eco Points Earned</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
                <h4 className="text-purple-800 mb-3">Engineering Insight:</h4>
                <p className="text-purple-700">
                  Wind turbine design involves balancing many factors: cost, efficiency, environmental conditions, 
                  and maintenance requirements. Your design demonstrates key engineering principles like 
                  optimization under constraints and performance testing. Real wind turbines power millions 
                  of homes worldwide and are a crucial part of our clean energy future!
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8"
                >
                  <RotateCcw size={20} className="mr-2" />
                  Build Another Turbine
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8"
                >
                  Back to Lessons
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default WindTurbineBuild;