import { type FC, useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, Sparkles } from "lucide-react"
import profileKnowledge from "../data/personal_knowledge.json"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface MinBOTProps {
  isOpen: boolean
  onClose: () => void
}

const CORE_SUGGESTED_QUESTIONS = [
  "What did you study at Jadavpur University?",
  "Tell me about Next Station short film",
  "What was your WBJEE prep at Al-Ameen Mission?",
  "List your professional certifications"
];

const BotAvatar: FC = () => (
  <img
    src={`${import.meta.env.BASE_URL}profile-icon.png`}
    alt=""
    width={28}
    height={28}
    className="w-7 h-7 shrink-0 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
  />
)

const MinBOT: FC<MinBOTProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I am MinBOT, Menajul's AI assistant. Ask me anything about my projects, technical architecture, AI engineering, skills, or certifications!"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(CORE_SUGGESTED_QUESTIONS)
  const chatListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen])

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hi! I am MinBOT, Menajul's AI assistant. Ask me anything about my projects, technical architecture, AI engineering, skills, or certifications!"
      }
    ]);
    setSuggestedPrompts(CORE_SUGGESTED_QUESTIONS);
  };

  const parseMessageContent = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      // RegEx to split and capture **bold text** and [link text](url)
      const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
      
      const content = parts.map((part, partIdx) => {
        // Bold formatting
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={partIdx} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        // Markdown Links formatting
        if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
          const textMatch = part.match(/\[(.*?)\]/);
          const urlMatch = part.match(/\((.*?)\)/);
          if (textMatch && urlMatch) {
            const linkText = textMatch[1];
            const linkUrl = urlMatch[1];
            return (
              <a 
                key={partIdx}
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-zinc-900 dark:text-zinc-100 hover:text-zinc-500 dark:hover:text-zinc-400 font-medium transition-colors cursor-pointer"
              >
                {linkText}
              </a>
            );
          }
        }
        return part
      });

      return (
        <span key={lineIdx} className="block min-h-[1.4em]">
          {content}
        </span>
      )
    });
  }

  const getRandomFallbacks = (): string[] => {
    return CORE_SUGGESTED_QUESTIONS;
  }

  const handleSend = async (customMessage?: string) => {
    const userMessage = (customMessage || input).trim()
    if (!userMessage || isLoading) return

    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const systemPrompt = `You are MinBOT, a conversational AI representing Menajul Hoque on his personal portfolio. 
Your goal is to answer questions about Menajul's career, education, skills, projects, and life based ONLY on the structured context provided below.

Rules:
1. **FIRST-PERSON STYLE**: Speak strictly in the first-person representing Menajul (e.g. "I studied at Jadavpur...", "My projects include...", "I architect cloud data pipelines and AI agents..."). NEVER refer to Menajul in the third-person as "Menajul" or "he" in your responses.
2. For questions unrelated to Menajul, politely explain that you are dedicated to answering details about Menajul's profile.
3. Be structured and concise.
4. **CRITICAL**: Always use clean markdown line breaks (each list item on a separate line) for any list of items (e.g., certifications, education history, projects). NEVER merge multiple numbered list items into a single line.
5. Highlight important names, project titles, and certificates using bold markers (**like this**).
6. **SUGGESTED QUESTIONS**: At the very end of your response, you MUST append exactly 3 relevant and curious follow-up questions the user might ask next. Format them strictly as a single line: [SUGGESTIONS]: ["Question 1", "Question 2", "Question 3"]. Make sure the array uses double quotes and matches valid JSON.
7. **STRICT CONTEXT CONSTRAINT**: You are NOT allowed to answer general questions, write code, tell general jokes, translate unrelated files, or discuss any topics outside of Menajul's profile context. If the user asks anything unrelated to Menajul, your background, or your qualifications, you must politely decline and state that you are only programmed to discuss Menajul Hoque's profile.

Here is the official profile context:
${JSON.stringify(profileKnowledge, null, 2)}`

      const chatHistory = messages.map(msg => ({
        role: msg.role === "assistant" ? "assistant" as const : "user" as const,
        content: msg.content
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...chatHistory,
            { role: "user", content: userMessage }
          ],
          temperature: 0.7
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error.message || "OpenAI API Error")

      const reply = data.choices?.[0]?.message?.content || "I couldn't process that. Please try again."
      
      let cleanedReply = reply;
      let newSuggestions = getRandomFallbacks();

      // ALWAYS strip out any suggestions blocks from the visible bubble response first
      cleanedReply = reply.replace(/\[SUGGESTIONS\]:?[\s\S]*/i, "").trim();

      const suggestionsMatch = reply.match(/\[SUGGESTIONS\]:?[\s\S]*/i);
      if (suggestionsMatch) {
        const content = suggestionsMatch[0];
        // Match anything inside quotes: "", '', “”, or []
        const quoteRegex = /["'“‘](.*?)["'”’]/g;
        const extracted: string[] = [];
        let m;
        while ((m = quoteRegex.exec(content)) !== null) {
          const q = m[1].trim();
          // Filter out the tag name itself if matched
          if (q && q.length > 5 && q.toLowerCase() !== "suggestions") {
            extracted.push(q);
          }
        }
        
        // Fallback: If no quotes matched, split by lines and clean list markers
        if (extracted.length === 0) {
          const lines = content.replace(/\[SUGGESTIONS\]:?/i, "").split(/\n/);
          for (let line of lines) {
            const cleaned = line.replace(/^[-*•\d\.\s\[\]"']+|["'\]\s]+$/g, "").trim();
            if (cleaned && cleaned.length > 5) {
              extracted.push(cleaned);
            }
          }
        }

        if (extracted.length > 0) {
          newSuggestions = extracted.slice(0, 3);
        }
      }

      setMessages(prev => [...prev, { role: "assistant", content: cleanedReply }])
      setSuggestedPrompts(newSuggestions)
    } catch (error: any) {
      console.error("Chatbot error:", error)
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `Error: ${error.message || "Failed to contact OpenAI. Check key/network."}` }
      ])
      setSuggestedPrompts(getRandomFallbacks())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAF9] dark:bg-[#161210] animate-fade-in">
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pt-5 pb-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-900 dark:text-zinc-100 select-none">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
            MinBOT
          </div>

          {messages.length > 1 ? (
            <button
              onClick={handleClear}
              className="rounded-full px-2.5 py-1 text-[13px] text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Clear
            </button>
          ) : (
            <span className="w-[52px]" aria-hidden="true" />
          )}
        </div>

        {/* Conversation */}
        <div ref={chatListRef} data-chat-scroll className="flex-1 overflow-y-auto py-4 space-y-4 font-sans scrollbar-minimal">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "user" ? (
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2.5 text-[14px] leading-relaxed">
                  {parseMessageContent(msg.content)}
                </div>
              ) : (
                <div className="flex items-end gap-2.5 max-w-[92%]">
                  <BotAvatar />
                  <div className="min-w-0 rounded-2xl rounded-bl-md border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 px-4 py-2.5 text-[14px] leading-relaxed text-zinc-800 dark:text-zinc-200 select-text">
                    {parseMessageContent(msg.content)}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2.5 justify-start">
              <BotAvatar />
              <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 px-4 py-3" role="status" aria-label="MinBOT is thinking">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="pt-3 pb-2">
          <div className="flex flex-wrap gap-1.5 max-h-[84px] overflow-y-auto scrollbar-none">
            {suggestedPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="rounded-full border border-zinc-200/80 dark:border-zinc-800/80 px-3 py-1 text-[12px] text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="pb-5 sm:pb-8 pt-1">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 pl-4 pr-1.5 py-1.5 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors"
          >
            <input
              type="text"
              placeholder="Ask about Menajul…"
              aria-label="Ask MinBOT a question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 min-w-0 text-[14px] bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send"
              className="w-8 h-8 shrink-0 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors disabled:opacity-40 flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MinBOT
