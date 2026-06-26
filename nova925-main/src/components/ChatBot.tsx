import { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageCircle, X, Send, User, Sparkles, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function ChatBot() {
  const { user } = useAuth();
  const isSignedIn = !!user;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      setMessages([
        { role: 'model', content: "Hello! I'm **NOVA**, your personal jewelry concierge. How can I help you sparkle today?" }
      ]);
    } else {
      setMessages([
        { role: 'model', content: "Welcome to **NOVA Jewellery**! Please sign in to consult our personal jewelry concierge assistant." }
      ]);
    }
  }, [isSignedIn]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    
    // Add user message to UI
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Add empty model message for streaming
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      // Fall back to a mock-token when using client-side mock authentication
      let token = '';
      if (auth && auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      } else if (isSignedIn) {
        token = 'mock-token';
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          history: messages,
          message: userMsg
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { value, done } = await reader.read();
        
        if (done) {
          setIsLoading(false);
          break;
        }
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            if (dataStr === '[DONE]') continue;
            
            try {
               const data = JSON.parse(dataStr);
               
               setMessages(prev => {
                  const updatedMessages = [...prev];
                  const lastMessage = updatedMessages[updatedMessages.length - 1];
                  
                  if (lastMessage.role === 'model') {
                    lastMessage.content += data.text;
                  }
                  
                  return updatedMessages;
               });
            } catch (e) {
               console.error("Error parsing streaming chunk", e, dataStr);
               const matches = dataStr.match(/{"text":"(.*?)"}/g);
               if (matches) {
                  matches.forEach(m => {
                    try {
                       const p = JSON.parse(m);
                       setMessages(prev => {
                          const updated = [...prev];
                          updated[updated.length - 1].content += p.text;
                          return updated;
                       });
                    } catch {}
                  });
               }
            }
          }
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newArr = [...prev];
        if (newArr[newArr.length - 1].content === '') {
           newArr[newArr.length - 1].content = "_Sorry, I encountered an error. Please check your Gemini API key configuration and try again._";
        } else {
           newArr.push({ role: 'model', content: "_Sorry, I encountered an error._" });
        }
        return newArr;
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Premium Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-nova-gold-dark to-nova-gold text-nova-darker rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(197,168,128,0.3)] hover:scale-105 transition-all z-50 group border border-white/20 active:scale-95"
          aria-label="Open Chat Assistant"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform text-nova-darker" />
          <span className="absolute -top-1 -right-1 bg-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold text-nova-darker border border-nova-gold">
            1
          </span>
          <span className="absolute inset-0 rounded-full border border-nova-gold animate-ping opacity-25"></span>
        </button>
      )}

      {/* Frosted Glass Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[92vw] md:w-[420px] h-[620px] max-h-[85vh] glass-dark rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-50 overflow-hidden border border-white/10 animate-fade-in">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-nova-darker via-nova-dark to-nova-darker text-white p-4.5 flex items-center justify-between border-b border-nova-gold/20 shadow-lg z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-nova-gold/10 rounded-full flex items-center justify-center border border-nova-gold/30">
                <Sparkles className="w-5 h-5 text-nova-gold" />
              </div>
              <div>
                <h3 className="font-serif tracking-widest font-medium text-white flex items-center gap-1.5">
                  NOVA <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </h3>
                <p className="text-[9px] text-nova-gold uppercase tracking-[0.2em] font-medium">Luxury Concierge</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors border border-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 bg-nova-darker/60 flex flex-col gap-5 hide-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                   msg.role === 'user' 
                     ? 'bg-nova-gold text-nova-darker border border-nova-gold/20' 
                     : 'bg-[#181c2b] text-nova-gold border border-nova-gold/20'
                 }`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                 </div>
                 <div className={`py-3 px-4.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                   msg.role === 'user' 
                     ? 'bg-[#1c2235] text-white border border-white/5 rounded-tr-none' 
                     : 'bg-white/5 text-white/95 border border-white/10 shadow-sm rounded-tl-none prose prose-invert prose-sm max-w-none'
                 }`}>
                    {msg.role === 'model' ? (
                       msg.content === '' ? (
                         <div className="flex items-center gap-2 text-white/40">
                           <Loader2 className="w-3.5 h-3.5 animate-spin text-nova-gold" /> Preparing recommendations...
                         </div>
                       ) : (
                         <Markdown>{msg.content}</Markdown>
                       )
                    ) : (
                       msg.content
                    )}
                 </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-nova-darker border-t border-white/10">
            <form onSubmit={handleSubmit} className="relative flex items-center">
               <input 
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder={isSignedIn ? "Ask about materials, care, products..." : "Please sign in to chat with NOVA..."}
                 disabled={isLoading || !isSignedIn}
                 className="w-full bg-[#121522] border border-white/10 text-white placeholder-white/30 rounded-xl py-3.5 pl-5 pr-14 focus:outline-none focus:ring-1 focus:ring-nova-gold focus:border-nova-gold transition-all disabled:opacity-50 text-xs md:text-sm"
               />
               {isSignedIn ? (
                 <button 
                   type="submit"
                   disabled={!input.trim() || isLoading}
                   className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-nova-gold text-nova-darker rounded-lg flex items-center justify-center hover:bg-nova-gold-light transition-colors disabled:opacity-30 cursor-pointer"
                 >
                   <Send className="w-3.5 h-3.5 ml-0.5" />
                 </button>
               ) : (
                 <Link 
                   to="/login"
                   onClick={() => setIsOpen(true)}
                   className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-3 bg-nova-gold hover:bg-nova-gold-light text-nova-darker text-[10px] uppercase font-bold tracking-wider rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                 >
                   Sign In
                 </Link>
               )}
            </form>
            <div className="text-center w-full mt-3">
              <p className="text-[8px] text-white/20 uppercase tracking-[0.25em]">NOVA Intelligent Assistance</p>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
