export interface Point {
    x: number;
    y: number;
    id: string;
}
export interface Line {
    p1: Point;
    p2: Point;
}
export interface AlgorithmicStep {
    description: string;
    hull: Point[];
    active: Point[];
    discarded: Point[];
    activeLines: Line[];
}
