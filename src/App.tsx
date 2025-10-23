import { motion } from "motion/react";
import { supabase } from "./supabaseClient";
import {
  Leaf,
  Droplets,
  Sun,
  TreePine,
  Wind,
  Flower,
  ArrowRight,
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Button } from "./components/ui/button";
import EcoAuth from "./components/EcoAuth";
import EcoDashboard from "./components/EcoDashboard";
import EcoLessons from "./components/EcoLessons";
import EcoChallenges from "./components/EcoChallenges";
import EcoAI from "./components/EcoAI";
import { useEffect, useState } from "react";
const EcoSplash = ({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const natureIcons = [
    {
      Icon: Leaf,
      delay: 0.2,
      position: { top: "20%", left: "15%" },
    },
    {
      Icon: Droplets,
      delay: 0.4,
      position: { top: "30%", right: "20%" },
    },
    {
      Icon: Sun,
      delay: 0.6,
      position: { top: "70%", left: "10%" },
    },
    {
      Icon: TreePine,
      delay: 0.8,
      position: { top: "15%", right: "15%" },
    },
    {
      Icon: Wind,
      delay: 1.0,
      position: { bottom: "25%", right: "25%" },
    },
    {
      Icon: Flower,
      delay: 1.2,
      position: { bottom: "20%", left: "20%" },
    },
  ];
  const bounceVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1723816259091-48094e5916f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsZWFmJTIwZ3JlZW4lMjBhYnN0cmFjdHxlbnwxfHx8fDE3NTcxNjIzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Nature background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-100/30 to-transparent" />
      </div>

      {/* Animated Nature Icons */}
      {natureIcons.map(({ Icon, delay, position }, index) => (
        <motion.div
          key={index}
          className="absolute text-emerald-600/40"
          style={position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay, duration: 0.8 }}
        >
          <motion.div
            variants={bounceVariants}
            animate="animate"
          >
            <Icon size={40} />
          </motion.div>
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8"
        variants={containerVariants}
        initial="hidden"
        animate={showContent ? "visible" : "hidden"}
      >
        {/* Logo Section */}
        <motion.div
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.div
            className="relative mb-6"
            variants={pulseVariants}
            animate="animate"
          >
            {/* Gradient Logo Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full blur-xl opacity-30 scale-110" />

            {/* Logo Content */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent p-8 rounded-full border-2 border-emerald-200/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3">
                <Leaf size={48} className="text-emerald-600" />
                <span className="font-bold text-5xl">
                  EcoSplash
                </span>
              </div>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            variants={itemVariants}
            className="space-y-2"
          >
            <h2 className="text-2xl text-emerald-800 tracking-wide">
              Learn. Act. Sustain.
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
          </motion.div>
        </motion.div>

        {/* Animated Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-emerald-700 text-center max-w-md leading-relaxed"
        >
          Learn, play, and protect the planet — one challenge at a time
        </motion.p>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="absolute inset-0 border border-emerald-200/30 rounded-full" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
            >
              <Leaf className="text-emerald-400" size={20} />
            </motion.div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
              }}
            >
              <Droplets className="text-blue-400" size={20} />
            </motion.div>
          </div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <motion.div
              animate={{ x: [0, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1.5,
              }}
            >
              <Sun className="text-yellow-400" size={20} />
            </motion.div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 2,
              }}
            >
              <Wind className="text-teal-400" size={20} />
            </motion.div>
          </div>
        </motion.div>

        {/* Get Started Button */}
        <motion.div variants={itemVariants} className="mt-12">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white border-0 px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <span className="mr-2">Get Started</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={20} />
            </motion.div>
          </Button>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-emerald-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "splash" | "auth" | "dashboard" | "lessons" | "challenges" | "ai"
  >("splash");

  const [userRole, setUserRole] = useState<"student" | "teacher" | "ngo" | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  // ✅ 1. Handles "Get Started" on Splash
  const handleGetStarted = () => setCurrentScreen("auth");

  // ✅ 2. When user presses Back on Auth
  const handleBackToSplash = () => setCurrentScreen("splash");

  // ✅ 3. Called after successful login (Google or Gmail)
  const handleAuthSuccess = (role: "student" | "teacher" | "ngo", name: string) => {
    setUserRole(role);
    setUserName(name);
    setCurrentScreen("dashboard"); // go to dashboard
  };

  // ✅ 4. Navigation helpers
  const handleBackToDashboard = () => setCurrentScreen("dashboard");
  const handleNavigateToLessons = () => setCurrentScreen("lessons");
  const handleNavigateToChallenges = () => setCurrentScreen("challenges");

  const handleNavigateToAI = (lessonData: any) => {
    setSelectedLesson(lessonData);
    setCurrentScreen("ai");
  };

  const handleBackToLessons = () => setCurrentScreen("lessons");

  // ✅ 5. Logout logic
  const handleLogout = async () => {
    // optional: if using Supabase
    // await supabase.auth.signOut();
    setUserRole(null);
    setUserName(null);
    setCurrentScreen("splash");
  };

  // ✅ 6. Conditional Rendering (each screen)
  if (currentScreen === "ai" && selectedLesson) {
    return (
      <EcoAI
        onBack={handleBackToLessons}
        userName={userName ?? ""}
        lessonData={selectedLesson}
      />
    );
  }

  if (currentScreen === "lessons") {
    return (
      <EcoLessons
        onBack={handleBackToDashboard}
        userName={userName ?? ""}
        onNavigateToAI={handleNavigateToAI}
        isDarkTheme={false}
        onToggleTheme={() => {}}
      />
    );
  }

  if (currentScreen === "challenges") {
    return <EcoChallenges onBack={handleBackToDashboard} userName={userName ?? ""} />;
  }

  if (currentScreen === "dashboard" && userRole && userName) {
    return (
      <EcoDashboard
        userRole={userRole}
        userName={userName}
        onNavigateToLessons={handleNavigateToLessons}
        onNavigateToChallenges={handleNavigateToChallenges}
        onLogout={handleLogout}
      />
    );
  }
  if (currentScreen === "auth") {
    return (
      <EcoAuth
        onBack={handleBackToSplash}
        onAuthSuccess={handleAuthSuccess}
        isDarkTheme={false}
        onToggleTheme={() => {}}
      />
    );
  }
  return <EcoSplash onGetStarted={handleGetStarted} />;
}