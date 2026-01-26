import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import ItemList from "./ItemList";
import SafetyTips from "./SafetyTips";

export default function Dashboard() {
  const navigate = useNavigate();
  const firstName = auth.currentUser?.displayName?.split(" ")[0] || "User";
  // ... (rest of imports remains same, just replacing CommunityImpact import)


  const actions = [
    {
      id: "post",
      label: "Report Found",
      icon: (
        <svg h="24" w="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
      ),
      path: "/app/post-item",
      color: "text-indigo-700 dark:text-indigo-300",
      cardBg: "bg-indigo-100/50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40",
      border: "border-indigo-200 dark:border-indigo-800"
    },
    {
      id: "browse",
      label: "Search All",
      icon: (
        <svg h="24" w="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      ),
      path: "/app/feed",
      color: "text-emerald-700 dark:text-emerald-300",
      cardBg: "bg-emerald-100/50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
      border: "border-emerald-200 dark:border-emerald-800"
    },
    {
      id: "activity",
      label: "My Activity",
      icon: (
        <svg h="24" w="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
      ),
      path: "/app/activity",
      color: "text-blue-700 dark:text-blue-300",
      cardBg: "bg-blue-100/50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40",
      border: "border-blue-200 dark:border-blue-800"
    },
    {
      id: "saved",
      label: "Saved Alerts",
      icon: (
        <svg h="24" w="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
      ),
      path: "/app/saved",
      color: "text-rose-700 dark:text-rose-300",
      cardBg: "bg-rose-100/50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40",
      border: "border-rose-200 dark:border-rose-800"
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-surface-950 transition-colors duration-300">
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/20 dark:bg-primary-500/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-200/20 dark:bg-purple-500/20 rounded-full blur-[100px] -z-10 -translate-x-1/2 pointer-events-none"></div>

      <div className="space-y-12 max-w-6xl mx-auto px-4 py-8 relative z-10">

        {/* Glass Header */}
        <div className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 border border-surface-200/50 dark:border-surface-700/50 bg-white/40 dark:bg-surface-900/40 backdrop-blur-xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent dark:from-white/5 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                <p className="text-primary-600 dark:text-primary-400 font-bold text-xs tracking-widest uppercase">Member Dashboard</p>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-surface-900 leading-[0.9] tracking-tight">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">{firstName}</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-6 py-3 bg-white/60 dark:bg-surface-800/60 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm backdrop-blur-md">
                <span className="text-[10px] text-surface-500 block uppercase font-black tracking-widest">Status</span>
                <div className="text-lg font-bold text-surface-900">Active Member</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pastel Card Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {actions.map(action => (
            <button
              key={action.id}
              onClick={() => navigate(action.path)}
              className={`group relative p-6 md:p-8 rounded-[2rem] border ${action.border} ${action.cardBg} backdrop-blur-sm text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className="relative z-10">
                <div className={`w-14 h-14 bg-white dark:bg-surface-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 ${action.color}`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-bold text-surface-900">{action.label}</h3>
                <div className={`mt-2 h-1 w-8 rounded-full bg-current ${action.color} opacity-40 group-hover:w-16 transition-all duration-300`}></div>
              </div>
            </button>
          ))}
        </div>

        {/* High-Impact CTA */}
        <div
          onClick={() => navigate('/app/post-item')}
          className="group relative overflow-hidden p-8 md:p-14 bg-surface-900 dark:bg-white rounded-[2.5rem] shadow-2xl cursor-pointer"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary-500 to-purple-600 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-500 translate-x-1/3 -translate-y-1/3"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-5xl font-black text-white dark:text-surface-900 mb-4 tracking-tight">
                Found something?
              </h2>
              <p className="text-surface-300 dark:text-surface-600 text-lg mb-8 max-w-md font-medium">
                The real owner awaits. Report found items in seconds and help a peer out.
              </p>
              <button className="px-8 py-4 bg-white dark:bg-surface-900 text-surface-900 dark:text-white font-extrabold rounded-2xl shadow-lg group-hover:scale-105 transition-transform flex items-center gap-3">
                <span className="text-xl">📸</span>
                Start Report
              </button>
            </div>
            <div className="hidden md:block transform group-hover:rotate-12 transition-transform duration-500">
              <div className="text-9xl filter drop-shadow-2xl">🎒</div>
            </div>
          </div>
        </div>



        {/* Clean Feed Section */}
        <div className="pt-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-200/50 dark:border-surface-700/50">
            <div>
              <h2 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">Recent Activity</h2>
            </div>
            <button
              onClick={() => navigate('/app/feed')}
              className="px-6 py-2 rounded-full border border-surface-200 dark:border-surface-700 text-surface-900 font-bold hover:bg-surface-50 dark:hover:bg-surface-800 transition-all text-sm"
            >
              View Full Feed
            </button>
          </div>


          <ItemList maxLimit={8} />
        </div>

        {/* Safety Tips Section */}
        <SafetyTips />

        <footer className="pt-20 pb-12 text-center">
          <p className="text-surface-400 font-bold uppercase tracking-widest text-[10px]">LOSFER © 2026 • Return What's Lost</p>
        </footer>
      </div>
    </div>
  );
}
