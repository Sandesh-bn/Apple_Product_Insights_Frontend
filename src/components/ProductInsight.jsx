import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Package, Search, BarChart3, Layers } from "lucide-react";

export default function ProductInsight() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          Product Insight
        </h1>
        <p className="text-muted-foreground mt-2">Deep dive into product performance and analytics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="blue-gradient border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Market Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center border-2 border-dashed border-blue-200 dark:border-blue-900 rounded-xl bg-blue-50/50 dark:bg-blue-900/10">
              <p className="text-blue-500 text-sm font-medium">Sentiment Analysis Visualization</p>
            </div>
          </CardContent>
        </Card>

        <Card className="green-gradient border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Inventory Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center border-2 border-dashed border-green-200 dark:border-green-900 rounded-xl bg-green-50/50 dark:bg-green-900/10">
              <p className="text-green-500 text-sm font-medium">Inventory Turnover Chart</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Top Performing Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             {["Electronics", "Apparel", "Home Office", "Lifestyle"].map((cat, i) => (
               <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {i + 1}
                    </div>
                    <span className="font-semibold">{cat}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-48 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-primary" style={{ width: `${80 - i * 15}%` }} />
                    </div>
                    <span className="text-sm font-mono">{80 - i * 15}%</span>
                  </div>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}