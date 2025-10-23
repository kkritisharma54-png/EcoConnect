import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Leaf, TreePine, Fish, Eye, AlertTriangle, CheckCircle, Award, ArrowLeft, RotateCcw, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface HabitatExplorerProps {
  onBack: () => void;
  userName?: string;
  onComplete?: (score: number, maxScore: number, timeElapsed: number) => void;
}

interface Habitat {
  id: string;
  name: string;
  description: string;
  threats: Threat[];
  species: Species[];
  conservation: string;
  image: string;
  color: string;
}

interface Threat {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  solution: string;
  points: number;
}

interface Species {
  id: string;
  name: string;
  status: 'safe' | 'vulnerable' | 'endangered' | 'critical';
  description: string;
  emoji: string;
}

const habitats: Habitat[] = [
  {
    id: 'rainforest',
    name: 'Tropical Rainforest',
    description: 'Dense, humid forests with incredible biodiversity',
    image: '🌳',
    color: 'emerald',
    conservation: 'Critical for climate regulation and biodiversity',
    threats: [
      {
        id: 'deforestation',
        name: 'Deforestation',
        description: 'Trees being cut down for agriculture and development',
        severity: 'critical',
        solution: 'Support sustainable forestry and conservation programs',
        points: 50
      },
      {
        id: 'mining',
        name: 'Illegal Mining',
        description: 'Mining operations destroying forest floor',
        severity: 'high',
        solution: 'Stricter enforcement and alternative livelihoods',
        points: 40
      },
      {
        id: 'poaching',
        name: 'Wildlife Poaching',
        description: 'Illegal hunting of endangered species',
        severity: 'high',
        solution: 'Anti-poaching patrols and community education',
        points: 40
      }
    ],
    species: [
      { id: 'jaguar', name: 'Jaguar', status: 'vulnerable', description: 'Large spotted cat, apex predator', emoji: '🐆' },
      { id: 'toucan', name: 'Toucan', status: 'safe', description: 'Colorful bird with large beak', emoji: '🦜' },
      { id: 'sloth', name: 'Three-toed Sloth', status: 'vulnerable', description: 'Slow-moving arboreal mammal', emoji: '🦥' }
    ]
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    description: 'Underwater ecosystems with vibrant marine life',
    image: '🪸',
    color: 'cyan',
    conservation: 'Marine biodiversity hotspots essential for ocean health',
    threats: [
      {
        id: 'bleaching',
        name: 'Coral Bleaching',
        description: 'Rising temperatures causing coral death',
        severity: 'critical',
        solution: 'Reduce carbon emissions and protect water quality',
        points: 50
      },
      {
        id: 'pollution',
        name: 'Ocean Pollution',
        description: 'Plastic waste and chemical runoff',
        severity: 'high',
        solution: 'Reduce plastic use and improve waste management',
        points: 40
      },
      {
        id: 'overfishing',
        name: 'Overfishing',
        description: 'Depleting fish populations disrupts ecosystem balance',
        severity: 'medium',
        solution: 'Sustainable fishing practices and marine protected areas',
        points: 30
      }
    ],
    species: [
      { id: 'clownfish', name: 'Clownfish', status: 'vulnerable', description: 'Small orange fish living in anemones', emoji: '🐠' },
      { id: 'turtle', name: 'Sea Turtle', status: 'endangered', description: 'Ancient marine reptile', emoji: '🐢' },
      { id: 'shark', name: 'Reef Shark', status: 'vulnerable', description: 'Important predator maintaining reef balance', emoji: '🦈' }
    ]
  },
  {
    id: 'wetland',
    name: 'Wetland',
    description: 'Areas where water meets land, supporting diverse wildlife',
    image: '🦆',
    color: 'blue',
    conservation: 'Natural water filters and flood protection',
    threats: [
      {
        id: 'drainage',
        name: 'Wetland Drainage',
        description: 'Converting wetlands for agriculture or development',
        severity: 'high',
        solution: 'Wetland protection laws and restoration projects',
        points: 40
      },
      {
        id: 'contamination',
        name: 'Water Contamination',
        description: 'Agricultural runoff and industrial pollution',
        severity: 'medium',
        solution: 'Better agricultural practices and pollution controls',
        points: 30
      },
      {
        id: 'invasive-species',
        name: 'Invasive Species',
        description: 'Non-native species disrupting ecosystem balance',
        severity: 'medium',
        solution: 'Species monitoring and removal programs',
        points: 30
      }
    ],
    species: [
      { id: 'heron', name: 'Great Blue Heron', status: 'safe', description: 'Large wading bird', emoji: '🦢' },
      { id: 'frog', name: 'Tree Frog', status: 'vulnerable', description: 'Indicator species sensitive to pollution', emoji: '🐸' },
      { id: 'beaver', name: 'Beaver', status: 'safe', description: 'Ecosystem engineer building dams', emoji: '🦫' }
    ]
  }
];

