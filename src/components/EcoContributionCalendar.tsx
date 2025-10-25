import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "../supabaseClient";

interface EcoContributionCalendarProps {
  className?: string;
}

const EcoContributionCalendar = ({ className }: EcoContributionCalendarProps) => {
  const [activity, setActivity] = useState<{ date: string; count: number }[]>([]);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalActions, setTotalActions] = useState(0);

  useEffect(() => {
    const fetchActivity = async () => {
      const { data, error } = await supabase
        .from("eco_activity")
        .select("created_at");

      if (error) {
        console.error(error);
        return;
      }

      // ✅ Group activity by date
      const dateMap: Record<string, number> = {};
      data.forEach((item) => {
        const date = new Date(item.created_at).toISOString().split("T")[0];
        dateMap[date] = (dateMap[date] || 0) + 1;
      });

      const formattedData = Object.entries(dateMap).map(([date, count]) => ({
        date,
        count,
      }));

      setActivity(formattedData);
      setTotalActions(formattedData.length);

      // ✅ Calculate streaks
      const sortedDates = Object.keys(dateMap)
        .map((d) => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());

      let current = 0;
      let longest = 0;
      for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0 || sortedDates[i].getTime() - sortedDates[i - 1].getTime() === 86400000) {
          current++;
        } else {
          longest = Math.max(longest, current);
          current = 1;
        }
      }
      longest = Math.max(longest, current);

      // ✅ Check if today continues the streak
      const lastDate = sortedDates[sortedDates.length - 1];
      const today = new Date();
      const diff = Math.floor((today.getTime() - lastDate.getTime()) / 86400000);
      const currentStreak = diff <= 1 ? current : 0;

      setStreak(currentStreak);
      setLongestStreak(longest);
    };

    fetchActivity();

    // ✅ Realtime updates
    const channel = supabase
      .channel("realtime:eco_activity")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eco_activity" },
        () => fetchActivity()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ✅ Prepare data for calendar
  const start = new Date();
  start.setMonth(start.getMonth() - 6);
  const end = new Date();
  const days: { date: string; count: number }[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const dayData = activity.find((a) => a.date === dateStr);
    days.push({ date: dateStr, count: dayData ? dayData.count : 0 });
  }

  // ✅ Define shades for activity intensity
  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-200";
    if (count === 1) return "bg-green-300";
    if (count === 2) return "bg-green-400";
    if (count === 3) return "bg-green-500";
    return "bg-green-600";
  };

  return (
    <Card className={`p-6 bg-white/70 backdrop-blur-md border border-green-200 shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center gap-2">
        <Star className="text-green-600" />
        <CardTitle className="text-green-800 text-lg">Eco Contribution Calendar</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((lvl) => (
              <div key={lvl} className={`w-3 h-3 rounded-sm ${getColor(lvl)}`}></div>
            ))}
          </div>
          <span>More</span>
        </div>

        {/* ✅ Calendar grid */}
        <div className="grid grid-cols-30 gap-1 justify-center mt-4">
          {days.map((day) => (
            <motion.div
              key={day.date}
              className={`w-4 h-4 rounded-md ${getColor(day.count)}`}
              whileHover={{ scale: 1.2 }}
              title={`${day.date}: ${day.count} action${day.count > 1 ? "s" : ""}`}
            />
          ))}
        </div>

        {/* ✅ Stats */}
        <div className="flex justify-around mt-6 text-center">
          <div>
            <p className="text-2xl text-green-700 font-semibold">{totalActions}</p>
            <p className="text-sm text-gray-600">Total actions</p>
          </div>
          <div>
            <p className="text-2xl text-green-700 font-semibold">{longestStreak}</p>
            <p className="text-sm text-gray-600">Longest streak</p>
          </div>
          <div>
            <p className="text-2xl text-green-700 font-semibold">{streak}</p>
            <p className="text-sm text-gray-600">Current streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EcoContributionCalendar;
