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
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Price Correlations</h1>
          <p className="text-muted-foreground">
            Analyze the relationship between different product categories across countries.
          </p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-lg border border-slate-200">
          <Select value={modelA} onValueChange={setModelA}>
            <SelectTrigger className="w-[180px]  border-none shadow-none">
              <SelectValue placeholder="Product X" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={`A-${p}`} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ArrowRightLeft className="w-4 h-4 text-slate-400" />
          <Select value={modelB} onValueChange={setModelB}>
            <SelectTrigger className="w-[180px] border-none shadow-none">
              <SelectValue placeholder="Product Y" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={`B-${p}`} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Cross-Product Price Correlation</CardTitle>
                <CardDescription>
                  Does an expensive {modelA} mean expensive accessories?
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 px-3 py-1">
                {correlationData.length} Countries Compared
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-8 px-6">
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    type="number" 
                    dataKey="priceA" 
                    name={modelA} 
                    unit="$" 
                    stroke="#64748b" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  >
                    <Label value={`${modelA} Price (USD)`} position="insideBottom" offset={-20} style={{ fill: '#64748b', fontWeight: 'bold' }} />
                  </XAxis>
                  <YAxis 
                    type="number" 
                    dataKey="priceB" 
                    name={modelB} 
                    unit="$" 
                    stroke="#64748b" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  >
                    <Label value={`${modelB} Price (USD)`} angle={-90} position="insideLeft" style={{ fill: '#64748b', fontWeight: 'bold' }} />
                  </YAxis>
                  <ZAxis type="number" range={[100, 100]} />
                  <RechartsTooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={<CustomTooltip modelA={modelA} modelB={modelB} />}
                  />
                  <Scatter 
                    name="Countries" 
                    data={correlationData} 
                    fill="#6366f1" 
                    fillOpacity={0.6}
                    stroke="#4f46e5"
                    strokeWidth={1}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Correlation Strength</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm ">
              A tight cluster along a diagonal line suggests that prices for these two products are highly correlated. If the dots are scattered randomly, the pricing strategies for these categories may be independent.
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold  uppercase tracking-wider">X-Axis Peak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black ">
              ${Math.max(...correlationData.map(d => d.priceA), 0).toFixed(2)}
            </div>
            <p className="text-xs  mt-1">Maximum price recorded for {modelA}.</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold  uppercase tracking-wider">Y-Axis Peak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black ">
              ${Math.max(...correlationData.map(d => d.priceB), 0).toFixed(2)}
            </div>
            <p className="text-xs  mt-1">Maximum price recorded for {modelB}.</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-10">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShoppingBasket className="w-5 h-5 text-indigo-600" />
                  The Apple Basket
                </CardTitle>
                <CardDescription>
                  Cumulative cost of multiple items across different countries.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {basketModels.map((m) => (
                  <Badge 
                    key={m} 
                    className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex gap-1 items-center px-3 py-1"
                    onClick={() => toggleModel(m)}
                  >
                    {m} <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            {/* Basket Selector */}
            <div className="mb-8 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {products.filter(p => !basketModels.includes(p)).slice(0, 8).map(p => (
                  <button
                    key={p}
                    onClick={() => toggleModel(p)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium hover:bg-slate-400 transition-colors flex items-center gap-1 "
                  >
                    <Check className="w-3 h-3 text-emerald-500" /> Add {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={basketData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="country" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0} 
                    height={70}
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    tickFormatter={(v) => `$${v}`} 
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <RechartsTooltip 
                    cursor={{fill: 'var(--chart-cursor-fill)'}}
                    content={<BasketTooltip />}
                  />
                  <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
                  {basketModels.map((model, index) => (
                    <Bar
                      key={model}
                      dataKey={model}
                      stackId="a"
                      fill={['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'][index % 5]}
                      radius={index === basketModels.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
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
                <span className="text-slate-400">{p.name}:</span>
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
          <div className="flex justify-between gap-4 text-xs text-slate-400">
            <span>{modelA}:</span>
            <span className="text-white font-mono">${data.priceA.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4 text-xs text-slate-400">
            <span>{modelB}:</span>
            <span className="text-white font-mono">${data.priceB.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};