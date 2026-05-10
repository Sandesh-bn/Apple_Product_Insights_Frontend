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

// Register countries locale
countries.registerLocale(enLocale);

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [priceData, setPriceData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [top10, setTop10] = useState([]);
  const [bottom10, setBottom10] = useState([]);

  // Fetch product list
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
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
      fetch(`http://localhost:5000/api/products/prices/${encodeURIComponent(selectedProduct)}`)
        .then((res) => res.json())
        .then((data) => {
          setPriceData(data.prices);
          setMetrics(data.metrics);
          
          // Calculate Top 10 and Bottom 10
          const sorted = [...data.prices].sort((a, b) => b.price_usd - a.price_usd);
          setTop10(sorted.slice(0, 10));
          setBottom10(sorted.slice(-10).reverse());
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
    .range(["#fee2e2", "#991b1b"]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Apple Global Insights</h1>
          <p className="text-muted-foreground">
            Analyze pricing strategies and macroeconomic factors for {selectedProduct}.
          </p>
        </div>
        <div className="w-[280px]">
          <Select value={selectedProduct} onValueChange={handleProductChange}>
            <SelectTrigger>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/50 backdrop-blur-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-bold tracking-wider">Global Average</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-900">${metrics?.avg.toFixed(2) || "0.00"}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-red-50/50 backdrop-blur-sm border-red-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-bold tracking-wider text-red-600">Highest Price</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-red-900">${metrics?.max.toFixed(2) || "0.00"}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-emerald-50/50 backdrop-blur-sm border-emerald-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-bold tracking-wider text-emerald-600">Lowest Price</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-emerald-900">${metrics?.min.toFixed(2) || "0.00"}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-lg">Price Heat Map (USD)</CardTitle>
          <CardDescription>Hover for country-specific pricing and local currency data.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          <TooltipProvider>
            <ComposableMap
              projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
              height={400}
            >
              <Sphere stroke="#f1f5f9" strokeWidth={0.5} />
              <Graticule stroke="#f1f5f9" strokeWidth={0.5} />
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const iso3 = countries.numericToAlpha3(geo.id) || geo.properties?.ISO_A3;
                    const d = dataMap[iso3];
                    return (
                      <Tooltip key={geo.rsmKey}>
                        <TooltipTrigger asChild>
                          <Geography
                            geography={geo}
                            fill={d ? dynamicColorScale(d.price_usd) : "#f8fafc"}
                            stroke="#e2e8f0"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "#6366f1", outline: "none", cursor: "pointer" },
                              pressed: { outline: "none" },
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white p-3 shadow-xl border-none rounded-lg">
                          <div className="text-sm font-bold">{geo.properties.name}</div>
                          {d ? (
                            <div className="space-y-1 mt-1">
                              <div className="text-lg font-black text-indigo-300">${d.price_usd.toFixed(2)}</div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-tighter">Currency: {d.currencyCode}</div>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400 italic mt-1">Data not available</div>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </TooltipProvider>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              Top 10 Most Expensive
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="country" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="price_usd" fill="#ef4444" radius={[0, 6, 6, 0]} barSize={24}>
                  {top10.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`rgba(239, 68, 68, ${1 - index * 0.06})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              Top 10 Cheapest
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...bottom10].sort((a,b) => a.price_usd - b.price_usd)} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="country" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="price_usd" fill="#10b981" radius={[0, 6, 6, 0]} barSize={24}>
                  {bottom10.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`rgba(16, 185, 129, ${index * 0.06 + 0.4})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}