const HabitatExplorer = ({ onBack, userName = 'Player', onComplete }: HabitatExplorerProps) => {
  const [gameState, setGameState] = useState<'menu' | 'exploring' | 'threat-solving' | 'completed'>('menu');
  const [currentHabitat, setCurrentHabitat] = useState<Habitat | null>(null);
  const [discoveredThreats, setDiscoveredThreats] = useState<string[]>([]);
  const [solvedThreats, setSolvedThreats] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [explorationProgress, setExplorationProgress] = useState(0);
  const [foundSpecies, setFoundSpecies] = useState<string[]>([]);

  const startExploration = (habitat: Habitat) => {
    setCurrentHabitat(habitat);
    setGameState('exploring');
    setScore(0);
    setDiscoveredThreats([]);
    setSolvedThreats([]);
    setFoundSpecies([]);
    setExplorationProgress(0);
    setStartTime(Date.now());
  };

  const exploreArea = () => {
    if (!currentHabitat) return;

    const newProgress = Math.min(explorationProgress + 25, 100);
    setExplorationProgress(newProgress);

    // Discover threats as we explore
    if (newProgress >= 25 && discoveredThreats.length === 0) {
      setDiscoveredThreats([currentHabitat.threats[0].id]);
    } else if (newProgress >= 50 && discoveredThreats.length === 1) {
      setDiscoveredThreats([...discoveredThreats, currentHabitat.threats[1].id]);
    } else if (newProgress >= 75 && discoveredThreats.length === 2) {
      setDiscoveredThreats([...discoveredThreats, currentHabitat.threats[2].id]);
    }

    // Discover species
    const speciesIndex = Math.floor(newProgress / 34);
    if (speciesIndex < currentHabitat.species.length && !foundSpecies.includes(currentHabitat.species[speciesIndex].id)) {
      setFoundSpecies([...foundSpecies, currentHabitat.species[speciesIndex].id]);
      setScore(prev => prev + 20); // Species discovery points
    }

    if (newProgress === 100) {
      // Exploration complete
      setTimeout(() => setGameState('threat-solving'), 1000);
    }
  };

  const solveThreat = (threat: Threat) => {
    if (!solvedThreats.includes(threat.id)) {
      setSolvedThreats([...solvedThreats, threat.id]);
      setScore(prev => prev + threat.points);
      
      if (solvedThreats.length + 1 === currentHabitat?.threats.length) {
        setTimeout(() => completeGame(), 1500);
      }
    }
  };

  const completeGame = () => {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = currentHabitat ? 
      currentHabitat.threats.reduce((sum, threat) => sum + threat.points, 0) + 
      (currentHabitat.species.length * 20) : 0;
    
    setGameState('completed');
    onComplete?.(score, maxScore, timeElapsed);
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentHabitat(null);
    setScore(0);
    setDiscoveredThreats([]);
    setSolvedThreats([]);
    setFoundSpecies([]);
    setExplorationProgress(0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'vulnerable': return 'text-yellow-600 bg-yellow-100';
      case 'endangered': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-green-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-green-700 hover:text-green-800 hover:bg-green-50"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl mb-8">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
                  <Leaf size={48} className="text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-green-800 mb-4">Interactive Habitat Explorer</CardTitle>
              <p className="text-green-700 text-lg">
                Explore different habitats, discover wildlife, identify threats, and learn how to implement conservation solutions!
              </p>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {habitats.map((habitat) => (
              <Card 
                key={habitat.id}
                className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => startExploration(habitat)}
              >
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-3">{habitat.image}</div>
                    <h3 className="text-xl text-green-800 mb-2">{habitat.name}</h3>
                    <p className="text-sm text-green-600 mb-4">{habitat.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm text-green-800 mb-2">Wildlife:</h4>
                      <div className="flex justify-center gap-2">
                        {habitat.species.map((species) => (
                          <span key={species.id} className="text-2xl" title={species.name}>
                            {species.emoji}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm text-green-800 mb-2">Major Threats:</h4>
                      <div className="text-xs text-green-600">
                        {habitat.threats.length} threats to discover
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                    Explore Habitat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'exploring' && currentHabitat) {
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
                Score: {score}
              </Badge>
              <Badge variant="outline" className="text-green-700">
                Exploring: {currentHabitat.name}
              </Badge>
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-green-200 shadow-xl mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-800">
                  {currentHabitat.image} {currentHabitat.name} Exploration
                </CardTitle>
                <div className="text-right">
                  <div className="text-2xl text-green-700">{explorationProgress}%</div>
                  <div className="text-sm text-green-600">Complete</div>
                </div>
              </div>
              <Progress value={explorationProgress} className="w-full" />
            </CardHeader>

            <CardContent>
              <p className="text-green-700 mb-4">{currentHabitat.description}</p>
              <p className="text-sm text-green-600 mb-6">{currentHabitat.conservation}</p>

              <div className="text-center">
                <Button
                  onClick={exploreArea}
                  disabled={explorationProgress >= 100}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3"
                >
                  <Eye size={20} className="mr-2" />
                  {explorationProgress >= 100 ? 'Exploration Complete!' : 'Continue Exploring'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Discovered Species */}
            <Card className="bg-white/90 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 text-lg">Wildlife Discovered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentHabitat.species.map((species) => (
                    <motion.div
                      key={species.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: foundSpecies.includes(species.id) ? 1 : 0.3,
                        x: 0 
                      }}
                      className={`p-3 rounded-lg border ${
                        foundSpecies.includes(species.id) 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{species.emoji}</span>
                        <div className="flex-1">
                          <h4 className="text-sm text-gray-800">{species.name}</h4>
                          <p className="text-xs text-gray-600">{species.description}</p>
                          <Badge className={`text-xs mt-1 ${getStatusColor(species.status)}`}>
                            {species.status}
                          </Badge>
                        </div>
                        {foundSpecies.includes(species.id) && (
                          <CheckCircle className="text-green-600" size={20} />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Discovered Threats */}
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800 text-lg">Environmental Threats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentHabitat.threats.map((threat) => (
                    <motion.div
                      key={threat.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: discoveredThreats.includes(threat.id) ? 1 : 0.3,
                        x: 0 
                      }}
                      className={`p-3 rounded-lg border ${
                        discoveredThreats.includes(threat.id) 
                          ? 'border-orange-300 bg-orange-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="text-orange-600" size={20} />
                        <div className="flex-1">
                          <h4 className="text-sm text-gray-800">{threat.name}</h4>
                          <p className="text-xs text-gray-600">{threat.description}</p>
                          <Badge className={`text-xs mt-1 ${getSeverityColor(threat.severity)}`}>
                            {threat.severity}
                          </Badge>
                        </div>
                        {discoveredThreats.includes(threat.id) && (
                          <Eye className="text-orange-600" size={16} />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'threat-solving' && currentHabitat) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-orange-700 hover:text-orange-800 hover:bg-orange-50"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-orange-700">
                Score: {score}
              </Badge>
              <Badge variant="outline" className="text-orange-700">
                Solved: {solvedThreats.length}/{currentHabitat.threats.length}
              </Badge>
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-orange-200 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="text-orange-800 text-center">
                Conservation Solutions for {currentHabitat.name}
              </CardTitle>
              <p className="text-orange-700 text-center">
                Choose the best solutions to address each environmental threat
              </p>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentHabitat.threats.map((threat) => (
              <Card 
                key={threat.id}
                className={`bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 ${
                  solvedThreats.includes(threat.id)
                    ? 'border-green-300 bg-green-50'
                    : 'border-orange-200 hover:shadow-xl cursor-pointer'
                }`}
                onClick={() => !solvedThreats.includes(threat.id) && solveThreat(threat)}
              >
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <AlertTriangle className="text-orange-600 mx-auto mb-3" size={32} />
                    <h3 className="text-lg text-orange-800 mb-2">{threat.name}</h3>
                    <Badge className={`mb-3 ${getSeverityColor(threat.severity)}`}>
                      {threat.severity} threat
                    </Badge>
                    <p className="text-sm text-orange-700 mb-4">{threat.description}</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4 mb-4">
                    <h4 className="text-blue-800 mb-2 flex items-center gap-2">
                      <Lightbulb size={16} />
                      Solution:
                    </h4>
                    <p className="text-sm text-blue-700">{threat.solution}</p>
                  </div>

                  <div className="text-center">
                    {solvedThreats.includes(threat.id) ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle size={20} />
                        <span>Solution Implemented!</span>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-orange-600 mb-2">+{threat.points} points</div>
                        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                          Implement Solution
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = currentHabitat ? 
      currentHabitat.threats.reduce((sum, threat) => sum + threat.points, 0) + 
      (currentHabitat.species.length * 20) : 0;
    const percentage = Math.round((score / maxScore) * 100);
    const ecoPoints = Math.floor(score / 3);

    return (
      <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-green-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border-green-200 shadow-xl">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <div className="p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
                  <Award size={48} className="text-white" />
                </div>
              </motion.div>
              <CardTitle className="text-3xl text-green-800 mb-2">Mission Complete!</CardTitle>
              <p className="text-green-700">
                Excellent work exploring {currentHabitat?.name} and implementing conservation solutions, {userName}!
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                    <div className="text-2xl text-green-800 mb-1">{score}/{maxScore}</div>
                    <div className="text-green-600">Final Score ({percentage}%)</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4">
                    <div className="text-2xl text-blue-800 mb-1">{foundSpecies.length}/{currentHabitat?.species.length}</div>
                    <div className="text-blue-600">Species Discovered</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4">
                    <div className="text-2xl text-orange-800 mb-1">{solvedThreats.length}/{currentHabitat?.threats.length}</div>
                    <div className="text-orange-600">Threats Addressed</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
                    <div className="text-2xl text-yellow-800 mb-1">+{ecoPoints}</div>
                    <div className="text-yellow-600">Eco Points Earned</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <h4 className="text-green-800 mb-3">Conservation Impact:</h4>
                <p className="text-green-700">
                  By exploring habitats and understanding their threats, you're learning how to make a real difference 
                  in conservation. Every action, from reducing plastic use to supporting sustainable practices, 
                  helps protect these precious ecosystems for future generations!
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8"
                >
                  <RotateCcw size={20} className="mr-2" />
                  Explore Another Habitat
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 px-8"
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

export default HabitatExplorer;