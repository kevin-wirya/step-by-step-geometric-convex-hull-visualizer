import React from "react";
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
    title: "Convex Hull Visualizer",
    description: "Step-by-Step Geometric Convex Hull Visualizer",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full">
            <body className="h-full bg-[#0B0F19] text-slate-100 antialiased">{children}</body>
        </html>
    );
}
