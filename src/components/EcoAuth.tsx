import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  Leaf,
  User,
  GraduationCap,
  Heart,
  Mail,
  Lock,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface EcoAuthProps {
  onBack: () => void;
  onAuthSuccess: (role: "student" | "teacher" | "ngo", username: string) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export default function EcoAuth({
  onBack,
  onAuthSuccess,
}: EcoAuthProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      const fromRedirect =
        window.location.href.includes("access_token") ||
        window.location.href.includes("type=recovery");

      const hasVisitedBefore = localStorage.getItem("eco_has_visited");

      if (session?.user && (fromRedirect || hasVisitedBefore)) {
        const role =
          session.user.user_metadata?.role ||
          localStorage.getItem("eco_role") ||
          "student";
        const name =
          session.user.user_metadata?.full_name ||
          session.user.email ||
          "Eco User";

        onAuthSuccess(role, name);
        localStorage.setItem("eco_has_visited", "true");

        window.history.replaceState({}, document.title, "/");
      } else {
        localStorage.removeItem("eco_has_visited");
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const role =
            session.user.user_metadata?.role ||
            localStorage.getItem("eco_role") ||
            "student";
          const name =
            session.user.user_metadata?.full_name ||
            session.user.email ||
            "Eco User";

          onAuthSuccess(role, name);
          localStorage.setItem("eco_has_visited", "true");
        }
      }
    );

    checkSession();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // 🟢 Google Login (Popup Mode - No reload)
  const handleGoogleLogin = async () => {
    if (!selectedRole) return alert("Please select a role first");
    localStorage.setItem("eco_role", selectedRole);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
        redirectTo: `${window.location.origin}`,
      },
    });
    if (error) {
      console.error("Google login error:", error.message);
      alert(error.message);
      return;
    }
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name =
          session.user.user_metadata?.full_name ||
          session.user.email ||
          "Eco User";
        const storedRole = localStorage.getItem("eco_role");
        const role =
          (storedRole === "student" ||
            storedRole === "teacher" ||
            storedRole === "ngo") &&
          storedRole
            ? storedRole
            : "student";
        onAuthSuccess(role, name);
        localStorage.setItem("eco_has_visited", "true");
      }
    });
  };

  // 📧 Email Login / Signup
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return alert("Please select a role first");
    localStorage.setItem("eco_role", selectedRole);

    const role =
      selectedRole === "student" ||
      selectedRole === "teacher" ||
      selectedRole === "ngo"
        ? selectedRole
        : "student";

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert(error.message);
        return;
      }

      if (data.user) {
        onAuthSuccess(role, data.user.email || "Eco User");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role },
        },
      });
      if (error) {
        alert(error.message);
        return;
      }
      alert("Signup successful! Please verify your email.");
      if (data.user) {
        // INSERT initial points for fresh signups
        await supabase.from("eco_points").insert([
          { user_id: data.user.id, points: 0 },
        ]);
        onAuthSuccess(role, data.user.email || "Eco User");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 flex flex-col items-center justify-center p-6">
      {/* 🌿 Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mb-6"
      >
        <Leaf className="w-8 h-8 text-green-600 mr-2" />
        <h1 className="text-3xl font-bold text-green-700">EcoConnect</h1>
      </motion.div>

      {/* 🌱 Auth Section */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="grid gap-6 w-full max-w-md"
      >
        {/* 🌿 Role Selection */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-center text-lg font-semibold mb-4 text-green-700">
              Choose Your Role
            </h2>
            <div className="flex justify-around">
              {[
                { role: "student", icon: GraduationCap },
                { role: "ngo", icon: Heart },
                { role: "citizen", icon: User },
              ].map(({ role, icon: Icon }) => (
                <motion.div
                  key={role}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-xl cursor-pointer flex flex-col items-center ${
                    selectedRole === role
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-700"
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-sm capitalize">{role}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 📧 Email Login / Signup */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-700 text-center">
              {isLogin ? "Login" : "Sign Up"} to EcoConnect
            </h2>

            <form onSubmit={handleEmailLogin} className="grid gap-3">
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white">
                <Mail className="w-4 h-4 text-green-600 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full outline-none text-green-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center border rounded-lg px-3 py-2 bg-white">
                <Lock className="w-4 h-4 text-green-600 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full outline-none text-green-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white mt-2"
              >
                {isLogin ? (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </>
                )}
              </Button>
            </form>

            <div className="text-center mt-3">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-green-700 hover:underline"
              >
                {isLogin
                  ? "New here? Create an account"
                  : "Already have an account? Login"}
              </button>
            </div>

            {/* 🌍 Google Login */}
            <div className="text-center mt-4">
              <p className="text-gray-500 text-sm mb-2">or continue with</p>
              <Button
                onClick={handleGoogleLogin}
                className="w-full bg-white border text-green-700 hover:bg-green-50"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-4 h-4 mr-2"
                />
                Sign in with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
