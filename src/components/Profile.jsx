import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { User, Mail, Shield, Bell, Settings } from "lucide-react";

export default function Profile() {
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and security.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">John Doe</h2>
                  <p className="text-sm text-muted-foreground italic">Chief Analyst</p>
                </div>
                <div className="w-full pt-4 space-y-2">
                   <div className="flex items-center justify-between text-xs font-medium uppercase text-muted-foreground tracking-tighter">
                      <span>Account Level</span>
                      <span className="text-primary">Enterprise</span>
                   </div>
                   <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-3/4" />
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue="john.doe@example.com" type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <textarea 
                   id="bio" 
                   className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                   defaultValue="Passionate analyst focusing on global tech markets and economic shifts."
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t border-border pt-6">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
             <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="pt-6">
                   <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 group-hover:scale-110 transition-transform">
                         <Shield className="h-5 w-5" />
                      </div>
                      <div>
                         <p className="font-semibold text-sm">Security</p>
                         <p className="text-xs text-muted-foreground">Manage your passwords</p>
                      </div>
                   </div>
                </CardContent>
             </Card>
             <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="pt-6">
                   <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 group-hover:scale-110 transition-transform">
                         <Bell className="h-5 w-5" />
                      </div>
                      <div>
                         <p className="font-semibold text-sm">Notifications</p>
                         <p className="text-xs text-muted-foreground">Configure alerts</p>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}