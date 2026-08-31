import { type FC, useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, Sparkles, HelpCircle } from "lucide-react"
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
            <strong key={partIdx} className="font-semibold text-zinc-900 dark:text-zinc-100">
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
    <div 
      className="fixed inset-0 z-50 bg-transparent px-6 pt-8 pb-6 md:px-12 md:py-8 lg:relative lg:inset-auto lg:z-auto lg:h-[calc(100vh-80px)] lg:w-full lg:p-0 flex flex-col justify-between transition-all duration-500 animate-fade-in"
    >
      {/* Header Container */}
      <div className="flex items-center justify-between pb-3 bg-transparent border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:text-zinc-900 dark:active:text-zinc-100 transition-colors text-[10px] font-mono uppercase tracking-widest font-semibold active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Profile</span>
          </button>
          
          {messages.length > 1 && (
            <button 
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:text-zinc-900 dark:active:text-zinc-100 transition-colors text-[10px] font-mono uppercase tracking-widest font-semibold border-l border-zinc-250/20 dark:border-zinc-800/80 pl-4 active:scale-95"
            >
              Clear Chat
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 select-none">
          <div className="relative">
            <span className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500/30 animate-ping" />
            <span className="relative block w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[9.5px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-400 font-semibold">MinBOT Active</span>
        </div>
      </div>

      {/* Conversation List */}
      <div ref={chatListRef} data-chat-scroll className="flex-1 overflow-y-auto py-4 space-y-5 font-sans text-[13px] leading-[1.65] pr-1.5 scrollbar-minimal">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex flex-col gap-1 w-full ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            {msg.role === "user" ? (
              <div className="space-y-1 max-w-[85%]">
                <div className="text-[8px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">You</div>
                <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-none px-3.5 py-2 text-[13.5px] shadow-sm">
                  {parseMessageContent(msg.content)}
                </div>
              </div>
            ) : (
              <div className="space-y-1 max-w-[88%]">
                <div className="text-[8px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">MinBOT</div>
                <div className="border-l border-zinc-200 dark:border-zinc-800/80 pl-3.5 py-0.5 text-zinc-800 dark:text-zinc-200 text-[13.5px] font-sans leading-relaxed select-text">
                  {parseMessageContent(msg.content)}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Custom staggered bouncing dots & rotating sparkle thinking indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 pl-3.5 border-l border-dashed border-zinc-200 dark:border-zinc-800 py-1.5 animate-pulse">
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 animate-spin [animation-duration:3s]" />
            </div>
            <div className="flex items-center gap-1 bg-zinc-100/50 dark:bg-zinc-900/40 rounded-none px-2.5 py-1 border border-zinc-200/20 dark:border-zinc-800/20">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" />
              <span className="text-[8.5px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 pl-1.5">thinking</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Queries Grid */}
      <div className="py-3.5 bg-transparent space-y-2 border-t border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-1 select-none">
          <HelpCircle className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
          <span className="text-[8.5px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Ask regarding...</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto scrollbar-none">
          {suggestedPrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-[9px] font-mono px-3 py-1 border border-zinc-200/80 dark:border-zinc-900 rounded-none bg-zinc-50/20 dark:bg-zinc-950/10 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-350 dark:hover:border-zinc-800 active:bg-zinc-50 dark:active:bg-zinc-900/50 active:text-zinc-900 dark:active:text-zinc-100 active:border-zinc-350 dark:active:border-zinc-800 active:scale-95 transition-all duration-300 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Container */}
      <div className="py-4 bg-transparent border-t border-zinc-100 dark:border-zinc-900">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2 bg-zinc-50/20 dark:bg-zinc-950/10 border border-zinc-200/80 dark:border-zinc-900 rounded-none px-3 py-1.5 focus-within:bg-zinc-50/30 dark:focus-within:bg-zinc-900/20 focus-within:border-zinc-350 dark:focus-within:border-zinc-800 transition-all duration-300"
        >
          <input
            type="text"
            placeholder="Ask about Menajul..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-[13.5px] bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none disabled:opacity-50 px-1"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-1 rounded-none bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-200 active:bg-zinc-700 dark:active:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center self-center active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  )
}

export default MinBOT
