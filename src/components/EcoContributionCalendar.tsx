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

  // 🗓 Fetch real activity data from Supabase
  useEffect(() => {
    const fetchActivity = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 5);
      const formattedStart = startDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('eco_activity')
        .select('active_date')
        .eq('user_id', user.id)
        .gte('active_date', formattedStart);

      if (!error && data) {
        const map: Record<string, number> = {};
        data.forEach(({ active_date }) => {
          map[active_date] = (map[active_date] || 0) + 1;
        });
        setActivityMap(map);
      }
    };

    fetchActivity();
  }, []);

  // Generate 6 months (Apr–Sep style layout)
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return date.toLocaleString('default', { month: 'short' });
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Helper for color levels based on activity count
  const getActivityColor = (count: number) => {
    if (count === 0) return 'bg-slate-200 dark:bg-slate-700';
    if (count === 1) return 'bg-emerald-100 dark:bg-emerald-800';
    if (count === 2) return 'bg-emerald-200 dark:bg-emerald-700';
    if (count === 3) return 'bg-emerald-300 dark:bg-emerald-600';
    return 'bg-emerald-400 dark:bg-emerald-500';
  };

  // Build calendar grid for past 6 months
  const generateCalendarData = () => {
    const today = new Date();
    const data: number[][] = [];
    const daysPerWeek = 7;
    const totalWeeks = 6 * 4; // roughly 6 months * 4 weeks

    for (let w = 0; w < totalWeeks; w++) {
      const weekData: number[] = [];
      for (let d = 0; d < daysPerWeek; d++) {
        const day = new Date();
        day.setDate(today.getDate() - (totalWeeks * 7 - (w * 7 + d)));
        const key = day.toISOString().split('T')[0];
        const count = activityMap[key] || 0;
        weekData.push(count);
      }
      data.push(weekData);
    }

    return data;
  };

  const data = generateCalendarData();

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
          {/* Month labels */}
          <div className="flex justify-between items-center">
            {months.map((month) => (
              <div key={month} className="text-sm text-gray-600 dark:text-gray-400 flex-1 text-center">
                {month}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2">
              <div className="h-3"></div> {/* Spacer */}
              {days.map((day, index) => (
                <div 
                  key={day}
                  className={`text-xs text-gray-600 dark:text-gray-400 h-3 flex items-center ${
                    index % 2 === 1 ? 'opacity-0' : ''
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar weeks */}
            <div className="flex gap-1 flex-1">
              {data.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1 flex-1">
                  {week.map((count, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm ${getActivityColor(count)} cursor-pointer`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (weekIndex * 7 + dayIndex) * 0.005, duration: 0.2 }}
                      whileHover={{ scale: 1.2, transition: { duration: 0.1 } }}
                      title={count === 0 ? 'No activity' : `${count} eco-actions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className={`w-3 h-3 rounded-sm ${getActivityColor(level)}`} />
              ))}
            </div>
            <span>More</span>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl text-emerald-600 dark:text-emerald-400">{Object.keys(activityMap).length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Active days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-emerald-600 dark:text-emerald-400">
                {Math.max(...Object.values(activityMap), 0)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Max actions/day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-emerald-600 dark:text-emerald-400">
                {Object.values(activityMap).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total actions</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EcoContributionCalendar;
