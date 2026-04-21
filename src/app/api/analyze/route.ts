import { NextResponse } from 'next/server';
import { scrapeProductUrl } from '@/lib/scraper';
import { analyzeProduct, compareProducts } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url1, url2, constraints, isComparison } = body;

    if (!constraints) {
      return NextResponse.json({ error: 'Constraints are required' }, { status: 400 });
    }

    if (isComparison) {
      if (!url1 || !url2) {
        return NextResponse.json({ error: 'Two URLs are required for comparison' }, { status: 400 });
      }

      console.log('Scraping product 1...');
      const p1Data = await scrapeProductUrl(url1);
      console.log('Scraping product 2...');
      const p2Data = await scrapeProductUrl(url2);

      console.log('Analyzing with Gemini...');
      const comparisonResult = await compareProducts(p1Data, p2Data, constraints);

      return NextResponse.json({
        type: 'comparison',
        product1Data: { title: p1Data.title, price: p1Data.price },
        product2Data: { title: p2Data.title, price: p2Data.price },
        ...comparisonResult
      });
    } else {
      if (!url1) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
      }

      console.log('Scraping product 1...');
      const pData = await scrapeProductUrl(url1);

      console.log('Analyzing with Gemini...');
      const analysisResult = await analyzeProduct(pData, constraints);

      return NextResponse.json({
        type: 'single',
        productData: { title: pData.title, price: pData.price },
        ...analysisResult
      });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
