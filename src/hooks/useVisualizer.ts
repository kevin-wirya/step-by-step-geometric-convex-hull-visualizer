import { useState, useEffect, useCallback, useRef } from "react";
import { Point, Line, AlgorithmicStep } from "../types";
import { useWasm } from "./useWasm";
import { generateUniform, generateCircular, generateRectangular, generateGaussian, generateClusters } from "../utils/datasetGenerator";
import { parseDatasetFile } from "../utils/fileParser";
export const useVisualizer = () => {
    const { wasmModule, isLoading: isLoadingWasm } = useWasm();
    const [points, setPoints] = useState<Point[]>([]);
    const [steps, setSteps] = useState<AlgorithmicStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [playbackSpeed, setPlaybackSpeed] = useState<number>(500);
    const [isBenchmarkOpen, setIsBenchmarkOpen] = useState<boolean>(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("graham");
    const pointsRef = useRef<Point[]>(points);
    useEffect(() => { pointsRef.current = points; }, [points]);
    const runAlgorithm = useCallback((algo: string, pts: Point[]) => {
        if (!wasmModule || pts.length === 0) return;
        const wasmPoints = new wasmModule.VectorPoint();
        for (const p of pts) wasmPoints.push_back(p);
        let wasmSteps;
        try {
            if (algo === "graham") wasmSteps = wasmModule.grahamScan(wasmPoints);
            else if (algo === "jarvis") wasmSteps = wasmModule.jarvisMarch(wasmPoints);
            else if (algo === "quickhull") wasmSteps = wasmModule.quickHull(wasmPoints);
        } catch (e) {
            console.error("Error executing algorithm:", e);
            wasmPoints.delete();
            return;
        }
        const jsSteps: AlgorithmicStep[] = [];
        const sz = wasmSteps.size();
        for (let i = 0; i < sz; i++) {
            const step = wasmSteps.get(i);
            const hullArr: Point[] = [];
            const hullSz = step.hull.size();
            for (let j = 0; j < hullSz; j++) hullArr.push(step.hull.get(j));
            step.hull.delete();
            const activeArr: Point[] = [];
            const activeSz = step.active.size();
            for (let j = 0; j < activeSz; j++) activeArr.push(step.active.get(j));
            step.active.delete();
            const discardedArr: Point[] = [];
            const discardedSz = step.discarded.size();
            for (let j = 0; j < discardedSz; j++) discardedArr.push(step.discarded.get(j));
            step.discarded.delete();
            const linesArr: Line[] = [];
            const linesSz = step.activeLines.size();
            for (let j = 0; j < linesSz; j++) {
                const line = step.activeLines.get(j);
                linesArr.push({ p1: line.p1, p2: line.p2 });
            }
            step.activeLines.delete();
            jsSteps.push({
                description: step.description,
                hull: hullArr,
                active: activeArr,
                discarded: discardedArr,
                activeLines: linesArr
            });
        }
        wasmSteps.delete();
        wasmPoints.delete();
        setSteps(jsSteps);
        setCurrentStepIndex(0);
    }, [wasmModule]);
    useEffect(() => {
        if (points.length >= 3) runAlgorithm(selectedAlgorithm, points);
        else {
            setSteps([]);
            setCurrentStepIndex(0);
        }
    }, [points, selectedAlgorithm, runAlgorithm]);
    useEffect(() => {
        if (!isPlaying || steps.length === 0) return;
        const interval = setInterval(() => {
            setCurrentStepIndex((prev) => {
                if (prev < steps.length - 1) return prev + 1;
                setIsPlaying(false);
                return prev;
            });
        }, playbackSpeed);
        return () => clearInterval(interval);
    }, [isPlaying, steps.length, playbackSpeed]);
    const addPoint = useCallback((x: number, y: number) => {
        const nextId = (pointsRef.current.length + 1).toString();
        const newPt: Point = { x, y, id: nextId };
        setPoints((prev) => [...prev, newPt]);
    }, []);
    const removePoint = useCallback((id: string) => {
        setPoints((prev) => {
            const filtered = prev.filter((p) => p.id !== id);
            return filtered.map((p, idx) => ({ ...p, id: (idx + 1).toString() }));
        });
    }, []);
    const clearPoints = useCallback(() => {
        setPoints([]);
        setSteps([]);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);
    const generateDataset = useCallback((type: string, count: number, width: number, height: number) => {
        let raw: Point[] = [];
        if (type === "uniform") raw = generateUniform(count, width, height);
        else if (type === "circular") raw = generateCircular(count, width, height);
        else if (type === "rectangular") raw = generateRectangular(count, width, height);
        else if (type === "gaussian") raw = generateGaussian(count, width, height);
        else if (type === "clusters") raw = generateClusters(count, width, height);
        const formatted = raw.map((p, idx) => ({ ...p, id: (idx + 1).toString() }));
        setPoints(formatted);
        setIsPlaying(false);
    }, []);
    const handleFileUpload = useCallback((content: string) => {
        const parsed = parseDatasetFile(content);
        const formatted = parsed.map((p, idx) => ({ ...p, id: (idx + 1).toString() }));
        setPoints(formatted);
        setIsPlaying(false);
    }, []);
    const play = useCallback(() => {
        if (steps.length > 0) setIsPlaying(true);
    }, [steps.length]);
    const pause = useCallback(() => {
        setIsPlaying(false);
    }, []);
    const nextStep = useCallback(() => {
        setIsPlaying(false);
        if (currentStepIndex < steps.length - 1) setCurrentStepIndex((prev) => prev + 1);
    }, [currentStepIndex, steps.length]);
    const prevStep = useCallback(() => {
        setIsPlaying(false);
        if (currentStepIndex > 0) setCurrentStepIndex((prev) => prev - 1);
    }, [currentStepIndex]);
    const reset = useCallback(() => {
        setIsPlaying(false);
        setCurrentStepIndex(0);
    }, []);
    return {
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
        reset,
        runAlgorithm
    };
};
