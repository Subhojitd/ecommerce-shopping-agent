import { motion } from 'framer-motion';
import { Trophy, Scale, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from './AnalysisForm';

export default function ComparisonDisplay({ data, type }: { data: any, type: string }) {
  if (type !== 'comparison') return null;
  const { winner, verdict, product1Summary, product2Summary, product1Data, product2Data } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto mt-12 space-y-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 inline-flex items-center gap-3">
          <Scale className="w-8 h-8 text-purple-400" /> Comparison Verdict
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">{verdict}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <ProductCard
          data={product1Data}
          summary={product1Summary}
          isWinner={winner === 1}
          number={1}
        />
        <ProductCard
          data={product2Data}
          summary={product2Summary}
          isWinner={winner === 2}
          number={2}
        />
      </div>
    </motion.div>
  );
}

function ProductCard({ data, summary, isWinner, number }: { data: any, summary: any, isWinner: boolean, number: number }) {
  return (
    <div className={cn(
      "glass-panel rounded-2xl overflow-hidden relative transition-all duration-300",
      isWinner ? "ring-2 ring-purple-500 shadow-xl shadow-purple-500/20 transform md:-translate-y-2" : "opacity-80 hover:opacity-100"
    )}>
      {isWinner && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-pink-600 text-white px-6 py-1 rounded-bl-xl font-bold text-sm shadow-lg flex items-center gap-2">
          <Trophy className="w-4 h-4" /> Winner
        </div>
      )}

      <div className="p-6 md:p-8 space-y-6">
        <div>
          <div className="text-sm text-gray-400 mb-2 font-mono">PRODUCT {number}</div>
          <h3 className="text-xl font-bold text-white line-clamp-2 min-h-[3.5rem]">{data.title}</h3>
          {/* <div className="text-2xl font-black text-purple-400 mt-2">{data.price}</div> */}
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Pros
            </h4>
            <ul className="space-y-2">
              {summary.pros?.map((pro: string, i: number) => (
                <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-green-500/50 mt-0.5">•</span> {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2 text-sm">
              <XCircle className="w-4 h-4" /> Cons
            </h4>
            <ul className="space-y-2">
              {summary.cons?.map((con: string, i: number) => (
                <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-red-500/50 mt-0.5">•</span> {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
