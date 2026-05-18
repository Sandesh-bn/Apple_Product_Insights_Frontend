import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Skeleton } from "./ui/skeleton";
import { BACKEND_URL } from "../config";

// Register countries locale
countries.registerLocale(enLocale);

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const productImages = {
  "iPhone 13": "iphone.png",
  "iPhone SE": "iphone.png",
  "iPhone 12": "iphone.png",
  "AirPods(3rd generation)": "airpod.png",
  "AirPods Pro": "airpod.png",
  "AirPods(2nd generation)": "airpod.png",
  "AirPods Max": "airpodmax.png",
  "Apple TV 4K": "appletv.png",
  "Apple Watch SE": "applewatch1.png",
  "Apple Watch Series 3": "applewatch2.png",
  "iPad": "ipad.png",
  "iPad Pro": "ipad.png",
  "Apple Pencil (2nd generation)": "applepencil.png",
  "MacBook Air": "macbook.png",
  "Magic Mouse": "magicmouse.png",
  "Apple TV HD": "appletv.png"
};

const getProductImage = (model) => {
  const filename = productImages[model] || "";
  return new URL(`../assets/${filename}`, import.meta.url).href;
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [priceData, setPriceData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceLoading, setPriceLoading] = useState(false);
  const [top10, setTop10] = useState([]);
  const [bottom10, setBottom10] = useState([]);

  // Fetch product list
  useEffect(() => {
    fetch(BACKEND_URL + "/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        if (data.length > 0) setSelectedProduct(data[0]);
        setLoading(false);
      });
  }, []);

  // Fetch price data when product changes
  useEffect(() => {
    if (selectedProduct) {
      setPriceLoading(true);
      fetch(BACKEND_URL + `/api/products/prices/${encodeURIComponent(selectedProduct)}`)
        .then((res) => res.json())
        .then((data) => {
          setPriceData(data.prices);
          setMetrics(data.metrics);
          
          // Calculate Top 10 and Bottom 10
          const sorted = [...data.prices].sort((a, b) => b.price_usd - a.price_usd);
          setTop10(sorted.slice(0, 10));
          setBottom10(sorted.slice(-10).reverse());
          setPriceLoading(false);
        });
    }
  }, [selectedProduct]);

  const handleProductChange = (val) => {
    setSelectedProduct(val);
  };

  // Map 2-letter codes to price data
  const dataMap = priceData.reduce((acc, curr) => {
    const iso3 = countries.alpha2ToAlpha3(curr.countryCode);
    if (iso3) acc[iso3] = curr;
    return acc;
  }, {});

  // Dynamic color scale based on current product prices
  const currentMax = metrics?.max || 1500;
  const currentMin = metrics?.min || 400;
  const dynamicColorScale = scaleLinear()
    .domain([currentMin, currentMax])
    .range(["#aff2c3", "#06ae47"]);

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 flex flex-col items-center text-center">
        <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter mb-4 text-foreground">
          {selectedProduct || "AirPods Max"}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-12 max-w-2xl">
          Analyze global pricing strategies and macroeconomic factors.
        </p>
        
        <div className="w-full max-w-[300px] mx-auto mb-16">
          <Select value={selectedProduct} onValueChange={handleProductChange}>
            <SelectTrigger className="text-lg rounded-full h-14 bg-secondary/80 hover:bg-secondary border-none px-6 transition-colors shadow-sm font-medium mx-auto flex justify-center text-center gap-2">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-xl border-none">
              {products.map((p) => (
                <SelectItem className="text-base py-3 cursor-pointer justify-center text-center" key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-[300px] md:h-[400px] flex items-center justify-center">
          {priceLoading ? (
            <Skeleton className="h-[250px] w-[250px] rounded-full" />
          ) : selectedProduct ? (
            <img 
              src={getProductImage(selectedProduct)} 
              alt={selectedProduct} 
              className="max-h-full object-contain drop-shadow-2xl"
            />
          ) : null}
        </div>
      </section>

      {/* Metrics Section */}
      <section className="px-6 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        <div className="bg-card rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Global Average</p>
          {(priceLoading || !metrics) ? (
            <Skeleton className="h-12 w-32" />
          ) : (
            <h3 className="text-5xl font-semibold tracking-tighter">${metrics?.avg.toFixed(2) || ""}</h3>
          )}
        </div>
        <div className="bg-card rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Highest Price</p>
          {(priceLoading || !metrics) ? (
            <Skeleton className="h-12 w-32" />
          ) : (
            <h3 className="text-5xl font-semibold tracking-tighter text-red-500">${metrics?.max.toFixed(2) || ""}</h3>
          )}
        </div>
        <div className="bg-card rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Lowest Price</p>
          {(priceLoading || !metrics) ? (
            <Skeleton className="h-12 w-32" />
          ) : (
            <h3 className="text-5xl font-semibold tracking-tighter text-emerald-500">${metrics?.min.toFixed(2) || ""}</h3>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-24">
        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Global Pricing Map</h2>
            <p className="text-muted-foreground text-lg">Hover to explore country-specific pricing and local currency details.</p>
          </div>
          <div className="h-[400px] md:h-[600px] w-full bg-secondary/30 rounded-[2rem] overflow-hidden">
            {priceLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <TooltipProvider>
                <ComposableMap
                  projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
                  height={600}
                  className="w-full h-full object-cover"
                >
                  <Sphere stroke="var(--color-border)" strokeWidth={0.5} fill="transparent" />
                  <Graticule stroke="var(--color-border)" strokeWidth={0.5} opacity={0.3} />
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const iso3 = countries.numericToAlpha3(geo.id) || geo.properties?.ISO_A3;
                        const d = dataMap[iso3];
                        return (
                          <Tooltip key={geo.rsmKey} delayDuration={0}>
                            <TooltipTrigger asChild>
                              
                               <Geography
                                geography={geo}
                                fill={d ? dynamicColorScale(d.price_usd) : "#f8fafc"}
                                stroke="#236bc2"
                                strokeWidth={0.5}
                                style={{
                                  default: { outline: "#f8fafc" },
                                  hover: { fill: "#63f1a3", outline: "none", cursor: "pointer",  },
                                  pressed: { outline: "#f8fafc" },
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover/90 backdrop-blur-md p-4 shadow-2xl border-none rounded-2xl text-popover-foreground">
                              <div className="text-base font-semibold mb-1">{geo.properties.name}</div>
                              {d ? (
                                <div className="space-y-1">
                                  <div className="text-2xl font-bold tracking-tight">${d.price_usd.toFixed(2)}</div>
                                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Currency: {d.currencyCode}</div>
                                </div>
                              ) : (
                                <div className="text-sm italic text-muted-foreground mt-1">Data not available</div>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </TooltipProvider>
            )}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-[2.5rem] p-8 shadow-sm">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
              Top 10 Most Expensive
            </h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" opacity={0.4} />
                <XAxis type="number" hide />
                <YAxis dataKey="country" type="category" width={110} fontSize={13} tickLine={false} axisLine={false} tick={{fill: 'var(--color-foreground)'}} />
                <RechartsTooltip 
                  cursor={{fill: 'var(--color-secondary)'}}
                  formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '16px', backgroundColor: 'var(--color-popover)', color: 'var(--color-popover-foreground)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="price_usd" fill="var(--color-destructive)" radius={[0, 8, 8, 0]} barSize={28}>
                  {top10.map((entry, index) => (
                    <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.05} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-[2.5rem] p-8 shadow-sm">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              Top 10 Cheapest
            </h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...bottom10].sort((a,b) => a.price_usd - b.price_usd)} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" opacity={0.4} />
                <XAxis type="number" hide />
                <YAxis dataKey="country" type="category" width={110} fontSize={13} tickLine={false} axisLine={false} tick={{fill: 'var(--color-foreground)'}} />
                <RechartsTooltip 
                  cursor={{fill: 'var(--color-secondary)'}}
                  formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '16px', backgroundColor: 'var(--color-popover)', color: 'var(--color-popover-foreground)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="price_usd" fill="#10b981" radius={[0, 8, 8, 0]} barSize={28}>
                  {bottom10.map((entry, index) => (
                    <Cell key={`cell-${index}`} fillOpacity={0.5 + index * 0.05} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}