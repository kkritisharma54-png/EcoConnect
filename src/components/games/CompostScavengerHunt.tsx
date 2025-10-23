import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Search, Recycle, Check, X, Leaf, Award, ArrowLeft, RotateCcw, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface CompostScavengerHuntProps {
  onBack: () => void;
  userName?: string;
  onComplete?: (score: number, maxScore: number, timeElapsed: number) => void;
}

interface CompostItem {
  id: string;
  name: string;
  category: 'greens' | 'browns' | 'not-compostable';
  image: string;
  points: number;
  description: string;
  tips: string;
}

const compostItems: CompostItem[] = [
  // Greens (Nitrogen-rich)
  {
    id: 'banana-peel',
    name: 'Banana Peel',
    category: 'greens',
    image: '🍌',
    points: 10,
    description: 'Rich in potassium and breaks down quickly',
    tips: 'Chop into smaller pieces for faster decomposition'
  },
  {
    id: 'coffee-grounds',
    name: 'Coffee Grounds',
    category: 'greens',
    image: '☕',
    points: 15,
    description: 'High in nitrogen, excellent for compost',
    tips: 'Mix with browns to prevent clumping'
  },
  {
    id: 'grass-clippings',
    name: 'Fresh Grass Clippings',
    category: 'greens',
    image: '🌱',
    points: 10,
    description: 'Fresh green material high in nitrogen',
    tips: 'Don\'t add too much at once to avoid odors'
  },
  {
    id: 'vegetable-scraps',
    name: 'Vegetable Scraps',
    category: 'greens',
    image: '🥕',
    points: 10,
    description: 'Kitchen waste that decomposes well',
    tips: 'Avoid onions and garlic in large quantities'
  },
  {
    id: 'eggshells',
    name: 'Eggshells',
    category: 'greens',
    image: '🥚',
    points: 15,
    description: 'Provide calcium for your compost',
    tips: 'Crush shells for faster breakdown'
  },

  // Browns (Carbon-rich)
  {
    id: 'dry-leaves',
    name: 'Dry Leaves',
    category: 'browns',
    image: '🍂',
    points: 10,
    description: 'Perfect carbon source for compost balance',
    tips: 'Shred large leaves for faster decomposition'
  },
  {
    id: 'cardboard',
    name: 'Plain Cardboard',
    category: 'browns',
    image: '📦',
    points: 15,
    description: 'Unbleached cardboard adds carbon',
    tips: 'Remove tape and staples, tear into pieces'
  },
  {
    id: 'newspaper',
    name: 'Newspaper',
    category: 'browns',
    image: '📰',
    points: 10,
    description: 'Black and white newspaper is compostable',
    tips: 'Shred to prevent matting'
  },
  {
    id: 'sawdust',
    name: 'Sawdust',
    category: 'browns',
    image: '🪚',
    points: 20,
    description: 'Fine carbon material, use sparingly',
    tips: 'Only use from untreated wood'
  },
  {
    id: 'paper-towels',
    name: 'Used Paper Towels',
    category: 'browns',
    image: '🧻',
    points: 10,
    description: 'Unbleached paper towels work well',
    tips: 'Ensure they\'re not contaminated with chemicals'
  },

  // Not Compostable
  {
    id: 'meat',
    name: 'Meat Scraps',
    category: 'not-compostable',
    image: '🥩',
    points: -15,
    description: 'Attracts pests and creates odors',
    tips: 'Never add to home compost bins'
  },
  {
    id: 'dairy',
    name: 'Dairy Products',
    category: 'not-compostable',
    image: '🧀',
    points: -15,
    description: 'Can attract rodents and smell bad',
    tips: 'Keep dairy out of compost piles'
  },
  {
    id: 'plastic',
    name: 'Plastic Bags',
    category: 'not-compostable',
    image: '🛍️',
    points: -20,
    description: 'Takes hundreds of years to decompose',
    tips: 'Recycle plastic separately'
  },
  {
    id: 'glass',
    name: 'Glass Bottles',
    category: 'not-compostable',
    image: '🍼',
    points: -20,
    description: 'Doesn\'t break down in compost',
    tips: 'Recycle glass at proper facilities'
  },
  {
    id: 'coated-paper',
    name: 'Glossy Magazine',
    category: 'not-compostable',
    image: '📖',
    points: -10,
    description: 'Coated paper has chemicals',
    tips: 'Recycle separately from compost'
  }
];

