import React, { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setTyping(true);

    // fake AI streaming effect
    setTimeout(() => {
      const aiMsg = {
        type: "ai",
        text: "Analyzing your career path... AI suggests learning Python + ML",
      };

      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="glass" style={{ padding: 20 }}>

      <div className="chatBox">

        {messages.map((m, i) => (
          <div key={i} className={m.type === "user" ? "msgUser" : "msgAI"}>
            {m.text}
          </div>
        ))}

        {typing && <div className="msgAI">AI is typing...</div>}

      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask AI..."
      />

      <button onClick={sendMessage}>Send</button>

    </div>
  );
}