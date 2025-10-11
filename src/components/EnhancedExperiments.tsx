import { type FC, useState, useRef, useEffect } from "react"
import { ExternalLink, Globe, Code, Calendar, Zap, AlertCircle, RefreshCw, Brain, Loader2 } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { generateProjectAnalysis, testEnvironmentVariables } from "@/lib/gemini"

// Function to format AI analysis text with proper ornaments and structure
const formatAnalysisText = (text: string) => {
  if (!text) return text;
  
  return text
    // Format headers with ornaments
    .replace(/\*\*([^*]+)\*\*/g, (match, content) => {
      return `<div class="font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-3 first:mt-0">${content}</div>`;
    })
    // Format bullet points with proper ornaments
    .replace(/^[\s]*[-•]\s*(.+)$/gm, (match, content) => {
      return `<div class="flex items-start gap-2 mb-1"><span class="text-blue-500 dark:text-blue-400 mt-1">•</span><span>${content}</span></div>`;
    })
    // Format numbered lists
    .replace(/^[\s]*(\d+)\.\s*(.+)$/gm, (match, num, content) => {
      return `<div class="flex items-start gap-2 mb-1"><span class="text-blue-500 dark:text-blue-400 font-medium min-w-[20px]">${num}.</span><span>${content}</span></div>`;
    })
    // Format bold text within paragraphs
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-800 dark:text-gray-200">$1</strong>')
    // Format italic text
    .replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>')
    // Format code snippets
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    // Split into paragraphs and format
    .split('\n\n')
    .map(paragraph => {
      if (paragraph.trim().startsWith('<div')) {
        return paragraph; // Already formatted
      }
      return `<div class="mb-3 last:mb-0">${paragraph}</div>`;
    })
    .join('');
};

// Typewriter effect component
const TypewriterText: FC<{ text: string; speed: number }> = ({ text, speed }) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Reset when text changes (new project)
    setDisplayText("")
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (currentIndex === text.length && text.length > 0) {
      // Writing is complete, show full text
      setIsComplete(true)
      setDisplayText(text)
    }
  }, [currentIndex, text, speed])

  return (
    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
      {isComplete ? text : displayText}
      {!isComplete && <span className="text-gray-400 dark:text-gray-500">|</span>}
    </div>
  )
}

// AI Analysis Component with Gemini API
const AIAnalysis: FC<{ project: Project }> = ({ project }) => {
  const [analysis, setAnalysis] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [currentStep, setCurrentStep] = useState<string>('')
  const [stepProgress, setStepProgress] = useState(0)

  useEffect(() => {
    const generateAnalysis = async () => {
      setIsGenerating(true)
      setIsError(false)
      setErrorMessage('')
      setAnalysis('')
      setStepProgress(0)
      
      const steps = [
        'Initializing analysis engine',
        'Connecting to AI service',
        'Processing project metadata',
        'Evaluating technical architecture',
        'Analyzing implementation patterns',
        'Generating comprehensive insights',
        'Finalizing analysis report'
      ]
      
      console.log('🤖 Starting AI analysis for:', project.title)
      
      // Test environment variables first
      testEnvironmentVariables()
      
      try {
        // Simulate step progression
        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(steps[i])
          setStepProgress((i + 1) * (100 / steps.length))
          await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500))
        }
        
        const aiAnalysis = await generateProjectAnalysis(project)
        console.log('✅ AI Analysis received:', aiAnalysis.substring(0, 100) + '...')
        setAnalysis(aiAnalysis)
        setIsError(false)
        setCurrentStep('Analysis complete')
        setStepProgress(100)
      } catch (error) {
        console.error('❌ Failed to generate AI analysis:', error)
        setIsError(true)
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred')
        setCurrentStep('Analysis failed')
        
        // Show error message instead of fallback
        setAnalysis(`❌ AI Analysis Failed

Error: ${error instanceof Error ? error.message : 'Unknown error'}

Please check:
1. GEMINI_API_KEY is set in .env.local
2. API key is valid and has proper permissions
3. Network connection is working
4. Check browser console for detailed error logs

To fix this:
1. Get your API key from: https://makersuite.google.com/app/apikey
2. Create .env.local file in project root
3. Add: GEMINI_API_KEY=your_actual_api_key
4. Restart development server`)
      } finally {
        setIsGenerating(false)
      }
    }

    generateAnalysis()
  }, [project])

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-6">
        {/* Progress Bar */}
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Analysis Progress</span>
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{Math.round(stepProgress)}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-400 dark:to-slate-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stepProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Current Step */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-slate-600 dark:bg-slate-400 rounded-full animate-pulse"></div>
            <span className="text-base font-medium text-gray-800 dark:text-gray-200">{currentStep}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            Processing technical analysis and generating insights
          </p>
        </div>
        
        {/* Step Indicators */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((step, index) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                (stepProgress / 100) * 7 >= step
                  ? 'bg-slate-600 dark:bg-slate-400'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="bg-transparent rounded-lg p-4 border border-red-200 dark:border-red-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
          <span className="text-xs text-red-500 dark:text-red-400">API Error</span>
        </div>
        <div 
          className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatAnalysisText(analysis) }}
        />
      </div>
    )
  }

  return (
    <div className="bg-transparent rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-500 dark:text-gray-400">✅ AI Analysis Complete</span>
      </div>
      <div 
        className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pb-6"
        dangerouslySetInnerHTML={{ __html: formatAnalysisText(analysis) }}
      />
    </div>
  )
}

