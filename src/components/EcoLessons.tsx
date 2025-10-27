import { motion } from 'motion/react';
import { useState, useEffect, useCallback, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { 
  Leaf, 
  Droplets, 
  Zap, 
  Recycle, 
  TreePine, 
  ArrowLeft, 
  Search,
  Star,
  Play,
  Clock,
  Award,
  CheckCircle,
  BookOpen,
  Users,
  ChevronRight,
  Sun,
  Wind,
  Flower,
  Bot,
  Gamepad2,
  Target,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ThemeToggle from './ThemeToggle';
import { supabase } from '../supabaseClient';

// Import all game components
import WaterUsageSimulator from './games/WaterUsageSimulator';
import LeakDetectionPuzzle from './games/LeakDetectionPuzzle';
import WaterConservationQuiz from './games/WaterConservationQuiz';
import SolarPuzzles from './games/SolarPuzzles';
import SolarWordGame from './games/SolarWordGame';
import CompostJarProject from './games/CompostJarProject';
import CompostScavengerHunt from './games/CompostScavengerHunt';
import EndangeredSpeciesMemory from './games/EndangeredSpeciesMemory';
import HabitatExplorer from './games/HabitatExplorer';
import WindEnergyTrivia from './games/WindEnergyTrivia';
import WindTurbineBuild from './games/WindTurbineBuild';
import SeedBombToss from './games/SeedBombToss';
import TrashTagChallenge from './games/TrashTagChallenge';

interface EcoLessonsProps {
  onBack: () => void;
  userName: string;
  onNavigateToAI: (lessonData: any) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

const EcoLessons = ({
  onBack, userName, onNavigateToAI, isDarkTheme, onToggleTheme
}: EcoLessonsProps) => {
  const [showFloatingElements, setShowFloatingElements] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<any|null>(null);
  const [ecoPoints, setEcoPoints] = useState(0);
  // Fetch eco points from eco_activity table
const fetchPoints = useCallback(async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data, error } = await supabase
    .from('eco_activity')
    .select('points')
    .eq('user_id', user.id);
  if (!error && data) {
    const totalPoints = data.reduce((sum, row) => sum + (row.points || 0), 0);
    setEcoPoints(totalPoints);
  } else {
    setEcoPoints(0);
  }
}, []);
  useEffect(() => { fetchPoints(); }, [fetchPoints]);
  useEffect(() => {
    const timer = setTimeout(() => setShowFloatingElements(true), 300);
    return () => clearTimeout(timer);
  }, []);
  const categories = [
    { id: 'water', name: 'Water', icon: Droplets, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 'energy', name: 'Energy', icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { id: 'waste', name: 'Waste', icon: Recycle, color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'nature', name: 'Nature', icon: TreePine, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  ];
    const lessons = [
    {
      id: 1,
      title: 'Water Conservation Basics',
      description: 'Learn fundamental techniques to save water in daily life',
      category: 'water',
      difficulty: 'beginner',
      duration: '15 min',
      points: 50,
      progress: 100,
      status: 'completed',
      rating: 4.8,
      students: 1250,
      image: 'https://images.unsplash.com/photo-1666413767635-78c79a06b4db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGNvbnNlcnZhdGlvbiUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTcxNjMzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      topics: ['Household water saving', 'Leak detection', 'Greywater systems'],
      learningLink: 'https://byjus.com/chemistry/water-management/',
      activities: [
        {
          id: 'water-sim',
          title: 'Water Usage Simulator Game',
          description: 'Simulate your household water usage and make conservation choices to see how much water you can save and reduce waste.',
          type: 'simulator',
          points: 25,
          icon: 'Droplets'
        },
        {
          id: 'leak-puzzle',
          title: 'Leak Detection Puzzle',
          description: 'Find and fix leaks in a virtual household. Each leak you discover and repair earns you points!',
          type: 'puzzle',
          points: 20,
          icon: 'Search'
        },
        {
          id: 'water-quiz',
          title: 'Quick Quiz on Water Conservation',
          description: 'Timed quiz with interesting water facts and water saving tips, with immediate feedback on your answers.',
          type: 'quiz',
          points: 15,
          icon: 'Clock'
        }
      ]
    },
    {
      id: 2,
      title: 'Solar Energy Fundamentals',
      description: 'Understanding how solar power works and its benefits',
      category: 'energy',
      difficulty: 'intermediate',
      duration: '25 min',
      points: 100,
      progress: 60,
      status: 'in-progress',
      rating: 4.9,
      students: 980,
      image: 'https://images.unsplash.com/photo-1655300256486-4ec7251bf84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NTcwNzAzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      topics: ['Photovoltaic cells', 'Energy storage', 'Grid connection'],
      learningLink: 'https://www.udemy.com/course/understanding-solar/?utm_source=adwords&utm_medium=udemyads&utm_campaign=Search_Keyword_Beta_Prof_la.DE_cc.ROW-German&campaigntype=Search&portfolio=ROW-German&language=DE&product=Course&test=&audience=Keyword&topic=SolarEnergy&priority=Beta&utm_content=deal4584&utm_term=._ag_168594845001.ad_706257671995.kw_solarenergie+ausbildung.de_c.dm._pl._ti_kwd-1928346736483.li_1007820.pd.&matchtype=b&gad_source=1&gad_campaignid=21485730605&gbraid=0AAAAADROdO2Tw3ooou-Hxjgn170GrzPRR&gclid=Cj0KCQjw8p7GBhCjARIsAEhghZ2MflEdpis9t-qbCrPxmCAVz1RCofCSF4kVoXMKd9l4XbDITyOH2AwaAsxeEALw_wcB&couponCode=PMNVD2025',
      activities: [
        {
          id: 'solar-puzzles',
          title: 'Power Puzzles: Solar Edition',
          description: 'Puzzle games where players understand solar panel placement, shading effects, angles, and weather conditions for optimal energy use through critical thinking.',
          type: 'puzzle',
          points: 30,
          icon: 'Sun'
        },
        {
          id: 'solar-word-game',
          title: 'Solar Energy Word Game',
          description: 'Interactive word games that teach tricky solar energy terms in a gamified way with progress tracking, suitable for both beginners and advanced learners.',
          type: 'word-game',
          points: 25,
          icon: 'Zap'
        }
      ]
    },
    {
      id: 3,
      title: 'Composting Made Simple',
      description: 'Turn your kitchen waste into nutrient-rich soil',
      category: 'waste',
      difficulty: 'beginner',
      duration: '20 min',
      points: 75,
      progress: 0,
      status: 'not-started',
      rating: 4.7,
      students: 1450,
      image: 'https://images.unsplash.com/photo-1716903282677-3a1b5c936b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wb3N0aW5nJTIwb3JnYW5pYyUyMHdhc3RlfGVufDF8fHx8MTc1Nzk3MTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      topics: ['Composting basics', 'What to compost', 'Troubleshooting'],
      learningLink: 'https://share.google/9qJHwZNp8kvkUptbc',
      activities: [
        {
          id: 'compost-jar',
          title: 'DIY Compost Jar Project',
          description: 'Create a simple compost jar and add kitchen scraps to it. Watch and understand different stages of decomposition through hands-on learning.',
          type: 'diy-project',
          points: 35,
          icon: 'Recycle'
        },
        {
          id: 'compost-hunt',
          title: 'Compost Scavenger Hunt',
          description: 'Encourage children to find compostable items around them, separating greens and browns. This develops practical understanding and connection with nature.',
          type: 'scavenger-hunt',
          points: 20,
          icon: 'Search'
        }
      ]
    },
    {
      id: 4,
      title: 'Biodiversity Conservation',
      description: 'Protecting ecosystems and wildlife habitats',
      category: 'nature',
      difficulty: 'advanced',
      duration: '35 min',
      points: 150,
      progress: 25,
      status: 'in-progress',
      rating: 4.9,
      students: 750,
      image: 'https://images.unsplash.com/photo-1708689501358-07eaa62d9bf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9kaXZlcnNpdHklMjBjb25zZXJ2YXRpb24lMjB3aWxkbGlmZXxlbnwxfHx8fDE3NTgwNDUyNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      topics: ['Ecosystem balance', 'Species protection', 'Habitat restoration'],
      learningLink: 'https://www.vedantu.com/biology/conservation-of-biodiversity',
      activities: [
        {
          id: 'species-memory',
          title: 'Endangered Species Memory Game',
          description: 'Card matching game where you identify endangered species and their habitats. Each correct match earns points and displays conservation facts about the species.',
          type: 'memory-game',
          points: 40,
          icon: 'TreePine'
        },
        {
          id: 'habitat-explorer',
          title: 'Interactive Habitat Explorer (AR/VR)',
          description: 'Explore virtual forests, wetlands, or coral reefs showing real threats like deforestation and pollution. Users can suggest and implement solutions.',
          type: 'ar-vr',
          points: 50,
          icon: 'Leaf'
        }
      ]
    },
    {
      id: 5,
      title: 'Wind Energy Systems',
      description: 'Exploring wind power technology and applications',
      category: 'energy',
      difficulty: 'intermediate',
      duration: '30 min',
      points: 120,
      progress: 0,
      status: 'not-started',
      rating: 4.6,
      students: 680,
      image: 'https://images.unsplash.com/photo-1629167429667-d3e37d72cf80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kJTIwZW5lcmd5JTIwdHVyYmluZXN8ZW58MXx8fHwxNzU4MDQ1MjUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      topics: ['Wind turbines', 'Wind patterns', 'Offshore wind'],
      learningLink: 'https://www.herofutureenergies.com/blog/wind-energy-systems/',
      activities: [
        {
          id: 'wind-trivia',
          title: 'Wind Energy Trivia Relay',
          description: 'Team relay race with wind energy questions. The team that answers fastest and most accurately wins! Combines physical activity with mental quiz.',
          type: 'trivia-relay',
          points: 35,
          icon: 'Wind'
        },
        {
          id: 'wind-turbine-build',
          title: 'Build Your Own Wind Turbine',
          description: 'STEM activity where users build small wind turbines using LEGO or paper clips and measure electricity generation. Develops hands-on engineering understanding.',
          type: 'stem-build',
          points: 40,
          icon: 'Target'
        }
      ]
    },
    {
      id: 6,
      title: 'Zero Waste Lifestyle',
      description: 'Strategies to minimize waste in everyday life',
      category: 'waste',
      difficulty: 'advanced',
      duration: '40 min',
      points: 180,
      progress: 0,
      status: 'not-started',
      rating: 4.8,
      students: 920,
      image: 'https://images.unsplash.com/flagged/photo-1665250398268-4fc494b0dfd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6ZXJvJTIwd2FzdGUlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzU3OTYyNjY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      topics: ['Reduce, reuse, recycle', 'Sustainable shopping', 'DIY alternatives'],
      learningLink: 'https://onetreeplanted.org/blogs/stories/how-to-reduce-waste?srsltid=AfmBOoq-0ebRDScT3ePG7QUX7RWFAyNjJ11fwINmPRhpxTv7YhYW_PfD',
      activities: [
        {
          id: 'seed-bomb-toss',
          title: 'Seed Bomb Toss Game',
          description: 'Players toss seed bombs (soil + seeds) into target zones to plant nature and improve biodiversity. Fun sustainability game for both outdoor and indoor play.',
          type: 'toss-game',
          points: 30,
          icon: 'TreePine'
        },
        {
          id: 'trash-tag-challenge',
          title: 'Trash Tag Challenge',
          description: 'Teams compete to clean up local areas within a time limit, using bags and gloves to collect and properly sort trash. Builds environmental awareness through competition and teamwork.',
          type: 'cleanup-challenge',
          points: 45,
          icon: 'Recycle'
        }
      ]
    }
  ];
  // Filtering logic
  const filteredLessons = lessons.filter((lesson: { category: string; difficulty: string; title: string; description: string; }) => {
    const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  // Stats
  const completedLessons = lessons.filter((l: { status: string; }) => l.status === 'completed').length;
  const inProgressLessons = lessons.filter((l: { status: string; }) => l.status === 'in-progress').length;

  const floatingElements = [
    { Icon: Leaf, position: { top: '8%', left: '3%' } },
    { Icon: TreePine, position: { top: '12%', right: '5%' } },
    { Icon: Droplets, position: { top: '45%', left: '2%' } },
    { Icon: Sun, position: { top: '55%', right: '3%' } },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-600" size={20} />;
      case 'in-progress': return <Play className="text-blue-600" size={20} />;
      case 'not-started': return <BookOpen className="text-slate-600" size={20} />;
      default: return <BookOpen className="text-slate-600" size={20} />;
    }
  };

  const handleActivityClick = (activity: any, lessonTitle: string) => {
    setSelectedActivity({ ...activity, lessonTitle });
  };

  // === Game Launch Handler with Points Refresh Callback Pattern ===
  if (selectedActivity) {
  const handleGameBack = () => {
    setSelectedActivity(null);
    fetchPoints(); // Always refresh after a game closes
  };

  // Helper to add points for the logged-in user
  const addPointsForUser = async (points: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('eco_activity')
      .insert([{ user_id: user.id, points,active_date: new Date().toISOString() }]);

    if (error) console.error('Error adding points:', error.message);
    else fetchPoints();
  };

  // All games get these common props
  const commonProps = { onBack: handleGameBack, userName, onPointsUpdated: fetchPoints, addPointsForUser };

  switch (selectedActivity.id) {
    case 'water-sim':
      return <WaterUsageSimulator onComplete={addPointsForUser} {...commonProps} />;
    case 'leak-puzzle':
      return <LeakDetectionPuzzle onComplete={addPointsForUser} {...commonProps} />;
    case 'water-quiz':
      return <WaterConservationQuiz
        onComplete={addPointsForUser}
        onExit={handleGameBack}
      />;
    case 'solar-puzzles':
      return <SolarPuzzles onComplete={addPointsForUser} {...commonProps} />;
    case 'solar-word-game':
      return <SolarWordGame onComplete={addPointsForUser} {...commonProps} />;
    case 'compost-jar':
      return <CompostJarProject onComplete={addPointsForUser} {...commonProps} />;
    case 'compost-hunt':
      return <CompostScavengerHunt onComplete={addPointsForUser} {...commonProps} />;
    case 'species-memory':
      return <EndangeredSpeciesMemory onComplete={addPointsForUser} {...commonProps} />;
    case 'habitat-explorer':
      return <HabitatExplorer onComplete={addPointsForUser} {...commonProps} />;
    case 'wind-trivia':
      return <WindEnergyTrivia onComplete={addPointsForUser} {...commonProps} />;
    case 'wind-turbine-build':
      return <WindTurbineBuild onComplete={addPointsForUser} {...commonProps} />;
    case 'seed-bomb-toss':
      return <SeedBombToss onComplete={addPointsForUser} {...commonProps} />;
    case 'trash-tag-challenge':
      return <TrashTagChallenge onComplete={addPointsForUser} {...commonProps} />;
    default:
      return (
        <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4">
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                onClick={handleGameBack}
                className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
              >
                <ArrowLeft size={20} className="mr-2" /> Back
              </Button>
            </div>
            <Card className="bg-white/90 backdrop-blur-sm border-emerald-200 shadow-xl">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl text-emerald-800 mb-4">{selectedActivity.title}</h2>
                <p className="text-emerald-700 mb-6">{selectedActivity.description}</p>
                <p className="text-orange-600">This game is coming soon! 🚀</p>
              </CardContent>
            </Card>
          </div>
        </div>
      );
  }
}

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors duration-300">
      {/* Environmental Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1696250863507-262618217c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlcyUyMGdyZWVuJTIwbmF0dXJlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTcxNjI4MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Forest background"
          className="w-full h-full object-cover opacity-5"
        />
      </div>
      {/* Floating Nature Elements */}
      {showFloatingElements && floatingElements.map(({ Icon, position }, index) => (
        <div
          key={index}
          className="absolute text-emerald-600/20 dark:text-emerald-400/20 pointer-events-none hidden lg:block"
          style={position}
        >
          <Icon size={24} />
        </div>
      ))}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/50"
            >
              <ArrowLeft size={20} />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <BookOpen className="text-emerald-600 dark:text-emerald-400" size={32} />
              <div>
                <h1 className="text-emerald-800 dark:text-emerald-200 mb-0">Interactive Lessons</h1>
                <p className="text-emerald-700 dark:text-emerald-300">Learn sustainable practices at your own pace</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle
              isDark={isDarkTheme}
              onToggle={onToggleTheme}
            />
          </div>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <CheckCircle className="text-green-600 dark:text-green-400 mx-auto mb-2" size={24} />
              <div className="text-xl text-slate-800 dark:text-gray-200">{completedLessons}</div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <Play className="text-blue-600 dark:text-blue-400 mx-auto mb-2" size={24} />
              <div className="text-xl text-slate-800 dark:text-gray-200">{inProgressLessons}</div>
              <div className="text-sm text-slate-600 dark:text-gray-400">In Progress</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <Award className="text-yellow-600 dark:text-yellow-400 mx-auto mb-2" size={24} />
              <div className="text-xl text-slate-800 dark:text-gray-200">{ecoPoints}</div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Points Earned</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <BookOpen className="text-emerald-600 dark:text-emerald-400 mx-auto mb-2" size={24} />
              <div className="text-xl text-slate-800 dark:text-gray-200">{lessons.length}</div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Total Lessons</div>
            </CardContent>
          </Card>
        </div>
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-500" size={20} />
              <Input
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-emerald-200 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 bg-white dark:bg-gray-800"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 border-emerald-200 dark:border-gray-600 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-48 border-emerald-200 dark:border-gray-600 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Category Filters with AI Tutor */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 flex-1">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'border-emerald-200 dark:border-gray-600 hover:bg-emerald-50 dark:hover:bg-gray-800'
              }
            >
              All Categories
            </Button>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'border-emerald-200 dark:border-gray-600 hover:bg-emerald-50 dark:hover:bg-gray-800'
                  }
                >
                  <Icon size={16} className="mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
          {/* AI Tutor Card */}
          <Card 
            className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 cursor-pointer lg:w-72"
            onClick={() => {
              onNavigateToAI({
                id: 0,
                title: 'EcoSplash Learning',
                category: 'General',
                description: 'Your personal AI tutor for all sustainability topics',
                topics: ['Water Conservation', 'Solar Energy', 'Composting', 'Biodiversity', 'Wind Energy', 'Zero Waste']
              });
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                  <Bot className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-slate-800 dark:text-gray-200 mb-1">AI Tutor</h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400">Ask me anything about sustainability!</p>
                </div>
                <ChevronRight className="flex-shrink-0 text-blue-500 dark:text-blue-400" size={20} />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson: { category: string; id: Key | null | undefined; image: string | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; difficulty: string; status: string; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; progress: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; duration: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; students: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; rating: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; points: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; topics: any[]; activities: { title: any; points: any; }[]; learningLink: string | URL | undefined; }, _index: any) => {
            const categoryData = categories.find(c => c.id === lesson.category);
            const Icon = categoryData?.icon || BookOpen;
            return (
              <div
                key={lesson.id}
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200 dark:border-gray-700 h-full hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    {lesson.image && (
                      <ImageWithFallback
                        src={lesson.image}
                        alt={lesson.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="absolute top-3 left-3">
                      <div className={`p-2 rounded-lg ${categoryData?.bgColor || 'bg-slate-100'}`}>
                        <Icon className={categoryData?.color || 'text-slate-600'} size={20} />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-slate-800 dark:text-gray-200">{lesson.title}</h3>
                      {getStatusIcon(lesson.status)}
                    </div>
                    <p className="text-slate-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {lesson.description}
                    </p>
                    {lesson.progress > 0 && lesson.status !== 'completed' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-600 dark:text-gray-400">Progress</span>
                          <span className="text-emerald-600 dark:text-emerald-400">{lesson.progress}%</span>
                        </div>
                        <Progress value={lesson.progress} className="h-2" />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {lesson.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {lesson.students}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500" />
                          {lesson.rating}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Award size={14} />
                        +{lesson.points} pts
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider">Topics</div>
                        <div className="flex flex-wrap gap-2">
                          {lesson.topics.slice(0, 2).map((topic: any, topicIndex: any) => (
                            <Badge key={topicIndex} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {lesson.topics.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{lesson.topics.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      {/* Activities Section */}
                      {lesson.activities && lesson.activities.length > 0 && (
  <div className="space-y-2">
    <div className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider">Activities</div>
    <div className="space-y-2">
      {lesson.activities.map((activity, activityIndex) => (
        <Button
          key={activityIndex}
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs border-emerald-200 dark:border-gray-600 hover:bg-emerald-50 dark:hover:bg-gray-800"
          onClick={(e: { stopPropagation: () => void; }) => {
            e.stopPropagation();
            handleActivityClick(activity, lesson.title);
          }}
        >
          <Gamepad2 size={12} className="mr-2" />
          {activity.title}
          <Badge variant="secondary" className="ml-auto text-xs">
            +{activity.points} pts
          </Badge>
        </Button>
      ))}
    </div>
  </div>
)}

                    </div>
                    {/* Action Button */}
                    <div className="mt-4">
                      <Button
                        onClick={(e: { stopPropagation: () => void; }) => {
                          e.stopPropagation();
                          if (lesson.learningLink) {
                            window.open(lesson.learningLink, '_blank');
                          } else {
                            console.log(`${lesson.status === 'completed' ? 'Reviewing' : 
                                        lesson.status === 'in-progress' ? 'Continuing' : 'Starting'} lesson: ${lesson.title}`);
                          }
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        size="sm"
                      >
                        <ExternalLink size={14} className="mr-2" />
                        {lesson.status === 'completed' ? 'Review' : 
                         lesson.status === 'in-progress' ? 'Continue' : 'Start'} Lesson
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="text-slate-400 dark:text-gray-500 mx-auto mb-4" size={48} />
            <h3 className="text-slate-600 dark:text-gray-400 mb-2">No lessons found</h3>
            <p className="text-slate-500 dark:text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default EcoLessons;