import React, { useState } from "react";
import { X, Play, Loader2, BarChart2 } from "lucide-react";
import { generateUniform } from "../utils/datasetGenerator";
import { WasmModule } from "../hooks/useWasm";
interface BenchmarkResult {
    size: number;
    graham: number;
    jarvis: number;
    quickhull: number;
}
interface BenchmarkViewProps {
    isOpen: boolean;
    onClose: () => void;
    wasmModule: WasmModule | null;
}
export const BenchmarkView: React.FC<BenchmarkViewProps> = ({ isOpen, onClose, wasmModule }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [progressSize, setProgressSize] = useState<number | null>(null);
    const [results, setResults] = useState<BenchmarkResult[] | null>(null);
    if (!isOpen) return null;
    const startBenchmark = async () => {
        if (!wasmModule) return;
        setIsRunning(true);
        setResults(null);
        const sizes = [10, 50, 100, 500, 1000];
        const tempResults: BenchmarkResult[] = [];
        for (const size of sizes) {
            setProgressSize(size);
            await new Promise((r) => setTimeout(r, 100));
            const pts = generateUniform(size, 800, 500);
            const wasmPoints = new wasmModule.VectorPoint();
            for (const p of pts) wasmPoints.push_back(p);
            let totalGraham = 0;
            for (let r = 0; r < 5; r++) {
                const start = performance.now();
                const stepsObj = wasmModule.grahamScan(wasmPoints);
                const end = performance.now();
                totalGraham += end - start;
                stepsObj.delete();
            }
            let totalJarvis = 0;
            for (let r = 0; r < 5; r++) {
                const start = performance.now();
                const stepsObj = wasmModule.jarvisMarch(wasmPoints);
                const end = performance.now();
                totalJarvis += end - start;
                stepsObj.delete();
            }
            let totalQuick = 0;
            for (let r = 0; r < 5; r++) {
                const start = performance.now();
                const stepsObj = wasmModule.quickHull(wasmPoints);
                const end = performance.now();
                totalQuick += end - start;
                stepsObj.delete();
            }
            wasmPoints.delete();
            tempResults.push({
                size,
                graham: totalGraham / 5,
                jarvis: totalJarvis / 5,
                quickhull: totalQuick / 5
            });
        }
        setResults(tempResults);
        setIsRunning(false);
        setProgressSize(null);
    };
    const maxVal = results ? Math.max(...results.flatMap((r) => [r.graham, r.jarvis, r.quickhull])) : 1;
    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
            <div className="bg-white border border-slate-200 rounded-lg max-w-3xl w-full p-6 relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <BarChart2 className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-800">Performance Benchmark</h2>
                </div>
                {!results && !isRunning && (
                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                        <p className="text-sm text-slate-500 max-w-md">
                            Run execution comparison benchmarks for Graham Scan, Jarvis March, and QuickHull. Measurements are taken across 5 iterations per input size.
                        </p>
                        <button
                            onClick={startBenchmark}
                            disabled={!wasmModule}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-md px-6 py-2.5 transition-colors cursor-pointer"
                        >
                            <Play className="w-4 h-4 fill-white" />
                            Run Benchmark
                        </button>
                    </div>
                )}
                {isRunning && (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <span className="text-sm text-slate-600">Evaluating size: {progressSize} points...</span>
                    </div>
                )}
                {results && (
                    <div className="flex flex-col gap-6">
                        <div className="overflow-x-auto border border-slate-200 rounded-md">
                            <table className="w-full border-collapse text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-700 text-xs font-bold uppercase border-b border-slate-200">
                                    <tr>
                                        <th className="p-3">Input Size</th>
                                        <th className="p-3 text-blue-600">Graham Scan</th>
                                        <th className="p-3 text-amber-600">Jarvis March</th>
                                        <th className="p-3 text-indigo-600">QuickHull</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {results.map((r) => (
                                        <tr key={r.size} className="hover:bg-slate-50/50">
                                            <td className="p-3 font-semibold text-slate-800">{r.size} pts</td>
                                            <td className="p-3 font-mono">{r.graham.toFixed(4)} ms</td>
                                            <td className="p-3 font-mono">{r.jarvis.toFixed(4)} ms</td>
                                            <td className="p-3 font-mono">{r.quickhull.toFixed(4)} ms</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-slate-800 text-sm">Visual Speed Comparison (Relative Execution Time)</h3>
                            <div className="flex flex-col gap-4">
                                {results.map((r) => (
                                    <div key={r.size} className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                        <span className="text-xs text-slate-500 font-bold">{r.size} Points</span>
                                        <div className="flex flex-col gap-1.5 mt-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-400 w-16">Graham</span>
                                                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${(r.graham / maxVal) * 100}%` }} />
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-mono w-16 text-right">{r.graham.toFixed(4)}ms</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-400 w-16">Jarvis</span>
                                                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${(r.jarvis / maxVal) * 100}%`, backgroundColor: "#F59E0B" }} />
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-mono w-16 text-right">{r.jarvis.toFixed(4)}ms</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-400 w-16">QuickHull</span>
                                                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${(r.quickhull / maxVal) * 100}%` }} />
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-mono w-16 text-right">{r.quickhull.toFixed(4)}ms</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={startBenchmark}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md px-4 py-2 transition-colors cursor-pointer"
                            >
                                Re-run Benchmark
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
