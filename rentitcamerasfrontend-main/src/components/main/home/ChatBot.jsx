import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Phone, Camera, Video } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your camera rental assistant. How can I help you today?", 
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const formatPhoneNumber = (phone) => {
    return phone.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2 $3');
  };

  const botResponses = {
    greeting: [
      "Hello! I'm your camera rental assistant. How can I help you today?",
      "Hi there! Ready to find your perfect camera gear? How can I assist you?",
      "Welcome to RentIt! What camera equipment are you looking for today?"
    ],
    suggestions: {
      text: "Need help? Message us on WhatsApp for quick assistance:",
      options: [
        { text: `💬 Chat on WhatsApp (${formatPhoneNumber('919940423791')})`, action: 'whatsapp', query: "Hello, I need help with camera rental" },
        { text: "📞 Call Us: +91 99404 23791", action: 'call' },
        { text: "📧 Email Us: info@rentitcameras.com", action: 'email' },
        { text: "📍 Find Our Location", action: 'location' }
      ]
    },
    cameraTypes: {
      text: "We have these popular camera types available:",
      options: [
        { text: "DSLR Cameras", icon: Camera, action: 'info', value: 'DSLR Cameras' },
        { text: "Mirrorless Cameras", icon: Camera, action: 'info', value: 'Mirrorless Cameras' },
        { text: "Video Cameras", icon: Video, action: 'info', value: 'Video Cameras' },
        { text: "Lenses", icon: Camera, action: 'info', value: 'Lenses' }
      ]
    },
    rentalPeriods: {
      text: "Choose your preferred rental period:",
      options: [
        { text: "1 Day", action: 'info', value: '1 Day' },
        { text: "3 Days", action: 'info', value: '3 Days' },
        { text: "1 Week", action: 'info', value: '1 Week' },
        { text: "2 Weeks", action: 'info', value: '2 Weeks' }
      ]
    },
    contact: {
      text: "Need to talk to us directly?",
      options: [
        { text: "Chat on WhatsApp", icon: FaWhatsapp, action: 'whatsapp' },
        { text: "Call Us: +91 99404 23791", icon: Phone, action: 'call' }
      ]
    },
    default: [
      "I can help you find the perfect camera equipment for your needs.",
      "We have a wide range of cameras and lenses available for rent.",
      "You can check our available equipment in the 'Rent Now' section.",
      "Our standard rental period is 7 days, but we offer flexible options.",
      "For any specific equipment inquiries, feel free to ask!"
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    
    if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening))/.test(message)) {
      return { text: botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)], type: 'text' };
    }
    if (/camera|rent|equipment|gear|dslr|mirrorless|video/.test(message)) {
      return { ...botResponses.cameraTypes, type: 'options' };
    }
    if (/rental period|how long|days|duration/.test(message)) {
      return { ...botResponses.rentalPeriods, type: 'options' };
    }
    if (/contact|whatsapp|call|number|reach|speak/.test(message)) {
      return { ...botResponses.contact, type: 'actions' };
    }
    return { text: botResponses.default[Math.floor(Math.random() * botResponses.default.length)], type: 'text' };
  };

  const handleAction = (action, value = '') => {
    switch(action) {
      case 'whatsapp':
        window.open(`https://wa.me/919940423791?text=${encodeURIComponent(value || 'Hello! I have a question about camera rentals.')}`, '_blank');
        break;
      case 'call':
        window.location.href = 'tel:+919940423791';
        break;
      case 'email':
        window.location.href = 'mailto:info@rentitcameras.com';
        break;
      case 'location':
        window.open('https://maps.google.com?q=RentIt+Cameras+Chennai', '_blank');
        break;
      case 'info':
        setMessages(prev => [...prev, { id: Date.now(), text: `You selected: ${value}`, sender: 'bot', timestamp: new Date(), type: 'text' }]);
        break;
      default:
        break;
    }
  };

  const handleSendMessage = (e, message = null) => {
    e?.preventDefault();
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    const userMessage = { 
      id: Date.now(), 
      text: messageText, 
      sender: 'user', 
      timestamp: new Date(), 
      type: 'text' 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowSuggestions(false);

    setTimeout(() => {
      const response = getBotResponse(messageText);
      const botMessage = { 
        id: Date.now() + 1, 
        ...response, 
        sender: 'bot', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMessage]);
      if (response.type === 'text' && !messageText.toLowerCase().includes('thank')) {
        setTimeout(() => setShowSuggestions(true), 1000);
      }
    }, 800);
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderMessage = (message) => {
    if (message.type === 'suggestions') {
      return (
        <div>
          <p className="text-sm mb-2">{message.text}</p>
          <div className="grid grid-cols-1 gap-2">
            {message.options.map((s, index) => (
              <button
                key={index}
                onClick={() => handleAction(s.action, s.query)}
                className="text-left p-3 text-sm rounded-lg border hover:bg-gray-100"
              >
                {s.text}
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (message.type === 'options') {
      return (
        <div>
          <p className="text-sm mb-2">{message.text}</p>
          <div className="grid grid-cols-2 gap-2">
            {message.options.map((opt, index) => {
              const Icon = opt.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleAction(opt.action, opt.value)}
                  className="flex items-center p-2 text-sm border rounded-lg hover:bg-gray-50"
                >
                  {Icon && <Icon className="w-4 h-4 mr-2" />}
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    if (message.type === 'actions') {
      return (
        <div>
          <p className="text-sm mb-2">{message.text}</p>
          <div className="flex flex-wrap gap-2">
            {message.options.map((act, index) => {
              const Icon = act.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleAction(act.action)}
                  className="flex items-center px-3 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  {Icon && <Icon className="w-4 h-4 mr-2" />}
                  {act.text}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    return <p className="text-sm">{message.text}</p>;
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="flex flex-col w-80 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1A97A9] to-[#153c43] text-white">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-white" />
              <h3 className="font-semibold">RentIt Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${m.sender === 'user' ? 'bg-[#1A97A9] text-white' : 'bg-white text-gray-800 border border-gray-200 shadow-sm'}`}>
                    {renderMessage(m)}
                    <p className="text-xs mt-2 opacity-70 text-right">{formatTime(new Date(m.timestamp))}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="p-3 border-t border-gray-200 bg-white">
            {showSuggestions && renderMessage({ id: 'suggestions', type: 'suggestions', ...botResponses.suggestions })}
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 text-sm border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-[#1A97A9]"
              />
              <button type="submit" className="p-3 bg-[#1A97A9] text-white rounded-r-xl hover:bg-[#16818f]">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => { setIsOpen(true); setShowSuggestions(true); }}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#1A97A9] to-[#153c43] text-white shadow-xl hover:scale-105 transition-transform animate-bounce"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
