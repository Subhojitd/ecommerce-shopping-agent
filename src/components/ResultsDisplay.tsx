import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, ThumbsUp } from 'lucide-react';
import { cn } from './AnalysisForm';

export default function ResultsDisplay({ data, type }: { data: any, type: string }) {
  if (type !== 'single') return null;
  const { verdict, summary, pros, cons, sentiment, productData } = data;

  const getVerdictConfig = () => {
    switch (verdict) {
      case 'Highly Recommended':
        return { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: ThumbsUp };
      case 'Wait for Sale':
        return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: AlertCircle };
      case 'Not for You':
        return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle };
      default:
        return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: CheckCircle2 };
    }
  };

  const config = getVerdictConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mt-12 glass-panel rounded-2xl overflow-hidden"
    >
      <div className={cn("p-6 md:p-8 border-b", config.border, config.bg)}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{productData.title}</h2>
            {/* <div className="text-2xl font-black text-white">{productData.price}</div> */}
          </div>
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full border", config.color, config.border, config.bg)}>
            <Icon className="w-5 h-5" />
            <span className="font-bold tracking-wide uppercase text-sm">{verdict}</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-400" /> AI Summary
          </h3>
          <p className="text-gray-300 leading-relaxed">{summary}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass p-6 rounded-xl border-green-500/10">
            <h4 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Pros
            </h4>
            <ul className="space-y-3">
              {pros?.map((pro: string, i: number) => (
                <li key={i} className="text-gray-300 flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 mt-2 flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-6 rounded-xl border-red-500/10">
            <h4 className="font-semibold text-red-400 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> Cons
            </h4>
            <ul className="space-y-3">
              {cons?.map((con: string, i: number) => (
                <li key={i} className="text-gray-300 flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-2 flex-shrink-0" />
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glass p-6 rounded-xl bg-purple-500/5 border-purple-500/10">
          <h4 className="font-semibold text-purple-400 mb-2">User Feedback Sentiment</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{sentiment}</p>
        </div>
      </div>
    </motion.div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
  )
}
