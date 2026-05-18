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
import {
  Treemap,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { BACKEND_URL } from "../config";

export default function ProductInsight() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [stats, setStats] = useState([]);
  const [treemapData, setTreemapData] = useState(null);
  const [incomeStats, setIncomeStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const popularModels = ["iPhone 13", "iPhone SE", "iPad", "MacBook Air"];

  useEffect(() => {
    fetch(BACKEND_URL + "/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        if (data.length > 0) setSelectedProduct(data[0]);
        setLoading(false);
      });

    // Fetch Income Group Stats for popular models
    const modelsParam = popularModels.map(m => encodeURIComponent(m)).join(',');
    fetch(BACKEND_URL + `/api/products/income-stats?models=${modelsParam}`)
      .then((res) => res.json())
      .then((data) => {
        // Transform for Recharts: [{ incomeGroup: 'High', 'iPhone 13': 800, ... }]
        const transformed = data.map(group => {
          const entry = { incomeGroup: group._id };
          group.models.forEach(m => {
            entry[m.model] = m.avgPrice;
          });
          return entry;
        });
        // Sort by income group hierarchy
        const order = ['High income', 'Upper middle income', 'Lower middle income'];
        transformed.sort((a, b) => order.indexOf(a.incomeGroup) - order.indexOf(b.incomeGroup));
        setIncomeStats(transformed);
      });
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      // Fetch regional stats for Box Plot
      fetch(BACKEND_URL + `/api/products/regional/${encodeURIComponent(selectedProduct)}`)
        .then((res) => res.json())
        .then((data) => setStats(data));

      // Fetch Treemap data
      fetch(BACKEND_URL + `/api/products/treemap/${encodeURIComponent(selectedProduct)}`)
        .then((res) => res.json())
        .then((data) => {
          // Transform flat data to hierarchical: Root -> Regions -> Countries
          const regionsMap = data.reduce((acc, curr) => {
            if (!acc[curr.region]) {
              acc[curr.region] = { name: curr.region, children: [] };
            }
            acc[curr.region].children.push({
              name: curr.country,
              size: curr.price_usd,
            });
            return acc;
          }, {});

          setTreemapData([
            {
              name: "Global",
              children: Object.values(regionsMap),
            },
          ]);
        });
    }
  }, [selectedProduct]);

  // Calculate global min/max for the Y-axis scale across all regions
  const globalMin = stats.length > 0 ? Math.min(...stats.map((s) => s.min)) * 0.9 : 0;
  const globalMax = stats.length > 0 ? Math.max(...stats.map((s) => s.max)) * 1.1 : 2000;
  const range = globalMax - globalMin || 1;

  const getY = (price) => {
    return 100 - ((price - globalMin) / range) * 100;
  };

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Header Section */}
      <section className="pt-24 pb-12 px-6 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter mb-4 text-foreground">
          Regional Analysis
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-10 max-w-2xl">
          Explore price consistency and distribution across global regions.
        </p>
        {loading ? (
          <div className="w-full max-w-[300px] mx-auto mb-8 h-14 bg-secondary/50 rounded-full animate-pulse"></div>
        ) : (
          <div className="w-full max-w-[300px] mx-auto mb-8">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
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
        )}
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 mt-12 space-y-6">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-lg font-medium text-muted-foreground animate-pulse">Loading regional insights...</p>
        </div>
      ) : (
        <>

      <section className="px-6 max-w-7xl mx-auto w-full mb-24">
        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col overflow-hidden">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2 flex items-center gap-3">
                Price Variance (Box Plot)
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm font-medium">
                  {selectedProduct}
                </Badge>
              </h2>
              <p className="text-muted-foreground">Visualizing median, quartiles, and price ranges across regions.</p>
            </div>
          </div>
          <div className="w-full overflow-x-auto pb-6">
            <div className="min-w-[800px] h-[500px] relative flex items-end justify-around px-10">
              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs font-semibold text-muted-foreground border-r border-border pr-3">
                <span>${globalMax.toFixed(0)}</span>
                <span>${((globalMax + globalMin) / 2).toFixed(0)}</span>
                <span>${globalMin.toFixed(0)}</span>
              </div>

              {stats.map((region, index) => (
                <div key={region.region} className="flex flex-col items-center group w-32 mt-4">
                  <div className="relative w-full h-[400px] mb-6">
                    {/* Whisker Line */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 bg-border w-[2px]"
                      style={{
                        top: `${getY(region.max)}%`,
                        bottom: `${100 - getY(region.min)}%`
                      }}
                    ></div>

                    {/* Top Whisker Tip */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 bg-muted-foreground h-[2px] w-6"
                      style={{ top: `${getY(region.max)}%` }}
                    ></div>

                    {/* Bottom Whisker Tip */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 bg-muted-foreground h-[2px] w-6"
                      style={{ top: `${getY(region.min)}%` }}
                    ></div>

                    {/* Box (IQR) */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-14 bg-primary/20 border-2 border-primary rounded-md shadow-sm group-hover:bg-primary/30 transition-colors backdrop-blur-sm"
                      style={{
                        top: `${getY(region.q3)}%`,
                        height: `${Math.max(getY(region.q1) - getY(region.q3), 1)}%`
                      }}
                    >
                      {/* Median Line */}
                      <div
                        className="absolute left-0 right-0 h-[2px] bg-primary"
                        style={{ top: `${((getY(region.median) - getY(region.q3)) / (getY(region.q1) - getY(region.q3))) * 100}%` }}
                      ></div>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-popover/90 backdrop-blur-md text-popover-foreground p-4 rounded-2xl z-20 -top-20 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap shadow-xl border-none">
                      <div className="font-semibold mb-3 pb-2 border-b border-border/50 text-base">{region.region}</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between gap-6 text-muted-foreground"><span>Max:</span> <span className="font-mono font-medium text-foreground">${region.max?.toFixed(2)}</span></div>
                        <div className="flex justify-between gap-6 text-muted-foreground"><span>Q3:</span> <span className="font-mono font-medium text-foreground">${region.q3?.toFixed(2)}</span></div>
                        <div className="flex justify-between gap-6 font-semibold text-primary"><span>Median:</span> <span className="font-mono">${region.median?.toFixed(2)}</span></div>
                        <div className="flex justify-between gap-6 text-muted-foreground"><span>Q1:</span> <span className="font-mono font-medium text-foreground">${region.q1?.toFixed(2)}</span></div>
                        <div className="flex justify-between gap-6 text-muted-foreground"><span>Min:</span> <span className="font-mono font-medium text-foreground">${region.min?.toFixed(2)}</span></div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-border/50 text-xs text-center text-muted-foreground">
                        {region.count} countries sampled
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-center px-1 leading-tight text-foreground/80">
                    {region.region}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-7xl mx-auto w-full mb-24">
        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-semibold tracking-tight mb-2">Global Market Hierarchy</h2>
            <p className="text-muted-foreground text-lg">Proportional pricing visualization by region and country.</p>
          </div>
          <div className="h-[600px] w-full rounded-[2rem] overflow-hidden bg-secondary/30">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treemapData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="var(--color-background)"
                fill="var(--color-primary)"
                content={<CustomTreemapContent />}
              >
                <RechartsTooltip content={<CustomTooltip />} />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-7xl mx-auto w-full mb-12">
        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-semibold tracking-tight mb-2">Pricing by Income Group</h2>
            <p className="text-muted-foreground text-lg">Average prices of popular models compared across economic tiers.</p>
          </div>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incomeStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.4} />
                <XAxis
                  dataKey="incomeGroup"
                  axisLine={false}
                  tickLine={false}
                  fontSize={14}
                  fontWeight="500"
                  tick={{ fill: 'var(--color-foreground)' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={13}
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fill: 'var(--color-muted-foreground)' }}
                  dx={-10}
                />
                <RechartsTooltip
                  cursor={{ fill: 'var(--color-secondary)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px', backgroundColor: 'var(--color-popover)', color: 'var(--color-popover-foreground)' }}
                  formatter={(value) => [`$${value.toFixed(2)}`, "Avg. Price"]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px' }} />
                <Bar dataKey="iPhone 13" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="iPhone SE" fill="var(--color-ring)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="iPad" fill="var(--color-destructive)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="MacBook Air" fill="var(--color-muted-foreground)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
        </>
      )}
    </div>
  );
}

const CustomTreemapContent = (props) => {
  const { x, y, width, height, name, depth, size } = props;

  // Assign colors based on depth or name
  const colors = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
  ];
  const fill = depth === 1 ? 'transparent' : colors[Math.floor(Math.random() * colors.length)];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill,
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1,
        }}
      />
      {depth > 0 && width > 30 && height > 14 && (
        <text
          x={x + 4}
          y={y + 14}
          fill="#fff"
          fontSize={Math.min(width / 5, 15)}

          className="pointer-events-none"
        >
          {name}
        </text>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2 rounded-lg shadow-xl text-xs border border-slate-700">
        <p className="font-bold">{data.name}</p>
        <p className="text-indigo-300 font-mono text-sm">${data.size?.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};