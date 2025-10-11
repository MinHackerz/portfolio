# Gemini API Setup Instructions

## Quick Setup

1. **Get your Gemini API Key**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

2. **Create Environment File**
   - Create a file named `.env.local` in your project root (same level as package.json)
   - Add this line to the file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   - Replace `your_actual_api_key_here` with your actual API key

3. **Restart Development Server**
   - Stop your current dev server (Ctrl+C)
   - Run `npm run dev` or `yarn dev` again
   - The environment variables will be loaded

## Testing the Integration

1. **Open Browser Console**
   - Press F12 or right-click → Inspect → Console
   - Hover over any project in your portfolio
   - Look for console logs starting with 🤖, ✅, or ❌

2. **Expected Console Output**
   ```
   🤖 Starting AI analysis for: VidStats
   🔑 API Key check: Found
   📝 Generated prompt for: VidStats
   🚀 Making API request to Gemini...
   📡 Response status: 200 OK
   ✅ Generated text length: 450
   🎉 AI Analysis generated successfully!
   ```

3. **If You See Errors**
   - Check that your API key is correct
   - Ensure .env.local file is in the right location
   - Verify you restarted the dev server
   - Check the console for detailed error messages

## Troubleshooting

### "API Key not found" Error
- Make sure .env.local file exists in project root
- Check the file name is exactly `.env.local` (not .env or .env.example)
- Verify the variable name is `GEMINI_API_KEY`
- Restart your development server

### "API Error 403" or "API Error 401"
- Your API key might be invalid
- Check if you copied the key correctly
- Try generating a new API key

### "Network Error"
- Check your internet connection
- Verify the Gemini API is accessible from your location
- Try again in a few minutes

## File Structure
```
portfolio/
├── .env.local          ← Create this file
├── src/
│   ├── lib/
│   │   └── gemini.ts   ← API integration
│   └── components/
│       └── EnhancedExperiments.tsx
└── package.json
```

## Environment Variable Format
```
GEMINI_API_KEY=AIzaSyC...your_actual_key_here
```

**Important:** Never commit your .env.local file to version control. It should be in your .gitignore file.
