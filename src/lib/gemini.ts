// Gemini API integration for AI-generated project analysis

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface Project {
  title: string;
  year: string;
  description: string;
  tech: string;
  status: string;
  link: string;
}

// Custom prompts for different project types
const getProjectPrompt = (project: Project): string => {
  const basePrompt = `You are a senior software engineer and technical analyst. Analyze this project and provide a comprehensive technical assessment in a professional, engaging tone. Keep the response under 300 words and focus on technical insights, architecture decisions, and business value.

Project Details:
- Title: ${project.title}
- Year: ${project.year}
- Description: ${project.description}
- Technology Stack: ${project.tech}
- Status: ${project.status}
- URL: ${project.link}

Provide analysis covering:

**Technical Architecture & Implementation**
• Key architectural decisions and patterns
• Implementation approach and methodology

**Technology Stack Assessment**
• Technology choices and their rationale
• Stack compatibility and integration

**Business Value & Impact**
• Real-world applications and benefits
• Market relevance and competitive advantage

**Innovation & Best Practices**
• Modern development practices used
• Innovative features and approaches

**Scalability & Performance Considerations**
• Performance optimization strategies
• Scalability planning and architecture

Format the response with clear structure using **bold headers** and bullet points (•) for key points. Make it professional and impressive for potential employers or clients.`;

  // Custom prompts for specific project types
  if (project.title.toLowerCase().includes('vidstats')) {
    return `${basePrompt}

Focus specifically on:
- AI/ML integration and data analytics capabilities
- YouTube API integration and data processing
- Real-time analytics and dashboard design
- Scalability for handling large datasets
- User experience in analytics platforms`;
  }

  if (project.title.toLowerCase().includes('transcript')) {
    return `${basePrompt}

Focus specifically on:
- Natural language processing and AI integration
- Multi-language support and translation capabilities
- API design and third-party integrations
- Performance optimization for large text processing
- User interface for transcript management`;
  }

  if (project.title.toLowerCase().includes('quran')) {
    return `${basePrompt}

Focus specifically on:
- AI chatbot implementation and natural language understanding
- Religious text processing and context awareness
- Migration from WordPress to Next.js
- Performance improvements and modern architecture
- User experience in educational platforms`;
  }

  if (project.title.toLowerCase().includes('ig tools') || project.title.toLowerCase().includes('igtools')) {
    return `${basePrompt}

Focus specifically on:
- Social media API integrations
- Multi-platform tool development
- WordPress to modern framework migration
- Tool ecosystem design and user experience
- Performance optimization for multiple APIs`;
  }

  return basePrompt;
};

// Test function to check environment variables
export const testEnvironmentVariables = () => {
  console.log('🧪 Testing environment variables...');
  console.log('🔍 All env vars:', import.meta.env);
  console.log('🔍 GEMINI_API_KEY:', import.meta.env.GEMINI_API_KEY);
  console.log('🔍 NODE_ENV:', import.meta.env.NODE_ENV);
  console.log('🔍 MODE:', import.meta.env.MODE);
};

export const generateProjectAnalysis = async (project: Project): Promise<string> => {
  try {
    const apiKey = import.meta.env.GEMINI_API_KEY;
    
    console.log('🔑 API Key check:', apiKey ? 'Found' : 'Missing');
    console.log('🔑 API Key length:', apiKey?.length || 0);
    console.log('🔑 API Key starts with:', apiKey?.substring(0, 10) || 'N/A');
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.length < 20) {
      console.error('❌ Gemini API key not configured properly');
      console.error('❌ Current API key value:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');
      throw new Error('Gemini API key not found. Please add GEMINI_API_KEY to your .env.local file.');
    }

    const prompt = getProjectPrompt(project);
    console.log('📝 Generated prompt for:', project.title);
    console.log('🎯 Prompt length:', prompt.length);
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      }
    };

    // Use only gemini-2.0-flash model
    const models = [
      'gemini-2.0-flash'
    ];

    let lastError: Error | null = null;

    for (const model of models) {
      try {
        console.log(`🚀 Trying model: ${model}`);
        
        // Try v1 API first, then v1beta as fallback
        const apiVersions = ['v1', 'v1beta'];
        let response: Response | null = null;
        let lastApiError: Error | null = null;
        
        for (const apiVersion of apiVersions) {
          try {
            console.log(`📡 Trying API version: ${apiVersion}`);
            response = await fetch(`https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody)
            });
            
            if (response.ok) {
              console.log(`✅ API version ${apiVersion} worked for model ${model}`);
              break;
            } else {
              const errorText = await response.text();
              console.log(`❌ API version ${apiVersion} failed: ${response.status} ${response.statusText}`);
              lastApiError = new Error(`API version ${apiVersion} failed: ${response.status} ${response.statusText} - ${errorText}`);
            }
          } catch (apiError) {
            console.log(`❌ API version ${apiVersion} error:`, apiError);
            lastApiError = apiError as Error;
          }
        }
        
        if (!response || !response.ok) {
          throw lastApiError || new Error(`All API versions failed for model ${model}`);
        }

        console.log('📡 Response status:', response.status, response.statusText);

        const data: GeminiResponse = await response.json();
        console.log('📊 API Response data:', data);
        
        if (!data.candidates || data.candidates.length === 0) {
          console.error(`❌ No candidates in response for model ${model}:`, data);
          lastError = new Error(`No candidates in response for model ${model}`);
          continue; // Try next model
        }

        if (!data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
          console.error(`❌ No content parts in response for model ${model}:`, data.candidates[0]);
          lastError = new Error(`No content parts in response for model ${model}`);
          continue; // Try next model
        }

        const generatedText = data.candidates[0].content.parts[0].text;
        console.log('✅ Generated text length:', generatedText?.length);
        console.log(`🎉 AI Analysis generated successfully with model ${model}!`);
        
        return generatedText.trim();
        
      } catch (modelError) {
        console.error(`❌ Model ${model} error:`, modelError);
        lastError = modelError as Error;
        continue; // Try next model
      }
    }

    // If all models failed, throw the last error
    throw lastError || new Error('All Gemini models failed');
    
  } catch (error) {
    console.error('💥 Error generating project analysis:', error);
    console.error('🔄 Falling back to static analysis...');
    
    // Don't return fallback - throw the error so we can see what's happening
    throw error;
  }
};

// Fallback analysis when API is unavailable
const generateFallbackAnalysis = (project: Project): string => {
  const currentYear = new Date().getFullYear();
  const yearsSinceLaunch = currentYear - parseInt(project.year);
  
  return `Technical Analysis: ${project.title}

This ${project.year} project demonstrates solid technical implementation using ${project.tech.split(', ')[0]} as the primary technology. The architecture shows modern web development practices with attention to user experience and scalability.

Key Technical Insights:
• Built with ${project.tech}
• Status: ${project.status} (${yearsSinceLaunch} years in production)
• Focus on practical functionality and user experience

Architecture Assessment:
The project leverages contemporary development tools and follows industry best practices. The technology stack indicates a well-planned approach to scalability and maintainability, with modern frameworks ensuring optimal performance.

Business Value:
This represents competent full-stack development with practical application of modern web technologies, demonstrating both technical proficiency and business acumen in creating valuable digital solutions.`;
};
