export const parseDatasetFile = (content: string): { x: number; y: number }[] => {
    const lines = content.split(/\r?\n/);
    const parsed: { x: number; y: number }[] = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const parts = trimmed.split(/[\s,;]+/);
        if (parts.length >= 2) {
            const x = parseFloat(parts[0]);
            const y = parseFloat(parts[1]);
            if (!isNaN(x) && !isNaN(y)) parsed.push({ x, y });
        }
    }
    return parsed;
};
