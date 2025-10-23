import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Sun, Zap, Check, X, Lightbulb, Award, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface SolarWordGameProps {
  onBack: () => void;
  userName?: string;
  onComplete?: (score: number, maxScore: number, timeElapsed: number) => void;
}

interface WordClue {
  word: string;
  clue: string;
  category: 'basic' | 'intermediate' | 'advanced';
  points: number;
}

const wordDatabase: WordClue[] = [
  // Basic Level
  { word: 'SOLAR', clue: 'Energy from the sun', category: 'basic', points: 10 },
  { word: 'PANEL', clue: 'Flat surface that captures sunlight', category: 'basic', points: 10 },
  { word: 'BATTERY', clue: 'Device that stores energy', category: 'basic', points: 15 },
  { word: 'ENERGY', clue: 'Power to do work', category: 'basic', points: 10 },
  { word: 'LIGHT', clue: 'Visible radiation from the sun', category: 'basic', points: 10 },
  
  // Intermediate Level
  { word: 'PHOTOVOLTAIC', clue: 'Technology that converts light to electricity', category: 'intermediate', points: 25 },
  { word: 'INVERTER', clue: 'Device that converts DC to AC power', category: 'intermediate', points: 20 },
  { word: 'SILICON', clue: 'Main material in solar cells', category: 'intermediate', points: 20 },
  { word: 'WATT', clue: 'Unit of electrical power', category: 'intermediate', points: 15 },
  { word: 'GRID', clue: 'Network that distributes electricity', category: 'intermediate', points: 15 },
  
  // Advanced Level
  { word: 'SEMICONDUCTOR', clue: 'Material with electrical conductivity between conductor and insulator', category: 'advanced', points: 30 },
  { word: 'EFFICIENCY', clue: 'Ratio of useful output to total input', category: 'advanced', points: 25 },
  { word: 'IRRADIANCE', clue: 'Power of solar radiation per unit area', category: 'advanced', points: 35 },
  { word: 'CRYSTALLINE', clue: 'Type of silicon solar cell structure', category: 'advanced', points: 30 },
  { word: 'MAXIMUM POWER POINT', clue: 'Optimal operating point of a solar panel', category: 'advanced', points: 40 }
];

