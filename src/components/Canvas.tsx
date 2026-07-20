import React, { useRef, useEffect } from "react";
import { Point, AlgorithmicStep } from "../types";
interface CanvasProps {
    points: Point[];
    currentStep?: AlgorithmicStep;
    addPoint: (x: number, y: number) => void;
    removePoint: (id: string) => void;
}
export const Canvas: React.FC<CanvasProps> = ({ points, currentStep, addPoint, removePoint }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        let animationId: number;
        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            const w = rect.width;
            const h = rect.height;
            const scaleX = w / 800;
            const scaleY = h / 500;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = "#F1F5F9";
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < w; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
            const activePtsMap = new Map<string, boolean>();
            const hullPtsMap = new Map<string, boolean>();
            const discardedPtsMap = new Map<string, boolean>();
            if (currentStep) {
                currentStep.active.forEach(p => activePtsMap.set(p.id, true));
                currentStep.hull.forEach(p => hullPtsMap.set(p.id, true));
                currentStep.discarded.forEach(p => discardedPtsMap.set(p.id, true));
            }
            const drawLine = (p1: Point, p2: Point, color: string, width: number, isDashed = false) => {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(p1.x * scaleX, p1.y * scaleY);
                ctx.lineTo(p2.x * scaleX, p2.y * scaleY);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                if (isDashed) ctx.setLineDash([5, 3]);
                ctx.stroke();
                ctx.restore();
            };
            if (currentStep) {
                const isCompleted = currentStep.active.length === 0 && currentStep.hull.length > 0;
                if (isCompleted) {
                    currentStep.activeLines.forEach(line => {
                        drawLine(line.p1, line.p2, "#2563EB", 2.5);
                    });
                } else {
                    if (currentStep.hull.length > 1) {
                        for (let i = 0; i < currentStep.hull.length - 1; i++) {
                            drawLine(currentStep.hull[i], currentStep.hull[i+1], "#2563EB", 2.5);
                        }
                    }
                    currentStep.activeLines.forEach(line => {
                        drawLine(line.p1, line.p2, "#EA580C", 1.5, true);
                    });
                }
            }
            points.forEach(p => {
                const isHull = hullPtsMap.get(p.id);
                const isActive = activePtsMap.get(p.id);
                const isDiscarded = discardedPtsMap.get(p.id);
                let color = "#64748B";
                let radius = 5;
                if (isHull) {
                    color = "#2563EB";
                    radius = 7;
                } else if (isActive) {
                    color = "#D97706";
                    radius = 7 + 1.5 * Math.sin(Date.now() / 150);
                } else if (isDiscarded) {
                    color = "#CBD5E1";
                    radius = 4;
                }
                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x * scaleX, p.y * scaleY, radius, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.restore();
                ctx.fillStyle = "#475569";
                ctx.font = "bold 10px sans-serif";
                ctx.fillText(`P${p.id}`, p.x * scaleX + 10, p.y * scaleY - 6);
            });
            animationId = requestAnimationFrame(render);
        };
        animationId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationId);
    }, [points, currentStep]);
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        const x = (clientX - rect.left) * (800 / rect.width);
        const y = (clientY - rect.top) * (500 / rect.height);
        const clickedPoint = points.find(p => {
            const dx = p.x - x;
            const dy = p.y - y;
            return Math.sqrt(dx * dx + dy * dy) < 15;
        });
        if (clickedPoint) removePoint(clickedPoint.id);
        else addPoint(x, y);
    };
    return (
        <div ref={containerRef} className="w-full h-full relative border border-slate-200 rounded-lg overflow-hidden bg-white">
            <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-full cursor-crosshair block" />
            <div className="absolute top-4 left-4 bg-slate-50/90 border border-slate-200 px-3 py-1.5 rounded text-xs text-slate-500 pointer-events-none font-medium">
                Click to add point • Click point to remove
            </div>
        </div>
    );
};
