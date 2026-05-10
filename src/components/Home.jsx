import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { TrendingUp, Users, DollarSign, Package } from "lucide-react";

export default function Home() {
  const stats = [
    { title: "Total Revenue", value: "$45,231.89", description: "+20.1% from last month", icon: DollarSign, color: "text-green-500" },
    { title: "Active Users", value: "2,350", description: "+180.1% from last month", icon: Users, color: "text-blue-500" },
    { title: "Products Sold", value: "12,234", description: "+19% from last month", icon: Package, color: "text-purple-500" },
    { title: "Growth Rate", value: "+12.2%", description: "+4.1% from last month", icon: TrendingUp, color: "text-yellow-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Admin</h1>
        <p className="text-muted-foreground mt-2">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-muted rounded-xl bg-muted/20">
              <p className="text-muted-foreground text-sm italic">Activity Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent updates and alerts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 text-sm border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="font-medium">System Update {i + 1}</p>
                    <p className="text-muted-foreground text-xs">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}