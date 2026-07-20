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
        <div className="w-full lg:w-64 bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-4 max-h-[400px] lg:max-h-none select-none">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Coordinate Registry</span>
                <span className="text-xs text-slate-500 font-mono">({points.length} pts)</span>
            </div>
            {points.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center gap-2 border border-dashed border-slate-200 bg-slate-50/30 rounded-md">
                    <ShieldAlert className="w-5 h-5 text-slate-400" />
                    <span className="text-xs text-slate-500">Registry is empty</span>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 max-h-[300px] lg:max-h-[450px]">
                    {points.map((p) => {
                        const isHull = hullPtsMap.get(p.id);
                        const isActive = activePtsMap.get(p.id);
                        const isDiscarded = discardedPtsMap.get(p.id);
                        let borderStyle = "border-slate-100 bg-slate-50/20";
                        let tagLabel = "";
                        let tagStyle = "";
                        if (isHull) {
                            borderStyle = "border-blue-100 bg-blue-50/30";
                            tagLabel = "Hull";
                            tagStyle = "bg-blue-50 text-blue-600 border-blue-100";
                        } else if (isActive) {
                            borderStyle = "border-amber-100 bg-amber-50/30";
                            tagLabel = "Active";
                            tagStyle = "bg-amber-50 text-amber-600 border-amber-100";
                        } else if (isDiscarded) {
                            borderStyle = "border-slate-100 bg-slate-100/30 opacity-60";
                            tagLabel = "Discarded";
                            tagStyle = "bg-slate-100 text-slate-500 border-slate-200";
                        }
                        return (
                            <div key={p.id} className={`flex items-center justify-between border rounded-md px-3 py-2 text-xs transition-colors ${borderStyle}`}>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-slate-500 font-bold w-7">P{p.id}</span>
                                    <span className="font-mono text-slate-400">({p.x.toFixed(0)}, {p.y.toFixed(0)})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {tagLabel && (
                                        <span className={`text-[10px] border px-1.5 py-0.5 rounded font-bold ${tagStyle}`}>
                                            {tagLabel}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => removePoint(p.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
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
