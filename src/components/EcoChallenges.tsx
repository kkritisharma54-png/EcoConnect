import { motion } from 'motion/react';
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
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
import { supabase } from '../supabaseClient';
interface EcoChallengesProps {
  onBack: () => void;
  userName: string;
}
async function uploadProofFiles(userId: string, files: File[], activityId: number) {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const filePath = `${userId}/${activityId}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('eco-proof')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('eco-proof')
      .getPublicUrl(filePath);

    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
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
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCompleted, setUserCompleted] = useState(0);
  const [userTotalPoints, setUserTotalPoints] = useState(0);
  const [activeChallenges, setActiveChallenges] = useState(0);   // for this user
const [totalParticipants, setTotalParticipants] = useState(0); // all users
     // already have this



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

  useEffect(() => {
  const loadChallenges = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('eco_challenge')
      .select('*')
      .eq('status', 'active')
      .order('deadline', { ascending: true });

    if (!error && data) setChallenges(data);
    setLoading(false);
  };

  loadChallenges();
}, []);
   const loadStats = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return;

  // user-specific activities
  const { data: userActivities, error: userActError } = await supabase
    .from('eco_activity')
    .select('challenge_id, points, status')
    .eq('user_id', user.id);

  if (!userActError && userActivities) {
    const completed = userActivities.filter(
      (a) => a.status === 'submitted' || a.status === 'approved'
    );

    // distinct challenges this user has submitted for
    const challengeIds = new Set(completed.map((a) => a.challenge_id));
    setActiveChallenges(challengeIds.size);
    setUserCompleted(challengeIds.size);

    const sumPoints = completed.reduce(
      (sum, a) => sum + (a.points || 0),
      0
    );
    setUserTotalPoints(sumPoints);
  }

  // global participants (unique users with at least one submission)
  const { data: allActivities, error: allActError } = await supabase
    .from('eco_activity')
    .select('user_id, status');

  if (!allActError && allActivities) {
    const usersWithSubmissions = new Set(
      allActivities
        .filter((a) => a.status === 'submitted' || a.status === 'approved')
        .map((a) => a.user_id)
    );
    setTotalParticipants(usersWithSubmissions.size);
  }
};
useEffect(() => {
  loadStats();
}, []);

  // Filter challenges
  const filteredChallenges = challenges.filter(challenge => {
    const matchesCategory = selectedCategory === 'all' || challenge.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  // Statistics
//   const activeChallenges = challenges.filter(c => c.status === 'active').length;
// const totalParticipants = challenges.reduce((sum, c) => sum + c.participants, 0);
// const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);


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

  const handleSubmitProof = async () => {
  if (!selectedChallenge) return;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('No user', userError);
    return;
  }

  // 1) create eco_activity row
  const { data: activity, error: activityError } = await supabase
    .from('eco_activity')
    .insert({
      user_id: user.id,
      challenge_id: selectedChallenge.id,
      active_date: new Date().toISOString().slice(0, 10),
      points: selectedChallenge.points,       // reward
      description: submissionText,
      activity_type: 'challenge_submission',
      status: 'submitted',
    })
    .select('id')
    .single();

  if (activityError || !activity) {
    console.error('Activity insert error', activityError);
    return;
  }

  const activityId = activity.id;

  // 2) upload files to Storage
  let proofUrls: string[] = [];
  if (uploadedFiles.length > 0) {
    proofUrls = await uploadProofFiles(user.id, uploadedFiles, activityId);
  }

  // 3) store URLs in eco_activity
  if (proofUrls.length > 0) {
    const { error: updateError } = await supabase
      .from('eco_activity')
      .update({ proof_urls: proofUrls })
      .eq('id', activityId);

    if (updateError) {
      console.error('Update proof URLs error', updateError);
      return;
    }
  }

  // 4) reset UI
  setUploadedFiles([]);
  setSubmissionText('');
  setLocation('');
  setSelectedChallenge(null);

  await loadStats();

};

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-600">
        Loading challenges...
      </div>
    );
  }
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
                <div className="text-xl text-slate-800">{userTotalPoints.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Total Points</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardContent className="p-4 text-center">
                <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
                <div className="text-xl text-slate-800">{userCompleted}</div>
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
                    {challenge.image_url && (
                      <ImageWithFallback
                        src={challenge.image_url}
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
                          {challenge.requirements.slice(0, 2).map((req: any, reqIndex: any) => (
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
                          {challenge.tags.slice(0, 2).map((tag: any, tagIndex: any) => (
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
                          {challenge.image_url && (
                            <ImageWithFallback
                              src={challenge.image_url}
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
                              {challenge.steps.map((step: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, stepIndex: Key | null | undefined) => (
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
                              {challenge.requirements.map((req: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, reqIndex: Key | null | undefined) => (
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
                    
                    <Dialog
  open={selectedChallenge?.id === challenge.id}
  onOpenChange={(open: any) => !open && setSelectedChallenge(null)}
>
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
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-emerald-50 rounded"
              >
                <div className="flex items-center gap-2">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon size={16} />
                  ) : (
                    <Video size={16} />
                  )}
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
          <MapPin
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={20}
          />
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