import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, Globe, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function EconomicInsight() {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            Economic Insight
          </h1>
          <p className="text-muted-foreground mt-2">Global market trends and economic indicators.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium self-start sm:self-center">
          <Globe className="h-4 w-4" />
          Live Market Data
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         <Card className="yellow-gradient border">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Inflation Index</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">2.4%</div>
                  <div className="flex items-center text-red-500 text-sm mb-1 font-medium">
                     <ArrowUpRight className="h-4 w-4" />
                     +0.2%
                  </div>
               </div>
            </CardContent>
         </Card>
         <Card className="blue-gradient border">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">GDP Growth</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">3.1%</div>
                  <div className="flex items-center text-green-500 text-sm mb-1 font-medium">
                     <ArrowUpRight className="h-4 w-4" />
                     +1.1%
                  </div>
               </div>
            </CardContent>
         </Card>
         <Card className="green-gradient border">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Unemployment</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">3.8%</div>
                  <div className="flex items-center text-green-500 text-sm mb-1 font-medium">
                     <ArrowDownRight className="h-4 w-4" />
                     -0.1%
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle>Economic Trends (Annual View)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] w-full flex items-center justify-center relative overflow-hidden">
             {/* Fake chart illustration with CSS */}
             <div className="absolute inset-0 flex items-end gap-1 px-4 pb-4">
                {[40, 60, 30, 80, 50, 90, 70, 45, 85, 55, 75, 95].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-primary/20 hover:bg-primary transition-all duration-300 rounded-t cursor-help group"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover border border-border px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none text-xs transition-opacity z-10 whitespace-nowrap">
                       Value: {h * 100}
                    </div>
                  </div>
                ))}
             </div>
             <div className="text-muted-foreground/30 text-4xl font-black uppercase tracking-widest pointer-events-none">
                Data Stream
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}