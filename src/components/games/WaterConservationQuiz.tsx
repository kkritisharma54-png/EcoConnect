import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle, X, Award, RotateCcw, Droplets } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface WaterConservationQuizProps {
  onComplete?: (score: number) => void;
  onBack: () => void;
  userName?: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

const WaterConservationQuiz = ({ onComplete, onBack, userName }: WaterConservationQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds total
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  const questions: Question[] = [
    {
      id: 1,
      question: "How much water does a typical 5-minute shower use?",
      options: ["25 liters", "50 liters", "75 liters", "100 liters"],
      correctAnswer: 2,
      explanation: "A typical shower uses about 15 liters per minute, so 5 minutes = 75 liters.",
      difficulty: "easy",
      points: 10
    },
    {
      id: 2,
      question: "Which method saves the most water when washing dishes?",
      options: ["Running water continuously", "Using a dishwasher when full", "Washing by hand with running water", "Using paper plates"],
      correctAnswer: 1,
      explanation: "A full dishwasher uses less water than hand washing dishes with running water.",
      difficulty: "medium",
      points: 15
    },
    {
      id: 3,
      question: "What percentage of Earth's water is freshwater suitable for drinking?",
      options: ["10%", "3%", "1%", "0.5%"],
      correctAnswer: 2,
      explanation: "Less than 1% of Earth's water is freshwater that's accessible for human use.",
      difficulty: "hard",
      points: 20
    },
    {
      id: 4,
      question: "How much water can a dripping tap waste per day?",
      options: ["1 liter", "5 liters", "10 liters", "20 liters"],
      correctAnswer: 3,
      explanation: "A tap that drips once per second can waste over 20 liters per day.",
      difficulty: "medium",
      points: 15
    },
    {
      id: 5,
      question: "Which activity uses the most water in an average household?",
      options: ["Cooking and drinking", "Bathroom activities", "Laundry", "Garden watering"],
      correctAnswer: 1,
      explanation: "Bathrooms account for about 60% of household water use (showers, toilets, sinks).",
      difficulty: "easy",
      points: 10
    },
    {
      id: 6,
      question: "How much water does it take to produce 1 kg of beef?",
      options: ["500 liters", "1,500 liters", "5,000 liters", "15,000 liters"],
      correctAnswer: 3,
      explanation: "It takes approximately 15,000 liters of water to produce 1 kg of beef due to feed production and processing.",
      difficulty: "hard",
      points: 20
    },
    {
      id: 7,
      question: "What's the most effective way to water plants?",
      options: ["Sprinkler in midday", "Drip irrigation in morning", "Hose watering in evening", "Overhead spraying anytime"],
      correctAnswer: 1,
      explanation: "Drip irrigation in the morning is most efficient, delivering water directly to roots with minimal evaporation.",
      difficulty: "medium",
      points: 15
    },
    {
      id: 8,
      question: "How much water can a low-flow toilet save per flush compared to older models?",
      options: ["2 liters", "4 liters", "6 liters", "10 liters"],
      correctAnswer: 2,
      explanation: "Modern low-flow toilets use about 6 liters per flush, compared to 12+ liters for older models.",
      difficulty: "easy",
      points: 10
    }
  ];

  const totalQuestions = questions.length;

  useEffect(() => {
    setAnsweredQuestions(new Array(totalQuestions).fill(false));
  }, [totalQuestions]);

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || currentQuestion >= totalQuestions) {
      setGameComplete(true);
      setTimeout(() => onComplete?.(score), 2000);
    }
  }, [timeLeft, gameComplete, currentQuestion, totalQuestions, score, onComplete]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Already answered
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 10); // Bonus for remaining time
      const totalPoints = questions[currentQuestion].points + timeBonus;
      setScore(prev => prev + totalPoints);
      setCorrectAnswers(prev => prev + 1);
    }

    // Mark question as answered
    setAnsweredQuestions(prev => {
      const newAnswered = [...prev];
      newAnswered[currentQuestion] = true;
      return newAnswered;
    });

    // Auto advance after 3 seconds
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
        setTimeout(() => onComplete?.(score), 1000);
      }
    }, 3000);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(90);
    setShowResult(false);
    setCorrectAnswers(0);
    setGameComplete(false);
    setAnsweredQuestions(new Array(totalQuestions).fill(false));
  };

  const getScoreGrade = () => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-600' };
    return { grade: 'D', color: 'text-red-600' };
  };

  const question = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Droplets size={24} />
                Water Conservation Quiz
              </CardTitle>
              <p className="text-blue-100 mt-1">Test your water conservation knowledge!</p>
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
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Quiz Header */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-blue-50">
                    <CardContent className="p-3 text-center">
                      <Clock className="text-blue-600 mx-auto mb-1" size={20} />
                      <div className="text-lg text-blue-600">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
                      <div className="text-xs text-blue-600">Time Left</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50">
                    <CardContent className="p-3 text-center">
                      <Award className="text-green-600 mx-auto mb-1" size={20} />
                      <div className="text-lg text-green-600">{score}</div>
                      <div className="text-xs text-green-600">Score</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50">
                    <CardContent className="p-3 text-center">
                      <CheckCircle className="text-purple-600 mx-auto mb-1" size={20} />
                      <div className="text-lg text-purple-600">{currentQuestion + 1}/{totalQuestions}</div>
                      <div className="text-xs text-purple-600">Question</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Quiz Progress</span>
                    <span>{currentQuestion + 1}/{totalQuestions}</span>
                  </div>
                  <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="h-2" />
                </div>

                {/* Question */}
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {question.difficulty} • {question.points} pts
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-4">{question.question}</h3>
                    
                    <div className="space-y-3">
                      {question.options.map((option, index) => (
                        <motion.button
                          key={index}
                          className={`w-full p-4 text-left rounded-lg transition-all ${
                            selectedAnswer === null 
                              ? 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300'
                              : selectedAnswer === index
                                ? index === question.correctAnswer
                                  ? 'bg-green-100 border-2 border-green-500 text-green-800'
                                  : 'bg-red-100 border-2 border-red-500 text-red-800'
                                : index === question.correctAnswer
                                  ? 'bg-green-100 border-2 border-green-500 text-green-800'
                                  : 'bg-gray-100 border-2 border-gray-300 text-gray-600'
                          }`}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={selectedAnswer !== null}
                          whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                          whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswer === null 
                                ? 'border-gray-300'
                                : selectedAnswer === index
                                  ? index === question.correctAnswer
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-red-500 bg-red-500'
                                  : index === question.correctAnswer
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300'
                            }`}>
                              {selectedAnswer !== null && (
                                selectedAnswer === index
                                  ? index === question.correctAnswer
                                    ? <CheckCircle size={16} className="text-white" />
                                    : <X size={16} className="text-white" />
                                  : index === question.correctAnswer
                                    ? <CheckCircle size={16} className="text-white" />
                                    : null
                              )}
                            </div>
                            <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                            <span>{option}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Explanation */}
                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500"
                      >
                        <h4 className="font-medium text-blue-800 mb-2">💡 Explanation:</h4>
                        <p className="text-blue-700 text-sm">{question.explanation}</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* Auto-advance notice */}
                {showResult && (
                  <div className="text-center text-sm text-gray-600">
                    {currentQuestion < totalQuestions - 1 ? 'Next question in 3 seconds...' : 'Quiz completing...'}
                  </div>
                )}
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
                  <h2 className="text-2xl font-bold text-gray-800">Quiz Complete!</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <Card className="bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className={`text-3xl ${getScoreGrade().color}`}>{getScoreGrade().grade}</div>
                        <div className="text-sm text-blue-600">Grade</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-green-600">{correctAnswers}/{totalQuestions}</div>
                        <div className="text-sm text-green-600">Correct</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-purple-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-purple-600">{score}</div>
                        <div className="text-sm text-purple-600">Total Score</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <h4 className="font-medium text-cyan-800 mb-2">🌊 Water Conservation Tips:</h4>
                    <ul className="text-sm text-cyan-700 text-left space-y-1">
                      <li>• Turn off tap while brushing teeth (saves 6L per minute)</li>
                      <li>• Fix leaks immediately to prevent waste</li>
                      <li>• Collect rainwater for garden watering</li>
                      <li>• Use water-efficient appliances and fixtures</li>
                      <li>• Take shorter showers (even 1 minute less saves 15L)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={resetGame} variant="outline">
                    <RotateCcw size={16} className="mr-2" />
                    Retake Quiz
                  </Button>
                  <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
                    <Award size={16} className="mr-2" />
                    Claim Points
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

export default WaterConservationQuiz;