import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useUser } from '@supabase/auth-helpers-react';
import { Button } from '../ui/button';
type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

const WaterConservationQuiz = ({
  onComplete,
  onExit, // ✅ New prop to handle Exit Quiz navigation
}: {
  onComplete?: (score: number) => void;
  onExit?: () => void;
}) => {
  const user = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const questions: Question[] = [
    {
      question: 'Which of the following helps conserve water at home?',
      options: [
        'Running tap while brushing',
        'Fixing leaks promptly',
        'Taking long showers',
        'Washing car daily',
      ],
      correctAnswer: 1,
      points: 10,
      difficulty: 'easy',
    },
    {
      question: 'What is the best time to water plants to reduce evaporation?',
      options: ['Noon', 'Evening', 'Early morning', 'Afternoon'],
      correctAnswer: 2,
      points: 10,
      difficulty: 'medium',
    },
    {
      question: 'What does rainwater harvesting primarily help with?',
      options: [
        'Increasing water bills',
        'Recharging groundwater levels',
        'Wasting more water',
        'Creating floods',
      ],
      correctAnswer: 1,
      points: 15,
      difficulty: 'medium',
    },
    {
      question: 'Which irrigation method uses the least water?',
      options: [
        'Flood irrigation',
        'Drip irrigation',
        'Sprinkler irrigation',
        'Manual watering',
      ],
      correctAnswer: 1,
      points: 20,
      difficulty: 'hard',
    },
  ];

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 && !gameComplete) handleNextQuestion();
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    const isCorrect = index === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + questions[currentQuestion].points);
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setTimeLeft(30);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameComplete(true);
      onComplete?.(score);

      if (user && score > 0) {
        const { error } = await supabase.from('eco_activity').insert([
          {
            user_id: user.id,
            activity_type: 'quiz',
            points: score,
            description: 'Completed Water Conservation Quiz',
          },
        ]);
        if (error) console.error('Failed to update points:', error.message);
      }
    }
  };

  const handleExitQuiz = () => {
    // Reset all quiz states
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCorrectAnswers(0);
    setTimeLeft(30);
    setGameComplete(false);

    // Navigate back to lessons section
    if (onExit) onExit();
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-emerald-50 dark:bg-gray-900">
        <h2 className="text-2xl text-emerald-800 dark:text-emerald-200 mb-4">Quiz Complete!</h2>
        <p className="text-emerald-700 dark:text-emerald-300 mb-4">
          You answered {correctAnswers} / {questions.length} correctly
        </p>
        <p className="text-emerald-600 dark:text-emerald-400 mb-6">Score: {score} pts</p>
        <Button onClick={handleExitQuiz} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Exit to Lessons
        </Button>
      </div>
    );
  }

  const current = questions[currentQuestion];

  return (
    <div className="min-h-screen p-4 flex flex-col justify-between bg-emerald-50 dark:bg-gray-900">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-emerald-800 dark:text-emerald-200">Water Conservation Quiz</h2>
          <Button
            variant="outline"
            onClick={handleExitQuiz}
            className="text-emerald-700 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-100 dark:hover:bg-gray-800"
          >
            Exit
          </Button>
        </div>
        <div className="mb-4">
          <p className="text-emerald-700 dark:text-emerald-300 mb-2">{current.question}</p>
          <div className="flex flex-col gap-2">
            {current.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? 'default' : 'outline'}
                onClick={() => handleAnswer(index)}
                className="text-emerald-700 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-100 dark:hover:bg-gray-800"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        {showResult && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
            {selectedAnswer === current.correctAnswer ? 'Correct ✅' : `Wrong ❌ (Answer: ${current.options[current.correctAnswer]})`}
          </p>
        )}
      </div>
      <div className="flex justify-end mt-4">
        {selectedAnswer !== null && !gameComplete && (
          <Button onClick={handleNextQuestion} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Next
          </Button>
        )}
      </div>
      <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">Time Left: {timeLeft}s</div>
    </div>
  );
};
export default WaterConservationQuiz;
