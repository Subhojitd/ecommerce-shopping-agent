"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingCart, ArrowRight, ArrowRightLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AnalysisForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const [isComparison, setIsComparison] = useState(false);
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [constraints, setConstraints] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ isComparison, url1, url2: isComparison ? url2 : undefined, constraints });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      <div className="flex justify-center mb-8">
        <div className="bg-white/5 p-1 rounded-full inline-flex relative cursor-pointer">
          <div
            className={cn("absolute inset-0 w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-transform duration-300",
              isComparison ? "translate-x-full" : "translate-x-0"
            )}
          />
          <button
            type="button"
            onClick={() => setIsComparison(false)}
            className={cn("relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors",
              !isComparison ? "text-white" : "text-gray-400 hover:text-white"
            )}
          >
            Single Product
          </button>
          <button
            type="button"
            onClick={() => setIsComparison(true)}
            className={cn("relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors",
              isComparison ? "text-white" : "text-gray-400 hover:text-white"
            )}
          >
            Comparison Mode
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Wrap both inputs in a container with a consistent gap */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <ShoppingCart className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              required
              value={url1}
              onChange={(e) => setUrl1(e.target.value)}
              placeholder="Paste Amazon or Flipkart URL here..."
              className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <AnimatePresence>
            {isComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 0 }} // Managed by parent gap
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="relative overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ArrowRightLeft className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  required={isComparison}
                  value={url2}
                  onChange={(e) => setUrl2(e.target.value)}
                  placeholder="Paste second product URL for comparison..."
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-transparent outline-none transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">What are you looking for?</label>
          <textarea
            required
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="e.g., 'Need a laptop under $1500 strictly for heavy 4K video editing, must have 32GB RAM' or 'Looking for a comfortable reading chair...'"
            rows={4}
            className="block w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <>
              <Sparkles className="w-5 h-5 -mt-0.5" />
              Analyze with Agent
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
