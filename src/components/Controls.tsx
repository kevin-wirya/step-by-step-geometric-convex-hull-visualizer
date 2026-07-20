import React from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";
import { AlgorithmicStep } from "../types";
interface ControlsProps {
    isPlaying: boolean;
    play: () => void;
    pause: () => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
    playbackSpeed: number;
    setPlaybackSpeed: (speed: number) => void;
    currentStepIndex: number;
    steps: AlgorithmicStep[];
}
export const Controls: React.FC<ControlsProps> = ({
    isPlaying,
    play,
    pause,
    nextStep,
    prevStep,
    reset,
    playbackSpeed,
    setPlaybackSpeed,
    currentStepIndex,
    steps
}) => {
    const totalSteps = steps.length;
    const currentStep = steps[currentStepIndex];
    const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;
    return (
        <div className="w-full bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-4 select-none">
            {totalSteps > 0 && (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-slate-400">Visualization Progress</span>
                        <span className="text-blue-600 font-bold">Step {currentStepIndex + 1} of {totalSteps}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-600 h-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={reset}
                        disabled={totalSteps === 0}
                        className="flex items-center justify-center w-10 h-10 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-650 rounded-md transition-colors cursor-pointer"
                        title="Reset"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={prevStep}
                        disabled={totalSteps === 0 || currentStepIndex === 0}
                        className="flex items-center justify-center w-10 h-10 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-650 rounded-md transition-colors cursor-pointer"
                        title="Previous Step"
                    >
                        <SkipBack className="w-4 h-4" />
                    </button>
                    {isPlaying ? (
                        <button
                            onClick={pause}
                            disabled={totalSteps === 0}
                            className="flex items-center justify-center w-12 h-10 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md transition-colors cursor-pointer"
                            title="Pause"
                        >
                            <Pause className="w-4 h-4 fill-white" />
                        </button>
                    ) : (
                        <button
                            onClick={play}
                            disabled={totalSteps === 0 || currentStepIndex === totalSteps - 1}
                            className="flex items-center justify-center w-12 h-10 bg-blue-600 hover:bg-blue-750 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md transition-colors cursor-pointer"
                            title="Play"
                        >
                            <Play className="w-4 h-4 fill-white" />
                        </button>
                    )}
                    <button
                        onClick={nextStep}
                        disabled={totalSteps === 0 || currentStepIndex === totalSteps - 1}
                        className="flex items-center justify-center w-10 h-10 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-650 rounded-md transition-colors cursor-pointer"
                        title="Next Step"
                    >
                        <SkipForward className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex flex-col gap-1 w-full md:w-48">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">Step Interval</span>
                        <span className="text-blue-600 font-semibold">{playbackSpeed}ms</span>
                    </div>
                    <input
                        type="range"
                        min="50"
                        max="2000"
                        step="50"
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
            </div>
            {currentStep && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-md text-sm text-slate-700 font-mono leading-relaxed shadow-inner">
                    <div className="text-[10px] text-blue-600 uppercase tracking-widest font-bold mb-1">Step Log</div>
                    {currentStep.description}
                </div>
            )}
        </div>
    );
};
