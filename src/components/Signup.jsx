import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/app");
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError(err.message || "Failed to sign in with Google. Please try again.");
    }
  };

  const handleSignup = async () => {
    try {
      if (email && password) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (e) {
          // If user exists, try login
          await signInWithEmailAndPassword(auth, email, password);
        }
      }
      navigate("/app");
    } catch (e) {
      console.error(e);
      setError("Authentication failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* Left - Clean & Modern Form */}
      <div className="flex flex-col items-center justify-center bg-white p-8 lg:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-surface-900 tracking-tight mb-2">Get Started</h2>
            <p className="text-surface-500 text-lg">Create your account to join the community.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button onClick={handleGoogleSignup} className="w-full flex items-center justify-center gap-3 bg-white border border-surface-200 text-surface-700 font-medium py-3 px-4 rounded-xl hover:bg-surface-50 transition-colors shadow-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-surface-500">Or continue with</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="student@university.edu"
                  className="w-full p-3.5 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-surface-900 placeholder:text-surface-400 font-medium"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3.5 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-surface-900 placeholder:text-surface-400 font-medium"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleSignup}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-lg font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transform transition-all active:scale-[0.98] hover:-translate-y-0.5"
            >
              Create Account
            </button>
          </div>

          <p className="text-center text-surface-500 font-medium">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-all">
              Log in
            </Link>
          </p>
        </div>

        {/* Decorative footer link */}
        <div className="absolute bottom-8 text-xs text-surface-400">
          By signing up, you agree to our <button className="underline">Terms</button> & <button className="underline">Privacy Policy</button>
        </div>
      </div>

      {/* Right - High Vibrancy / Neon Aesthetic */}
      <div className="hidden md:flex relative items-center justify-center overflow-hidden bg-black text-white p-12">
        {/* Abstract Fluid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-600 via-indigo-950 to-black opacity-80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 contrast-125 mix-blend-overlay"></div>

        {/* Animated Shapes */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>

        <div className="relative z-10 w-full max-w-lg">
          {/* Dynamic Typographic Composition */}
          <div className="text-left mb-12 relative">
            <span className="block text-xl font-bold tracking-widest text-indigo-400 uppercase mb-2">Welcome to your</span>

            <h1 className="text-7xl font-black leading-none drop-shadow-2xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                CAMPUS.
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400 transform -skew-x-6 relative left-2">
                LOST &
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-8xl relative -top-2">
                FOUND.
              </span>
            </h1>

            <div className="absolute -right-8 top-1/2 transform rotate-12 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl skew-y-6 hidden lg:block">
              <span className="text-4xl">🎒</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>

            <p className="text-2xl font-light leading-relaxed text-indigo-50 mb-6">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">Reimagined</span> for the speed of student life. Return what matters, faster than ever.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-200 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
                Fast
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-200 text-xs font-bold uppercase tracking-wider border border-pink-500/30">
                Secure
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-200 text-xs font-bold uppercase tracking-wider border border-cyan-500/30">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
