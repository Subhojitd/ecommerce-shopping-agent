import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export interface ScrapedData {
  title: string;
  price: string;
  description: string;
  reviews: string[];
  rawText?: string;
  url: string;
}

export async function scrapeProductUrl(url: string): Promise<ScrapedData> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    // Set a common user agent to avoid basic blocks
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');

    // Navigate and wait for network idle
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Get full HTML
    const content = await page.content();
    const $ = cheerio.load(content);

    // Heuristic extraction
    // Titles
    const title = $('h1').first().text().trim() || $('title').text().trim();

    // Price Extraction Strategy
    let price = '';
    
    // 1. Try to extract from SEO JSON-LD data (Most robust method)
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const jsonData = JSON.parse($(el).html() || '{}');
        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
        for (const item of dataArray) {
          // Check for product schema
          if (item['@type'] === 'Product' || item['@type']?.includes('Product')) {
            const offers = item.offers;
            if (offers) {
              const offerObj = Array.isArray(offers) ? offers[0] : offers;
              if (offerObj?.price) {
                const currency = offerObj.priceCurrency === 'INR' ? '₹' : offerObj.priceCurrency === 'USD' ? '$' : '';
                price = currency + offerObj.price;
              }
            }
          }
        }
      } catch (e) {
        // ignore parse errors
      }
    });

    // 2. Fallback to common CSS selectors (including Flipkart generic ones)
    if (!price) {
      const priceSelectors = ['.a-price .a-offscreen', '#priceblock_ourprice', '._30jeq3', '.Nx9bqj', 'div[class*="price"]', 'span[class*="price"]'];
      for (const sel of priceSelectors) {
        const p = $(sel).first().text().trim();
        if (p) {
          price = p;
          break;
        }
      }
    }

    // 3. Fallback to regex for Rupee or Dollar symbol in early body text
    if (!price) {
       const text = $('body').text();
       const priceMatch = text.match(/(₹|\$)\s?[\d,]+(\.\d{2})?/);
       if (priceMatch) {
          price = priceMatch[0];
       }
    }

    // Description - look for common description containers
    let description = '';
    const descSelectors = ['#feature-bullets', '#productDescription', 'div[class*="description"]'];
    for (const sel of descSelectors) {
      const d = $(sel).text().trim();
      if (d) {
        description += d + '\n';
      }
    }

    // Reviews - look for review texts
    const reviews: string[] = [];
    $('[data-hook="review-body"], div[class*="review-text"]').each((_, el) => {
      const text = $(el).text().trim();
      if (text) reviews.push(text);
    });

    // Capture raw text as a fallback for the AI
    const rawText = $('body').text().replace(/\s+/g, ' ').slice(0, 8000).trim();

    return {
      title,
      price: price || 'Not found',
      description: description.trim().slice(0, 2000) || 'Not found',
      reviews: reviews.slice(0, 10), // Take top 10 reviews
      rawText,
      url,
    };
  } finally {
    await browser.close();
  }
}
