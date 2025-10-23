import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  Leaf, 
  Droplets, 
  Zap, 
  Recycle, 
  TreePine, 
  ArrowLeft, 
  Search,
  Calendar,
  Users,
  MapPin,
  Upload,
  Camera,
  Video,
  ChevronRight,
  Clock,
  Award,
  CheckCircle,
  Target,
  Star,
  Sun,
  Wind,
  Flower,
  Image as ImageIcon,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EcoChallengesProps {
  onBack: () => void;
  userName: string;
}

const EcoChallenges = ({ onBack, userName }: EcoChallengesProps) => {
  const [showFloatingElements, setShowFloatingElements] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submissionText, setSubmissionText] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setShowFloatingElements(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'water', name: 'Water', icon: Droplets, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 'energy', name: 'Energy', icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { id: 'waste', name: 'Waste', icon: Recycle, color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'nature', name: 'Nature', icon: TreePine, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  ];

  const challenges = [
    {
      id: 1,
      title: 'Plant a Tree for the Future',
      description: 'Plant a tree in your community and document its growth over time',
      category: 'nature',
      difficulty: 'beginner',
      duration: '1 week',
      points: 200,
      participants: 1250,
      deadline: '2024-01-15',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1733766903731-d171d1c1b0ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudGFsJTIwY2hhbGxlbmdlJTIwdHJlZSUyMHBsYW50aW5nfGVufDF8fHx8MTc1NzE2MzM5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      steps: [
        'Choose a suitable location for planting',
        'Select an appropriate tree species for your climate',
        'Dig a hole twice the width of the root ball',
        'Plant the tree and water thoroughly',
        'Take before and after photos',
        'Set up a care schedule for ongoing maintenance'
      ],
      requirements: ['Photo/video proof', 'Location tagging', 'Care plan documentation'],
      tags: ['Environmental Impact', 'Community Action', 'Long-term Commitment']
    },
    {
      id: 2,
      title: 'Water Conservation Challenge',
      description: 'Reduce your household water usage by 25% this month',
      category: 'water',
      difficulty: 'intermediate',
      duration: '1 month',
      points: 300,
      participants: 850,
      deadline: '2024-01-30',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1666413767635-78c79a06b4db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGNvbnNlcnZhdGlvbiUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTcxNjMzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      steps: [
        'Record your baseline water usage for one week',
        'Identify areas where water can be saved',
        'Implement water-saving techniques',
        'Monitor and track daily usage',
        'Document your conservation methods',
        'Submit final usage comparison report'
      ],
      requirements: ['Water bill comparison', 'Daily usage logs', 'Photo documentation'],
      tags: ['Resource Conservation', 'Data Tracking', 'Lifestyle Change']
    },
    {
      id: 3,
      title: 'Zero Waste Week',
      description: 'Go one full week producing minimal to zero waste',
      category: 'waste',
      difficulty: 'advanced',
      duration: '1 week',
      points: 400,
      participants: 420,
      deadline: '2024-01-20',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1637681262973-a516e647e826?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjB3YXN0ZSUyMG1hbmFnZW1lbnR8ZW58MXx8fHwxNzU3MTYzMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      steps: [
        'Plan your meals to avoid food waste',
        'Bring reusable containers for shopping',
        'Avoid single-use plastics completely',
        'Compost organic waste',
        'Document all waste produced',
        'Share tips and challenges faced'
      ],
      requirements: ['Daily waste photos', 'Shopping receipts', 'Reflection journal'],
      tags: ['Waste Reduction', 'Lifestyle Challenge', 'Awareness Building']
    },
    {
      id: 4,
      title: 'Solar Energy Installation',
      description: 'Install solar panels or solar-powered devices in your home',
      category: 'energy',
      difficulty: 'advanced',
      duration: '2 weeks',
      points: 500,
      participants: 180,
      deadline: '2024-02-01',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1655300256486-4ec7251bf84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NTcwNzAzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      steps: [
        'Research solar options for your location',
        'Calculate energy needs and costs',
        'Choose appropriate solar equipment',
        'Install solar devices (with professional help if needed)',
        'Monitor energy generation',
        'Document savings and environmental impact'
      ],
      requirements: ['Installation photos', 'Energy monitoring data', 'Cost-benefit analysis'],
      tags: ['Renewable Energy', 'Investment', 'Technical Challenge']
    },
    {
      id: 5,
      title: 'Community Garden Initiative',
      description: 'Start or contribute to a community garden project',
      category: 'nature',
      difficulty: 'intermediate',
      duration: '3 weeks',
      points: 350,
      participants: 680,
      deadline: '2024-01-25',
      status: 'active',
      steps: [
        'Find or create a community garden space',
        'Organize volunteers and resources',
        'Plan and plant vegetables or herbs',
        'Establish maintenance schedule',
        'Document community engagement',
        'Share harvest with participants'
      ],
      requirements: ['Community photos', 'Volunteer documentation', 'Growth progress photos'],
      tags: ['Community Building', 'Food Security', 'Collaboration']
    }
  ];

  // Filter challenges
  const filteredChallenges = challenges.filter(challenge => {
    const matchesCategory = selectedCategory === 'all' || challenge.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  // Statistics
  const activeChallenges = challenges.filter(c => c.status === 'active').length;
  const totalParticipants = challenges.reduce((sum, c) => sum + c.participants, 0);
  const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);

  // Floating nature elements
  const floatingElements = [
    { Icon: Leaf, position: { top: '8%', left: '3%' }, delay: 0.2 },
    { Icon: TreePine, position: { top: '12%', right: '5%' }, delay: 0.4 },
    { Icon: Droplets, position: { top: '45%', left: '2%' }, delay: 0.6 },
    { Icon: Sun, position: { top: '55%', right: '3%' }, delay: 0.8 },
    { Icon: Wind, position: { bottom: '25%', left: '4%' }, delay: 1.0 },
    { Icon: Flower, position: { bottom: '40%', right: '6%' }, delay: 1.2 },
  ];

  const floatVariants = {
    animate: {
      y: [0, -8, 0],
      rotate: [0, 2, -2, 0],
      scale: [1, 1.02, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitProof = () => {
    // Handle submission logic here
    console.log('Submitting proof:', {
      challenge: selectedChallenge?.id,
      files: uploadedFiles,
      text: submissionText,
      location
    });
    
    // Reset form
    setUploadedFiles([]);
    setSubmissionText('');
    setLocation('');
    setSelectedChallenge(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4">
      {/* Environmental Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1696250863507-262618217c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlcyUyMGdyZWVuJTIwbmF0dXJlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTcxNjI4MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Forest background"
          className="w-full h-full object-cover opacity-5"
        />
      </div>

      {/* Floating Nature Elements */}
      {showFloatingElements && floatingElements.map(({ Icon, position, delay }, index) => (
        <motion.div
          key={index}
          className="absolute text-emerald-600/20 pointer-events-none hidden lg:block"
          style={position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay, duration: 1 }}
        >
          <motion.div variants={floatVariants} animate="animate">
            <Icon size={28} />
          </motion.div>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/50"
            >
              <ArrowLeft size={20} />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Target className="text-emerald-600" size={32} />
              </motion.div>
              <div>
                <h1 className="text-emerald-800 mb-0">Real-World Challenges</h1>
                <p className="text-emerald-700">Make a difference through action</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardContent className="p-4 text-center">
                <Target className="text-emerald-600 mx-auto mb-2" size={24} />
                <div className="text-xl text-slate-800">{activeChallenges}</div>
                <div className="text-sm text-slate-600">Active Challenges</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardContent className="p-4 text-center">
                <Users className="text-blue-600 mx-auto mb-2" size={24} />
                <div className="text-xl text-slate-800">{totalParticipants.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Participants</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardContent className="p-4 text-center">
                <Award className="text-yellow-600 mx-auto mb-2" size={24} />
                <div className="text-xl text-slate-800">{totalPoints.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Total Points</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardContent className="p-4 text-center">
                <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
                <div className="text-xl text-slate-800">12</div>
                <div className="text-sm text-slate-600">Your Completed</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 border-emerald-200">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-48 border-emerald-200">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' 
              ? 'bg-emerald-600 hover:bg-emerald-700' 
              : 'border-emerald-200 hover:bg-emerald-50'
            }
          >
            All Categories
          </Button>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'border-emerald-200 hover:bg-emerald-50'
                }
              >
                <Icon size={16} className="mr-2" />
                {category.name}
              </Button>
            );
          })}
        </motion.div>

        {/* Challenges Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredChallenges.map((challenge, index) => {
            const categoryData = categories.find(c => c.id === challenge.category);
            const Icon = categoryData?.icon || Target;
            const daysLeft = getDaysLeft(challenge.deadline);
            
            return (
              <motion.div
                key={challenge.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01, y: -3 }}
                className="cursor-pointer"
              >
                <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 h-full hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    {challenge.image && (
                      <ImageWithFallback
                        src={challenge.image}
                        alt={challenge.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="absolute top-3 left-3">
                      <div className={`p-2 rounded-lg ${categoryData?.bgColor || 'bg-slate-100'}`}>
                        <Icon className={categoryData?.color || 'text-slate-600'} size={20} />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <Badge className={daysLeft > 7 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                        {daysLeft} days left
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-slate-800">{challenge.title}</h3>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {challenge.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {challenge.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {challenge.participants}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(challenge.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600">
                        <Award size={14} />
                        +{challenge.points} pts
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Requirements</div>
                        <div className="flex flex-wrap gap-2">
                          {challenge.requirements.slice(0, 2).map((req, reqIndex) => (
                            <Badge key={reqIndex} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {challenge.requirements.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{challenge.requirements.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Tags</div>
                        <div className="flex flex-wrap gap-2">
                          {challenge.tags.slice(0, 2).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs border-emerald-200">
                              {tag}
                            </Badge>
                          ))}
                          {challenge.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs border-emerald-200">
                              +{challenge.tags.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <div className="px-6 pb-6 flex gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 border-emerald-200 hover:bg-emerald-50">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <Icon className={categoryData?.color || 'text-slate-600'} size={24} />
                            {challenge.title}
                          </DialogTitle>
                          <DialogDescription>
                            View detailed information about this environmental challenge including steps, requirements, and instructions to participate.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {challenge.image && (
                            <ImageWithFallback
                              src={challenge.image}
                              alt={challenge.title}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          )}
                          
                          <div>
                            <h4 className="text-emerald-800 mb-2">Description</h4>
                            <p className="text-slate-600">{challenge.description}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-emerald-800 mb-3">Step-by-Step Instructions</h4>
                            <div className="space-y-3">
                              {challenge.steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="flex gap-3">
                                  <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                                    {stepIndex + 1}
                                  </div>
                                  <p className="text-slate-600 text-sm">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-emerald-800 mb-2">Requirements</h4>
                            <div className="space-y-2">
                              {challenge.requirements.map((req, reqIndex) => (
                                <div key={reqIndex} className="flex items-center gap-2">
                                  <CheckCircle className="text-emerald-600" size={16} />
                                  <span className="text-slate-600 text-sm">{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                              onClick={() => setSelectedChallenge(challenge)}
                            >
                              Join Challenge
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={selectedChallenge?.id === challenge.id} onOpenChange={(open) => !open && setSelectedChallenge(null)}>
                      <DialogTrigger asChild>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                          onClick={() => setSelectedChallenge(challenge)}
                        >
                          Submit Proof
                          <Upload size={16} className="ml-2" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <Upload className="text-emerald-600" size={24} />
                            Submit Proof for: {selectedChallenge?.title}
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="text-emerald-800 mb-2 block">Upload Photos/Videos</label>
                            <div className="border-2 border-dashed border-emerald-200 rounded-lg p-6 text-center">
                              <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                              />
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <Camera className="text-emerald-600 mx-auto mb-2" size={32} />
                                <p className="text-slate-600">Click to upload photos or videos</p>
                                <p className="text-slate-500 text-sm">PNG, JPG, MP4 up to 10MB each</p>
                              </label>
                            </div>
                            
                            {uploadedFiles.length > 0 && (
                              <div className="mt-4 space-y-2">
                                {uploadedFiles.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-emerald-50 rounded">
                                    <div className="flex items-center gap-2">
                                      {file.type.startsWith('image/') ? <ImageIcon size={16} /> : <Video size={16} />}
                                      <span className="text-sm">{file.name}</span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFile(index)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-emerald-800 mb-2 block">Location (optional)</label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                              <Input
                                placeholder="Enter location where you completed the challenge"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="pl-10 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-emerald-800 mb-2 block">Description</label>
                            <Textarea
                              placeholder="Describe your experience, challenges faced, and outcomes..."
                              value={submissionText}
                              onChange={(e) => setSubmissionText(e.target.value)}
                              className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200"
                              rows={4}
                            />
                          </div>
                          
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              className="flex-1 border-emerald-200"
                              onClick={() => setSelectedChallenge(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                              onClick={handleSubmitProof}
                              disabled={uploadedFiles.length === 0 && !submissionText.trim()}
                            >
                              Submit Proof
                              <CheckCircle size={16} className="ml-2" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredChallenges.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Target className="text-slate-400 mx-auto mb-4" size={48} />
            <h3 className="text-slate-600 mb-2">No challenges found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EcoChallenges;