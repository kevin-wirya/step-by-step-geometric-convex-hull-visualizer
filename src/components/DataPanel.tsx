import React from "react";
import { Trash2, ShieldAlert } from "lucide-react";
import { Point, AlgorithmicStep } from "../types";
interface DataPanelProps {
    points: Point[];
    currentStep?: AlgorithmicStep;
    removePoint: (id: string) => void;
}
export const DataPanel: React.FC<DataPanelProps> = ({ points, currentStep, removePoint }) => {
    const activePtsMap = new Map<string, boolean>();
    const hullPtsMap = new Map<string, boolean>();
    const discardedPtsMap = new Map<string, boolean>();
    if (currentStep) {
        currentStep.active.forEach(p => activePtsMap.set(p.id, true));
        currentStep.hull.forEach(p => hullPtsMap.set(p.id, true));
        currentStep.discarded.forEach(p => discardedPtsMap.set(p.id, true));
    }
    return (
        <div className="w-full lg:w-64 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-lg p-5 flex flex-col gap-4 max-h-[400px] lg:max-h-none select-none">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Coordinate Registry</span>
                <span className="text-xs text-slate-500 font-mono">({points.length} pts)</span>
            </div>
            {points.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center gap-2 border border-dashed border-slate-800 rounded">
                    <ShieldAlert className="w-5 h-5 text-slate-600" />
                    <span className="text-xs text-slate-500">Registry is empty</span>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 max-h-[300px] lg:max-h-[450px]">
                    {points.map((p) => {
                        const isHull = hullPtsMap.get(p.id);
                        const isActive = activePtsMap.get(p.id);
                        const isDiscarded = discardedPtsMap.get(p.id);
                        let borderStyle = "border-slate-800/60 bg-slate-950/20";
                        let tagLabel = "";
                        let tagStyle = "";
                        if (isHull) {
                            borderStyle = "border-cyan-950/60 bg-cyan-950/10";
                            tagLabel = "Hull";
                            tagStyle = "bg-cyan-950 text-cyan-400 border-cyan-800/40";
                        } else if (isActive) {
                            borderStyle = "border-amber-950/60 bg-amber-950/10";
                            tagLabel = "Active";
                            tagStyle = "bg-amber-950 text-amber-400 border-amber-800/40";
                        } else if (isDiscarded) {
                            borderStyle = "border-slate-800 bg-slate-950/40 opacity-50";
                            tagLabel = "Discarded";
                            tagStyle = "bg-slate-900 text-slate-500 border-slate-800";
                        }
                        return (
                            <div key={p.id} className={`flex items-center justify-between border rounded px-3 py-2 text-xs transition-colors ${borderStyle}`}>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-slate-400 font-semibold w-7">P{p.id}</span>
                                    <span className="font-mono text-slate-500">({p.x.toFixed(0)}, {p.y.toFixed(0)})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {tagLabel && (
                                        <span className={`text-[10px] border px-1.5 py-0.5 rounded font-medium ${tagStyle}`}>
                                            {tagLabel}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => removePoint(p.id)}
                                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                                        title="Delete Point"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
