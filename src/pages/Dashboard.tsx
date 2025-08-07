import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Globe, 
  TrendingUp, 
  Download, 
  Eye, 
  Settings,
  CreditCard,
  BarChart3,
  Plus,
  RefreshCw
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    plan: "Pro",
    scansUsed: 7,
    scansLimit: 10
  });

  const [scanHistory, setScanHistory] = useState([
    {
      id: "scan-001",
      url: "https://example.com",
      date: "2024-01-15",
      score: 78,
      issues: 12,
      status: "completed"
    },
    {
      id: "scan-002", 
      url: "https://mystore.com",
      date: "2024-01-14",
      score: 85,
      issues: 8,
      status: "completed"
    },
    {
      id: "scan-003",
      url: "https://portfolio.dev",
      date: "2024-01-12",
      score: 92,
      issues: 3,
      status: "completed"
    }
  ]);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  const handleViewScan = (scanId: string) => {
    navigate(`/scan/${scanId}`);
  };

  const handleDownloadPDF = (scanId: string, url: string) => {
    showSuccess(`Generating PDF report for ${url}...`);
    setTimeout(() => {
      showSuccess("PDF report downloaded successfully!");
    }, 2000);
  };

  const handleNewScan = () => {
    navigate('/');
  };

  const handleRefreshScans = () => {
    showSuccess("Refreshing scan history...");
    // In real app, this would fetch latest data from API
  };

  const handleUpdateProfile = async () => {
    if (!profileData.name.trim() || !profileData.email.trim()) {
      showError("Please fill in all fields");
      return;
    }

    setIsUpdatingProfile(true);
    
    // Simulate API call
    setTimeout(() => {
      setUser(prev => ({
        ...prev,
        name: profileData.name,
        email: profileData.email
      }));
      setIsUpdatingProfile(false);
      showSuccess("Profile updated successfully!");
    }, 1500);
  };

  const handleChangePlan = () => {
    navigate('/pricing');
  };

  const handleUpdatePayment = () => {
    showSuccess("Redirecting to payment settings...");
    // In real app, this would open Stripe billing portal or payment form
  };

  const handleChangePhoto = () => {
    showSuccess("Photo upload feature coming soon!");
    // In real app, this would open file picker
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/pricing')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Plan</p>
                  <p className="text-2xl font-bold">{user.plan}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scans Used</p>
                  <p className="text-2xl font-bold">{user.scansUsed}/{user.scansLimit}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <Progress 
                value={(user.scansUsed / user.scansLimit) * 100} 
                className="mt-2" 
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Scans</p>
                  <p className="text-2xl font-bold">{scanHistory.length}</p>
                </div>
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold">
                    {Math.round(scanHistory.reduce((sum, scan) => sum + scan.score, 0) / scanHistory.length)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="scans" className="space-y-6">
          <TabsList>
            <TabsTrigger value="scans">Scan History</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="scans">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Scans</CardTitle>
                    <CardDescription>
                      View and manage your accessibility scan history
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleRefreshScans}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Button onClick={handleNewScan}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Scan
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Globe className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{scan.url}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{scan.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge variant={getScoreBadge(scan.score)}>
                            Score: {scan.score}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {scan.issues} issues found
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewScan(scan.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadPDF(scan.id, scan.url)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{user.name}</h3>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  <Button variant="outline" onClick={handleChangePhoto}>
                    Change Photo
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Current Plan: {user.plan}</h3>
                      <p className="text-sm text-gray-600">
                        $19/month • Renews on Feb 15, 2024
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleChangePlan}>
                      Change Plan
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Usage This Month</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Scans Used</span>
                      <span>{user.scansUsed} / {user.scansLimit}</span>
                    </div>
                    <Progress value={(user.scansUsed / user.scansLimit) * 100} />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Payment Method</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleUpdatePayment}>
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;