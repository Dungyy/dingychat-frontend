"use client";

import { useChatStore } from "@/store/chatStore";

export default function TypingIndicator() {
  const typingUsers = useChatStore((state) => state.typingUsers);

  if (typingUsers.length === 0) return null;

  return (
    <div className="px-6 py-2 text-sm text-gray-500 italic">
      {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
      typing...
    </div>
  );
}
