"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/chatStore";

export default function ChatMessages() {
  const messages = useChatStore((state) => state.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAutoScroll]);

  // Check if user has scrolled up
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAutoScroll(isNearBottom);
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {} as Record<string, typeof messages>);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 space-y-6"
      onScroll={handleScroll}
    >
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Date Divider */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
              {date === new Date().toLocaleDateString() ? "Today" : date}
            </div>
          </div>

          {/* Messages for this date */}
          <div className="space-y-4">
            {dateMessages.map((msg, index) => {
              // Check if this message is from the same sender as previous
              const prevMsg = dateMessages[index - 1];
              const isConsecutive =
                prevMsg &&
                prevMsg.sender === msg.sender &&
                !msg.isSystem &&
                !prevMsg.isSystem &&
                new Date(msg.createdAt).getTime() -
                  new Date(prevMsg.createdAt).getTime() <
                  60000;

              return (
                <div
                  key={msg._id}
                  className={msg.isSystem ? "text-center" : ""}
                >
                  {msg.isSystem ? (
                    <div className="flex items-center justify-center">
                      <span className="text-sm text-gray-500 italic bg-gray-100 px-3 py-1 rounded-full">
                        {msg.text}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`flex items-start gap-3 hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors ${
                        isConsecutive ? "mt-1" : "mt-4"
                      }`}
                    >
                      {/* Avatar - only show if not consecutive */}
                      {!isConsecutive ? (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: msg.color }}
                          aria-label={`${msg.sender}'s avatar`}
                        >
                          {msg.sender[0].toUpperCase()}
                        </div>
                      ) : (
                        <div className="w-10 flex-shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        {/* Sender and timestamp - only show if not consecutive */}
                        {!isConsecutive && (
                          <div className="flex items-baseline gap-2 mb-1">
                            <span
                              className="font-semibold text-sm"
                              style={{ color: msg.color }}
                            >
                              {msg.sender}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}

                        {/* Message text */}
                        <p className="text-gray-800 text-sm leading-relaxed break-words">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div ref={messagesEndRef} />

      {/* Scroll to bottom button */}
      {!isAutoScroll && (
        <button
          onClick={() => {
            setIsAutoScroll(true);
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          className="fixed bottom-24 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-110"
          aria-label="Scroll to bottom"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
