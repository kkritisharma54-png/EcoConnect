import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Recycle, CheckCircle, Award, RotateCcw, ArrowRight, Leaf } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface CompostJarProjectProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface CompostItem {
  id: string;
  name: string;
  type: 'green' | 'brown';
  emoji: string;
  added: boolean;
}

interface Step {
  id: number;
  title: string;
  description: string;
  action?: string;
  completed: boolean;
}

const CompostJarProject = ({ onComplete, onBack }: CompostJarProjectProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [projectComplete, setProjectComplete] = useState(false);
  const [jarLayers, setJarLayers] = useState<string[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0); // Simulated days

  const compostItems: CompostItem[] = [
    { id: 'banana', name: 'Banana Peels', type: 'green', emoji: '🍌', added: false },
    { id: 'leaves', name: 'Dry Leaves', type: 'brown', emoji: '🍂', added: false },
    { id: 'apple', name: 'Apple Cores', type: 'green', emoji: '🍎', added: false },
    { id: 'paper', name: 'Shredded Paper', type: 'brown', emoji: '📄', added: false },
    { id: 'coffee', name: 'Coffee Grounds', type: 'green', emoji: '☕', added: false },
    { id: 'cardboard', name: 'Cardboard Pieces', type: 'brown', emoji: '📦', added: false },
    { id: 'vegetable', name: 'Vegetable Scraps', type: 'green', emoji: '🥕', added: false },
    { id: 'eggshell', name: 'Crushed Eggshells', type: 'brown', emoji: '🥚', added: false }
  ];

  const [availableItems, setAvailableItems] = useState(compostItems);

  const steps: Step[] = [
    {
      id: 0,
      title: 'Gather Your Materials',
      description: 'Collect a clear jar, drill/nail for holes, and organic materials for composting.',
      completed: false
    },
    {
      id: 1,
      title: 'Prepare the Jar',
      description: 'Make small holes in the lid for airflow. This allows oxygen to reach the microorganisms.',
      action: 'drill',
      completed: false
    },
    {
      id: 2,
      title: 'Add Brown Materials',
      description: 'Start with carbon-rich "brown" materials like dry leaves, paper, or cardboard.',
      action: 'add-brown',
      completed: false
    },
    {
      id: 3,
      title: 'Add Green Materials',
      description: 'Layer nitrogen-rich "green" materials like fruit peels and vegetable scraps.',
      action: 'add-green',
      completed: false
    },
    {
      id: 4,
      title: 'Create Layers',
      description: 'Continue alternating brown and green materials. Aim for a 3:1 brown to green ratio.',
      action: 'layer',
      completed: false
    },
    {
      id: 5,
      title: 'Add Moisture',
      description: 'Lightly spray with water. The mixture should feel like a wrung-out sponge.',
      action: 'water',
      completed: false
    },
    {
      id: 6,
      title: 'Wait and Observe',
      description: 'Watch your compost decompose over time! Shake gently every few days.',
      action: 'wait',
      completed: false
    }
  ];

  const [projectSteps, setProjectSteps] = useState(steps);

  const addItemToJar = (item: CompostItem) => {
    if (currentStep < 2) return; // Can't add items until step 2
    
    setJarLayers(prev => [...prev, `${item.type}-${item.emoji}`]);
    setAvailableItems(prev => prev.map(i => 
      i.id === item.id ? { ...i, added: true } : i
    ));
    setScore(prev => prev + 10);
    
    // Check if we should advance steps
    if (currentStep === 2 && item.type === 'brown') {
      completeStep(2);
    } else if (currentStep === 3 && item.type === 'green') {
      completeStep(3);
    } else if (currentStep === 4 && jarLayers.length >= 4) {
      completeStep(4);
    }
  };

  const completeStep = (stepId: number) => {
    setProjectSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
    
    if (stepId === currentStep) {
      setScore(prev => prev + 25);
      
      if (stepId < steps.length - 1) {
        setTimeout(() => setCurrentStep(stepId + 1), 1000);
      } else {
        setProjectComplete(true);
        setTimeout(() => onComplete(score + 100), 2000);
      }
    }
  };

  const performAction = (action: string) => {
    switch (action) {
      case 'drill':
        completeStep(1);
        break;
      case 'water':
        completeStep(5);
        break;
      case 'wait':
        setTimeElapsed(30); // Skip to 30 days
        completeStep(6);
        break;
    }
  };

  const resetProject = () => {
    setCurrentStep(0);
    setScore(0);
    setProjectComplete(false);
    setJarLayers([]);
    setTimeElapsed(0);
    setAvailableItems(compostItems);
    setProjectSteps(steps);
  };

  const getStepProgress = () => ((currentStep + 1) / steps.length) * 100;

  const renderJar = () => {
    return (
      <div className="relative w-40 h-60 mx-auto">
        {/* Jar outline */}
        <div className="absolute inset-0 border-4 border-gray-400 rounded-b-full bg-gradient-to-b from-transparent to-gray-100">
          {/* Jar lid */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-600 rounded-t-lg">
            {projectSteps[1].completed && (
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                <div className="w-1 h-2 bg-black rounded-full opacity-50"></div>
                <div className="w-1 h-2 bg-black rounded-full opacity-50"></div>
                <div className="w-1 h-2 bg-black rounded-full opacity-50"></div>
              </div>
            )}
          </div>
          
          {/* Compost layers */}
          <div className="absolute bottom-2 left-2 right-2 space-y-1">
            {jarLayers.map((layer, index) => {
              const [type, emoji] = layer.split('-');
              return (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`h-8 rounded flex items-center justify-center text-sm ${
                    type === 'brown' ? 'bg-amber-200' : 'bg-green-200'
                  }`}
                >
                  <span className="text-xs">{emoji}</span>
                </motion.div>
              );
            })}
          </div>
          
          {/* Decomposition progress */}
          {timeElapsed > 0 && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-black/20 rounded p-2 text-center">
                <div className="text-xs text-white">🦠 Decomposing...</div>
                <div className="text-xs text-white">{timeElapsed} days</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Recycle size={24} />
                DIY Compost Jar Project
              </CardTitle>
              <p className="text-green-100 mt-1">Create your own mini composting system!</p>
            </div>
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {!projectComplete ? (
              <motion.div
                key="project"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Project Progress</span>
                    <span>Step {currentStep + 1} of {steps.length}</span>
                  </div>
                  <Progress value={getStepProgress()} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Instructions */}
                  <div className="space-y-4">
                    <Card className="bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {currentStep + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-blue-800 mb-2">
                              {projectSteps[currentStep].title}
                            </h3>
                            <p className="text-blue-700 text-sm mb-3">
                              {projectSteps[currentStep].description}
                            </p>
                            
                            {projectSteps[currentStep].action && !projectSteps[currentStep].completed && (
                              <Button
                                onClick={() => performAction(projectSteps[currentStep].action!)}
                                className="bg-blue-600 hover:bg-blue-700"
                                size="sm"
                              >
                                {projectSteps[currentStep].action === 'drill' && '🔧 Drill Holes'}
                                {projectSteps[currentStep].action === 'water' && '💧 Add Water'}
                                {projectSteps[currentStep].action === 'wait' && '⏰ Fast Forward 30 Days'}
                                <ArrowRight size={14} className="ml-2" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Available materials */}
                    {(currentStep >= 2 && currentStep <= 4) && (
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-3">Available Compost Materials:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {availableItems.filter(item => !item.added).map((item) => (
                              <Button
                                key={item.id}
                                variant="outline"
                                onClick={() => addItemToJar(item)}
                                className={`p-3 text-left ${
                                  item.type === 'brown' ? 'border-amber-300 hover:bg-amber-50' : 'border-green-300 hover:bg-green-50'
                                }`}
                                disabled={
                                  (currentStep === 2 && item.type !== 'brown') ||
                                  (currentStep === 3 && item.type !== 'green')
                                }
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{item.emoji}</span>
                                  <div>
                                    <div className="text-xs font-medium">{item.name}</div>
                                    <div className={`text-xs ${
                                      item.type === 'brown' ? 'text-amber-600' : 'text-green-600'
                                    }`}>
                                      {item.type === 'brown' ? 'Carbon (Brown)' : 'Nitrogen (Green)'}
                                    </div>
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Score */}
                    <Card className="bg-yellow-50">
                      <CardContent className="p-4 text-center">
                        <Award className="text-yellow-600 mx-auto mb-2" size={24} />
                        <div className="text-2xl text-yellow-600">{score}</div>
                        <div className="text-sm text-yellow-600">Project Points</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Jar visualization */}
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-center mb-4">Your Compost Jar</h4>
                        {renderJar()}
                        
                        {jarLayers.length > 0 && (
                          <div className="mt-4 text-center">
                            <div className="text-sm text-gray-600 mb-2">Current Layers:</div>
                            <div className="flex justify-center gap-2">
                              {jarLayers.slice(-4).map((layer, index) => {
                                const [type] = layer.split('-');
                                return (
                                  <div
                                    key={index}
                                    className={`w-4 h-4 rounded ${
                                      type === 'brown' ? 'bg-amber-400' : 'bg-green-400'
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Tips */}
                    <Card className="bg-green-50">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-green-800 mb-2">💡 Composting Tips:</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Browns provide carbon (dry materials)</li>
                          <li>• Greens provide nitrogen (wet materials)</li>
                          <li>• Keep a 3:1 brown to green ratio</li>
                          <li>• Turn/shake regularly for air circulation</li>
                          <li>• Maintain moisture like a wrung-out sponge</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="space-y-4">
                  <CheckCircle className="text-green-600 mx-auto" size={64} />
                  <h2 className="text-2xl font-bold text-gray-800">Compost Master!</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <Card className="bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-green-600">{score}</div>
                        <div className="text-sm text-green-600">Total Score</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-blue-600">{jarLayers.length}</div>
                        <div className="text-sm text-blue-600">Layers Added</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-medium text-emerald-800 mb-2">🌱 What Happens Next:</h4>
                    <ul className="text-sm text-emerald-700 text-left space-y-1">
                      <li>• Week 1-2: Materials start breaking down, temperature rises</li>
                      <li>• Week 3-4: Decomposition accelerates, volume reduces</li>
                      <li>• Month 2-3: Materials become unrecognizable</li>
                      <li>• Month 3-6: Rich, dark compost forms</li>
                      <li>• Final product: Nutrient-rich soil amendment!</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={resetProject} variant="outline">
                    <RotateCcw size={16} className="mr-2" />
                    Start New Project
                  </Button>
                  <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
                    <Leaf size={16} className="mr-2" />
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

export default CompostJarProject;