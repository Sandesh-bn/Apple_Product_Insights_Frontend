import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { User, Mail, Shield, Bell, Settings } from "lucide-react";

export default function Profile() {
  return (
    <div className="flex flex-col w-full pb-24 items-center">
      {/* Header Section */}
      <section className="pt-24 pb-12 px-6 flex flex-col items-center text-center w-full">
        <div className="w-32 h-32 rounded-full bg-secondary/80 flex items-center justify-center mb-6 shadow-sm">
          <User className="h-14 w-14 text-muted-foreground" />
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter mb-4 text-foreground">
          John Doe
        </h1>
        <p className="text-xl text-muted-foreground font-medium mb-4">
          john.doe@example.com
        </p>
        <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
          Enterprise Account
        </span>
      </section>

      <section className="px-6 w-full max-w-4xl mb-12">
        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col border border-border/40 gap-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-muted-foreground font-medium pl-2">Full Name</Label>
                <Input 
                  id="name" 
                  defaultValue="John Doe" 
                  className="h-14 rounded-2xl bg-secondary/30 border-none px-6 text-lg font-medium shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-muted-foreground font-medium pl-2">Email Address</Label>
                <Input 
                  id="email" 
                  defaultValue="john.doe@example.com" 
                  type="email" 
                  className="h-14 rounded-2xl bg-secondary/30 border-none px-6 text-lg font-medium shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-3 mt-6">
              <Label htmlFor="bio" className="text-muted-foreground font-medium pl-2">Professional Bio</Label>
              <textarea 
                 id="bio" 
                 className="flex min-h-[120px] w-full rounded-2xl bg-secondary/30 border-none px-6 py-4 text-lg font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none"
                 defaultValue="Passionate analyst focusing on global tech markets and economic shifts."
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="h-12 px-8 rounded-full text-base font-semibold">
              Save Changes
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-card rounded-[2rem] p-6 flex items-center gap-6 shadow-sm border border-border/40 cursor-pointer hover:bg-secondary/20 transition-colors group">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                 <Shield className="h-6 w-6 text-foreground" />
              </div>
              <div>
                 <p className="font-semibold text-xl tracking-tight mb-1">Security</p>
                 <p className="text-muted-foreground font-medium">Manage your passwords</p>
              </div>
           </div>
           
           <div className="bg-card rounded-[2rem] p-6 flex items-center gap-6 shadow-sm border border-border/40 cursor-pointer hover:bg-secondary/20 transition-colors group">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                 <Bell className="h-6 w-6 text-foreground" />
              </div>
              <div>
                 <p className="font-semibold text-xl tracking-tight mb-1">Notifications</p>
                 <p className="text-muted-foreground font-medium">Configure alerts</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}