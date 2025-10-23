import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Recycle, Timer, Users, Trophy, ArrowLeft, RotateCcw, Award, MapPin, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface TrashTagChallengeProps {
  onBack: () => void;
  userName?: string;
  onComplete?: (score: number, maxScore: number, timeElapsed: number) => void;
}

interface TrashItem {
  id: string;
  type: 'plastic' | 'paper' | 'metal' | 'glass' | 'organic' | 'electronic' | 'hazardous';
  name: string;
  points: number;
  recycleCategory: 'recyclable' | 'compostable' | 'hazardous' | 'landfill';
  decompositionTime: string;
  icon: string;
  size: 'small' | 'medium' | 'large';
  difficulty: number; // 1-3, how hard to spot/collect
}

interface Area {
  id: string;
  name: string;
  description: string;
  trashCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  backgroundColor: string;
  icon: string;
  environmentalImpact: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
  itemsCollected: number;
  avatar: string;
}

const trashItems: TrashItem[] = [
  // Plastic items
  { id: 'bottle', type: 'plastic', name: 'Plastic Bottle', points: 10, recycleCategory: 'recyclable', decompositionTime: '450 years', icon: '🍾', size: 'medium', difficulty: 1 },
  { id: 'bag', type: 'plastic', name: 'Plastic Bag', points: 8, recycleCategory: 'recyclable', decompositionTime: '20 years', icon: '🛍️', size: 'small', difficulty: 2 },
  { id: 'straw', type: 'plastic', name: 'Plastic Straw', points: 5, recycleCategory: 'landfill', decompositionTime: '200 years', icon: '🥤', size: 'small', difficulty: 3 },
  
  // Paper items
  { id: 'newspaper', type: 'paper', name: 'Newspaper', points: 6, recycleCategory: 'recyclable', decompositionTime: '6 weeks', icon: '📰', size: 'medium', difficulty: 1 },
  { id: 'cardboard', type: 'paper', name: 'Cardboard Box', points: 12, recycleCategory: 'recyclable', decompositionTime: '2 months', icon: '📦', size: 'large', difficulty: 1 },
  { id: 'receipt', type: 'paper', name: 'Receipt', points: 3, recycleCategory: 'landfill', decompositionTime: '5 years', icon: '🧾', size: 'small', difficulty: 3 },
  
  // Metal items
  { id: 'can', type: 'metal', name: 'Aluminum Can', points: 15, recycleCategory: 'recyclable', decompositionTime: '80-100 years', icon: '🥤', size: 'small', difficulty: 1 },
  { id: 'bottle-cap', type: 'metal', name: 'Bottle Cap', points: 8, recycleCategory: 'recyclable', decompositionTime: '50 years', icon: '🍺', size: 'small', difficulty: 2 },
  
  // Glass items
  { id: 'glass-bottle', type: 'glass', name: 'Glass Bottle', points: 20, recycleCategory: 'recyclable', decompositionTime: '1 million years', icon: '🍼', size: 'medium', difficulty: 1 },
  { id: 'jar', type: 'glass', name: 'Glass Jar', points: 18, recycleCategory: 'recyclable', decompositionTime: '1 million years', icon: '🫙', size: 'medium', difficulty: 1 },
  
  // Organic items
  { id: 'apple-core', type: 'organic', name: 'Apple Core', points: 5, recycleCategory: 'compostable', decompositionTime: '8 weeks', icon: '🍎', size: 'small', difficulty: 1 },
  { id: 'banana-peel', type: 'organic', name: 'Banana Peel', points: 5, recycleCategory: 'compostable', decompositionTime: '3-5 weeks', icon: '🍌', size: 'small', difficulty: 1 },
  
  // Electronic items
  { id: 'battery', type: 'electronic', name: 'Battery', points: 25, recycleCategory: 'hazardous', decompositionTime: '100+ years', icon: '🔋', size: 'small', difficulty: 2 },
  { id: 'phone', type: 'electronic', name: 'Old Phone', points: 50, recycleCategory: 'hazardous', decompositionTime: '1000+ years', icon: '📱', size: 'small', difficulty: 3 },
  
  // Hazardous items
  { id: 'paint-can', type: 'hazardous', name: 'Paint Can', points: 40, recycleCategory: 'hazardous', decompositionTime: '100+ years', icon: '🎨', size: 'medium', difficulty: 2 },
  { id: 'motor-oil', type: 'hazardous', name: 'Motor Oil Container', points: 45, recycleCategory: 'hazardous', decompositionTime: '200+ years', icon: '🛢️', size: 'medium', difficulty: 2 }
];

