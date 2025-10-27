import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  Leaf,
  Flame,
  Trophy,
  BookOpen,
  Target,
  Star,
  Award,
  ArrowRight,
  CheckCircle,
  Droplets,
  TreePine,
  Sun,
  Wind,
  Flower,
  Lock,
  Crown,
  LogOut,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import EcoContributionCalendar from './EcoContributionCalendar';
import { supabase } from '../supabaseClient';


interface EcoDashboardProps {
  userRole: 'student' | 'teacher' | 'ngo';
  userName: string;
  onNavigateToLessons: () => void;
  onNavigateToChallenges: () => void;
  onLogout: () => void;
}


const EcoDashboard = ({
  userRole,
  userName,
  onNavigateToLessons,
  onNavigateToChallenges,
}: EcoDashboardProps) => {
  const [showFloatingElements, setShowFloatingElements] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [refreshCalendar, setRefreshCalendar] = useState(false);
  // 🟢 NEW: ecoPoints state and Supabase fetching
const [ecoPoints, setEcoPoints] = useState(0);
const maxEcoPoints = 1500;

useEffect(() => {
  const fetchPoints = async () => {
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
  };
  fetchPoints();
}, []);
  const progressPercentage = (ecoPoints / maxEcoPoints) * 100;
  // Floating animation timer
  useEffect(() => {
    const timer = setTimeout(() => setShowFloatingElements(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Record today's activity once logged in
  useEffect(() => {
    const recordActivity = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      const { data: existing, error: existingError } = await supabase
        .from('eco_activity')
        .select('*')
        .eq('user_id', user.id)
        .eq('active_date', today);

      if (!existingError && existing.length === 0) {
        await supabase.from('eco_activity').insert([
          { user_id: user.id, active_date: today },
        ]);
        setRefreshCalendar((prev) => !prev); // refresh calendar on insert
      }
    };

    recordActivity();
  }, []);

  // Fetch streak dynamically
  useEffect(() => {
    const fetchStreak = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('eco_activity')
        .select('active_date')
        .eq('user_id', user.id)
        .order('active_date', { ascending: false });

      if (error || !data) return;

      let streak = 0;
      let currentDate = new Date();

      for (const row of data) {
        const activeDate = new Date(row.active_date);
        const diffDays = Math.floor(
          (currentDate.getTime() - activeDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0 || diffDays === streak) {
          streak++;
        } else {
          break;
        }
      }

      setCurrentStreak(streak);
    };

    fetchStreak();
  }, [refreshCalendar]);

  // Stats data
  const stats = [
    {
      title: 'Challenges Done',
      value: 12,
      icon: Target,
      color: 'from-emerald-500 to-green-500',
    },
    {
      title: 'Lessons Learned',
      value: 8,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Badges Earned',
      value: 5,
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  // Active challenges
  const activeChallenges = [
    {
      id: 1,
      title: 'Water Conservation Week',
      description: 'Save 50 liters of water this week',
      progress: 75,
      status: 'active',
      daysLeft: 3,
      points: 150,
      icon: Droplets,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      title: 'Plant a Tree',
      description: 'Plant and document a new tree',
      progress: 0,
      status: 'pending',
      daysLeft: 7,
      points: 200,
      icon: TreePine,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 3,
      title: 'Solar Energy Learning',
      description: 'Complete solar energy module',
      progress: 100,
      status: 'completed',
      daysLeft: 0,
      points: 100,
      icon: Sun,
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  // Badges
  const badges = [
    { id: 1, name: 'Water Warrior', icon: Droplets, earned: true },
    { id: 2, name: 'Tree Hugger', icon: TreePine, earned: true },
    { id: 3, name: 'Solar Scholar', icon: Sun, earned: true },
    { id: 4, name: 'Wind Walker', icon: Wind, earned: true },
    { id: 5, name: 'Flower Power', icon: Flower, earned: true },
    { id: 6, name: 'Eco Master', icon: Crown, earned: false },
    { id: 7, name: 'Green Guru', icon: Leaf, earned: false },
    { id: 8, name: 'Planet Protector', icon: Trophy, earned: false },
  ];

  // Floating icons
  const floatingElements = [
    { Icon: Leaf, position: { top: '5%', left: '3%' } },
    { Icon: TreePine, position: { top: '15%', right: '5%' } },
    { Icon: Droplets, position: { top: '50%', left: '2%' } },
    { Icon: Sun, position: { top: '60%', right: '3%' } },
    { Icon: Wind, position: { bottom: '20%', left: '4%' } },
    { Icon: Flower, position: { bottom: '35%', right: '6%' } },
  ];

  // Circular Progress component (unchanged)
  const CircularProgress = ({
    percentage,
    points,
    maxPoints,
  }: {
    percentage: number;
    points: number;
    maxPoints: number;
  }) => {
    const radius = 120;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="rgb(209 213 219)"
            strokeWidth={strokeWidth}
            fill="none"
            className="opacity-20"
          />
          <motion.circle
            cx="140"
            cy="140"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(16 185 129)" />
              <stop offset="50%" stopColor="rgb(34 197 94)" />
              <stop offset="100%" stopColor="rgb(20 184 166)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <div className="text-4xl text-emerald-800 mb-2">{points}</div>
          <div className="text-lg text-emerald-600">/ {maxPoints}</div>
          <div className="text-sm text-slate-600 mt-1">Eco Points</div>
        </div>
      </div>
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4"
    >
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1696250863507-262618217c55?auto=format&fit=crop&w=1080&q=80"
          alt="Forest background"
          className="w-full h-full object-cover opacity-5"
        />
      </div>

      {floatingElements.map(({ Icon, position }, index) => (
        <motion.div
          key={index}
          className="absolute text-emerald-600/20 pointer-events-none hidden lg:block"
          style={position}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + index * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Icon size={24} />
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Leaf className="text-emerald-600" size={32} />
            <div>
              <h1 className="text-emerald-800 mb-0">
                Welcome back, {userName}!
              </h1>
              <p className="text-emerald-700">Ready to make a difference today?</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white border-0 shadow-md flex items-center gap-2">
              <Flame size={16} />
              {currentStreak} day streak!
            </Badge>

            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                localStorage.clear();
                window.location.href = '/';
              }}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Circular Progress */}
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 shadow-lg p-8 flex justify-center">
              <CircularProgress
                percentage={progressPercentage}
                points={ecoPoints}
                maxPoints={maxEcoPoints}
              />
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.title}
                    className="bg-white/80 backdrop-blur-sm border-emerald-200 shadow-lg text-center p-4"
                  >
                    <div
                      className={`mx-auto mb-3 w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="text-white" size={20} />
                    </div>
                    <div className="text-2xl text-slate-800 mb-1">{stat.value}</div>
                    <div className="text-xs text-slate-600">{stat.title}</div>
                  </Card>
                );
              })}
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 shadow-lg text-center p-4">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Star className="text-white" size={20} />
                </div>
                <div className="text-2xl text-slate-800 mb-1">{ecoPoints}</div>
                <div className="text-xs text-slate-600">Total Points</div>
              </Card>
            </div>

            {/* Calendar */}
            <EcoContributionCalendar key={refreshCalendar ? 'a' : 'b'} />

            {/* Active Challenges */}
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <Target className="text-emerald-600" size={24} />
                  Active Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeChallenges.map((challenge) => {
                  const Icon = challenge.icon;
                  return (
                    <div key={challenge.id} className="p-4 rounded-lg border border-slate-200 hover:border-emerald-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full bg-gradient-to-r ${challenge.color}`}>
                            <Icon className="text-white" size={20} />
                          </div>
                          <div>
                            <h4 className="text-slate-800">{challenge.title}</h4>
                            <p className="text-sm text-slate-600">{challenge.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {challenge.status === 'active' && (
                            <Badge variant="outline" className="text-blue-600 border-blue-200 mb-1">
                              {challenge.daysLeft} days left
                            </Badge>
                          )}
                          {challenge.status === 'pending' && (
                            <Badge variant="outline" className="text-gray-600 border-gray-200 mb-1">
                              Start Now
                            </Badge>
                          )}
                          {challenge.status === 'completed' && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 mb-1">
                              Completed
                            </Badge>
                          )}
                          <div className="text-sm text-emerald-600">+{challenge.points} pts</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Progress</span>
                          <span className="text-emerald-600">{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button onClick={onNavigateToLessons} className="bg-emerald-600 hover:bg-emerald-700 text-white h-16 text-lg">
                <BookOpen size={24} className="mr-3" />
                Continue Learning
                <ArrowRight size={20} className="ml-3" />
              </Button>
              <Button onClick={onNavigateToChallenges} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-16 text-lg">
                <Target size={24} className="mr-3" />
                Browse Challenges
                <ArrowRight size={20} className="ml-3" />
              </Button>
            </div>
          </div>

          {/* Right Column — Badges only */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-slate-800">
                  <div className="flex items-center gap-3">
                    <Award className="text-purple-500" size={24} />
                    Badge Collection
                  </div>
                  <Button variant="ghost" size="sm" className="text-emerald-600">
                    View All Badges
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {badges.map((badge) => {
                    const IconComponent = badge.icon;
                    return (
                      <div key={badge.id}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                          badge.earned
                            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 shadow-sm'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        {!badge.earned && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                            <Lock className="text-slate-400" size={20} />
                          </div>
                        )}
                        <div className="text-center space-y-2">
                          <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center ${
                            badge.earned
                              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                              : 'bg-slate-200 text-slate-400'
                          }`}>
                            <IconComponent size={20} />
                          </div>
                          <h4 className={`text-xs ${badge.earned ? 'text-emerald-800' : 'text-slate-600'}`}>
                            {badge.name}
                          </h4>
                        </div>
                        {badge.earned && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                          >
                            <CheckCircle className="text-white" size={12} />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export default EcoDashboard;
