"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Send } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { getSocket } from "@/lib/socket";
import { MAX_MESSAGE_LENGTH } from "@/global";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const currentRoom = useChatStore((state) => state.currentRoom);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const handleSend = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    const socket = getSocket();
    if (!socket) return;

    setIsSending(true);

    try {
      socket.emit("chatMessage", trimmedInput, false);
      setInput("");

      // Stop typing indicator
      socket.emit("stopTyping");
      isTypingRef.current = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  }, [input, isSending]);

  const handleTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket) return;

    // Only emit "typing" once until we stop
    if (!isTypingRef.current) {
      socket.emit("typing");
      isTypingRef.current = true;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping");
      isTypingRef.current = false;
    }, 1000);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const remainingChars = MAX_MESSAGE_LENGTH - input.length;
  const isNearLimit = remainingChars < 50;

  return (
    <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2">
          <div className="relative flex-1 text-gray-900">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                  setInput(e.target.value);
                  handleTyping();
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Type a message in #${currentRoom || "OMNI CHAT"}...`}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
              rows={1}
              disabled={isSending}
              aria-label="Message input"
            />

            {/* Character counter (only show when near limit) */}
            {isNearLimit && (
              <div
                className={`absolute bottom-2 left-3 text-xs font-medium ${
                  remainingChars < 0 ? "text-red-500" : "text-gray-500"
                }`}
              >
                {remainingChars}
              </div>
            )}
          </div>

          {/* Send button now next to the input */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending || remainingChars < 0}
            className="bg-indigo-600 text-white p-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 mb-3"
            aria-label="Send message"
          >
            {isSending ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Helper text */}
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <span>
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
              Enter
            </kbd>{" "}
            to send,{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
              Shift+Enter
            </kbd>{" "}
            for new line
          </span>
        </div>
      </div>
    </div>
  );
}