const SolarWordGame = ({ onBack, userName = 'Player', onComplete }: SolarWordGameProps) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [currentLevel, setCurrentLevel] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [hints, setHints] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [currentWords, setCurrentWords] = useState<WordClue[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    if (gameState === 'playing') {
      const levelWords = wordDatabase.filter(w => w.category === currentLevel);
      const shuffled = [...levelWords].sort(() => Math.random() - 0.5);
      setCurrentWords(shuffled.slice(0, 5)); // 5 words per level
      setCurrentWordIndex(0);
      setStartTime(Date.now());
    }
  }, [gameState, currentLevel]);

  const startGame = (level: 'basic' | 'intermediate' | 'advanced') => {
    setCurrentLevel(level);
    setGameState('playing');
    setScore(0);
    setCorrectAnswers(0);
    setHints(3);
    setStreak(0);
    setMaxStreak(0);
    setUserAnswer('');
    setShowHint(false);
    setFeedback({ type: null, message: '' });
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;

    const currentWord = currentWords[currentWordIndex];
    const isCorrect = userAnswer.toUpperCase().trim() === currentWord.word.toUpperCase();

    if (isCorrect) {
      const points = currentWord.points + (streak >= 3 ? Math.floor(currentWord.points * 0.5) : 0);
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      setFeedback({ 
        type: 'correct', 
        message: `Correct! +${points} points${streak >= 2 ? ' (Streak bonus!)' : ''}` 
      });
    } else {
      setStreak(0);
      setFeedback({ 
        type: 'incorrect', 
        message: `Incorrect. The answer was: ${currentWord.word}` 
      });
    }

    setTimeout(() => {
      if (currentWordIndex < currentWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setUserAnswer('');
        setShowHint(false);
        setFeedback({ type: null, message: '' });
      } else {
        completeGame();
      }
    }, 2000);
  };

  const useHint = () => {
    if (hints > 0) {
      setHints(prev => prev - 1);
      setShowHint(true);
    }
  };

  const completeGame = () => {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = currentWords.reduce((sum, word) => sum + word.points, 0);
    
    setGameState('completed');
    onComplete?.(score, maxScore, timeElapsed);
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setCorrectAnswers(0);
    setCurrentWordIndex(0);
    setUserAnswer('');
    setShowHint(false);
    setFeedback({ type: null, message: '' });
  };

  const currentWord = currentWords[currentWordIndex];

  if (gameState === 'menu') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-orange-700 hover:text-orange-800 hover:bg-orange-50"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                  <Sun size={48} className="text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-orange-800 mb-4">Solar Energy Word Game</CardTitle>
              <p className="text-orange-700 text-lg">
                Test your solar energy vocabulary! Guess words based on clues and learn about solar technology.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-green-200 hover:border-green-400"
                  onClick={() => startGame('basic')}
                >
                  <CardContent className="p-6 text-center">
                    <Lightbulb className="text-green-600 mx-auto mb-3" size={32} />
                    <h3 className="text-lg text-green-800 mb-2">Basic Level</h3>
                    <p className="text-sm text-green-600 mb-3">Simple solar terms</p>
                    <Badge className="bg-green-100 text-green-800">5 Words • 10-15 pts each</Badge>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-yellow-200 hover:border-yellow-400"
                  onClick={() => startGame('intermediate')}
                >
                  <CardContent className="p-6 text-center">
                    <Zap className="text-yellow-600 mx-auto mb-3" size={32} />
                    <h3 className="text-lg text-yellow-800 mb-2">Intermediate Level</h3>
                    <p className="text-sm text-yellow-600 mb-3">Technical solar terms</p>
                    <Badge className="bg-yellow-100 text-yellow-800">5 Words • 15-25 pts each</Badge>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-red-200 hover:border-red-400"
                  onClick={() => startGame('advanced')}
                >
                  <CardContent className="p-6 text-center">
                    <Sun className="text-red-600 mx-auto mb-3" size={32} />
                    <h3 className="text-lg text-red-800 mb-2">Advanced Level</h3>
                    <p className="text-sm text-red-600 mb-3">Expert solar terminology</p>
                    <Badge className="bg-red-100 text-red-800">5 Words • 25-40 pts each</Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-6">
                <h4 className="text-orange-800 mb-3">Game Features:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-orange-700">
                  <div>• 3 difficulty levels with increasing complexity</div>
                  <div>• Hint system to help you learn</div>
                  <div>• Streak bonuses for consecutive correct answers</div>
                  <div>• Educational clues that teach solar concepts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'playing' && currentWord) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
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
                Level: {currentLevel}
              </Badge>
              <Badge variant="outline" className="text-orange-700">
                Question {currentWordIndex + 1}/{currentWords.length}
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white/90 backdrop-blur-sm border-yellow-200">
              <CardContent className="p-4 text-center">
                <Award className="text-yellow-600 mx-auto mb-2" size={24} />
                <div className="text-2xl text-yellow-800">{score}</div>
                <div className="text-xs text-yellow-600">Score</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
              <CardContent className="p-4 text-center">
                <Zap className="text-orange-600 mx-auto mb-2" size={24} />
                <div className="text-2xl text-orange-800">{streak}</div>
                <div className="text-xs text-orange-600">Current Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-red-200">
              <CardContent className="p-4 text-center">
                <Lightbulb className="text-red-600 mx-auto mb-2" size={24} />
                <div className="text-2xl text-red-800">{hints}</div>
                <div className="text-xs text-red-600">Hints Left</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-orange-200 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-orange-800">Solar Word Challenge</CardTitle>
                <Progress 
                  value={(currentWordIndex / currentWords.length) * 100} 
                  className="w-32"
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6 mb-6">
                  <h3 className="text-xl text-orange-800 mb-3">Clue:</h3>
                  <p className="text-lg text-orange-700">{currentWord.clue}</p>
                  <Badge className="mt-3 bg-orange-100 text-orange-800">
                    {currentWord.points} points
                  </Badge>
                </div>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
                  >
                    <h4 className="text-blue-800 mb-2">💡 Hint:</h4>
                    <p className="text-blue-700">
                      The word has {currentWord.word.length} letters: 
                      {currentWord.word.split('').map((letter, i) => 
                        i < 2 ? ` ${letter}` : ' _'
                      ).join('')}
                    </p>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                    className="w-full p-4 text-lg text-center border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                  />

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={submitAnswer}
                      disabled={!userAnswer.trim()}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8"
                    >
                      Submit Answer
                    </Button>
                    <Button
                      onClick={useHint}
                      disabled={hints === 0 || showHint}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Use Hint ({hints})
                    </Button>
                  </div>
                </div>

                {feedback.type && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mt-6 p-4 rounded-lg ${
                      feedback.type === 'correct' 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {feedback.type === 'correct' ? (
                        <Check size={20} className="text-green-600" />
                      ) : (
                        <X size={20} className="text-red-600" />
                      )}
                      <span>{feedback.message}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    const maxScore = currentWords.reduce((sum, word) => sum + word.points, 0);
    const percentage = Math.round((score / maxScore) * 100);
    const ecoPoints = Math.floor(score / 10);

    return (
      <div className="relative min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border-orange-200 shadow-xl">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                  <Award size={48} className="text-white" />
                </div>
              </motion.div>
              <CardTitle className="text-3xl text-orange-800 mb-2">Game Complete!</CardTitle>
              <p className="text-orange-700">Great job learning solar energy terms, {userName}!</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                    <div className="text-2xl text-green-800 mb-1">{score}/{maxScore}</div>
                    <div className="text-green-600">Final Score ({percentage}%)</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4">
                    <div className="text-2xl text-blue-800 mb-1">{correctAnswers}/{currentWords.length}</div>
                    <div className="text-blue-600">Correct Answers</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                    <div className="text-2xl text-purple-800 mb-1">{maxStreak}</div>
                    <div className="text-purple-600">Best Streak</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
                    <div className="text-2xl text-orange-800 mb-1">+{ecoPoints}</div>
                    <div className="text-orange-600">Eco Points Earned</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
                <h4 className="text-orange-800 mb-3">Did You Know?</h4>
                <p className="text-orange-700">
                  Solar energy vocabulary is essential for understanding renewable energy systems. 
                  The more we know about solar terminology, the better we can communicate about clean energy solutions!
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8"
                >
                  <RotateCcw size={20} className="mr-2" />
                  Play Again
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8"
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

export default SolarWordGame;