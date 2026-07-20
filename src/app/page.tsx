"use client";
import React from "react";
import { Sidebar } from "../components/Sidebar";
import { Canvas } from "../components/Canvas";
import { Controls } from "../components/Controls";
import { DataPanel } from "../components/DataPanel";
import { BenchmarkView } from "../components/BenchmarkView";
import { useVisualizer } from "../hooks/useVisualizer";
import { Cpu, HelpCircle } from "lucide-react";
export default function HomePage() {
    const {
        points,
        steps,
        currentStepIndex,
        isPlaying,
        playbackSpeed,
        isBenchmarkOpen,
        selectedAlgorithm,
        isLoadingWasm,
        wasmModule,
        setPlaybackSpeed,
        setIsBenchmarkOpen,
        setSelectedAlgorithm,
        addPoint,
        removePoint,
        clearPoints,
        generateDataset,
        handleFileUpload,
        play,
        pause,
        nextStep,
        prevStep,
        reset
    } = useVisualizer();
    const currentStep = steps[currentStepIndex];
    return (
        <main className="min-h-screen bg-[#070B13] text-slate-100 flex flex-col md:flex-row overflow-hidden font-sans">
            <Sidebar
                selectedAlgorithm={selectedAlgorithm}
                setSelectedAlgorithm={setSelectedAlgorithm}
                generateDataset={generateDataset}
                handleFileUpload={handleFileUpload}
                clearPoints={clearPoints}
                pointsCount={points.length}
                setIsBenchmarkOpen={setIsBenchmarkOpen}
            />
            <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto h-screen">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">Convex Hull Visualizer</h1>
                        <p className="text-xs text-slate-500 mt-1">Visualize and analyze geometric algorithms step-by-step.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsBenchmarkOpen(true)}
                            className="md:hidden flex items-center justify-center gap-1.5 border border-purple-800 hover:bg-purple-950/30 text-purple-300 text-xs rounded px-3 py-1.5 transition-all"
                        >
                            Benchmark
                        </button>
                        {isLoadingWasm ? (
                            <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded-full font-medium animate-pulse">
                                <Cpu className="w-3.5 h-3.5" />
                                Wasm Loading...
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-900/60 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-medium">
                                <Cpu className="w-3.5 h-3.5" />
                                Wasm Active
                            </span>
                        )}
                    </div>
                </header>
                {points.length < 3 && (
                    <div className="bg-amber-950/15 border border-amber-900/40 text-amber-300 text-xs px-4 py-3 rounded-lg flex items-start gap-2 shadow-sm">
                        <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-semibold block text-amber-400">Degenerate Condition Warning</span>
                            A minimum of 3 non-collinear points is required to calculate the convex hull. Generate random coordinates using the dataset generator, upload a file, or click on the grid canvas below to populate the workspace.
                        </div>
                    </div>
                )}
                <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[500px]">
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="flex-1 min-h-[350px]">
                            <Canvas
                                points={points}
                                currentStep={currentStep}
                                addPoint={addPoint}
                                removePoint={removePoint}
                            />
                        </div>
                        <Controls
                            isPlaying={isPlaying}
                            play={play}
                            pause={pause}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            reset={reset}
                            playbackSpeed={playbackSpeed}
                            setPlaybackSpeed={setPlaybackSpeed}
                            currentStepIndex={currentStepIndex}
                            steps={steps}
                        />
                    </div>
                    <DataPanel
                        points={points}
                        currentStep={currentStep}
                        removePoint={removePoint}
                    />
                </div>
            </div>
            <BenchmarkView
                isOpen={isBenchmarkOpen}
                onClose={() => setIsBenchmarkOpen(false)}
                wasmModule={wasmModule}
            />
        </main>
    );
}
