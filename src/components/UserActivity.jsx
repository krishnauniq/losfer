import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function UserActivity() {
    const [activeTab, setActiveTab] = useState("posted");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!auth.currentUser) return;

        setLoading(true);
        let q;

        if (activeTab === "posted") {
            q = query(collection(db, "items"), where("uid", "==", auth.currentUser.uid));
        } else if (activeTab === "claimed") {
            q = query(collection(db, "items"), where("uid", "==", auth.currentUser.uid), where("status", "==", "claimed"));
        }

        if (!q) {
            setItems([]);
            setLoading(false);
            return;
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [activeTab]);

    const tabs = [
        { id: "posted", label: "Items Posted" },
        { id: "claimed", label: "Items Returned" },
    ];

    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-surface-900 flex items-center">
                    <span className="mr-2">👤</span> My Dashboard
                </h2>

                <div className="flex space-x-2 bg-white p-1 rounded-lg border border-surface-200">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.id}
                            size="sm"
                            variant={activeTab === tab.id ? "primary" : "ghost"}
                            onClick={() => setActiveTab(tab.id)}
                            className={activeTab === tab.id ? "shadow-sm" : ""}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="min-h-[150px]">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {[1, 2, 3, 4].map(i => <Card key={i} className="h-32 animate-pulse" />)}
                    </div>
                ) : items.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {items.map((item) => (
                            <Card key={item.id} className="hover:scale-[1.02] cursor-pointer group" noPadding>
                                <div className="h-24 w-full relative">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full bg-surface-100 flex items-center justify-center text-xs text-surface-400">No Img</div>
                                    )}
                                    {item.status === 'claimed' && (
                                        <div className="absolute inset-0 bg-success-500/80 flex items-center justify-center text-white font-bold text-xs uppercase backdrop-blur-sm">Returned</div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h4 className="font-bold text-surface-800 text-sm truncate">{item.itemName}</h4>
                                    <p className="text-xs text-surface-500 mt-1">
                                        {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-10 bg-surface-50 border-dashed">
                        <p className="text-surface-500 text-sm">No items found in this section.</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
