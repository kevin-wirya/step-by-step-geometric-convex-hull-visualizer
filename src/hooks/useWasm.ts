import { useEffect, useState } from "react";
export interface WasmModule {
    grahamScan: (points: any) => any;
    jarvisMarch: (points: any) => any;
    quickHull: (points: any) => any;
    VectorPoint: any;
}
export const useWasm = () => {
    const [wasmModule, setWasmModule] = useState<WasmModule | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const checkAndLoad = async () => {
            if ((window as any).createModule) {
                try {
                    const module = await (window as any).createModule();
                    setWasmModule(module);
                    setIsLoading(false);
                } catch (err) {
                    console.error("Wasm load error:", err);
                }
                return;
            }
            const script = document.createElement("script");
            script.src = "/algorithm_core.js";
            script.async = true;
            script.onload = async () => {
                try {
                    const module = await (window as any).createModule();
                    setWasmModule(module);
                    setIsLoading(false);
                } catch (err) {
                    console.error("Wasm load error:", err);
                }
            };
            document.body.appendChild(script);
        };
        checkAndLoad();
    }, []);
    return { wasmModule, isLoading };
};
