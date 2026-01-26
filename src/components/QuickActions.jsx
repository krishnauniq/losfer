import Card from "./ui/Card";

export default function QuickActions({ onScrollToPost, onFocusSearch, onScrollToActivity }) {
    const actions = [
        {
            title: "Post Found Item",
            icon: "📦",
            desc: "Report an item you found",
            gradient: "from-blue-500 to-indigo-500",
            action: onScrollToPost
        },
        {
            title: "Search Lost Items",
            icon: "🔍",
            desc: "Find what you lost",
            gradient: "from-purple-500 to-pink-500",
            action: onFocusSearch
        },
        {
            title: "My Dashboard",
            icon: "📊",
            desc: "Track your activity",
            gradient: "from-orange-400 to-red-500",
            action: onScrollToActivity
        },
        {
            title: "Saved Items",
            icon: "🔖",
            desc: "View bookmarked",
            gradient: "from-emerald-400 to-teal-500",
            action: () => alert("Saved Items feature coming soon!")
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {actions.map((item, index) => (
                <Card
                    key={index}
                    onClick={item.action}
                    className="p-4 cursor-pointer hover:border-primary-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
                    noPadding={true}
                >
                    <div className="p-5">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl shadow-md mb-3 group-hover:rotate-6 transition-transform text-white`}>
                            {item.icon}
                        </div>
                        <h3 className="text-surface-900 font-bold text-lg leading-tight">{item.title}</h3>
                        <p className="text-surface-500 text-xs mt-1">{item.desc}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
}
