import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import { useNavigate } from "react-router-dom";

export default function SavedAlerts() {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [matches, setMatches] = useState({});

    useEffect(() => {
        // 1. Load Alerts
        const saved = JSON.parse(localStorage.getItem('savedAlerts') || '[]');
        setAlerts(saved);

        // 2. Find Matches for each alert
        if (saved.length > 0) {
            findMatches(saved);
        }
    }, []);

    const findMatches = async (savedAlerts) => {
        try {
            // Query recent items (last 50? or all for now)
            const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const newMatches = {};

            savedAlerts.forEach((alert, index) => {
                const alertMatches = allItems.filter(item => {
                    // Simple matching logic
                    const searchMatch = !alert.term ||
                        item.itemName.toLowerCase().includes(alert.term.toLowerCase()) ||
                        item.description.toLowerCase().includes(alert.term.toLowerCase());

                    const catMatch = !alert.category || alert.category === "All" || item.category === alert.category;

                    // Only show 'found' or 'verified' status matches for alerts usually
                    const statusMatch = item.status !== 'claimed' && item.status !== 'returned';

                    return searchMatch && catMatch && statusMatch;
                });

                // Limit to 3 matches per alert for display
                newMatches[index] = alertMatches.slice(0, 3);
            });

            setMatches(newMatches);
        } catch (error) {
            console.error("Error finding matches:", error);
        }
    };

    const deleteAlert = (indexToDelete) => {
        const updated = alerts.filter((_, i) => i !== indexToDelete);
        setAlerts(updated);
        localStorage.setItem('savedAlerts', JSON.stringify(updated));
        // Also remove matches
        const updatedMatches = { ...matches };
        delete updatedMatches[indexToDelete];
        setMatches(updatedMatches);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-surface-900 dark:text-white mb-2">Saved Alerts</h1>
                <p className="text-surface-500">
                    We'll watch for items matching your criteria.
                </p>
            </div>

            {alerts.length === 0 ? (
                <Card className="text-center py-20 bg-surface-50 border-dashed border-2 border-surface-300">
                    <div className="text-6xl mb-4">🔔</div>
                    <h3 className="text-xl font-bold text-surface-900 mb-2">No Active Alerts</h3>
                    <p className="text-surface-500 mb-6 max-w-sm mx-auto">
                        Search for items in the feed and click the "Bell" icon to save a search alert.
                    </p>
                    <Button onClick={() => navigate('/app/feed')}>
                        Go to Feed
                    </Button>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {alerts.map((alert, index) => (
                        <Card key={index} className="overflow-hidden border border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-2xl font-bold">
                                        {alert.term ? 'T' : 'C'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-surface-900 dark:text-white">
                                            {alert.term ? `"${alert.term}"` : "Any Item"}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-surface-500 mt-1">
                                            <Badge variant="neutral">{alert.category || 'All Categories'}</Badge>
                                            <span>•</span>
                                            <span>Created {new Date(alert.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => deleteAlert(index)} className="text-error-500 hover:bg-error-50">
                                    Delete
                                </Button>
                            </div>

                            {/* Matches Section */}
                            <div className="bg-surface-50 dark:bg-surface-900/50 rounded-xl p-4 border border-surface-100 dark:border-surface-800">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-surface-500 mb-3 flex items-center gap-2">
                                    {matches[index]?.length > 0 ? (
                                        <><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Found Matches</>
                                    ) : (
                                        "No new matches yet"
                                    )}
                                </h4>

                                {matches[index]?.length > 0 ? (
                                    <div className="space-y-3">
                                        {matches[index].map(item => (
                                            <div key={item.id} className="flex gap-3 items-center bg-white dark:bg-surface-800 p-3 rounded-lg border border-surface-200 dark:border-surface-700 cursor-pointer hover:border-primary-300 transition-colors" onClick={() => alert("Navigate to item details (implement in item list)")}>
                                                <div className="w-10 h-10 rounded-lg bg-surface-100 flex-shrink-0 overflow-hidden">
                                                    {item.imageUrl ? <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">📷</div>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-surface-900 truncate">{item.itemName}</p>
                                                    <p className="text-xs text-surface-500 truncate">{item.location} • {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-primary-600 text-xs font-bold">View</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-surface-400 italic">We'll notify you when items arrive.</p>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
