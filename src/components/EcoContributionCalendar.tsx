import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface EcoContributionCalendarProps {
  className?: string;
}

const EcoContributionCalendar = ({ className = '' }: EcoContributionCalendarProps) => {
  // Generate calendar data for the last 6 months
  const generateCalendarData = () => {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeksPerMonth = 4;
    const daysPerWeek = 7;
    
    const data: number[][] = [];
    
    for (let month = 0; month < months.length; month++) {
      for (let week = 0; week < weeksPerMonth; week++) {
        const weekData: number[] = [];
        for (let day = 0; day < daysPerWeek; day++) {
          // Generate random contribution levels (0-4)
          // Higher activity in recent months
          const activityBonus = month >= 3 ? 1 : 0;
          const randomActivity = Math.floor(Math.random() * (4 + activityBonus));
          weekData.push(Math.min(randomActivity, 4));
        }
        data.push(weekData);
      }
    }
    return { months, days, data };
  };

  const { months, days, data } = generateCalendarData();

  const getActivityColor = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-slate-200 dark:bg-slate-700';
      case 1:
        return 'bg-emerald-100 dark:bg-emerald-800';
      case 2:
        return 'bg-emerald-200 dark:bg-emerald-700';
      case 3:
        return 'bg-emerald-300 dark:bg-emerald-600';
      case 4:
        return 'bg-emerald-400 dark:bg-emerald-500';
      default:
        return 'bg-slate-200 dark:bg-slate-700';
    }
  };

  const getActivityLabel = (level: number) => {
    switch (level) {
      case 0:
        return 'No activity';
      case 1:
        return 'Low activity';
      case 2:
        return 'Moderate activity';
      case 3:
        return 'High activity';
      case 4:
        return 'Very high activity';
      default:
        return 'No activity';
    }
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
          {/* Month labels */}
          <div className="flex justify-between items-center">
            {months.map((month, index) => (
              <div key={month} className="text-sm text-gray-600 dark:text-gray-400 flex-1 text-center">
                {month}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2">
              <div className="h-3"></div> {/* Spacer for month labels */}
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
                  {week.map((activity, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm ${getActivityColor(activity)} cursor-pointer`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: (weekIndex * 7 + dayIndex) * 0.01,
                        duration: 0.2 
                      }}
                      whileHover={{ 
                        scale: 1.2,
                        transition: { duration: 0.1 }
                      }}
                      title={`${getActivityLabel(activity)} - ${activity} eco-actions`}
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
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getActivityColor(level)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl text-emerald-600 dark:text-emerald-400">156</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total contributions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-emerald-600 dark:text-emerald-400">23</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Longest streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-emerald-600 dark:text-emerald-400">7</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Current streak</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EcoContributionCalendar;