import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { INITIAL_CHAT_MESSAGES } from '../services/storage';
import { soundFx } from '../services/soundFx';
import { Send, Radio } from 'lucide-react';

interface ChatLoungeProps {
  user: UserProfile;
}

export const ChatLounge: React.FC<ChatLoungeProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('turbotype_chat_history_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CHAT_MESSAGES;
  });

  const [inputMessage, setInputMessage] = useState<string>('');
  const [activeChannel, setActiveChannel] = useState<'paddock' | 'tuning'>('paddock');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    try {
      const channel = new BroadcastChannel('turbotype_chat_net');
      broadcastRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'NEW_CHAT_MESSAGE') {
          setMessages((prev) => [...prev, event.data.payload]);
          soundFx.playKeyClick();
        }
      };

      return () => {
        channel.close();
      };
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('turbotype_chat_history_v2', JSON.stringify(messages.slice(-50)));
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = inputMessage.trim();
    if (!cleanText) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: user.id,
      senderName: user.displayName,
      senderAvatar: user.avatar,
      senderTier: user.tier,
      text: cleanText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    soundFx.playKeyClick();

    if (broadcastRef.current) {
      broadcastRef.current.postMessage({
        type: 'NEW_CHAT_MESSAGE',
        payload: newMsg,
      });
    }
  };

  const sendQuickEmoji = (emoji: string) => {
    soundFx.playButtonClick();
    setInputMessage((prev) => prev + emoji);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-gradient-to-r from-amber-950 via-[#3d1a0a] to-amber-950 border-4 border-amber-950 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-400 border-2 border-amber-900 rounded-2xl text-amber-950 shadow-md">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-game text-yellow-300 stroke-black-md">
              HILL DRIVER RADIO CHAT
            </h2>
            <p className="font-game text-xs text-amber-200">
              Live transmission between drivers across countryside stages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playButtonClick();
              setActiveChannel('paddock');
            }}
            className={`px-4 py-2 rounded-xl font-game text-xs uppercase cursor-pointer ${
              activeChannel === 'paddock' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            # GLOBAL PADDOCK
          </button>
          <button
            onClick={() => {
              soundFx.playButtonClick();
              setActiveChannel('tuning');
            }}
            className={`px-4 py-2 rounded-xl font-game text-xs uppercase cursor-pointer ${
              activeChannel === 'tuning' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            # TUNING TIPS
          </button>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="hcr-panel border-4 border-amber-950 bg-gradient-to-b from-slate-900 to-amber-950 flex flex-col h-[460px] shadow-2xl">
        <div className="flex-1 p-4 overflow-y-auto space-y-3 divide-y divide-amber-950/60">
          {messages.map((msg) => {
            const isMe = msg.senderId === user.id;

            return (
              <div key={msg.id} className="pt-3 first:pt-0 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 border-2 border-amber-900 flex items-center justify-center text-lg shrink-0">
                  {msg.senderAvatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-game text-sm ${
                        isMe ? 'text-yellow-300 stroke-black-sm' : 'text-white'
                      }`}
                    >
                      {msg.senderName}
                    </span>
                    <span className="font-game text-[10px] px-2 py-0.2 bg-amber-950 text-amber-300 rounded border border-amber-800">
                      {msg.senderTier}
                    </span>
                    <span className="text-[10px] text-amber-400/70 font-mono ml-auto">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="font-game text-xs text-amber-100 mt-1 break-words">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-amber-950/80 border-t-2 border-amber-900 space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="font-game text-xs text-amber-300 mr-1">React:</span>
            {['🔥', '⚡', '🚀', '🏎️', '🏁', '👏', '💯', '👑'].map((emo) => (
              <button
                key={emo}
                onClick={() => sendQuickEmoji(emo)}
                className="w-8 h-8 rounded-lg bg-amber-900/60 hover:bg-amber-800 border border-amber-800 text-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                {emo}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Send message to #${activeChannel}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border-2 border-amber-900 rounded-xl font-game text-xs text-white placeholder:text-amber-400/60 focus:outline-none focus:border-yellow-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="btn-hcr-green px-5 py-2.5 rounded-xl font-game text-xs uppercase stroke-black-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
