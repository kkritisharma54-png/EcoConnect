import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { supabase } from '../supabaseClient';

interface EcoContributionCalendarProps {
  className?: string;
}

const EcoContributionCalendar = ({ className = '' }: EcoContributionCalendarProps) => {
  const [activityMap, setActivityMap] = useState<Record<string, number>>({});
  const [totalActions, setTotalActions] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  // Fetch activity from Supabase (active_date)
  useEffect(() => {
    let channel: any = null;

    const fetchActivity = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 6 months ago
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 5);
      const formattedStart = startDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('eco_activity')
        .select('active_date')
        .eq('user_id', user.id)
        .gte('active_date', formattedStart)
        .order('active_date', { ascending: true });

      if (error) {
        console.error('fetchActivity error', error);
        return;
      }

      // Build map keyed by YYYY-MM-DD
      const map: Record<string, number> = {};
      if (data && Array.isArray(data)) {
        data.forEach((row: any) => {
          // normalize active_date
          const dateKey = new Date(row.active_date).toISOString().split('T')[0];
          map[dateKey] = (map[dateKey] || 0) + 1;
        });
      }

      setActivityMap(map);

      // stats
      const counts = Object.values(map).reduce((a, b) => a + b, 0);
      setTotalActions(counts);

      // compute streaks
      const sortedDates = Object.keys(map)
        .map((d) => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());

      if (sortedDates.length === 0) {
        setCurrentStreak(0);
        setLongestStreak(0);
        return;
      }

      // longest streak
      let longest = 0;
      let run = 0;
      for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0) {
          run = 1;
        } else {
          const diff = Math.round((sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
          if (diff === 1) run++;
          else run = 1;
        }
        longest = Math.max(longest, run);
      }

      // current streak: count consecutive days up to today
      const todayKey = new Date().toISOString().split('T')[0];
      let currRun = 0;
      let checkDate = new Date(); // start from today
      // iterate backward until a missing date
      while (true) {
        const key = checkDate.toISOString().split('T')[0];
        if (map[key]) {
          currRun++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      setCurrentStreak(currRun);
      setLongestStreak(longest);
    };

    // initial fetch
    fetchActivity();

    // realtime subscription to refresh when rows change
    channel = supabase
      .channel('realtime:eco_activity')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'eco_activity' },
        () => {
          fetchActivity();
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Calendar grid generation (past ~6 months), align to Monday
  const buildWeeks = () => {
    const end = new Date(); // today
    const start = new Date();
    start.setMonth(start.getMonth() - 5); // 6 months window
    // align start to previous Monday
    const startDay = start.getDay(); // 0 Sun .. 6 Sat
    const offsetToMonday = (startDay + 6) % 7; // 0->Mon offset
    start.setDate(start.getDate() - offsetToMonday);

    // total days
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalWeeks = Math.ceil(totalDays / 7);

    const weeks: { date: string; count: number }[][] = [];
    for (let w = 0; w < totalWeeks; w++) {
      const week: { date: string; count: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(start);
        day.setDate(start.getDate() + w * 7 + d);
        const key = day.toISOString().split('T')[0];
        week.push({ date: key, count: activityMap[key] || 0 });
      }
      weeks.push(week);
    }
    return weeks;
  };

  const weeks = buildWeeks();
  const todayKey = new Date().toISOString().split('T')[0];

  // inline style for color intensity
  const getDotStyle = (count: number) => {
    if (!count) return { backgroundColor: 'rgba(226,232,240,1)' }; // slate-200
    const opacity = Math.min(1, 0.4 + count * 0.25); // 0.65 for 1, 0.9 for 2, etc
    return { backgroundColor: `rgba(16,185,129,${opacity})` }; // emerald
  };

  return (
    <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200 dark:border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
          <Star size={24} />
          Eco Contribution Calendar
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Month labels - spread across weeks */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            {/* place month labels approximately at quarter positions */}
            {(() => {
              // choose six evenly spaced label positions across weeks
              const labelsCount = 6;
              const labelIndexes: number[] = [];
              const total = weeks.length;
              for (let i = 0; i < labelsCount; i++) {
                labelIndexes.push(Math.floor((i / labelsCount) * total));
              }
              return labelIndexes.map((wi, idx) => {
                const week = weeks[Math.max(0, Math.min(weeks.length - 1, wi))];
                const month = week && week[0] ? new Date(week[0].date).toLocaleString('default', { month: 'short' }) : '';
                return (
                  <div key={idx} className="flex-1 text-center">
                    {month}
                  </div>
                );
              });
            })()}
          </div>

          {/* grid layout: left day labels + scrollable weeks-columns */}
          <div className="flex gap-2 items-start">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-3 w-10">
              <div className="h-3" />
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                <div key={d} className="text-xs text-gray-600 dark:text-gray-400 h-3 flex items-center">
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks columns: each week is a column of 7 tiny dots */}
            <div className="flex gap-1 overflow-x-auto py-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <motion.div
                      key={day.date}
                      className={`w-3 h-3 rounded-sm ${day.date === todayKey ? 'ring-1 ring-emerald-500' : ''}`}
                      style={getDotStyle(day.count)}
                      title={`${day.date}: ${day.count} ${day.count === 1 ? 'action' : 'actions'}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.08 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* legend */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((lvl) => (
                <div
                  key={lvl}
                  className="w-3 h-3 rounded-sm"
                  style={
                    lvl === 0
                      ? { backgroundColor: 'rgba(226,232,240,1)' }
                      : { backgroundColor: `rgba(16,185,129,${Math.min(1, 0.4 + lvl * 0.25)})` }
                  }
                />
              ))}
            </div>
            <span>More</span>
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl text-emerald-600 dark:text-emerald-400">{totalActions}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total actions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-emerald-600 dark:text-emerald-400">{longestStreak}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Longest streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-emerald-600 dark:text-emerald-400">{currentStreak}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Current streak</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EcoContributionCalendar;
