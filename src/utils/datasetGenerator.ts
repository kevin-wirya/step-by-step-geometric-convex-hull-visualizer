import { Point } from "../types";
const generateId = () => Math.random().toString(36).substr(2, 9);
export const generateUniform = (count: number, width: number, height: number): Point[] => {
    const pts: Point[] = [];
    for (let i = 0; i < count; i++) {
        pts.push({
            x: Math.floor(Math.random() * (width - 100)) + 50,
            y: Math.floor(Math.random() * (height - 100)) + 50,
            id: generateId()
        });
    }
    return pts;
};
export const generateCircular = (count: number, width: number, height: number): Point[] => {
    const pts: Point[] = [];
    const cx = width / 2;
    const cy = height / 2;
    const rMax = Math.min(width, height) * 0.4;
    for (let i = 0; i < count; i++) {
        const r = rMax * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        pts.push({
            x: Math.floor(cx + r * Math.cos(theta)),
            y: Math.floor(cy + r * Math.sin(theta)),
            id: generateId()
        });
    }
    return pts;
};
export const generateRectangular = (count: number, width: number, height: number): Point[] => {
    const pts: Point[] = [];
    const cx = width / 2;
    const cy = height / 2;
    const rw = width * 0.6;
    const rh = height * 0.6;
    for (let i = 0; i < count; i++) {
        pts.push({
            x: Math.floor(cx - rw / 2 + Math.random() * rw),
            y: Math.floor(cy - rh / 2 + Math.random() * rh),
            id: generateId()
        });
    }
    return pts;
};
export const generateGaussian = (count: number, width: number, height: number): Point[] => {
    const pts: Point[] = [];
    const cx = width / 2;
    const cy = height / 2;
    const stdDev = Math.min(width, height) * 0.15;
    const nextGaussian = () => {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };
    for (let i = 0; i < count; i++) {
        let x = cx + nextGaussian() * stdDev;
        let y = cy + nextGaussian() * stdDev;
        x = Math.max(50, Math.min(width - 50, x));
        y = Math.max(50, Math.min(height - 50, y));
        pts.push({ x: Math.floor(x), y: Math.floor(y), id: generateId() });
    }
    return pts;
};
export const generateClusters = (count: number, width: number, height: number): Point[] => {
    const pts: Point[] = [];
    const k = 4;
    const centers = Array.from({ length: k }, () => ({
        x: Math.random() * (width - 200) + 100,
        y: Math.random() * (height - 200) + 100
    }));
    const stdDev = Math.min(width, height) * 0.05;
    const nextGaussian = () => {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };
    for (let i = 0; i < count; i++) {
        const center = centers[Math.floor(Math.random() * k)];
        let x = center.x + nextGaussian() * stdDev;
        let y = center.y + nextGaussian() * stdDev;
        x = Math.max(50, Math.min(width - 50, x));
        y = Math.max(50, Math.min(height - 50, y));
        pts.push({ x: Math.floor(x), y: Math.floor(y), id: generateId() });
    }
    return pts;
};