const areas: Area[] = [
  {
    id: 'park',
    name: 'City Park',
    description: 'Clean up the local park where families come to play',
    trashCount: 15,
    difficulty: 'easy',
    timeLimit: 120,
    backgroundColor: 'from-green-100 to-emerald-200',
    icon: '🌳',
    environmentalImpact: 'Protects wildlife and recreational spaces'
  },
  {
    id: 'beach',
    name: 'Coastal Beach',
    description: 'Remove trash from the beach to protect marine life',
    trashCount: 20,
    difficulty: 'medium',
    timeLimit: 150,
    backgroundColor: 'from-blue-100 to-cyan-200',
    icon: '🏖️',
    environmentalImpact: 'Prevents ocean pollution and saves marine animals'
  },
  {
    id: 'urban',
    name: 'Urban Street',
    description: 'Clean busy city streets and sidewalks',
    trashCount: 25,
    difficulty: 'hard',
    timeLimit: 180,
    backgroundColor: 'from-gray-100 to-slate-200',
    icon: '🏙️',
    environmentalImpact: 'Improves community health and city appearance'
  }
];

const teams: Team[] = [
  { id: 'eco-warriors', name: 'Eco Warriors', color: 'green', score: 0, itemsCollected: 0, avatar: '🌱' },
  { id: 'clean-crusaders', name: 'Clean Crusaders', color: 'blue', score: 0, itemsCollected: 0, avatar: '🧹' },
  { id: 'trash-terminators', name: 'Trash Terminators', color: 'red', score: 0, itemsCollected: 0, avatar: '🗑️' },
  { id: 'green-guardians', name: 'Green Guardians', color: 'emerald', score: 0, itemsCollected: 0, avatar: '🛡️' }
];

