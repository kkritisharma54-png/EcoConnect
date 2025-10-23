import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { TreePine, Target, Award, ArrowLeft, RotateCcw, Crosshair, Wind, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface SeedBombTossProps {
  onBack: () => void;
  userName?: string;
  onComplete?: (score: number, maxScore: number, timeElapsed: number) => void;
}

interface TargetZone {
  id: string;
  x: number;
  y: number;
  size: number;
  type: 'forest' | 'meadow' | 'wetland' | 'urban';
  points: number;
  color: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SeedBomb {
  id: string;
  type: 'wildflower' | 'tree' | 'grass' | 'vegetable';
  name: string;
  description: string;
  icon: string;
  biodiversityScore: number;
  growthTime: string;
}

interface GameState {
  level: number;
  score: number;
  seedBombsLeft: number;
  targets: TargetZone[];
  hitTargets: string[];
  wind: { strength: number; direction: number };
  timeRemaining: number;
}

const seedBombs: SeedBomb[] = [
  {
    id: 'wildflower',
    type: 'wildflower',
    name: 'Wildflower Mix',
    description: 'Attracts pollinators and adds color',
    icon: '🌸',
    biodiversityScore: 15,
    growthTime: '2-3 months'
  },
  {
    id: 'tree',
    type: 'tree',
    name: 'Native Tree Seeds',
    description: 'Provides habitat and carbon sequestration',
    icon: '🌳',
    biodiversityScore: 25,
    growthTime: '2-5 years'
  },
  {
    id: 'grass',
    type: 'grass',
    name: 'Prairie Grass',
    description: 'Prevents erosion and supports wildlife',
    icon: '🌾',
    biodiversityScore: 10,
    growthTime: '1-2 months'
  },
  {
    id: 'vegetable',
    type: 'vegetable',
    name: 'Vegetable Garden Mix',
    description: 'Provides food and promotes urban farming',
    icon: '🥕',
    biodiversityScore: 20,
    growthTime: '3-4 months'
  }
];

const targetZones: TargetZone[] = [
  {
    id: 'forest1',
    x: 20,
    y: 30,
    size: 80,
    type: 'forest',
    points: 30,
    color: 'bg-green-500',
    description: 'Reforestation Area',
    icon: '🌲',
    difficulty: 'easy'
  },
  {
    id: 'meadow1',
    x: 70,
    y: 20,
    size: 60,
    type: 'meadow',
    points: 25,
    color: 'bg-yellow-400',
    description: 'Wildflower Meadow',
    icon: '🌻',
    difficulty: 'medium'
  },
  {
    id: 'wetland1',
    x: 15,
    y: 70,
    size: 50,
    type: 'wetland',
    points: 40,
    color: 'bg-blue-400',
    description: 'Wetland Restoration',
    icon: '🦆',
    difficulty: 'hard'
  },
  {
    id: 'urban1',
    x: 80,
    y: 75,
    size: 45,
    type: 'urban',
    points: 35,
    color: 'bg-purple-400',
    description: 'Urban Green Space',
    icon: '🏢',
    difficulty: 'hard'
  },
  {
    id: 'forest2',
    x: 45,
    y: 50,
    size: 65,
    type: 'forest',
    points: 25,
    color: 'bg-green-400',
    description: 'Forest Edge',
    icon: '🌳',
    difficulty: 'medium'
  }
];

const SeedBombToss = ({ onBack, userName = 'Player', onComplete }: SeedBombTossProps) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [seedBombsLeft, setSeedBombsLeft] = useState(10);
  const [selectedSeedBomb, setSelectedSeedBomb] = useState<SeedBomb>(seedBombs[0]);
  const [targets, setTargets] = useState<TargetZone[]>([]);
  const [hitTargets, setHitTargets] = useState<string[]>([]);
  const [wind, setWind] = useState({ strength: 2, direction: 90 });
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameStats, setGameStats] = useState({
    totalHits: 0,
    perfectHits: 0,
    biodiversityPoints: 0,
    areasRestored: 0
  });
  const [trajectoryPreview, setTrajectoryPreview] = useState<{x: number, y: number} | null>(null);
  const [isAiming, setIsAiming] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      completeGame();
    }
    return () => clearTimeout(timer);
  }, [gameState, timeRemaining]);

  useEffect(() => {
    // Change wind conditions periodically
    const windTimer = setInterval(() => {
      if (gameState === 'playing') {
        setWind({
          strength: Math.floor(Math.random() * 5) + 1,
          direction: Math.floor(Math.random() * 360)
        });
      }
    }, 15000); // Change wind every 15 seconds

    return () => clearInterval(windTimer);
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setScore(0);
    setSeedBombsLeft(10);
    setHitTargets([]);
    setTimeRemaining(120);
    setCurrentLevel(1);
    setTargets(getTargetsForLevel(1));
    setGameStats({
      totalHits: 0,
      perfectHits: 0,
      biodiversityPoints: 0,
      areasRestored: 0
    });
    setWind({ strength: 2, direction: 90 });
  };

  const getTargetsForLevel = (level: number): TargetZone[] => {
    const baseTargets = [...targetZones];
    
    // Shuffle and select targets based on level
    const shuffled = baseTargets.sort(() => Math.random() - 0.5);
    const numTargets = Math.min(3 + level, 5);
    
    return shuffled.slice(0, numTargets).map(target => ({
      ...target,
      // Adjust target positions slightly for variety
      x: Math.max(10, Math.min(90, target.x + (Math.random() - 0.5) * 20)),
      y: Math.max(10, Math.min(90, target.y + (Math.random() - 0.5) * 20)),
      // Scale difficulty with level
      size: Math.max(30, target.size - (level - 1) * 5),
      points: target.points + (level - 1) * 5
    }));
  };

  const handleFieldClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (seedBombsLeft <= 0 || timeRemaining <= 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    tossSeedBomb(x, y);
  };

  const tossSeedBomb = (targetX: number, targetY: number) => {
    // Apply wind effect to trajectory
    const windEffectX = (wind.strength * Math.cos((wind.direction * Math.PI) / 180)) * 2;
    const windEffectY = (wind.strength * Math.sin((wind.direction * Math.PI) / 180)) * 2;
    
    const actualX = Math.max(0, Math.min(100, targetX + windEffectX));
    const actualY = Math.max(0, Math.min(100, targetY + windEffectY));

    setSeedBombsLeft(prev => prev - 1);

    // Check if we hit any targets
    let hit = false;
    let pointsEarned = 0;
    let biodiversityBonus = 0;

    targets.forEach(target => {
      if (hitTargets.includes(target.id)) return;

      const distance = Math.sqrt(
        Math.pow(actualX - target.x, 2) + Math.pow(actualY - target.y, 2)
      );

      const hitRadius = target.size / 8; // Convert size to hit radius

      if (distance <= hitRadius) {
        hit = true;
        pointsEarned += target.points;
        biodiversityBonus += selectedSeedBomb.biodiversityScore;
        
        setHitTargets(prev => [...prev, target.id]);
        setGameStats(prev => ({
          ...prev,
          totalHits: prev.totalHits + 1,
          perfectHits: distance <= hitRadius * 0.5 ? prev.perfectHits + 1 : prev.perfectHits,
          biodiversityPoints: prev.biodiversityPoints + selectedSeedBomb.biodiversityScore,
          areasRestored: prev.areasRestored + 1
        }));

        // Bonus points for perfect center hits
        if (distance <= hitRadius * 0.3) {
          pointsEarned += 20; // Perfect hit bonus
        } else if (distance <= hitRadius * 0.6) {
          pointsEarned += 10; // Good hit bonus
        }

        // Seed bomb type bonus for appropriate targets
        if (
          (selectedSeedBomb.type === 'tree' && target.type === 'forest') ||
          (selectedSeedBomb.type === 'wildflower' && target.type === 'meadow') ||
          (selectedSeedBomb.type === 'grass' && target.type === 'wetland') ||
          (selectedSeedBomb.type === 'vegetable' && target.type === 'urban')
        ) {
          pointsEarned += 15; // Appropriate pairing bonus
          biodiversityBonus += 5;
        }
      }
    });

    const totalPointsThisRound = pointsEarned + biodiversityBonus;
    setScore(prev => prev + totalPointsThisRound);

    // Check if level is complete
    const newHitTargets = hit ? [...hitTargets, targets.find(t => !hitTargets.includes(t.id))?.id].filter(Boolean) : hitTargets;
    if (newHitTargets.length === targets.length) {
      setTimeout(() => nextLevel(), 1000);
    }

    // Check if game should end
    if (seedBombsLeft - 1 <= 0 && newHitTargets.length < targets.length) {
      setTimeout(() => completeGame(), 1000);
    }
  };

  const nextLevel = () => {
    const nextLevelNum = currentLevel + 1;
    setCurrentLevel(nextLevelNum);
    setTargets(getTargetsForLevel(nextLevelNum));
    setHitTargets([]);
    setSeedBombsLeft(prev => prev + 5); // Bonus seed bombs for completing level
    setScore(prev => prev + 100); // Level completion bonus

    if (nextLevelNum > 3) {
      completeGame();
    }
  };

  const completeGame = () => {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = 500 * currentLevel; // Rough maximum
    
    setGameState('completed');
    onComplete?.(score, maxScore, timeElapsed);
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setSeedBombsLeft(10);
    setHitTargets([]);
    setTimeRemaining(120);
    setCurrentLevel(1);
    setTargets([]);
    setGameStats({
      totalHits: 0,
      perfectHits: 0,
      biodiversityPoints: 0,
      areasRestored: 0
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'menu') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-green-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
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

          <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
                  <TreePine size={48} className="text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-green-800 mb-4">Seed Bomb Toss Game</CardTitle>
              <p className="text-green-700 text-lg">
                Help restore nature by tossing seed bombs into target zones! Each successful hit helps create 
                biodiversity and brings new life to different ecosystems.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                {seedBombs.map((bomb) => (
                  <div key={bomb.id} className="text-center">
                    <div className="text-4xl mb-2">{bomb.icon}</div>
                    <h4 className="text-green-800 mb-1">{bomb.name}</h4>
                    <p className="text-xs text-green-600 mb-2">{bomb.description}</p>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      +{bomb.biodiversityScore} biodiversity
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6">
                <h4 className="text-green-800 mb-3">Game Features:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
                  <div>• 5 different restoration zones to target</div>
                  <div>• Wind effects add realistic challenge</div>
                  <div>• Multiple seed bomb types with unique benefits</div>
                  <div>• Level progression with increasing difficulty</div>
                  <div>• Biodiversity scoring system</div>
                  <div>• Perfect aim bonuses and combo multipliers</div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 text-lg"
                >
                  <Target size={20} className="mr-2" />
                  Start Tossing!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-green-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
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
                Level {currentLevel}
              </Badge>
              <Badge variant="outline" className={`${timeRemaining < 30 ? 'text-red-700' : 'text-green-700'}`}>
                Time: {formatTime(timeRemaining)}
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-4 mb-4">
            <Card className="bg-white/90 backdrop-blur-sm border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-green-800">{score}</div>
                <div className="text-xs text-green-600">Score</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-blue-800">{seedBombsLeft}</div>
                <div className="text-xs text-blue-600">Seed Bombs Left</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-purple-800">{hitTargets.length}/{targets.length}</div>
                <div className="text-xs text-purple-600">Targets Hit</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-orange-800">
                  <Wind size={16} />
                  <span className="text-xl">{wind.strength}</span>
                </div>
                <div className="text-xs text-orange-600">Wind: {wind.direction}°</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Game Field */}
            <div className="lg:col-span-3">
              <Card className="bg-white/90 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 text-center">
                    Restoration Field - Level {currentLevel}
                  </CardTitle>
                  <Progress value={(hitTargets.length / targets.length) * 100} className="w-full" />
                </CardHeader>
                <CardContent className="p-2">
                  <div
                    className="relative w-full h-96 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg cursor-crosshair overflow-hidden"
                    onClick={handleFieldClick}
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)' }}
                  >
                    {/* Target Zones */}
                    {targets.map((target) => (
                      <div
                        key={target.id}
                        className={`absolute rounded-full border-4 transition-all duration-300 flex items-center justify-center ${
                          hitTargets.includes(target.id)
                            ? 'bg-green-400 border-green-600 opacity-50'
                            : `${target.color} border-white opacity-80 hover:opacity-90`
                        }`}
                        style={{
                          left: `${target.x - target.size / 16}%`,
                          top: `${target.y - target.size / 16}%`,
                          width: `${target.size / 8}%`,
                          height: `${target.size / 8}%`,
                        }}
                      >
                        <div className="text-center text-white">
                          <div className="text-2xl">{target.icon}</div>
                          <div className="text-xs">{target.points}pts</div>
                        </div>
                        {hitTargets.includes(target.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="text-4xl">✅</div>
                          </motion.div>
                        )}
                      </div>
                    ))}

                    {/* Wind Indicator */}
                    <div className="absolute top-2 right-2 bg-white/80 rounded-lg p-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Wind 
                          size={16} 
                          className="text-blue-600"
                          style={{ transform: `rotate(${wind.direction}deg)` }}
                        />
                        <span className="text-blue-800">Wind: {wind.strength}</span>
                      </div>
                    </div>

                    {/* Crosshair Cursor */}
                    <div className="absolute inset-0 pointer-events-none">
                      <Crosshair className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600 opacity-50" size={32} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Seed Bomb Selection */}
            <div className="space-y-4">
              <Card className="bg-white/90 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Select Seed Bomb</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {seedBombs.map((bomb) => (
                    <Card
                      key={bomb.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedSeedBomb.id === bomb.id
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                      onClick={() => setSelectedSeedBomb(bomb)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{bomb.icon}</div>
                          <div className="flex-1">
                            <h4 className="text-sm text-green-800">{bomb.name}</h4>
                            <p className="text-xs text-green-600 mb-1">{bomb.description}</p>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              +{bomb.biodiversityScore}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Target Zones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {targets.map((target) => (
                    <div
                      key={target.id}
                      className={`flex items-center gap-2 text-sm p-2 rounded ${
                        hitTargets.includes(target.id) ? 'bg-green-100' : 'bg-gray-50'
                      }`}
                    >
                      <div className="text-lg">{target.icon}</div>
                      <div className="flex-1">
                        <div className="text-gray-800">{target.description}</div>
                        <div className="text-xs text-gray-600">{target.points} points</div>
                      </div>
                      {hitTargets.includes(target.id) && (
                        <div className="text-green-600">✓</div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-800">Game Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Hits:</span>
                    <span className="text-purple-700">{gameStats.totalHits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Perfect Hits:</span>
                    <span className="text-purple-700">{gameStats.perfectHits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biodiversity:</span>
                    <span className="text-purple-700">{gameStats.biodiversityPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Areas Restored:</span>
                    <span className="text-purple-700">{gameStats.areasRestored}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = 500 * currentLevel;
    const percentage = Math.round((score / maxScore) * 100);
    const ecoPoints = Math.floor(score / 5);

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
              <CardTitle className="text-3xl text-green-800 mb-2">Restoration Complete!</CardTitle>
              <p className="text-green-700">
                Fantastic work, {userName}! You've helped restore {gameStats.areasRestored} areas and 
                increased biodiversity by {gameStats.biodiversityPoints} points!
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                    <div className="text-2xl text-green-800 mb-1">{score}</div>
                    <div className="text-green-600">Final Score</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4">
                    <div className="text-2xl text-blue-800 mb-1">{gameStats.totalHits}</div>
                    <div className="text-blue-600">Successful Hits</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                    <div className="text-2xl text-purple-800 mb-1">{currentLevel}</div>
                    <div className="text-purple-600">Levels Completed</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
                    <div className="text-2xl text-orange-800 mb-1">+{ecoPoints}</div>
                    <div className="text-orange-600">Eco Points Earned</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                  <h4 className="text-green-800 mb-2">Biodiversity Impact</h4>
                  <div className="text-2xl text-green-700">{gameStats.biodiversityPoints}</div>
                  <div className="text-sm text-green-600">Biodiversity points added to ecosystems</div>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4">
                  <h4 className="text-blue-800 mb-2">Perfect Accuracy</h4>
                  <div className="text-2xl text-blue-700">
                    {gameStats.totalHits > 0 ? Math.round((gameStats.perfectHits / gameStats.totalHits) * 100) : 0}%
                  </div>
                  <div className="text-sm text-blue-600">Perfect center hits</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <h4 className="text-green-800 mb-3">Environmental Impact:</h4>
                <p className="text-green-700">
                  Seed bombs are a real guerrilla gardening technique used to restore degraded land and increase 
                  urban biodiversity! Each seed bomb contains clay, compost, and native seeds that can grow in 
                  difficult conditions. Your virtual restoration efforts mirror real conservation work happening 
                  around the world to bring nature back to cities and heal damaged ecosystems.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8"
                >
                  <RotateCcw size={20} className="mr-2" />
                  Restore More Areas
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

export default SeedBombToss;