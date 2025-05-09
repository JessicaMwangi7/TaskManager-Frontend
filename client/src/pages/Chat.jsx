// /src/pages/Chat.jsx
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, push, onValue } from "firebase/database";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const chatRef = ref(db, "chat"); // path: /chat in Firebase
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const msgs = [];
      snapshot.forEach((child) => {
        msgs.push(child.val());
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = {
      user: user?.username || user?.email || "Guest",
      text: input,
      timestamp: Date.now(),
    };
    try {
      await push(ref(db, "chat"), newMessage);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col h-[80vh] border rounded-lg shadow bg-white">
        <h1 className="text-3xl font-bold text-primary p-4 border-b">Team Chat</h1>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-gray-500 italic">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="flex flex-col">
                <span className="font-semibold text-sm text-gray-700">{msg.user}:</span>
                <span className="text-gray-800">{msg.text}</span>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={handleSend}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
