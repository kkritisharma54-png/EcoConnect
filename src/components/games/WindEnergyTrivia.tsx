import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Wind, Zap, Clock, Users, Trophy, ArrowLeft, RotateCcw, Award, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface WindEnergyTriviaProps {
  onBack: () => void;
  userName?: string;
  onComplete?: (score: number, maxScore: number, timeElapsed: number) => void;
}

interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  category: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
  avatar: string;
}

const triviaQuestions: TriviaQuestion[] = [
  {
    id: '1',
    question: 'What force drives wind turbines to generate electricity?',
    options: ['Solar energy', 'Wind energy', 'Water energy', 'Nuclear energy'],
    correctAnswer: 1,
    explanation: 'Wind turbines harness kinetic energy from moving air (wind) to rotate their blades and generate electricity.',
    difficulty: 'easy',
    points: 10,
    category: 'Basics'
  },
  {
    id: '2',
    question: 'What is the typical height of modern wind turbines?',
    options: ['50-80 meters', '80-120 meters', '120-200 meters', '200-300 meters'],
    correctAnswer: 2,
    explanation: 'Modern wind turbines are typically 120-200 meters tall to capture stronger, more consistent winds at higher altitudes.',
    difficulty: 'medium',
    points: 15,
    category: 'Technology'
  },
  {
    id: '3',
    question: 'Which country is the world\'s largest producer of wind energy?',
    options: ['United States', 'Germany', 'China', 'Denmark'],
    correctAnswer: 2,
    explanation: 'China leads the world in wind energy production, generating more than double the amount of any other country.',
    difficulty: 'medium',
    points: 15,
    category: 'Global Facts'
  },
  {
    id: '4',
    question: 'What is the minimum wind speed needed to start generating electricity?',
    options: ['5-7 mph', '7-10 mph', '10-15 mph', '15-20 mph'],
    correctAnswer: 1,
    explanation: 'Most wind turbines start generating electricity at wind speeds of 7-10 mph (cut-in speed).',
    difficulty: 'easy',
    points: 10,
    category: 'Technology'
  },
  {
    id: '5',
    question: 'What percentage of global electricity was generated from wind in 2023?',
    options: ['2-3%', '4-6%', '7-9%', '10-12%'],
    correctAnswer: 2,
    explanation: 'Wind energy provided approximately 7-9% of global electricity generation in 2023, and this percentage is growing rapidly.',
    difficulty: 'hard',
    points: 20,
    category: 'Statistics'
  },
  {
    id: '6',
    question: 'What environmental benefit does wind energy provide?',
    options: ['Reduces water usage', 'Zero carbon emissions during operation', 'Improves air quality', 'All of the above'],
    correctAnswer: 3,
    explanation: 'Wind energy provides all these benefits: it uses minimal water, produces no emissions during operation, and improves air quality.',
    difficulty: 'easy',
    points: 10,
    category: 'Environment'
  },
  {
    id: '7',
    question: 'What is the term for wind farms located in the ocean?',
    options: ['Marine wind', 'Offshore wind', 'Ocean wind', 'Coastal wind'],
    correctAnswer: 1,
    explanation: 'Offshore wind farms are built in bodies of water, typically on continental shelves, where winds are stronger and more consistent.',
    difficulty: 'easy',
    points: 10,
    category: 'Technology'
  },
  {
    id: '8',
    question: 'How long do wind turbine blades typically last?',
    options: ['10-15 years', '20-25 years', '30-35 years', '40-50 years'],
    correctAnswer: 1,
    explanation: 'Wind turbine blades typically last 20-25 years before needing replacement due to wear from constant rotation and weather exposure.',
    difficulty: 'medium',
    points: 15,
    category: 'Technology'
  },
  {
    id: '9',
    question: 'What happens when wind speeds are too high for safe operation?',
    options: ['Turbines spin faster', 'Turbines automatically shut down', 'Turbines generate more power', 'Nothing changes'],
    correctAnswer: 1,
    explanation: 'Turbines have a cut-out speed (usually 55-65 mph) where they automatically shut down to prevent damage from high winds.',
    difficulty: 'medium',
    points: 15,
    category: 'Safety'
  },
  {
    id: '10',
    question: 'Which component converts the rotational motion into electricity?',
    options: ['Rotor', 'Generator', 'Gearbox', 'Tower'],
    correctAnswer: 1,
    explanation: 'The generator converts the mechanical rotational energy from the turbine blades into electrical energy.',
    difficulty: 'easy',
    points: 10,
    category: 'Technology'
  }
];

