import React, { useState, useRef } from "react";
import { Compass, Upload, Trash2, RefreshCw, BarChart2 } from "lucide-react";
interface SidebarProps {
    selectedAlgorithm: string;
    setSelectedAlgorithm: (algo: string) => void;
    generateDataset: (type: string, count: number, width: number, height: number) => void;
    handleFileUpload: (content: string) => void;
    clearPoints: () => void;
    pointsCount: number;
    setIsBenchmarkOpen: (open: boolean) => void;
}
export const Sidebar: React.FC<SidebarProps> = ({
    selectedAlgorithm,
    setSelectedAlgorithm,
    generateDataset,
    handleFileUpload,
    clearPoints,
    pointsCount,
    setIsBenchmarkOpen
}) => {
    const [genType, setGenType] = useState<string>("uniform");
    const [genCount, setGenCount] = useState<number>(50);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (text) handleFileUpload(text);
        };
        reader.readAsText(file);
    };
    return (
        <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col gap-6 select-none">
            <div className="flex items-center gap-2">
                <Compass className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-lg text-slate-800 tracking-wide">Convex Hull Core</span>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Algorithm Selection</label>
                <select
                    value={selectedAlgorithm}
                    onChange={(e) => setSelectedAlgorithm(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 text-slate-700 text-sm rounded-md px-3 py-2 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                    <option value="graham">Graham Scan</option>
                    <option value="jarvis">Jarvis March</option>
                    <option value="quickhull">QuickHull</option>
                </select>
            </div>
            <div className="h-[1px] bg-slate-150" />
            <div className="flex flex-col gap-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dataset Generator</label>
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-500">Distribution Type</label>
                    <select
                        value={genType}
                        onChange={(e) => setGenType(e.target.value)}
                        className="w-full bg-slate-55 border border-slate-200 text-slate-700 text-sm rounded-md px-3 py-2 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                        <option value="uniform">Uniform Distribution</option>
                        <option value="circular">Circular Distribution</option>
                        <option value="rectangular">Rectangular Distribution</option>
                        <option value="gaussian">Normal Gaussian</option>
                        <option value="clusters">Clustered Gaussian</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Point Count</span>
                        <span className="text-blue-600 font-semibold">{genCount}</span>
                    </div>
                    <input
                        type="range"
                        min="3"
                        max="500"
                        value={genCount}
                        onChange={(e) => setGenCount(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
                <button
                    onClick={() => generateDataset(genType, genCount, 800, 500)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md px-4 py-2.5 transition-colors cursor-pointer"
                >
                    <RefreshCw className="w-4 h-4" />
                    Generate Points
                </button>
            </div>
            <div className="h-[1px] bg-slate-150" />
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data Ingest</label>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".txt,.csv"
                    className="hidden"
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-sm rounded-md px-3 py-2 transition-all cursor-pointer"
                    >
                        <Upload className="w-4 h-4" />
                        Import File
                    </button>
                    <button
                        onClick={clearPoints}
                        disabled={pointsCount === 0}
                        className="flex items-center justify-center border border-slate-200 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-400 hover:text-red-500 rounded-md p-2 transition-all cursor-pointer"
                        title="Clear Canvas"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="mt-auto h-[1px] bg-slate-150 hidden md:block" />
            <button
                onClick={() => setIsBenchmarkOpen(true)}
                className="hidden md:flex items-center justify-center gap-2 border border-blue-200 hover:bg-blue-50 text-blue-600 font-medium text-sm rounded-md px-4 py-2.5 transition-all cursor-pointer"
            >
                <BarChart2 className="w-4 h-4" />
                Benchmark Analyzer
            </button>
        </div>
    );
};
