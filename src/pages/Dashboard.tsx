import { useState, useEffect } from "react";
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
  RefreshCw,
  Crown,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Users,
  Zap
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  invoice?: string;
}

interface UsageStats {
  scansThisMonth: number;
  scansLimit: number;
  pagesScanned: number;
  issuesFound: number;
  avgScore: number;
  trendsData: Array<{ month: string; scans: number; score: number }>;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "user_123",
    name: "John Doe",
    email: "john@example.com",
    plan: "Pro",
    planStatus: "active",
    subscriptionId: "sub_123",
    customerId: "cus_123",
    joinedDate: "2024-01-01",
    lastLogin: new Date().toISOString(),
    avatar: null
  });

  const [usageStats, setUsageStats] = useState<UsageStats>({
    scansThisMonth: 7,
    scansLimit: 10,
    pagesScanned: 45,
    issuesFound: 127,
    avgScore: 78,
    trendsData: [
      { month: "Oct", scans: 8, score: 75 },
      { month: "Nov", scans: 12, score: 82 },
      { month: "Dec", scans: 7, score: 78 }
    ]
  });

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: "inv_001",
      date: "2024-01-15",
      amount: 19.00,
      status: "paid",
      description: "Pro Plan - Monthly",
      invoice: "INV-2024-001"
    },
    {
      id: "inv_002",
      date: "2023-12-15",
      amount: 19.00,
      status: "paid",
      description: "Pro Plan - Monthly",
      invoice: "INV-2023-012"
    },
    {
      id: "inv_003",
      date: "2023-11-15",
      amount: 19.00,
      status: "paid",
      description: "Pro Plan - Monthly",
      invoice: "INV-2023-011"
    }
  ]);

  const [scanHistory, setScanHistory] = useState([
    {
      id: "scan-001",
      url: "https://example.com",
      date: "2024-01-15",
      score: 78,
      issues: 12,
      status: "completed",
      wcagCompliance: { levelA: 85, levelAA: 72, levelAAA: 45 }
    },
    {
      id: "scan-002", 
      url: "https://mystore.com",
      date: "2024-01-14",
      score: 85,
      issues: 8,
      status: "completed",
      wcagCompliance: { levelA: 92, levelAA: 78, levelAAA: 52 }
    },
    {
      id: "scan-003",
      url: "https://portfolio.dev",
      date: "2024-01-12",
      score: 92,
      issues: 3,
      status: "completed",
      wcagCompliance: { levelA: 98, levelAA: 89, levelAAA: 67 }
    }
  ]);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email
  });

  const planFeatures = {
    Free: {
      scansPerMonth: 1,
      pagesPerScan: 3,
      features: ["Basic reporting", "Email support", "WCAG AA scanning"],
      price: 0,
      color: "gray"
    },
    Pro: {
      scansPerMonth: 10,
      pagesPerScan: 25,
      features: ["PDF reports", "Priority support", "Scan history", "WCAG AAA scanning"],
      price: 19,
      color: "blue"
    },
    Agency: {
      scansPerMonth: "Unlimited",
      pagesPerScan: "Unlimited",
      features: ["White-label reports", "API access", "Team collaboration", "Phone support"],
      price: 49,
      color: "purple"
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
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
    // Simulate data refresh
    setTimeout(() => {
      showSuccess("Data refreshed successfully!");
    }, 1000);
  };

  const handleUpdateProfile = async () => {
    if (!profileData.name.trim() || !profileData.email.trim()) {
      showError("Please fill in all fields");
      return;
    }

    setIsUpdatingProfile(true);
    
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
    showSuccess("Redirecting to secure payment portal...");
    // In real app, this would open Stripe billing portal
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    showSuccess(`Downloading invoice ${invoiceId}...`);
    // In real app, this would download the actual invoice
  };

  const handleCancelSubscription = () => {
    showError("Please contact support to cancel your subscription.");
  };

  const handleChangePhoto = () => {
    showSuccess("Photo upload feature coming soon!");
  };

  const currentPlan = planFeatures[user.plan as keyof typeof planFeatures];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <Badge variant="outline" className={`text-${currentPlan.color}-600 border-${currentPlan.color}-200`}>
                <Crown className="w-3 h-3 mr-1" />
                {user.plan} Plan
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/pricing')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
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
                  <p className="text-sm font-medium text-gray-600">Monthly Usage</p>
                  <p className="text-2xl font-bold">{usageStats.scansThisMonth}/{usageStats.scansLimit}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <Progress 
                value={(usageStats.scansThisMonth / usageStats.scansLimit) * 100} 
                className="mt-2" 
              />
              <p className="text-xs text-gray-500 mt-1">
                {usageStats.scansLimit - usageStats.scansThisMonth} scans remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pages Scanned</p>
                  <p className="text-2xl font-bold">{usageStats.pagesScanned}</p>
                </div>
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Issues Found</p>
                  <p className="text-2xl font-bold">{usageStats.issuesFound}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Across all scans</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(usageStats.avgScore)}`}>
                    {usageStats.avgScore}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Accessibility score</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="scans" className="space-y-6">
          <TabsList>
            <TabsTrigger value="scans">Scan History</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
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
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {scan.date}
                            </span>
                            <span>WCAG AA: {scan.wcagCompliance.levelAA}%</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{user.name}</h3>
                      <p className="text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-400">
                        Member since {new Date(user.joinedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleChangePhoto}>
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
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

              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>
                    Your current plan and account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Crown className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{user.plan} Plan</h4>
                        <p className="text-sm text-gray-600">
                          ${currentPlan.price}/month • Active
                        </p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium">Plan Features:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={handleChangePlan} className="w-full">
                      Upgrade Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
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
                          ${currentPlan.price}/month • Renews on Feb 15, 2024
                        </p>
                      </div>
                      <Button variant="outline" onClick={handleChangePlan}>
                        Change Plan
                      </Button>
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

                  <div className="pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      onClick={handleCancelSubscription}
                      className="w-full"
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    View your recent payments and download invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium">${payment.amount.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{payment.description}</p>
                            <p className="text-xs text-gray-400">{payment.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={payment.status === 'paid' ? 'default' : 'secondary'}
                            className={getStatusColor(payment.status)}
                          >
                            {payment.status}
                          </Badge>
                          {payment.invoice && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadInvoice(payment.invoice!)}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usage">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>
                    Track your scanning activity and trends
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{usageStats.scansThisMonth}</div>
                      <div className="text-sm text-gray-600">Scans This Month</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{usageStats.pagesScanned}</div>
                      <div className="text-sm text-gray-600">Pages Analyzed</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">Monthly Trends</h5>
                    <div className="space-y-2">
                      {usageStats.trendsData.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{trend.month}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{trend.scans} scans</span>
                            <span className={`text-sm font-medium ${getScoreColor(trend.score)}`}>
                              {trend.score} avg score
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Limits</CardTitle>
                  <CardDescription>
                    Monitor your current usage against plan limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Monthly Scans</span>
                      <span>{usageStats.scansThisMonth} / {usageStats.scansLimit}</span>
                    </div>
                    <Progress value={(usageStats.scansThisMonth / usageStats.scansLimit) * 100} />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Pages per Scan</span>
                      <span>Up to {currentPlan.pagesPerScan}</span>
                    </div>
                    <Progress value={100} />
                  </div>

                  {usageStats.scansThisMonth >= usageStats.scansLimit * 0.8 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Usage Warning:</strong> You've used {Math.round((usageStats.scansThisMonth / usageStats.scansLimit) * 100)}% of your monthly scans.
                      </p>
                    </div>
                  )}

                  <Button onClick={handleChangePlan} className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade for More Scans
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;