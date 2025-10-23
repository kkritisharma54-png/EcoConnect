import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Wrench, CheckCircle, Award, RotateCcw, Timer } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface LeakDetectionPuzzleProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface Leak {
  id: string;
  x: number;
  y: number;
  severity: 'minor' | 'major' | 'critical';
  fixed: boolean;
  points: number;
  room: string;
}

const LeakDetectionPuzzle = ({ onComplete, onBack }: LeakDetectionPuzzleProps) => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [score, setScore] = useState(0);
  const [leaksFound, setLeaksFound] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('kitchen');
  const [showHint, setShowHint] = useState(false);

  const rooms = [
    { id: 'kitchen', name: 'Kitchen', icon: '🍽️' },
    { id: 'bathroom', name: 'Bathroom', icon: '🚿' },
    { id: 'laundry', name: 'Laundry', icon: '👕' },
    { id: 'garden', name: 'Garden', icon: '🌱' }
  ];

  const [leaks, setLeaks] = useState<Leak[]>([
    // Kitchen leaks
    { id: 'k1', x: 20, y: 30, severity: 'minor', fixed: false, points: 10, room: 'kitchen' },
    { id: 'k2', x: 70, y: 45, severity: 'major', fixed: false, points: 20, room: 'kitchen' },
    
    // Bathroom leaks
    { id: 'b1', x: 15, y: 60, severity: 'critical', fixed: false, points: 30, room: 'bathroom' },
    { id: 'b2', x: 80, y: 25, severity: 'minor', fixed: false, points: 10, room: 'bathroom' },
    { id: 'b3', x: 45, y: 70, severity: 'major', fixed: false, points: 20, room: 'bathroom' },
    
    // Laundry leaks
    { id: 'l1', x: 60, y: 40, severity: 'major', fixed: false, points: 20, room: 'laundry' },
    
    // Garden leaks
    { id: 'g1', x: 25, y: 50, severity: 'critical', fixed: false, points: 30, room: 'garden' },
    { id: 'g2', x: 75, y: 35, severity: 'minor', fixed: false, points: 10, room: 'garden' }
  ]);

  const totalLeaks = leaks.length;
  const roomLeaks = leaks.filter(leak => leak.room === currentRoom);

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || leaksFound === totalLeaks) {
      setGameComplete(true);
      setTimeout(() => onComplete(score), 2000);
    }
  }, [timeLeft, gameComplete, leaksFound, totalLeaks, score, onComplete]);

  const handleLeakClick = (leakId: string) => {
    const leak = leaks.find(l => l.id === leakId);
    if (!leak || leak.fixed) return;

    // Fix the leak
    setLeaks(prev => prev.map(l => 
      l.id === leakId ? { ...l, fixed: true } : l
    ));
    
    setScore(prev => prev + leak.points);
    setLeaksFound(prev => prev + 1);

    // Bonus points for speed
    if (timeLeft > 90) {
      setScore(prev => prev + 5); // Speed bonus
    }
  };

  const resetGame = () => {
    setTimeLeft(120);
    setScore(0);
    setLeaksFound(0);
    setGameComplete(false);
    setCurrentRoom('kitchen');
    setLeaks(prev => prev.map(leak => ({ ...leak, fixed: false })));
  };

  const getLeakColor = (severity: string, fixed: boolean) => {
    if (fixed) return 'bg-green-500';
    switch (severity) {
      case 'minor': return 'bg-blue-400';
      case 'major': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-blue-400';
    }
  };

  const getRoomBackground = (roomId: string) => {
    const backgrounds = {
      kitchen: 'bg-gradient-to-br from-orange-100 to-yellow-100',
      bathroom: 'bg-gradient-to-br from-blue-100 to-cyan-100', 
      laundry: 'bg-gradient-to-br from-purple-100 to-pink-100',
      garden: 'bg-gradient-to-br from-green-100 to-emerald-100'
    };
    return backgrounds[roomId as keyof typeof backgrounds] || 'bg-gray-100';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search size={24} />
                Leak Detection Puzzle
              </CardTitle>
              <p className="text-blue-100 mt-1">Find and fix all the leaks before time runs out!</p>
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
                key="game"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Game Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-red-50">
                    <CardContent className="p-3 text-center">
                      <Timer className="text-red-600 mx-auto mb-1" size={20} />
                      <div className="text-xl text-red-600">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
                      <div className="text-xs text-red-600">Time Left</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50">
                    <CardContent className="p-3 text-center">
                      <CheckCircle className="text-green-600 mx-auto mb-1" size={20} />
                      <div className="text-xl text-green-600">{leaksFound}/{totalLeaks}</div>
                      <div className="text-xs text-green-600">Leaks Fixed</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-50">
                    <CardContent className="p-3 text-center">
                      <Award className="text-yellow-600 mx-auto mb-1" size={20} />
                      <div className="text-xl text-yellow-600">{score}</div>
                      <div className="text-xs text-yellow-600">Score</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50">
                    <CardContent className="p-3 text-center">
                      <Search className="text-blue-600 mx-auto mb-1" size={20} />
                      <div className="text-xl text-blue-600">{roomLeaks.filter(l => !l.fixed).length}</div>
                      <div className="text-xs text-blue-600">In This Room</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Detection Progress</span>
                    <span>{leaksFound}/{totalLeaks} leaks found</span>
                  </div>
                  <Progress value={(leaksFound / totalLeaks) * 100} className="h-3" />
                </div>

                {/* Room Navigation */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {rooms.map((room) => {
                    const roomLeakCount = leaks.filter(l => l.room === room.id && !l.fixed).length;
                    return (
                      <Button
                        key={room.id}
                        variant={currentRoom === room.id ? "default" : "outline"}
                        onClick={() => setCurrentRoom(room.id)}
                        className="flex items-center gap-2"
                      >
                        <span>{room.icon}</span>
                        {room.name}
                        {roomLeakCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                            {roomLeakCount}
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </div>

                {/* Room Display */}
                <Card className="relative">
                  <CardContent className="p-0">
                    <div className={`relative w-full h-96 ${getRoomBackground(currentRoom)} rounded-lg overflow-hidden`}>
                      {/* Room label */}
                      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {rooms.find(r => r.id === currentRoom)?.icon}
                          </span>
                          <span className="font-medium">
                            {rooms.find(r => r.id === currentRoom)?.name}
                          </span>
                        </div>
                      </div>

                      {/* Leaks in current room */}
                      {roomLeaks.map((leak) => (
                        <motion.button
                          key={leak.id}
                          className={`absolute w-6 h-6 rounded-full ${getLeakColor(leak.severity, leak.fixed)} 
                            shadow-lg hover:scale-110 transition-transform cursor-pointer
                            ${!leak.fixed ? 'animate-pulse' : ''}`}
                          style={{ 
                            left: `${leak.x}%`, 
                            top: `${leak.y}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                          onClick={() => handleLeakClick(leak.id)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={leak.fixed}
                        >
                          {leak.fixed ? (
                            <CheckCircle size={16} className="text-white absolute inset-0 m-auto" />
                          ) : (
                            <div className="w-full h-full rounded-full relative">
                              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
                            </div>
                          )}
                        </motion.button>
                      ))}

                      {/* Hint overlay */}
                      {showHint && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="bg-white rounded-lg p-4 text-center max-w-md">
                            <h3 className="font-medium mb-2">💡 Hint</h3>
                            <p className="text-sm text-gray-600">
                              Look for pulsing dots around the room. Different colors indicate leak severity:
                            </p>
                            <div className="mt-2 space-y-1 text-xs">
                              <div><span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-2"></span>Minor (10 pts)</div>
                              <div><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>Major (20 pts)</div>
                              <div><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>Critical (30 pts)</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Game Controls */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2"
                  >
                    💡 {showHint ? 'Hide' : 'Show'} Hints
                  </Button>
                  
                  <div className="text-sm text-gray-600">
                    Click on the pulsing spots to fix leaks! Speed bonus for quick fixes.
                  </div>
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
                  <h2 className="text-2xl font-bold text-gray-800">
                    {leaksFound === totalLeaks ? 'Perfect Detective Work!' : 'Time\'s Up!'}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <Card className="bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-green-600">{leaksFound}</div>
                        <div className="text-sm text-green-600">Leaks Fixed</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-blue-600">{score}</div>
                        <div className="text-sm text-blue-600">Final Score</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-purple-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-purple-600">{Math.round((leaksFound / totalLeaks) * 100)}%</div>
                        <div className="text-sm text-purple-600">Efficiency</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">💧 Water Conservation Facts:</h4>
                    <ul className="text-sm text-blue-700 text-left space-y-1">
                      <li>• A dripping tap wastes over 3,000 liters per year</li>
                      <li>• Running toilets can waste 200 liters per day</li>
                      <li>• Early leak detection saves money and water</li>
                      <li>• Check under sinks and behind toilets regularly</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={resetGame} variant="outline">
                    <RotateCcw size={16} className="mr-2" />
                    Play Again
                  </Button>
                  <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
                    <Wrench size={16} className="mr-2" />
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

export default LeakDetectionPuzzle;