interface Project {
  title: string
  year: string
  description: string
  tech: string
  status: string
  link: string
}

// Website Preview Component with Enhanced Error Handling and Auto-Scroll
const WebsitePreview: FC<{ url: string; title: string }> = ({ url, title }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [loadTimeout, setLoadTimeout] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const maxRetries = 1

  // Check if URL is known to have iframe restrictions
  const isKnownRestricted = (url: string) => {
    const restrictedDomains = ['vidstats.pro', 'youtubetranscript.in', 'quran-gpt.netlify.app', 'igtoolsapk.in']
    return restrictedDomains.some(domain => url.includes(domain))
  }

  const startAutoScroll = () => {
    if (!iframeRef.current || isKnownRestricted(url)) return
    
    setIsScrolling(true)
    let scrollPosition = 0
    let direction = 1 // 1 for down, -1 for up
    let maxScroll = 0
    
    const scroll = () => {
      if (isPaused || !iframeRef.current) return
      
      try {
        const iframe = iframeRef.current
        const contentWindow = iframe.contentWindow
        const contentDocument = iframe.contentDocument
        
        if (contentWindow && contentDocument) {
          // Get the maximum scroll height
          if (maxScroll === 0) {
            maxScroll = Math.max(
              contentDocument.body?.scrollHeight || 0,
              contentDocument.documentElement?.scrollHeight || 0,
              contentDocument.body?.offsetHeight || 0,
              contentDocument.documentElement?.offsetHeight || 0
            ) - iframe.offsetHeight
          }
          
          // Update scroll position
          scrollPosition += direction * 2 // Scroll speed
          
          // Change direction at boundaries
          if (scrollPosition >= maxScroll) {
            scrollPosition = maxScroll
            direction = -1 // Start scrolling up
          } else if (scrollPosition <= 0) {
            scrollPosition = 0
            direction = 1 // Start scrolling down
          }
          
          // Apply scroll
          contentWindow.scrollTo(0, scrollPosition)
        }
      } catch (error) {
        // If we can't access the iframe content, stop scrolling
        console.log('Auto-scroll stopped due to cross-origin restrictions')
        setIsScrolling(false)
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current)
        }
      }
    }
    
    // Start scrolling after a short delay
    setTimeout(() => {
      scrollIntervalRef.current = setInterval(scroll, 50) // Scroll every 50ms
    }, 1000)
  }

  const stopAutoScroll = () => {
    setIsScrolling(false)
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
  }

  const toggleScrollPause = () => {
    setIsPaused(!isPaused)
  }

  const handleIframeLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsLoading(false)
    setHasError(false)
    setLoadTimeout(false)
    
    // Start auto-scroll for non-restricted sites
    if (!isKnownRestricted(url)) {
      startAutoScroll()
    }
  }

  const handleIframeError = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsLoading(false)
    setHasError(true)
  }

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1)
      setHasError(false)
      setIsLoading(true)
      setLoadTimeout(false)
      
      // Force iframe reload
      if (iframeRef.current) {
        const currentSrc = iframeRef.current.src
        iframeRef.current.src = ''
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = currentSrc
          }
        }, 100)
      }
    }
  }

  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Reset states when URL changes
  useEffect(() => {
    // Stop any existing auto-scroll
    stopAutoScroll()
    
    setIsLoading(true)
    setHasError(false)
    setRetryCount(0)
    setLoadTimeout(false)
    setIsScrolling(false)
    setIsPaused(false)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set a timeout to detect if iframe doesn't load within 5 seconds
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setLoadTimeout(true)
        setIsLoading(false)
        setHasError(true)
      }
    }, 5000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      stopAutoScroll()
    }
  }, [url, isLoading])

  // For known restricted sites, show fallback immediately
  if (isKnownRestricted(url)) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/30">
        <div className="text-center">
          <Globe className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Live Website Preview
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            This website has security restrictions that prevent embedding. 
            Click below to view the live site.
          </p>
          <button
            onClick={openInNewTab}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Open {title}
          </button>
        </div>
      </div>
    )
  }

  if (hasError && (retryCount >= maxRetries || loadTimeout)) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/30">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Preview Unavailable
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            {loadTimeout 
              ? "The website took too long to load or has security restrictions."
              : "This website cannot be embedded due to security restrictions."
            } Click below to view it directly.
          </p>
          <button
            onClick={openInNewTab}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Open {title}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800/30 z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-400 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Loading preview...</p>
          </div>
        </div>
      )}
      
      {hasError && retryCount < maxRetries && !loadTimeout && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800/30 z-10">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Failed to load preview</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Auto-scroll controls */}
      {!isLoading && !hasError && !isKnownRestricted(url) && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
          <button
            onClick={toggleScrollPause}
            className="p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
          >
            {isPaused ? (
              <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          {isScrolling && (
            <div className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Auto-scroll</span>
              </div>
            </div>
          )}
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={url}
        className="w-full h-full border-0"
        title={`${title} Preview`}
        loading="eager"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation allow-presentation allow-same-origin-allow-popups allow-downloads"
        referrerPolicy="no-referrer"
        allow="fullscreen; camera; microphone; geolocation; autoplay"
        scrolling="yes"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  )
}

interface EnhancedExperimentsProps {
  projects: Project[]
}

const EnhancedExperiments: FC<EnhancedExperimentsProps> = ({ projects }) => {
  const [expandedProject, setExpandedProject] = useState<Project | null>(null)
  const [showKnowDetailButton, setShowKnowDetailButton] = useState<Project | null>(null)
  const isMobile = useIsMobile()
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleProjectHover = (project: Project) => {
    if (isMobile) return
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    // Set a small delay to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setShowKnowDetailButton(project)
    }, 300)
  }

  const handleProjectLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    
    // Small delay before hiding to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setShowKnowDetailButton(null)
    }, 100)
  }

  const handleKnowDetailClick = (project: Project) => {
    setExpandedProject(expandedProject === project ? null : project)
  }

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  return (
    <section className="mb-12">
      <h2 className="mb-8">experiments</h2>
      <p className="text-subtle pb-4 hover-border" style={{ marginBottom: '24px' }}>
        Technical projects and experiments exploring data engineering, web development, and digital tools.
        {!isMobile && (
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 opacity-75">
            Hover for preview • Click to open sections →
          </span>
        )}
      </p>
      
      <div className="relative">
        {/* Main content */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="project-item group relative"
              onMouseEnter={() => handleProjectHover(project)}
              onMouseLeave={handleProjectLeave}
            >
              {/* Enhanced project card */}
              <div className="project-card bg-white dark:bg-transparent rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/20 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-title-link"
                      >
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                          {project.title}
                        </h3>
                      </a>
                      <div className="flex items-center gap-2 mt-1">
                        {project.status === 'Live' && (
                          <span className="live-dot"></span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {project.year}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link-wrapper p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <ExternalLink className="external-link w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </a>
                  </div>
                </div>
                
                <p className="text-subtle leading-relaxed mb-4 text-gray-700 dark:text-gray-300">
                  {project.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <p className="text-xs text-muted font-mono">
                    {project.tech}
                  </p>
                </div>

                {/* Know in Detail Button */}
                {showKnowDetailButton === project && expandedProject !== project && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => handleKnowDetailClick(project)}
                      className="know-detail-button-minimal"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Know in Detail
                    </button>
                  </div>
                )}

                {/* Expandable AI Analysis */}
                {expandedProject === project && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Analysis</span>
                      </div>
                      <button
                        onClick={() => handleKnowDetailClick(project)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        title="Close analysis"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      <AIAnalysis project={project} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default EnhancedExperiments
