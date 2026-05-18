import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Label,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Badge } from "./ui/badge";
import { ArrowRightLeft, ShoppingBasket, Check, X } from "lucide-react";
import { BACKEND_URL } from "../config";


export default function EconomicInsight() {
  const [products, setProducts] = useState([]);
  const [modelA, setModelA] = useState("iPhone 13");
  const [modelB, setModelB] = useState("Apple TV HD");
  const [basketModels, setBasketModels] = useState(["iPhone 13", "AirPods Max", "Magic Mouse"]);
  const [correlationData, setCorrelationData] = useState([]);
  const [basketData, setBasketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(BACKEND_URL + "/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (modelA && modelB) {
      fetch(
        BACKEND_URL + `/api/products/correlation?modelA=${encodeURIComponent(
          modelA
        )}&modelB=${encodeURIComponent(modelB)}`
      )
        .then((res) => res.json())
        .then((data) => setCorrelationData(data));
    }
  }, [modelA, modelB]);

  useEffect(() => {
    if (basketModels.length > 0) {
      const modelsParam = basketModels.map((m) => encodeURIComponent(m)).join(",");
      fetch(BACKEND_URL + `/api/products/basket?models=${modelsParam}`)
        .then((res) => res.json())
        .then((data) => {
          const transformed = data.map((item) => {
            const entry = { country: item._id, total: item.totalPrice };
            item.items.forEach((p) => {
              entry[p.model] = p.price;
            });
            return entry;
          });
          setBasketData(transformed.slice(0, 20)); // Limit to top 20 for readability
        });
    }
  }, [basketModels]);

  const toggleModel = (model) => {
    setBasketModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Header Section */}
      <section className="pt-24 pb-12 px-6 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter mb-4 text-foreground">
          Price Correlations
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-12 max-w-2xl">
          Analyze the relationship between different product categories across countries.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 bg-secondary/50 p-2 rounded-[2rem] shadow-sm">
          <Select value={modelA} onValueChange={setModelA}>
            <SelectTrigger className="w-[200px] text-base h-12 bg-card rounded-full border-none shadow-sm font-medium">
              <SelectValue placeholder="Product X" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-xl">
              {products.map((p) => (
                <SelectItem className="text-base py-2 cursor-pointer" key={`A-${p}`} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="bg-background rounded-full p-3 shadow-sm text-muted-foreground">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          
          <Select value={modelB} onValueChange={setModelB}>
            <SelectTrigger className="w-[200px] text-base h-12 bg-card rounded-full border-none shadow-sm font-medium">
              <SelectValue placeholder="Product Y" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-xl">
              {products.map((p) => (
                <SelectItem className="text-base py-2 cursor-pointer" key={`B-${p}`} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="px-6 max-w-7xl mx-auto w-full mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-[2rem] p-8 shadow-sm flex flex-col justify-center border border-border/40">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Correlation Strength</h3>
            <p className="text-sm text-foreground leading-relaxed">
              A tight cluster along a diagonal line suggests highly correlated pricing. Scattered dots mean independent strategies.
            </p>
          </div>
          <div className="bg-card rounded-[2rem] p-8 shadow-sm flex flex-col justify-center items-center text-center border border-border/40">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">X-Axis Peak</h3>
            <div className="text-4xl font-semibold tracking-tighter text-primary">
              ${Math.max(...correlationData.map(d => d.priceA), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">{modelA}</p>
          </div>
          <div className="bg-card rounded-[2rem] p-8 shadow-sm flex flex-col justify-center items-center text-center border border-border/40">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Y-Axis Peak</h3>
            <div className="text-4xl font-semibold tracking-tighter text-primary">
              ${Math.max(...correlationData.map(d => d.priceB), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">{modelB}</p>
          </div>
        </div>

        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col overflow-hidden">
          <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2">Cross-Product Scatter Analysis</h2>
              <p className="text-muted-foreground">Does an expensive {modelA} mean expensive {modelB}?</p>
            </div>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-medium">
              {correlationData.length} Countries Compared
            </Badge>
          </div>
          
          <div className="h-[600px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
                <XAxis 
                  type="number" 
                  dataKey="priceA" 
                  name={modelA} 
                  unit="$" 
                  stroke="var(--color-muted-foreground)" 
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--color-foreground)' }}
                >
                  <Label value={`${modelA} Price (USD)`} position="insideBottom" offset={-20} style={{ fill: 'var(--color-muted-foreground)', fontWeight: 500, fontSize: 14 }} />
                </XAxis>
                <YAxis 
                  type="number" 
                  dataKey="priceB" 
                  name={modelB} 
                  unit="$" 
                  stroke="var(--color-muted-foreground)" 
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--color-foreground)' }}
                >
                  <Label value={`${modelB} Price (USD)`} angle={-90} position="insideLeft" offset={0} style={{ fill: 'var(--color-muted-foreground)', fontWeight: 500, fontSize: 14 }} />
                </YAxis>
                <ZAxis type="number" range={[150, 150]} />
                <RechartsTooltip 
                  cursor={{ strokeDasharray: '3 3', stroke: 'var(--color-border)' }}
                  content={<CustomTooltip modelA={modelA} modelB={modelB} />}
                />
                <Scatter 
                  name="Countries" 
                  data={correlationData} 
                  fill="var(--color-primary)" 
                  fillOpacity={0.8}
                  stroke="var(--color-background)"
                  strokeWidth={2}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-7xl mx-auto w-full mb-12">
        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col">
          <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2 flex items-center justify-center md:justify-start gap-3">
                <ShoppingBasket className="w-8 h-8 text-primary" />
                The Apple Basket
              </h2>
              <p className="text-muted-foreground text-lg">Cumulative cost of multiple items across different countries.</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end max-w-lg">
              {basketModels.map((m) => (
                <Badge 
                  key={m} 
                  className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer flex gap-1 items-center px-4 py-2 rounded-full font-medium"
                  onClick={() => toggleModel(m)}
                >
                  {m} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mb-12 overflow-x-auto pb-4">
            <div className="flex gap-3 justify-center md:justify-start">
              {products.filter(p => !basketModels.includes(p)).slice(0, 10).map(p => (
                <button
                  key={p}
                  onClick={() => toggleModel(p)}
                  className="whitespace-nowrap px-5 py-2.5 rounded-full border border-border bg-secondary/50 text-foreground text-sm font-medium hover:bg-secondary hover:border-secondary transition-all flex items-center gap-2 shadow-sm"
                >
                  <Check className="w-4 h-4 text-emerald-500" /> Add {p}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[600px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={basketData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.4} />
                <XAxis 
                  dataKey="country" 
                  angle={-45} 
                  textAnchor="end" 
                  interval={0} 
                  height={90}
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--color-foreground)' }}
                  dy={20}
                />
                <YAxis 
                  tickFormatter={(v) => `$${v}`} 
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--color-muted-foreground)' }}
                />
                <RechartsTooltip 
                  cursor={{fill: 'var(--color-secondary)'}}
                  content={<BasketTooltip />}
                />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '30px' }} iconType="circle" />
                {basketModels.map((model, index) => {
                  const colors = ['var(--color-primary)', 'var(--color-ring)', 'var(--color-destructive)', 'var(--color-muted-foreground)', 'var(--color-chart-2)'];
                  return (
                    <Bar
                      key={model}
                      dataKey={model}
                      stackId="a"
                      fill={colors[index % colors.length]}
                      radius={index === basketModels.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
                    />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

const BasketTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, p) => sum + p.value, 0);
    return (
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 min-w-[200px]">
        <p className="font-bold text-lg mb-2 border-b border-slate-700 pb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((p, i) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }}></div>
                <span >{p.name}:</span>
              </div>
              <span className="font-mono font-bold">${p.value.toFixed(2)}</span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t border-slate-700 flex justify-between items-center font-black">
            <span>Total Basket:</span>
            <span className="text-indigo-300 text-lg">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomTooltip = ({ active, payload, modelA, modelB }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-slate-700 min-w-[150px]">
        <p className="font-bold text-indigo-300 border-b border-slate-700 pb-2 mb-2">{data.country}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-xs ">
            <span>{modelA}:</span>
            <span className="text-white font-mono">${data.priceA.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4 text-xs ">
            <span>{modelB}:</span>
            <span className="text-white font-mono">${data.priceB.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};