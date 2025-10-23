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
  Users, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Play,
  TreePine,
  Droplets,
  Sun,
  Wind,
  Flower,
  Lock,
  Crown,
  Moon,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
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
const EcoDashboard = ({ userRole, userName, onNavigateToLessons, onNavigateToChallenges, onLogout }: EcoDashboardProps) => {
  const [showFloatingElements, setShowFloatingElements] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFloatingElements(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Mock data
  const ecoPoints = 1250;
  const maxEcoPoints = 1500;
  const currentStreak = 7;
  const progressPercentage = (ecoPoints / maxEcoPoints) * 100;

  const stats = [
    { title: 'Challenges Done', value: 12, icon: Target, color: 'from-emerald-500 to-green-500', progress: 60 },
    { title: 'Lessons Learned', value: 8, icon: BookOpen, color: 'from-blue-500 to-cyan-500', progress: 80 },
    { title: 'Badges Earned', value: 5, icon: Award, color: 'from-yellow-500 to-orange-500', progress: 50 },
  ];

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
      color: 'from-blue-500 to-cyan-500'
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
      color: 'from-green-500 to-emerald-500'
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
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Green', points: 2450, avatar: 'AG', isCurrentUser: false },
    { rank: 2, name: 'Maya Forest', points: 2100, avatar: 'MF', isCurrentUser: false },
    { rank: 3, name: 'Sam Rivers', points: 1890, avatar: 'SR', isCurrentUser: false },
    { rank: 4, name: userName, points: ecoPoints, avatar: userName.split(' ').map(n => n[0]).join(''), isCurrentUser: true },
    { rank: 5, name: 'Jordan Leaf', points: 1180, avatar: 'JL', isCurrentUser: false },
  ];

  const badges = [
    { id: 1, name: 'Water Warrior', icon: Droplets, earned: true, description: 'Saved 100L of water' },
    { id: 2, name: 'Tree Hugger', icon: TreePine, earned: true, description: 'Planted 3 trees' },
    { id: 3, name: 'Solar Scholar', icon: Sun, earned: true, description: 'Mastered solar energy' },
    { id: 4, name: 'Wind Walker', icon: Wind, earned: true, description: 'Learned about wind power' },
    { id: 5, name: 'Flower Power', icon: Flower, earned: true, description: 'Created a garden' },
    { id: 6, name: 'Eco Master', icon: Crown, earned: false, description: 'Reach 2000 eco-points' },
    { id: 7, name: 'Green Guru', icon: Leaf, earned: false, description: 'Complete 20 challenges' },
    { id: 8, name: 'Planet Protector', icon: Trophy, earned: false, description: 'Top 3 on leaderboard' },
  ];

  // Floating nature elements
  const floatingElements = [
    { Icon: Leaf, position: { top: '5%', left: '3%' }, delay: 0.2 },
    { Icon: TreePine, position: { top: '15%', right: '5%' }, delay: 0.4 },
    { Icon: Droplets, position: { top: '50%', left: '2%' }, delay: 0.6 },
    { Icon: Sun, position: { top: '60%', right: '3%' }, delay: 0.8 },
    { Icon: Wind, position: { bottom: '20%', left: '4%' }, delay: 1.0 },
    { Icon: Flower, position: { bottom: '35%', right: '6%' }, delay: 1.2 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const CircularProgress = ({ percentage, points, maxPoints }: { percentage: number, points: number, maxPoints: number }) => {
    const radius = 120;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center">
        <svg width="280" height="280" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="rgb(209 213 219)"
            strokeWidth={strokeWidth}
            fill="none"
            className="opacity-20"
          />
          {/* Progress circle */}
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
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(16 185 129)" />
              <stop offset="50%" stopColor="rgb(34 197 94)" />
              <stop offset="100%" stopColor="rgb(20 184 166)" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
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
      {/* Environmental Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1696250863507-262618217c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlcyUyMGdyZWVuJTIwbmF0dXJlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTcxNjI4MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Forest background"
          className="w-full h-full object-cover opacity-5"
        />
      </div>

      {/* Floating Nature Elements */}
      {floatingElements.map(({ Icon, position }, index) => (
        <motion.div
          key={index}
          className="absolute text-emerald-600/20 pointer-events-none hidden lg:block"
          style={position}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon size={24} />
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Leaf className="text-emerald-600" size={32} />
            </motion.div>
            
            <div>
              <h1 className="text-emerald-800 mb-0">Welcome back, {userName}!</h1>
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
  localStorage.removeItem("eco_has_visited");
  localStorage.removeItem("eco_role");
  window.location.href = "/"; // redirects back to Get Started page
}}

              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Large Circular Progress */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="flex justify-center"
            >
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 shadow-lg p-8">
                <CircularProgress 
                  percentage={progressPercentage} 
                  points={ecoPoints} 
                  maxPoints={maxEcoPoints}
                />
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="cursor-pointer"
                  >
                    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-4 text-center">
                        <div className={`mx-auto mb-3 w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="text-white" size={20} />
                        </div>
                        <div className="text-2xl text-slate-800 mb-1">{stat.value}</div>
                        <div className="text-xs text-slate-600">{stat.title}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              
              {/* Additional stats card for Total Points */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cursor-pointer"
              >
                <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Star className="text-white" size={20} />
                    </div>
                    <div className="text-2xl text-slate-800 mb-1">{ecoPoints}</div>
                    <div className="text-xs text-slate-600">Total Points</div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Contribution Calendar */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <Star className="text-emerald-600" size={24} />
                    Eco Contribution Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EcoContributionCalendar />
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Challenges */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.0 }}
            >
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
                      <motion.div
                        key={challenge.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all duration-300"
                      >
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
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Button 
                onClick={onNavigateToLessons}
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-16 text-lg"
                size="lg"
              >
                <BookOpen size={24} className="mr-3" />
                Continue Learning
                <ArrowRight size={20} className="ml-3" />
              </Button>
              
              <Button 
                onClick={onNavigateToChallenges}
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-16 text-lg"
                size="lg"
              >
                <Target size={24} className="mr-3" />
                Browse Challenges
                <ArrowRight size={20} className="ml-3" />
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Leaderboard and Badges */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <Trophy className="text-yellow-500" size={24} />
                    Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {leaderboard.map((user) => (
                    <motion.div
                      key={user.rank}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                        user.isCurrentUser 
                          ? 'bg-emerald-50 border border-emerald-200 shadow-sm' 
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          user.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                          user.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white' :
                          user.rank === 3 ? 'bg-gradient-to-r from-yellow-600 to-yellow-800 text-white' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {user.rank}
                        </div>
                        
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className={`text-sm ${
                            user.isCurrentUser ? 'bg-emerald-100 text-emerald-700' : 
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className={`text-sm ${user.isCurrentUser ? 'text-emerald-800' : 'text-slate-800'}`}>
                            {user.name} {user.isCurrentUser && '(You)'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {user.points.toLocaleString()} points
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Badge Collection */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
            >
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
                    {badges.slice(0, 8).map((badge) => {
                      const IconComponent = badge.icon;
                      return (
                        <motion.div
                          key={badge.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer group ${
                            badge.earned
                              ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 shadow-sm hover:shadow-md'
                              : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-80'
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
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                                : 'bg-slate-200 text-slate-400'
                            }`}>
                              <IconComponent size={20} />
                            </div>                           
                            <div>
                              <h4 className={`text-xs ${
                                badge.earned 
                                  ? 'text-emerald-800' 
                                  : 'text-slate-600'
                              }`}>
                                {badge.name}
                              </h4>
                            </div>
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
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export default EcoDashboard;