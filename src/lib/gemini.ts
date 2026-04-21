import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client
// Note: Ensure GEMINI_API_KEY is set in your .env.local file
const ai = new GoogleGenAI({ apiKey: "AIzaSyDGv1vy5DqP0DPR9lP7D279d2HQ4oUW7Y0" });

export interface AnalysisResult {
  verdict: 'Highly Recommended' | 'Wait for Sale' | 'Not for You' | 'Neutral';
  summary: string;
  pros: string[];
  cons: string[];
  sentiment: string;
}

export async function analyzeProduct(productData: any, userConstraints: string): Promise<AnalysisResult> {
  const prompt = `
    You are an expert personalized e-commerce shopping agent. 
    Analyze the following product data against the user's specific constraints.
    
    User Constraints: "${userConstraints}"
    
    Product Data:
    URL: ${productData.url}
    Title: ${productData.title}
    Price: ${productData.price}
    Description: ${productData.description}
    Reviews: ${JSON.stringify(productData.reviews)}
    
    Raw Text Fallback (if details were missing):
    ${productData.rawText?.substring(0, 2000)}

    Provide a JSON response with the following structure:
    {
      "verdict": "Highly Recommended" | "Wait for Sale" | "Not for You" | "Neutral",
      "summary": "AI summary of the product matching user constraints",
      "pros": ["Pro 1", "Pro 2"],
      "cons": ["Con 1", "Con 2"],
      "sentiment": "A short summary of what user reviews are saying (Sentiment Analysis)"
    }
    
    Return ONLY valid JSON. No markdown backticks, no extra text.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    }
  });

  const text = response.text || '{}';

  // Parse JSON from text, handling potential markdown wrappers and illegal control characters
  const cleanedText = text
    .replace(/```json\n?|\n?```/g, '')
    .replace(/[\n\r\t]+/g, ' ')
    .trim();

  try {
    return JSON.parse(cleanedText) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON. Cleaned text:", cleanedText);
    throw new Error('Failed to parse AI response');
  }
}

export async function compareProducts(product1Data: any, product2Data: any, userConstraints: string) {
  const prompt = `
    You are an expert personalized e-commerce shopping agent. 
    Compare the following two products against the user's specific constraints.
    
    User Constraints: "${userConstraints}"
    
    Product 1 Data:
    Title: ${product1Data.title}
    Description: ${product1Data.description}
    Reviews: ${JSON.stringify(product1Data.reviews)}
    
    Product 2 Data:
    Title: ${product2Data.title}
    Description: ${product2Data.description}
    Reviews: ${JSON.stringify(product2Data.reviews)}

    Provide a JSON response with the following structure:
    {
      "winner": 1 | 2 | 0, // 1 for Product 1, 2 for Product 2, 0 for tie
      "verdict": "A brief explanation of which product is better and why",
      "product1Summary": {
        "pros": ["Pro 1", "Pro 2"],
        "cons": ["Con 1", "Con 2"]
      },
      "product2Summary": {
        "pros": ["Pro 1", "Pro 2"],
        "cons": ["Con 1", "Con 2"]
      }
    }
    
    Return ONLY valid JSON. No markdown backticks, no extra text.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    }
  });

  const text = response.text || '{}';
  const cleanedText = text
    .replace(/```json\n?|\n?```/g, '')
    .replace(/[\n\r\t]+/g, ' ')
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON. Cleaned text:", cleanedText);
    throw new Error('Failed to parse AI response');
  }
}
