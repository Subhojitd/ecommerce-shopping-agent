"use client";

import { useState } from 'react';
import AnalysisForm from '@/components/AnalysisForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import ComparisonDisplay from '@/components/ComparisonDisplay';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze');

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative z-0">
      {/* Background blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/20 blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-4 glass rounded-2xl mb-4"
          >
            <ShoppingBag className="w-10 h-10 text-purple-400" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tight"
          >
            AI Shopping <span className="text-gradient">Agent</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Paste product URLs and tell the agent exactly what you need.
            Get a personalized, data-driven verdict before you buy.
          </motion.p>
        </div>

        <div className={`transition-all duration-700 ease-in-out ${(result || error || isLoading)
          ? "lg:grid lg:grid-cols-2 lg:gap-8 items-start"
          : "max-w-3xl mx-auto"
          }`}>
          <div className="lg:sticky lg:top-8">
            <AnalysisForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {(result || error || isLoading) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 lg:mt-0"
            >
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center mb-8">
                  {error}
                </div>
              )}

              {result && (
                <div className="pb-24">
                  {result.type === 'single' ? (
                    <ResultsDisplay data={result} type={result.type} />
                  ) : (
                    <ComparisonDisplay data={result} type={result.type} />
                  )}
                </div>
              )}

              {isLoading && !result && !error && (
                <div className="flex h-full min-h-[500px] border border-white/5 rounded-2xl bg-white/[0.02] items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
                    />
                    <p className="text-gray-400">Analyzing product data...</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
