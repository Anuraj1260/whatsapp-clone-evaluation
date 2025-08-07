import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [conversations, setConversations] = useState({});
  const [activeChatId, setActiveChatId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messageAreaRef = useRef(null);

  // Function to fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch conversations when the app loads
  useEffect(() => {
    fetchConversations();
  }, []);

  // Scroll to the bottom of the message area when new messages arrive
  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [conversations, activeChatId]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;

    const activeChat = conversations[activeChatId];
    const contactName = activeChat ? activeChat[0].name : 'New Contact';

    const messageData = {
      wa_id: activeChatId,
      name: contactName,
      text: newMessage,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/send', messageData);
      if (response.status === 201) {
        setNewMessage('');
        fetchConversations(); // Re-fetch conversations to show the new message
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const activeMessages = activeChatId ? conversations[activeChatId] || [] : [];
  const contactInfo = activeChatId && conversations[activeChatId] ? conversations[activeChatId][0] : null;

  return (
    <div className="app">
      <div className="sidebar">
        {Object.keys(conversations).map((wa_id) => (
          <div key={wa_id} className={`chat-item ${wa_id === activeChatId ? 'active' : ''}`} onClick={() => setActiveChatId(wa_id)}>
            <h3>{conversations[wa_id][0].name}</h3>
            <p>{conversations[wa_id][conversations[wa_id].length - 1].text}</p>
          </div>
        ))}
      </div>
      <div className="chat-window">
        {activeChatId ? (
          <>
            <div className="chat-header">
              <h2>{contactInfo?.name || 'Loading...'}</h2>
            </div>
            <div className="message-area" ref={messageAreaRef}>
              {activeMessages.map((msg) => (
                <div key={msg._id} className="message-bubble">
                  <p>{msg.text}</p>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {msg.status}</span>
                </div>
              ))}
            </div>
            <form className="message-input-area" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="welcome-screen">
            <h2>Select a chat to start messaging</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;