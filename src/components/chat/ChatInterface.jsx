import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";
import Button from '../ui/Button';

export default function ChatInterface({ itemId, itemName, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!itemId) return;

        // Reference to the messages subcollection for this specific item
        // Structure: chats/{itemId}/messages/{messageId}
        const q = query(
            collection(db, "chats", itemId, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
            // Scroll to bottom on new message
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        return () => unsubscribe();
    }, [itemId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const user = auth.currentUser;
            if (!user) return; // Should be logged in

            const messageData = {
                text: newMessage,
                senderId: user.uid,
                senderName: user.displayName || "User",
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, "chats", itemId, "messages"), messageData);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            // distinct error handling could be added here
        }
    };

    return (
        <div className="flex flex-col h-[400px] bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden shadow-xl">
            {/* Header */}
            <div className="p-4 border-b border-surface-200 dark:border-surface-800 flex justify-between items-center bg-surface-50 dark:bg-surface-800">
                <div>
                    <h3 className="font-bold text-surface-900 dark:text-surface-100">Secure Chat</h3>
                    <p className="text-xs text-surface-500">Ref: {itemName}</p>
                </div>
                <button onClick={onClose} className="text-surface-400 hover:text-surface-600">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-50/50 dark:bg-surface-950/50">
                {messages.length === 0 && (
                    <div className="text-center text-surface-400 text-sm mt-10">
                        Start the conversation for "{itemName}"
                    </div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.senderId === auth.currentUser?.uid;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`
                                    max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm
                                    ${isMe
                                        ? 'bg-primary-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 border border-surface-100 dark:border-surface-700 rounded-tl-none'}
                                `}
                            >
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-surface-50 dark:bg-surface-800 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                />
                <Button size="sm" type="submit" className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                    ➤
                </Button>
            </form>
        </div>
    );
}
