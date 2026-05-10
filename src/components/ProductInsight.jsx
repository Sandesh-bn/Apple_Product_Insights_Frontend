import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Info } from "lucide-react";

export default function ProductInsight() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        if (data.length > 0) setSelectedProduct(data[0]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetch(`http://localhost:5000/api/products/regional/${encodeURIComponent(selectedProduct)}`)
        .then((res) => res.json())
        .then((data) => setStats(data));
    }
  }, [selectedProduct]);

  // Calculate global min/max for the Y-axis scale across all regions
  const globalMin = stats.length > 0 ? Math.min(...stats.map((s) => s.min)) * 0.9 : 0;
  const globalMax = stats.length > 0 ? Math.max(...stats.map((s) => s.max)) * 1.1 : 2000;
  const range = globalMax - globalMin || 1;

  const getY = (price) => {
    return 100 - ((price - globalMin) / range) * 100;
  };

  if (loading) {
    return <div className="p-10 text-center font-bold text-slate-500 animate-pulse">Loading regional insights...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Regional Price Analysis</h1>
          <p className="text-muted-foreground">
            Explore price consistency and distribution across global regions.
          </p>
        </div>
        <div className="w-[280px]">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CardTitle>Box and Whisker Plots by Region</CardTitle>
            <Badge variant="outline" className="bg-white flex gap-1 items-center">
              <Info className="w-3 h-3" /> {selectedProduct}
            </Badge>
          </div>
          <CardDescription>
            Visualizing median, quartiles, and price ranges. Whiskers show min/max; the box shows the interquartile range (IQR).
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-10 pb-6 overflow-x-auto">
          <div className="min-w-[800px] h-[450px] relative flex items-end justify-around px-10">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-[10px] text-slate-400 font-bold border-r border-slate-100 pr-2">
              <span>${globalMax.toFixed(0)}</span>
              <span>${((globalMax + globalMin) / 2).toFixed(0)}</span>
              <span>${globalMin.toFixed(0)}</span>
            </div>

            {stats.map((region, index) => (
              <div key={region.region} className="flex flex-col items-center group w-32">
                {/* The Plot Area */}
                <div className="relative w-full h-[350px] mb-4">
                  {/* Vertical line (Whisker) */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 bg-slate-300 w-[2px]"
                    style={{ 
                      top: `${getY(region.max)}%`, 
                      bottom: `${100 - getY(region.min)}%` 
                    }}
                  ></div>

                  {/* Top Whisker Tip */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 bg-slate-400 h-[2px] w-8"
                    style={{ top: `${getY(region.max)}%` }}
                  ></div>

                  {/* Bottom Whisker Tip */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 bg-slate-400 h-[2px] w-8"
                    style={{ top: `${getY(region.min)}%` }}
                  ></div>

                  {/* The Box (IQR) */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 w-16 border-2 border-indigo-600 bg-indigo-50/80 rounded-sm shadow-sm group-hover:bg-indigo-100 transition-colors"
                    style={{ 
                      top: `${getY(region.q3)}%`, 
                      height: `${getY(region.q1) - getY(region.q3)}%` 
                    }}
                  >
                    {/* Median Line */}
                    <div 
                      className="absolute left-0 right-0 h-[3px] bg-indigo-800"
                      style={{ top: `${((getY(region.median) - getY(region.q3)) / (getY(region.q1) - getY(region.q3))) * 100}%` }}
                    ></div>
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white p-3 rounded-lg text-[10px] z-20 -top-16 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap shadow-2xl border border-slate-700">
                    <div className="font-bold border-b border-slate-700 mb-2 pb-1 text-xs">{region.region}</div>
                    <div className="space-y-0.5">
                      <div className="flex justify-between gap-4"><span>Max:</span> <span className="font-mono font-bold">${region.max?.toFixed(2) || "0.00"}</span></div>
                      <div className="flex justify-between gap-4 text-slate-400"><span>Q3:</span> <span className="font-mono">${region.q3?.toFixed(2) || "0.00"}</span></div>
                      <div className="flex justify-between gap-4 text-indigo-300 font-bold"><span>Median:</span> <span className="font-mono">${region.median?.toFixed(2) || "0.00"}</span></div>
                      <div className="flex justify-between gap-4 text-slate-400"><span>Q1:</span> <span className="font-mono">${region.q1?.toFixed(2) || "0.00"}</span></div>
                      <div className="flex justify-between gap-4"><span>Min:</span> <span className="font-mono font-bold">${region.min?.toFixed(2) || "0.00"}</span></div>
                    </div>
                    <div className="mt-2 pt-1 border-t border-slate-700 text-[9px] text-slate-500 text-center">
                      Sample: {region.count} countries
                    </div>
                  </div>
                </div>

                {/* Label */}
                <div className="text-[11px] font-bold text-slate-600 text-center px-1 leading-tight h-8 flex items-center">
                  {region.region}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide text-slate-500">Key Observation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              The height of the indigo box represents the **Interquartile Range (IQR)**. A taller box indicates higher price variability within that region, while a shorter box suggests more consistent pricing across member countries.
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide text-slate-500">Outlier Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Whiskers extending far beyond the box indicate extreme price differences in certain countries. For example, Brazil often acts as a significant outlier in the Latin America region due to high import taxes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}