const CompostScavengerHunt = ({ onBack, userName = 'Player', onComplete }: CompostScavengerHuntProps) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [currentItems, setCurrentItems] = useState<CompostItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{[key: string]: 'greens' | 'browns' | 'not-compostable'}>({});
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [maxHints] = useState(3);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeRemaining > 0 && !gameCompleted) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !gameCompleted) {
      completeGame();
    }
    return () => clearTimeout(timer);
  }, [gameState, timeRemaining, gameCompleted]);

  const startGame = () => {
    // Select 12 random items (4 greens, 4 browns, 4 not-compostable)
    const greens = compostItems.filter(item => item.category === 'greens');
    const browns = compostItems.filter(item => item.category === 'browns');
    const notCompostable = compostItems.filter(item => item.category === 'not-compostable');

    const selectedGreens = greens.sort(() => Math.random() - 0.5).slice(0, 4);
    const selectedBrowns = browns.sort(() => Math.random() - 0.5).slice(0, 4);
    const selectedNotCompostable = notCompostable.sort(() => Math.random() - 0.5).slice(0, 4);

    const allSelected = [...selectedGreens, ...selectedBrowns, ...selectedNotCompostable]
      .sort(() => Math.random() - 0.5);

    setCurrentItems(allSelected);
    setGameState('playing');
    setScore(0);
    setSelectedItems({});
    setStartTime(Date.now());
    setTimeRemaining(300);
    setGameCompleted(false);
    setShowResults(false);
    setHintsUsed(0);
  };

  const selectCategory = (itemId: string, category: 'greens' | 'browns' | 'not-compostable') => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: category
    }));
  };

  const submitAnswers = () => {
    setShowResults(true);
    calculateScore();
  };

  const calculateScore = () => {
    let totalScore = 0;
    let correctAnswers = 0;

    currentItems.forEach(item => {
      const selectedCategory = selectedItems[item.id];
      if (selectedCategory === item.category) {
        totalScore += item.points;
        correctAnswers++;
      } else if (selectedCategory) {
        // Wrong answer penalty, but not as harsh as the negative points
        totalScore -= 5;
      }
    });

    // Bonus for speed
    const timeBonus = Math.max(0, Math.floor((300 - (300 - timeRemaining)) / 10));
    totalScore += timeBonus;

    // Penalty for hints
    totalScore -= hintsUsed * 10;

    setScore(Math.max(0, totalScore));
    setTimeout(() => completeGame(), 2000);
  };

  const completeGame = () => {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = currentItems.reduce((sum, item) => sum + Math.abs(item.points), 0) + 50; // Including max time bonus
    
    setGameCompleted(true);
    setGameState('completed');
    onComplete?.(score, maxScore, timeElapsed);
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setSelectedItems({});
    setCurrentItems([]);
    setShowResults(false);
  };

  const getHint = (item: CompostItem) => {
    if (hintsUsed < maxHints) {
      setHintsUsed(prev => prev + 1);
      return true;
    }
    return false;
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
                  <Search size={48} className="text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-green-800 mb-4">Compost Scavenger Hunt</CardTitle>
              <p className="text-green-700 text-lg">
                Find and sort compostable items! Learn to identify greens, browns, and items that don't belong in compost.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-4 text-center">
                  <Leaf className="text-green-600 mx-auto mb-2" size={32} />
                  <h4 className="text-green-800 mb-2">Greens</h4>
                  <p className="text-sm text-green-700">Nitrogen-rich materials like fruit peels, coffee grounds</p>
                </div>
                <div className="bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg p-4 text-center">
                  <div className="text-amber-600 mx-auto mb-2 text-2xl">🍂</div>
                  <h4 className="text-amber-800 mb-2">Browns</h4>
                  <p className="text-sm text-amber-700">Carbon-rich materials like dry leaves, cardboard</p>
                </div>
                <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-lg p-4 text-center">
                  <X className="text-red-600 mx-auto mb-2" size={32} />
                  <h4 className="text-red-800 mb-2">Not Compostable</h4>
                  <p className="text-sm text-red-700">Items that don't belong in home compost</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg p-6">
                <h4 className="text-emerald-800 mb-3">Game Rules:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-emerald-700">
                  <div>• 5 minutes to sort 12 different items</div>
                  <div>• Correct answers earn points</div>
                  <div>• Speed bonus for quick completion</div>
                  <div>• 3 hints available (with point penalty)</div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 text-lg"
                >
                  <Search size={20} className="mr-2" />
                  Start Hunt
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
              <Badge variant="outline" className={`text-lg px-3 py-1 ${timeRemaining < 60 ? 'text-red-700 border-red-300' : 'text-green-700'}`}>
                Time: {formatTime(timeRemaining)}
              </Badge>
              <Badge variant="outline" className="text-green-700">
                Score: {score}
              </Badge>
              <Badge variant="outline" className="text-blue-700">
                Hints: {maxHints - hintsUsed} left
              </Badge>
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-green-200 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="text-green-800 text-center">Sort These Items Into Categories</CardTitle>
              <Progress 
                value={(Object.keys(selectedItems).length / currentItems.length) * 100} 
                className="w-full"
              />
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {currentItems.map((item) => (
              <Card 
                key={item.id}
                className={`bg-white/90 backdrop-blur-sm border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                  selectedItems[item.id] === 'greens' ? 'border-green-400 bg-green-50' :
                  selectedItems[item.id] === 'browns' ? 'border-amber-400 bg-amber-50' :
                  selectedItems[item.id] === 'not-compostable' ? 'border-red-400 bg-red-50' :
                  'border-gray-200'
                }`}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{item.image}</div>
                  <h4 className="text-sm text-gray-800 mb-2">{item.name}</h4>
                  
                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`mb-2 p-1 rounded text-xs ${
                        selectedItems[item.id] === item.category
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedItems[item.id] === item.category ? '✓ Correct' : `✗ Should be: ${item.category}`}
                    </motion.div>
                  )}

                  {!showResults && (
                    <div className="space-y-2">
                      <div className="flex justify-center gap-1">
                        <Button
                          size="sm"
                          variant={selectedItems[item.id] === 'greens' ? 'default' : 'outline'}
                          className={`text-xs px-2 py-1 ${selectedItems[item.id] === 'greens' ? 'bg-green-500 hover:bg-green-600' : 'border-green-300 text-green-700 hover:bg-green-50'}`}
                          onClick={() => selectCategory(item.id, 'greens')}
                        >
                          Green
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedItems[item.id] === 'browns' ? 'default' : 'outline'}
                          className={`text-xs px-2 py-1 ${selectedItems[item.id] === 'browns' ? 'bg-amber-500 hover:bg-amber-600' : 'border-amber-300 text-amber-700 hover:bg-amber-50'}`}
                          onClick={() => selectCategory(item.id, 'browns')}
                        >
                          Brown
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant={selectedItems[item.id] === 'not-compostable' ? 'default' : 'outline'}
                        className={`text-xs px-2 py-1 w-full ${selectedItems[item.id] === 'not-compostable' ? 'bg-red-500 hover:bg-red-600' : 'border-red-300 text-red-700 hover:bg-red-50'}`}
                        onClick={() => selectCategory(item.id, 'not-compostable')}
                      >
                        Not Compostable
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs w-full text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          if (getHint(item)) {
                            alert(`Hint: ${item.tips}`);
                          }
                        }}
                        disabled={hintsUsed >= maxHints}
                      >
                        <Eye size={12} className="mr-1" />
                        Hint
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {!showResults && (
            <div className="text-center">
              <Button
                onClick={submitAnswers}
                disabled={Object.keys(selectedItems).length !== currentItems.length}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 text-lg"
              >
                Submit Answers
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    const correctAnswers = currentItems.filter(item => selectedItems[item.id] === item.category).length;
    const percentage = Math.round((correctAnswers / currentItems.length) * 100);
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
              <CardTitle className="text-3xl text-green-800 mb-2">Hunt Complete!</CardTitle>
              <p className="text-green-700">Great job learning about composting, {userName}!</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                    <div className="text-2xl text-green-800 mb-1">{score}</div>
                    <div className="text-green-600">Final Score</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4">
                    <div className="text-2xl text-blue-800 mb-1">{correctAnswers}/{currentItems.length}</div>
                    <div className="text-blue-600">Correct ({percentage}%)</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                    <div className="text-2xl text-purple-800 mb-1">{formatTime(300 - timeRemaining)}</div>
                    <div className="text-purple-600">Time Taken</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
                    <div className="text-2xl text-orange-800 mb-1">+{ecoPoints}</div>
                    <div className="text-orange-600">Eco Points Earned</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <h4 className="text-green-800 mb-3">Composting Tip:</h4>
                <p className="text-green-700">
                  The ideal compost mix is about 3 parts browns to 1 part greens. This ratio provides the right 
                  balance of carbon and nitrogen for healthy decomposition. Remember to turn your compost regularly 
                  and keep it moist but not soggy!
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8"
                >
                  <RotateCcw size={20} className="mr-2" />
                  Hunt Again
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

export default CompostScavengerHunt;