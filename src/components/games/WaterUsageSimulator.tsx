import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Home, Zap, Award, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface WaterUsageSimulatorProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  addPointsForUser: (points: number) => Promise<void>; // ✅ added prop
}

interface Appliance {
  id: string;
  name: string;
  baseUsage: number;
  efficient: boolean;
  icon: string;
}

const WaterUsageSimulator = ({ onComplete, onBack, addPointsForUser }: WaterUsageSimulatorProps) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [totalWaterUsed, setTotalWaterUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [dailyUsage, setDailyUsage] = useState<number[]>([]);
  const [todayUsage, setTodayUsage] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false); // ✅ button loading state

  const appliances: Appliance[] = [
    { id: 'shower', name: 'Shower', baseUsage: 80, efficient: false, icon: '🚿' },
    { id: 'toilet', name: 'Toilet Flush', baseUsage: 15, efficient: false, icon: '🚽' },
    { id: 'dishwasher', name: 'Dishwasher', baseUsage: 25, efficient: false, icon: '🍽️' },
    { id: 'washing', name: 'Washing Machine', baseUsage: 100, efficient: false, icon: '👕' },
    { id: 'tap', name: 'Kitchen Tap', baseUsage: 20, efficient: false, icon: '🚰' }
  ];

  const useAppliance = (applianceId: string, efficient: boolean = false) => {
    const appliance = appliances.find(a => a.id === applianceId);
    if (!appliance) return;

    const usage = efficient ? appliance.baseUsage * 0.6 : appliance.baseUsage;
    setTodayUsage(prev => prev + usage);

    if (efficient) {
      setScore(prev => prev + 10);
    }
  };

  // ✅ Updated nextDay function to claim points
  const nextDay = async () => {
    setIsClaiming(true);

    // Save today’s data
    setDailyUsage(prev => [...prev, todayUsage]);
    setTotalWaterUsed(prev => prev + todayUsage);

    // Calculate eco points earned for the day
    const dailyPoints = todayUsage < 250 ? 20 : todayUsage < 350 ? 10 : 5; // less water → more points
    const totalPoints = score + dailyPoints;

    try {
      await addPointsForUser(dailyPoints); // ✅ update Supabase or points table
    } catch (err) {
      console.error('Error claiming eco points:', err);
    }

    setScore(totalPoints);
    setTodayUsage(0);
    setIsClaiming(false);

    if (currentDay < 7) {
      setCurrentDay(prev => prev + 1);
    } else {
      const averageDaily = (totalWaterUsed + todayUsage) / 7;
      const conservationBonus = Math.max(0, (300 - averageDaily) * 2);
      const finalScore = totalPoints + conservationBonus;
      setGameComplete(true);
      setTimeout(() => onComplete(finalScore), 2000);
    }
  };

  const resetGame = () => {
    setCurrentDay(1);
    setTotalWaterUsed(0);
    setScore(0);
    setGameComplete(false);
    setDailyUsage([]);
    setTodayUsage(0);
  };

  const getUsageColor = (usage: number) => {
    if (usage < 200) return 'text-green-600';
    if (usage < 300) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Droplets size={24} />
                Water Usage Simulator
              </CardTitle>
              <p className="text-blue-100 mt-1">Day {currentDay} of 7 - Make smart water choices!</p>
            </div>
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {!gameComplete ? (
              <motion.div
                key="game"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <Droplets className="text-blue-600 mx-auto mb-2" size={24} />
                      <div className={`text-2xl ${getUsageColor(todayUsage)}`}>{Math.round(todayUsage)}L</div>
                      <div className="text-sm text-blue-600">Today's Usage</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50">
                    <CardContent className="p-4 text-center">
                      <Award className="text-green-600 mx-auto mb-2" size={24} />
                      <div className="text-2xl text-green-600">{score}</div>
                      <div className="text-sm text-green-600">Eco Points</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50">
                    <CardContent className="p-4 text-center">
                      <Home className="text-purple-600 mx-auto mb-2" size={24} />
                      <div className="text-2xl text-purple-600">{Math.round(totalWaterUsed / Math.max(currentDay - 1, 1))}L</div>
                      <div className="text-sm text-purple-600">Daily Average</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Water Usage</span>
                    <span className={getUsageColor(todayUsage)}>
                      {Math.round(todayUsage)}/400L (Recommended: 200L)
                    </span>
                  </div>
                  <Progress value={(todayUsage / 400) * 100} className="h-3" />
                </div>

                {/* Appliances */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Choose Your Daily Activities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appliances.map((appliance) => (
                      <Card key={appliance.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{appliance.icon}</span>
                            <div>
                              <h4 className="font-medium">{appliance.name}</h4>
                              <p className="text-sm text-gray-600">Normal: {appliance.baseUsage}L</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              onClick={() => useAppliance(appliance.id, false)}
                              className="w-full text-sm"
                            >
                              Normal Use
                            </Button>
                            <Button
                              onClick={() => useAppliance(appliance.id, true)}
                              className="w-full text-sm bg-green-600 hover:bg-green-700"
                            >
                              Eco Mode <span className="ml-1 text-xs">(-40%)</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Day Action Button */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Tip: Choose "Eco Mode" options to save water and earn bonus points!
                  </div>
                  <Button
                    onClick={nextDay}
                    disabled={isClaiming}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center"
                  >
                    {isClaiming
                      ? 'Claiming Points...'
                      : currentDay < 7
                      ? 'Next Day & Claim Eco Points'
                      : 'Finish Week & Claim Eco Points'}
                    <Zap size={16} className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              // ✅ Game Complete Section
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="space-y-4">
                  <CheckCircle className="text-green-600 mx-auto" size={64} />
                  <h2 className="text-2xl font-bold text-gray-800">Week Complete!</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <Card className="bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-blue-600">{Math.round(totalWaterUsed)}L</div>
                        <div className="text-sm text-blue-600">Total Water Used</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-green-600">{Math.round(totalWaterUsed / 7)}L</div>
                        <div className="text-sm text-green-600">Daily Average</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-purple-600">{score}</div>
                        <div className="text-sm text-purple-600">Final Score</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={resetGame} variant="outline">
                    <RotateCcw size={16} className="mr-2" />
                    Play Again
                  </Button>
                  <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
                    Claim Rewards
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterUsageSimulator;