const TrashTagChallenge = ({ onBack, userName = 'Player', onComplete }: TrashTagChallengeProps) => {
  const [gameState, setGameState] = useState<'menu' | 'area-select' | 'team-select' | 'playing' | 'sorting' | 'completed'>('menu');
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [score, setScore] = useState(0);
  const [collectedTrash, setCollectedTrash] = useState<TrashItem[]>([]);
  const [currentTrashItems, setCurrentTrashItems] = useState<TrashItem[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [teamScores, setTeamScores] = useState<{[key: string]: number}>({});
  const [sortingPhase, setSortingPhase] = useState(false);
  const [sortedItems, setSortedItems] = useState<{[key: string]: TrashItem[]}>({
    recyclable: [],
    compostable: [],
    hazardous: [],
    landfill: []
  });
  const [gameStats, setGameStats] = useState({
    totalItems: 0,
    correctSorts: 0,
    bonusPoints: 0,
    timeBonus: 0
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && gameState === 'playing') {
      startSortingPhase();
    }
    return () => clearTimeout(timer);
  }, [gameState, timeRemaining]);

  const startGame = () => {
    setGameState('area-select');
  };

  const selectArea = (area: Area) => {
    setSelectedArea(area);
    setGameState('team-select');
  };

  const selectTeam = (team: Team) => {
    setSelectedTeam(team);
    if (selectedArea) {
      startCleanup();
    }
  };

  const startCleanup = () => {
    if (!selectedArea || !selectedTeam) return;

    setGameState('playing');
    setStartTime(Date.now());
    setTimeRemaining(selectedArea.timeLimit);
    setScore(0);
    setCollectedTrash([]);
    
    // Generate random trash items for this area
    const areaTrash = generateTrashForArea(selectedArea);
    setCurrentTrashItems(areaTrash);
    
    // Initialize team scores
    const initialScores: {[key: string]: number} = {};
    teams.forEach(t => {
      if (t.id === selectedTeam.id) {
        initialScores[t.id] = 0;
      } else {
        // Simulate other teams' progress
        initialScores[t.id] = Math.floor(Math.random() * 100) + 50;
      }
    });
    setTeamScores(initialScores);

    setGameStats({
      totalItems: 0,
      correctSorts: 0,
      bonusPoints: 0,
      timeBonus: 0
    });
  };

  const generateTrashForArea = (area: Area): TrashItem[] => {
    const areaTrash: TrashItem[] = [];
    
    // Different areas have different trash distributions
    let trashPool = [...trashItems];
    
    if (area.id === 'beach') {
      // More plastic and bottles at beach
      trashPool = trashPool.filter(item => 
        item.type === 'plastic' || item.type === 'glass' || item.type === 'metal'
      );
    } else if (area.id === 'park') {
      // More organic waste and general litter in park
      trashPool = trashPool.filter(item => 
        item.type === 'organic' || item.type === 'paper' || item.type === 'plastic'
      );
    } else if (area.id === 'urban') {
      // All types in urban area
      trashPool = [...trashItems];
    }

    // Randomly select items
    for (let i = 0; i < area.trashCount; i++) {
      const randomItem = trashPool[Math.floor(Math.random() * trashPool.length)];
      areaTrash.push({ ...randomItem, id: `${randomItem.id}-${i}` });
    }

    return areaTrash.sort(() => Math.random() - 0.5);
  };

  const collectTrash = (item: TrashItem) => {
    setCollectedTrash(prev => [...prev, item]);
    setCurrentTrashItems(prev => prev.filter(t => t.id !== item.id));
    
    let points = item.points;
    
    // Difficulty bonus
    if (item.difficulty === 3) points += 5;
    else if (item.difficulty === 2) points += 2;
    
    // Size bonus
    if (item.size === 'large') points += 5;
    else if (item.size === 'medium') points += 2;
    
    setScore(prev => prev + points);
    
    // Update team score
    if (selectedTeam) {
      setTeamScores(prev => ({
        ...prev,
        [selectedTeam.id]: prev[selectedTeam.id] + points
      }));
    }

    // Simulate other teams collecting trash
    teams.forEach(team => {
      if (team.id !== selectedTeam?.id) {
        const randomPoints = Math.floor(Math.random() * 15) + 5;
        setTeamScores(prev => ({
          ...prev,
          [team.id]: prev[team.id] + randomPoints
        }));
      }
    });

    // Check if all trash is collected
    if (currentTrashItems.length <= 1) {
      setTimeout(() => startSortingPhase(), 500);
    }
  };

  const startSortingPhase = () => {
    setGameState('sorting');
    setSortingPhase(true);
  };

  const sortTrashItem = (item: TrashItem, category: string) => {
    setSortedItems(prev => ({
      ...prev,
      [category]: [...prev[category], item]
    }));
    
    setCollectedTrash(prev => prev.filter(t => t.id !== item.id));
    
    // Check if sorting is correct
    if (item.recycleCategory === category) {
      const bonus = item.points * 0.5;
      setScore(prev => prev + bonus);
      setGameStats(prev => ({
        ...prev,
        correctSorts: prev.correctSorts + 1,
        bonusPoints: prev.bonusPoints + bonus
      }));
    }

    setGameStats(prev => ({
      ...prev,
      totalItems: prev.totalItems + 1
    }));

    // Check if sorting is complete
    if (collectedTrash.length <= 1) {
      setTimeout(() => completeGame(), 1000);
    }
  };

  const completeGame = () => {
    // Calculate time bonus
    const timeBonus = Math.max(0, timeRemaining * 2);
    setScore(prev => prev + timeBonus);
    setGameStats(prev => ({ ...prev, timeBonus }));

    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = selectedArea ? (selectedArea.trashCount * 30) + (selectedArea.timeLimit * 2) : 500;
    
    setGameState('completed');
    onComplete?.(score + timeBonus, maxScore, timeElapsed);
  };

  const resetGame = () => {
    setGameState('menu');
    setSelectedArea(null);
    setSelectedTeam(null);
    setScore(0);
    setCollectedTrash([]);
    setCurrentTrashItems([]);
    setTimeRemaining(120);
    setSortingPhase(false);
    setSortedItems({
      recyclable: [],
      compostable: [],
      hazardous: [],
      landfill: []
    });
    setTeamScores({});
    setGameStats({
      totalItems: 0,
      correctSorts: 0,
      bonusPoints: 0,
      timeBonus: 0
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                  <Recycle size={48} className="text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-green-800 mb-4">Trash Tag Challenge</CardTitle>
              <p className="text-green-700 text-lg">
                Join the global Trash Tag movement! Compete with teams to clean up the environment 
                and properly sort recyclables. Make a real impact on your community!
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-4 text-center">
                  <Timer className="text-blue-600 mx-auto mb-2" size={32} />
                  <h4 className="text-blue-800 mb-2">Timed Cleanup</h4>
                  <p className="text-sm text-blue-700">Race against the clock to collect trash</p>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center">
                  <Users className="text-purple-600 mx-auto mb-2" size={32} />
                  <h4 className="text-purple-800 mb-2">Team Competition</h4>
                  <p className="text-sm text-purple-700">Compete against other environmental teams</p>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg p-4 text-center">
                  <Recycle className="text-orange-600 mx-auto mb-2" size={32} />
                  <h4 className="text-orange-800 mb-2">Proper Sorting</h4>
                  <p className="text-sm text-orange-700">Learn to sort waste into correct categories</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6">
                <h4 className="text-green-800 mb-3">Challenge Phases:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
                  <div>• Collection Phase: Gather trash quickly and efficiently</div>
                  <div>• Sorting Phase: Properly categorize collected items</div>
                  <div>• Team scoring with live leaderboard updates</div>
                  <div>• Environmental impact tracking and education</div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 text-lg"
                >
                  <Recycle size={20} className="mr-2" />
                  Start Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'area-select') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-green-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setGameState('menu')}
              className="text-green-700 hover:text-green-800 hover:bg-green-50"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-800 mb-2">Choose Cleanup Area</CardTitle>
              <p className="text-green-700">Select the area where your team will make an environmental impact!</p>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {areas.map((area) => (
              <Card 
                key={area.id}
                className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-400"
                onClick={() => selectArea(area)}
              >
                <CardContent className="p-6">
                  <div className={`h-32 rounded-lg bg-gradient-to-br ${area.backgroundColor} flex items-center justify-center mb-4`}>
                    <div className="text-6xl">{area.icon}</div>
                  </div>
                  
                  <h3 className="text-xl text-green-800 mb-2">{area.name}</h3>
                  <p className="text-sm text-green-600 mb-4">{area.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Trash Items:</span>
                      <span className="text-green-700">{area.trashCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Time Limit:</span>
                      <span className="text-green-700">{formatTime(area.timeLimit)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <Badge className={`text-xs ${
                        area.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        area.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {area.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4">
                    <h4 className="text-xs text-green-800 mb-1">Environmental Impact:</h4>
                    <p className="text-xs text-green-700">{area.environmentalImpact}</p>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                    Choose This Area
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'team-select') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-green-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setGameState('area-select')}
              className="text-green-700 hover:text-green-800 hover:bg-green-50"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-800 mb-2">Join a Cleanup Team</CardTitle>
              <p className="text-green-700">
                Cleaning up: <strong>{selectedArea?.name}</strong> • {selectedArea?.trashCount} items • {formatTime(selectedArea?.timeLimit || 120)}
              </p>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teams.map((team) => (
              <Card 
                key={team.id}
                className={`bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                  team.color === 'green' ? 'hover:border-green-400' :
                  team.color === 'blue' ? 'hover:border-blue-400' :
                  team.color === 'red' ? 'hover:border-red-400' :
                  'hover:border-emerald-400'
                }`}
                onClick={() => selectTeam(team)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{team.avatar}</div>
                  <h3 className={`text-xl mb-3 ${
                    team.color === 'green' ? 'text-green-800' :
                    team.color === 'blue' ? 'text-blue-800' :
                    team.color === 'red' ? 'text-red-800' :
                    'text-emerald-800'
                  }`}>
                    {team.name}
                  </h3>
                  <Badge className={`mb-4 ${
                    team.color === 'green' ? 'bg-green-100 text-green-800' :
                    team.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    team.color === 'red' ? 'bg-red-100 text-red-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    Environmental Champions
                  </Badge>
                  <Button className={`w-full ${
                    team.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                    team.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                    team.color === 'red' ? 'bg-red-500 hover:bg-red-600' :
                    'bg-emerald-500 hover:bg-emerald-600'
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

  if (gameState === 'playing' && selectedArea && selectedTeam) {
    const currentRanking = getCurrentTeamRanking();

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
                {selectedArea.name} {selectedArea.icon}
              </Badge>
              <Badge variant="outline" className={`${timeRemaining < 30 ? 'text-red-700' : 'text-green-700'}`}>
                Time: {formatTime(timeRemaining)}
              </Badge>
              <Badge variant="outline" className="text-green-700">
                Rank: #{currentRanking}/4
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/90 backdrop-blur-sm border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-green-800">{score}</div>
                <div className="text-xs text-green-600">Score</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-blue-800">{collectedTrash.length}</div>
                <div className="text-xs text-blue-600">Items Collected</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-purple-800">{currentTrashItems.length}</div>
                <div className="text-xs text-purple-600">Items Remaining</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-orange-800">{selectedTeam.name}</div>
                <div className="text-xs text-orange-600">Your Team</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Cleanup Area */}
            <div className="lg:col-span-3">
              <Card className="bg-white/90 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 text-center flex items-center justify-center gap-2">
                    <MapPin size={24} />
                    {selectedArea.name} Cleanup Zone
                  </CardTitle>
                  <Progress 
                    value={((selectedArea.trashCount - currentTrashItems.length) / selectedArea.trashCount) * 100} 
                    className="w-full"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className={`relative w-full h-96 bg-gradient-to-br ${selectedArea.backgroundColor} rounded-lg overflow-hidden`}>
                    {/* Trash Items */}
                    <div className="absolute inset-0 p-4">
                      <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 h-full">
                        {currentTrashItems.slice(0, 40).map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="cursor-pointer hover:scale-110 transition-transform duration-200"
                            onClick={() => collectTrash(item)}
                          >
                            <div className={`
                              w-full h-full rounded-lg flex items-center justify-center text-center
                              ${item.difficulty === 1 ? 'opacity-100' : 
                                item.difficulty === 2 ? 'opacity-75' : 'opacity-50'}
                              hover:opacity-100 transition-opacity duration-200
                              ${item.size === 'large' ? 'text-2xl' : 
                                item.size === 'medium' ? 'text-xl' : 'text-lg'}
                            `}>
                              <div>
                                <div>{item.icon}</div>
                                <div className="text-xs text-gray-700 mt-1">+{item.points}</div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Area Description Overlay */}
                    <div className="absolute bottom-4 left-4 bg-white/80 rounded-lg p-3 max-w-sm">
                      <h4 className="text-green-800 mb-1">{selectedArea.name}</h4>
                      <p className="text-xs text-green-700">{selectedArea.description}</p>
                      <p className="text-xs text-green-600 mt-1">{selectedArea.environmentalImpact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Team Leaderboard */}
              <Card className="bg-white/90 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Live Leaderboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teams
                    .map(team => ({ ...team, score: teamScores[team.id] || 0 }))
                    .sort((a, b) => b.score - a.score)
                    .map((team, index) => (
                      <div 
                        key={team.id}
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          team.id === selectedTeam.id 
                            ? 'bg-green-100 border-2 border-green-400' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="text-lg">{index + 1}.</div>
                        <div className="text-lg">{team.avatar}</div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-800">{team.name}</div>
                          <div className="text-xs text-gray-600">{team.score} points</div>
                        </div>
                        {index === 0 && <Trophy className="text-yellow-500" size={16} />}
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Collected Items */}
              <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Collection Bag</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                    {collectedTrash.slice(-12).map((item) => (
                      <div key={item.id} className="text-center">
                        <div className="text-2xl">{item.icon}</div>
                        <div className="text-xs text-gray-600">+{item.points}</div>
                      </div>
                    ))}
                  </div>
                  {collectedTrash.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      Start collecting trash!
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Environmental Impact */}
              <Card className="bg-white/90 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Impact Tracker</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Items Collected:</span>
                    <span className="text-green-700">{collectedTrash.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Area Cleaned:</span>
                    <span className="text-green-700">
                      {Math.round(((selectedArea.trashCount - currentTrashItems.length) / selectedArea.trashCount) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Team Rank:</span>
                    <span className="text-green-700">#{currentRanking}/4</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'sorting' && selectedArea && selectedTeam) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-100/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
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
                Sorting Phase
              </Badge>
              <Badge variant="outline" className="text-orange-700">
                Items Left: {collectedTrash.length}
              </Badge>
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-orange-200 shadow-xl mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-orange-800">Waste Sorting Station</CardTitle>
              <p className="text-orange-700">
                Sort your collected trash into the correct categories to earn bonus points!
              </p>
              <Progress 
                value={((gameStats.totalItems) / (gameStats.totalItems + collectedTrash.length)) * 100} 
                className="w-full mt-4"
              />
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items to Sort */}
            <div className="lg:col-span-1">
              <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Items to Sort</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {collectedTrash.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-move"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', JSON.stringify(item));
                        }}
                      >
                        <div className="text-2xl">{item.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-sm text-gray-800">{item.name}</h4>
                          <p className="text-xs text-gray-600">Decomposes in: {item.decompositionTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {collectedTrash.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      All items sorted!
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sorting Categories */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Recyclable */}
                <Card 
                  className="bg-white/90 backdrop-blur-sm border-green-200 min-h-48"
                  onDrop={(e) => {
                    e.preventDefault();
                    const item = JSON.parse(e.dataTransfer.getData('text/plain'));
                    sortTrashItem(item, 'recyclable');
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-green-800">♻️ Recyclable</CardTitle>
                    <p className="text-xs text-green-600">Plastics, metals, glass, clean paper</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {sortedItems.recyclable.map((item) => (
                        <div key={item.id} className="text-center">
                          <div className="text-xl">{item.icon}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Compostable */}
                <Card 
                  className="bg-white/90 backdrop-blur-sm border-brown-200 min-h-48"
                  onDrop={(e) => {
                    e.preventDefault();
                    const item = JSON.parse(e.dataTransfer.getData('text/plain'));
                    sortTrashItem(item, 'compostable');
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-amber-800">🌱 Compostable</CardTitle>
                    <p className="text-xs text-amber-600">Organic waste, food scraps</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {sortedItems.compostable.map((item) => (
                        <div key={item.id} className="text-center">
                          <div className="text-xl">{item.icon}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Hazardous */}
                <Card 
                  className="bg-white/90 backdrop-blur-sm border-red-200 min-h-48"
                  onDrop={(e) => {
                    e.preventDefault();
                    const item = JSON.parse(e.dataTransfer.getData('text/plain'));
                    sortTrashItem(item, 'hazardous');
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-red-800">⚠️ Hazardous</CardTitle>
                    <p className="text-xs text-red-600">Batteries, electronics, chemicals</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {sortedItems.hazardous.map((item) => (
                        <div key={item.id} className="text-center">
                          <div className="text-xl">{item.icon}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Landfill */}
                <Card 
                  className="bg-white/90 backdrop-blur-sm border-gray-200 min-h-48"
                  onDrop={(e) => {
                    e.preventDefault();
                    const item = JSON.parse(e.dataTransfer.getData('text/plain'));
                    sortTrashItem(item, 'landfill');
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-gray-800">🗑️ Landfill</CardTitle>
                    <p className="text-xs text-gray-600">Non-recyclable items</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {sortedItems.landfill.map((item) => (
                        <div key={item.id} className="text-center">
                          <div className="text-xl">{item.icon}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'completed' && selectedArea && selectedTeam) {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = (selectedArea.trashCount * 30) + (selectedArea.timeLimit * 2);
    const finalRanking = getCurrentTeamRanking();
    const ecoPoints = Math.floor(score / 3);
    const sortingAccuracy = gameStats.totalItems > 0 ? Math.round((gameStats.correctSorts / gameStats.totalItems) * 100) : 0;

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
                <div className={`p-4 rounded-full ${
                  finalRanking === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                  finalRanking === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  finalRanking === 3 ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                  'bg-gradient-to-br from-green-400 to-emerald-500'
                }`}>
                  {finalRanking === 1 ? <Trophy size={48} className="text-white" /> : <Award size={48} className="text-white" />}
                </div>
              </motion.div>
              <CardTitle className="text-3xl text-green-800 mb-2">
                Challenge Complete! Team {selectedTeam.name} finishes #{finalRanking}!
              </CardTitle>
              <p className="text-green-700">
                {finalRanking === 1 ? 'Outstanding! Your team led the cleanup effort!' :
                 finalRanking === 2 ? 'Excellent work! Second place finish!' :
                 finalRanking === 3 ? 'Great job! Third place finish!' :
                 'Good effort! Every bit of cleanup makes a difference!'}
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
                    <div className="text-2xl text-blue-800 mb-1">{gameStats.totalItems}</div>
                    <div className="text-blue-600">Items Collected & Sorted</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                    <div className="text-2xl text-purple-800 mb-1">{sortingAccuracy}%</div>
                    <div className="text-purple-600">Sorting Accuracy</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
                    <div className="text-2xl text-orange-800 mb-1">+{ecoPoints}</div>
                    <div className="text-orange-600">Eco Points Earned</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 text-center">
                  <div className="text-xl text-green-800 mb-1">{gameStats.bonusPoints}</div>
                  <div className="text-sm text-green-600">Sorting Bonus</div>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4 text-center">
                  <div className="text-xl text-blue-800 mb-1">{gameStats.timeBonus}</div>
                  <div className="text-sm text-blue-600">Time Bonus</div>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 text-center">
                  <div className="text-xl text-purple-800 mb-1">#{finalRanking}</div>
                  <div className="text-sm text-purple-600">Team Ranking</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <h4 className="text-green-800 mb-3">Environmental Impact:</h4>
                <p className="text-green-700">
                  The Trash Tag Challenge is a real global movement where people clean up their communities and 
                  share before/after photos. Your virtual cleanup mirrors real efforts happening worldwide! 
                  Proper waste sorting is crucial for recycling efficiency and reducing environmental impact. 
                  Every piece of trash properly disposed of helps protect our ecosystems and wildlife.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8"
                >
                  <RotateCcw size={20} className="mr-2" />
                  New Challenge
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

export default TrashTagChallenge;