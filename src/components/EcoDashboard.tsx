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
  CheckCircle,
  Clock,
  Play,
  TreePine,
  Droplets,
  Sun,
  Wind,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import EcoContributionCalendar from './EcoContributionCalendar';
import { supabase } from '../supabaseClient';

const EcoDashboard = () => {
  const [showFloatingElements, setShowFloatingElements] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Step 1: Floating nature icons
  useEffect(() => {
    const timer = setTimeout(() => setShowFloatingElements(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Step 2: Record user activity in Supabase
  useEffect(() => {
    const recordActivity = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('eco_activity')
        .select('*')
        .eq('user_id', user.id)
        .eq('active_date', today)
        .single();

      if (!data && !error) {
        await supabase.from('eco_activity').insert([
          { user_id: user.id, active_date: today },
        ]);
      }
    };

    recordActivity();
  }, []);

  // Step 3: Fetch and calculate user streak
  useEffect(() => {
    const fetchStreak = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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
        if (diffDays === 0 || diffDays === streak) streak++;
        else break;
      }
      setCurrentStreak(streak);
    };

    fetchStreak();
  }, []);

  const natureIcons = [
    { Icon: Leaf, color: 'text-emerald-500' },
    { Icon: Flame, color: 'text-orange-500' },
    { Icon: TreePine, color: 'text-green-700' },
    { Icon: Droplets, color: 'text-cyan-500' },
    { Icon: Sun, color: 'text-yellow-400' },
    { Icon: Wind, color: 'text-blue-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-6 relative overflow-hidden">
      {/* Floating Elements */}
      {showFloatingElements &&
        natureIcons.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.color}`}
            initial={{ opacity: 0, y: 50, scale: 0 }}
            animate={{
              opacity: 0.3,
              y: [0, -20, 0],
              x: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + index * 0.5,
              repeat: Infinity,
              delay: index * 0.3,
            }}
            style={{
              top: `${20 + index * 12}%`,
              left: `${10 + (index % 3) * 30}%`,
            }}
          >
            <item.Icon size={32} />
          </motion.div>
        ))}

      {/* Dashboard Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {/* Header Section */}
        <motion.div
          className="text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
            🌿 Eco Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your environmental progress and challenges
          </p>
        </motion.div>

        {/* Streak + Stats */}
        <motion.div
          className="grid grid-cols-3 gap-6 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardContent className="pt-6">
              <Trophy className="mx-auto text-yellow-500 mb-2" size={28} />
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {currentStreak} Day Streak
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardContent className="pt-6">
              <Target className="mx-auto text-emerald-500 mb-2" size={28} />
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Weekly Goal
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardContent className="pt-6">
              <Star className="mx-auto text-emerald-500 mb-2" size={28} />
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Eco Points: 120
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calendar Section */}
        <EcoContributionCalendar />

        {/* Challenges Section */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <BookOpen size={24} />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={16} />
                  Plant 5 trees this month
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="text-amber-500" size={16} />
                  Reduce electricity use by 10%
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <Award size={24} />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex justify-between">
                  <span>🌿 You</span> <span className="font-semibold">#2</span>
                </li>
                <li className="flex justify-between">
                  <span>🌎 GreenGuru</span>{' '}
                  <span className="font-semibold">#1</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 py-2 flex items-center gap-2">
            <Play size={16} />
            Start New Mission
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EcoDashboard;