const teams: Team[] = [
  { id: 'wind-warriors', name: 'Wind Warriors', color: 'blue', score: 0, avatar: '💨' },
  { id: 'energy-eagles', name: 'Energy Eagles', color: 'emerald', score: 0, avatar: '🦅' },
  { id: 'power-pioneers', name: 'Power Pioneers', color: 'purple', score: 0, avatar: '⚡' },
  { id: 'turbine-titans', name: 'Turbine Titans', color: 'orange', score: 0, avatar: '🌪️' }
];

const WindEnergyTrivia = ({ onBack, userName = 'Player', onComplete }: WindEnergyTriviaProps) => {
  const [gameState, setGameState] = useState<'menu' | 'team-select' | 'playing' | 'completed'>('menu');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [gameQuestions, setGameQuestions] = useState<TriviaQuestion[]>([]);
  const [teamScores, setTeamScores] = useState<{[key: string]: number}>({});
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeRemaining > 0 && !showAnswer) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !showAnswer) {
      handleTimeOut();
    }
    return () => clearTimeout(timer);
  }, [gameState, timeRemaining, showAnswer]);

  const startGame = () => {
    setGameState('team-select');
  };

  const selectTeam = (team: Team) => {
    setSelectedTeam(team);
    const shuffledQuestions = [...triviaQuestions].sort(() => Math.random() - 0.5).slice(0, 8);
    setGameQuestions(shuffledQuestions);
    setGameState('playing');
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setScore(0);
    setCorrectAnswers(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setTimeRemaining(30);
    setStreak(0);
    setMaxStreak(0);
    
    // Initialize team scores
    const initialScores: {[key: string]: number} = {};
    teams.forEach(t => {
      initialScores[t.id] = Math.floor(Math.random() * 50) + 20; // Random scores for other teams
    });
    initialScores[team.id] = 0; // Player starts at 0
    setTeamScores(initialScores);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showAnswer) return;
    
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    
    const question = gameQuestions[currentQuestion];
    const isCorrect = answerIndex === question.correctAnswer;
    const responseTime = Date.now() - questionStartTime;
    
    if (isCorrect) {
      // Calculate points based on difficulty and speed
      let points = question.points;
      const speedBonus = Math.max(0, Math.floor((30 - (responseTime / 1000)) / 5) * 2);
      const streakBonus = streak >= 3 ? Math.floor(points * 0.5) : 0;
      
      points += speedBonus + streakBonus;
      
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      
      // Update team score
      if (selectedTeam) {
        setTeamScores(prev => ({
          ...prev,
          [selectedTeam.id]: prev[selectedTeam.id] + points
        }));
      }
    } else {
      setStreak(0);
    }

    // Simulate other teams answering
    const otherTeams = teams.filter(t => t.id !== selectedTeam?.id);
    otherTeams.forEach(team => {
      const randomPoints = Math.floor(Math.random() * 15) + 5;
      setTeamScores(prev => ({
        ...prev,
        [team.id]: prev[team.id] + randomPoints
      }));
    });

    setTimeout(() => {
      if (currentQuestion < gameQuestions.length - 1) {
        nextQuestion();
      } else {
        completeGame();
      }
    }, 3000);
  };

  const handleTimeOut = () => {
    setShowAnswer(true);
    setStreak(0);
    
    setTimeout(() => {
      if (currentQuestion < gameQuestions.length - 1) {
        nextQuestion();
      } else {
        completeGame();
      }
    }, 2000);
  };

  const nextQuestion = () => {
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setTimeRemaining(30);
    setQuestionStartTime(Date.now());
  };

  const completeGame = () => {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = gameQuestions.reduce((sum, q) => sum + q.points, 0) + 80; // Including max speed bonus
    
    setGameState('completed');
    onComplete?.(score, maxScore, timeElapsed);
  };

  const resetGame = () => {
    setGameState('menu');
    setSelectedTeam(null);
    setScore(0);
    setCorrectAnswers(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setGameQuestions([]);
    setTeamScores({});
    setStreak(0);
    setMaxStreak(0);
  };

  const getCurrentTeamRanking = () => {
    if (!selectedTeam) return 1;
    
    const sortedTeams = Object.entries(teamScores)
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score);
    
    return sortedTeams.findIndex(team => team.id === selectedTeam.id) + 1;
  };

  if (gameState === 'menu') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full">
                  <Wind size={48} className="text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-blue-800 mb-4">Wind Energy Trivia Relay</CardTitle>
              <p className="text-blue-700 text-lg">
                Join a team and compete in an exciting trivia race about wind energy! Answer quickly and accurately to win.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-4 text-center">
                  <Clock className="text-blue-600 mx-auto mb-2" size={32} />
                  <h4 className="text-blue-800 mb-2">Speed Matters</h4>
                  <p className="text-sm text-blue-700">Quick correct answers earn bonus points</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg p-4 text-center">
                  <Users className="text-emerald-600 mx-auto mb-2" size={32} />
                  <h4 className="text-emerald-800 mb-2">Team Competition</h4>
                  <p className="text-sm text-emerald-700">Compete against other teams in real-time</p>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center">
                  <Trophy className="text-purple-600 mx-auto mb-2" size={32} />
                  <h4 className="text-purple-800 mb-2">Streak Bonuses</h4>
                  <p className="text-sm text-purple-700">Consecutive correct answers increase your score</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-6">
                <h4 className="text-blue-800 mb-3">How to Play:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>• Choose your team name and color</div>
                  <div>• Answer 8 wind energy questions</div>
                  <div>• 30 seconds per question</div>
                  <div>• Compete for the highest team score</div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg"
                >
                  <Users size={20} className="mr-2" />
                  Join the Relay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'team-select') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setGameState('menu')}
              className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-800 mb-2">Choose Your Team</CardTitle>
              <p className="text-blue-700">Select a team to represent in the wind energy trivia relay!</p>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teams.map((team) => (
              <Card 
                key={team.id}
                className={`bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                  team.color === 'blue' ? 'hover:border-blue-400' :
                  team.color === 'emerald' ? 'hover:border-emerald-400' :
                  team.color === 'purple' ? 'hover:border-purple-400' :
                  'hover:border-orange-400'
                }`}
                onClick={() => selectTeam(team)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{team.avatar}</div>
                  <h3 className={`text-xl mb-3 ${
                    team.color === 'blue' ? 'text-blue-800' :
                    team.color === 'emerald' ? 'text-emerald-800' :
                    team.color === 'purple' ? 'text-purple-800' :
                    'text-orange-800'
                  }`}>
                    {team.name}
                  </h3>
                  <Badge className={`mb-4 ${
                    team.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    team.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                    team.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    Ready to compete
                  </Badge>
                  <Button className={`w-full ${
                    team.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                    team.color === 'emerald' ? 'bg-emerald-500 hover:bg-emerald-600' :
                    team.color === 'purple' ? 'bg-purple-500 hover:bg-purple-600' :
                    'bg-orange-500 hover:bg-orange-600'
                  } text-white`}>
                    Join Team
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing' && selectedTeam && gameQuestions.length > 0) {
    const question = gameQuestions[currentQuestion];
    const currentRanking = getCurrentTeamRanking();

    return (
      <div className="relative min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-blue-700">
                Team: {selectedTeam.name} {selectedTeam.avatar}
              </Badge>
              <Badge variant="outline" className="text-blue-700">
                Rank: #{currentRanking}/4
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card className={`bg-white/90 backdrop-blur-sm border-${selectedTeam.color}-200`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-blue-800">{score}</div>
                <div className="text-xs text-blue-600">Your Score</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl ${timeRemaining <= 10 ? 'text-red-600' : 'text-orange-800'}`}>
                  {timeRemaining}s
                </div>
                <div className="text-xs text-orange-600">Time Left</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-purple-800">{streak}</div>
                <div className="text-xs text-purple-600">Current Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-green-800">{currentQuestion + 1}/8</div>
                <div className="text-xs text-green-600">Question</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="mb-2 bg-blue-100 text-blue-800">{question.category}</Badge>
                  <CardTitle className="text-blue-800">{question.question}</CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-600">Question {currentQuestion + 1}</div>
                  <Progress value={(currentQuestion / gameQuestions.length) * 100} className="w-32 mt-1" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showAnswer}
                    className={`p-4 text-left h-auto transition-all duration-300 ${
                      showAnswer
                        ? index === question.correctAnswer
                          ? 'bg-green-100 border-green-400 text-green-800 hover:bg-green-100'
                          : selectedAnswer === index
                          ? 'bg-red-100 border-red-400 text-red-800 hover:bg-red-100'
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                        : selectedAnswer === index
                        ? 'bg-blue-100 border-blue-400'
                        : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                    variant="outline"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        showAnswer && index === question.correctAnswer
                          ? 'bg-green-500 text-white'
                          : showAnswer && selectedAnswer === index && index !== question.correctAnswer
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{option}</span>
                      {showAnswer && index === question.correctAnswer && (
                        <Check className="text-green-600" size={20} />
                      )}
                      {showAnswer && selectedAnswer === index && index !== question.correctAnswer && (
                        <X className="text-red-600" size={20} />
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200"
                >
                  <h4 className="text-blue-800 mb-2">💡 Explanation:</h4>
                  <p className="text-blue-700">{question.explanation}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Live Leaderboard */}
          <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 text-center">Live Team Standings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {teams.map((team, index) => (
                  <div 
                    key={team.id}
                    className={`p-3 rounded-lg text-center ${
                      team.id === selectedTeam.id 
                        ? 'bg-blue-100 border-2 border-blue-400' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{team.avatar}</div>
                    <div className="text-sm text-gray-700 mb-1">{team.name}</div>
                    <div className={`text-lg ${team.id === selectedTeam.id ? 'text-blue-800' : 'text-gray-800'}`}>
                      {teamScores[team.id] || 0}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'completed' && selectedTeam) {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = gameQuestions.reduce((sum, q) => sum + q.points, 0) + 80;
    const percentage = Math.round((correctAnswers / gameQuestions.length) * 100);
    const finalRanking = getCurrentTeamRanking();
    const ecoPoints = Math.floor(score / 2);

    return (
      <div className="relative min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <div className={`p-4 rounded-full ${
                  finalRanking === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                  finalRanking === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  finalRanking === 3 ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                  'bg-gradient-to-br from-blue-400 to-cyan-500'
                }`}>
                  {finalRanking === 1 ? <Trophy size={48} className="text-white" /> : <Award size={48} className="text-white" />}
                </div>
              </motion.div>
              <CardTitle className="text-3xl text-blue-800 mb-2">
                Relay Complete! Team {selectedTeam.name} finishes #{finalRanking}!
              </CardTitle>
              <p className="text-blue-700">
                {finalRanking === 1 ? 'Congratulations! Your team won the relay!' :
                 finalRanking === 2 ? 'Great job! Second place finish!' :
                 finalRanking === 3 ? 'Well done! Third place finish!' :
                 'Good effort! Keep learning about wind energy!'}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4">
                    <div className="text-2xl text-blue-800 mb-1">{score}</div>
                    <div className="text-blue-600">Final Score</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                    <div className="text-2xl text-green-800 mb-1">{correctAnswers}/{gameQuestions.length}</div>
                    <div className="text-green-600">Correct ({percentage}%)</div>
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

              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6">
                <h4 className="text-blue-800 mb-3">Wind Energy Fact:</h4>
                <p className="text-blue-700">
                  Wind energy is one of the fastest-growing renewable energy sources worldwide! Modern wind turbines 
                  can power hundreds of homes each, and wind farms can generate electricity for entire cities. 
                  The wind industry also creates jobs in manufacturing, installation, and maintenance.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8"
                >
                  <RotateCcw size={20} className="mr-2" />
                  Play Again
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8"
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

export default WindEnergyTrivia;