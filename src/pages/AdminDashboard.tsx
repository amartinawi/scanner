import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Settings, 
  Users, 
  CreditCard, 
  Mail, 
  BarChart3, 
  Globe, 
  Shield,
  Edit,
  Trash2,
  Plus,
  Save,
  Eye,
  Ban,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Crown,
  FileText,
  Database,
  Zap
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastLogin: string;
  scansUsed: number;
  totalSpent: number;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  scansPerMonth: number | string;
  pagesPerScan: number | string;
  features: string[];
  isActive: boolean;
  stripePriceId?: string;
}

interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  encryption: 'none' | 'tls' | 'ssl';
  isEnabled: boolean;
}

interface BillingConfig {
  provider: 'stripe' | 'paypal' | 'manual';
  stripePublishableKey: string;
  stripeSecretKey: string;
  webhookSecret: string;
  currency: string;
  taxRate: number;
  isEnabled: boolean;
}

interface WebsiteContent {
  id: string;
  page: string;
  section: string;
  title: string;
  content: string;
  isActive: boolean;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Overview Stats
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 1089,
    totalRevenue: 23450,
    monthlyRevenue: 4890,
    totalScans: 15678,
    avgScore: 76,
    conversionRate: 12.5,
    churnRate: 3.2
  });

  // Users Management
  const [users, setUsers] = useState<User[]>([
    {
      id: "user_1",
      name: "John Doe",
      email: "john@example.com",
      plan: "Pro",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2024-01-20",
      scansUsed: 7,
      totalSpent: 57.00
    },
    {
      id: "user_2",
      name: "Jane Smith",
      email: "jane@company.com",
      plan: "Agency",
      status: "active",
      joinDate: "2023-12-01",
      lastLogin: "2024-01-19",
      scansUsed: 45,
      totalSpent: 294.00
    },
    {
      id: "user_3",
      name: "Bob Wilson",
      email: "bob@startup.io",
      plan: "Free",
      status: "pending",
      joinDate: "2024-01-18",
      lastLogin: "2024-01-18",
      scansUsed: 1,
      totalSpent: 0.00
    }
  ]);

  // Plans Management
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "free",
      name: "Free",
      price: 0,
      scansPerMonth: 1,
      pagesPerScan: 3,
      features: ["Basic reporting", "Email support", "WCAG AA scanning"],
      isActive: true
    },
    {
      id: "pro",
      name: "Pro",
      price: 19,
      scansPerMonth: 10,
      pagesPerScan: 25,
      features: ["PDF reports", "Priority support", "Scan history", "WCAG AAA scanning"],
      isActive: true,
      stripePriceId: "price_1234567890"
    },
    {
      id: "agency",
      name: "Agency",
      price: 49,
      scansPerMonth: "Unlimited",
      pagesPerScan: "Unlimited",
      features: ["White-label reports", "API access", "Team collaboration", "Phone support"],
      isActive: true,
      stripePriceId: "price_0987654321"
    }
  ]);

  // SMTP Configuration
  const [smtpConfig, setSMTPConfig] = useState<SMTPConfig>({
    host: "smtp.gmail.com",
    port: 587,
    username: "noreply@accessscan.com",
    password: "",
    fromEmail: "noreply@accessscan.com",
    fromName: "AccessScan",
    encryption: "tls",
    isEnabled: true
  });

  // Billing Configuration
  const [billingConfig, setBillingConfig] = useState<BillingConfig>({
    provider: "stripe",
    stripePublishableKey: "pk_test_...",
    stripeSecretKey: "",
    webhookSecret: "",
    currency: "USD",
    taxRate: 0,
    isEnabled: true
  });

  // Website Content
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent[]>([
    {
      id: "hero_title",
      page: "Homepage",
      section: "Hero",
      title: "Main Headline",
      content: "Make Your Website Accessible to Everyone",
      isActive: true
    },
    {
      id: "hero_subtitle",
      page: "Homepage",
      section: "Hero",
      title: "Subtitle",
      content: "Scan your website for ADA/WCAG compliance issues and get actionable reports to improve accessibility for all users.",
      isActive: true
    },
    {
      id: "pricing_title",
      page: "Pricing",
      section: "Header",
      title: "Page Title",
      content: "Simple, Transparent Pricing",
      isActive: true
    }
  ]);

  // Dialog states
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingContent, setEditingContent] = useState<WebsiteContent | null>(null);

  const handleSaveUser = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    setEditingUser(null);
    showSuccess("User updated successfully");
  };

  const handleSavePlan = (plan: Plan) => {
    setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
    setEditingPlan(null);
    showSuccess("Plan updated successfully");
  };

  const handleSaveContent = (content: WebsiteContent) => {
    setWebsiteContent(prev => prev.map(c => c.id === content.id ? content : c));
    setEditingContent(null);
    showSuccess("Content updated successfully");
  };

  const handleSaveSMTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showSuccess("SMTP configuration saved successfully");
    }, 1000);
  };

  const handleSaveBilling = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showSuccess("Billing configuration saved successfully");
    }, 1000);
  };

  const handleTestSMTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showSuccess("Test email sent successfully!");
    }, 2000);
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u
    ));
    showSuccess("User status updated");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'suspended': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'suspended': return <Ban className="w-4 h-4 text-red-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">AccessScan Platform Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-red-600 border-red-200">
                <Shield className="w-3 h-3 mr-1" />
                Administrator
              </Badge>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <Eye className="w-4 h-4 mr-2" />
                View as User
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="smtp">SMTP</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.activeUsers} active users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ${stats.totalRevenue.toLocaleString()} total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Scans</p>
                      <p className="text-2xl font-bold">{stats.totalScans.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Avg score: {stats.avgScore}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                    </div>
                    <Zap className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.churnRate}% churn rate
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">New user registration</p>
                        <p className="text-xs text-gray-500">john@example.com - 2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Payment received</p>
                        <p className="text-xs text-gray-500">$19.00 from jane@company.com - 15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium">Scan completed</p>
                        <p className="text-xs text-gray-500">example.com scored 85 - 1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMTP Service</span>
                      <Badge variant="default" className="text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Stripe Integration</span>
                      <Badge variant="default" className="text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge variant="default" className="text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Healthy
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Scanner Engine</span>
                      <Badge variant="default" className="text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Running
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts, plans, and permissions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scans Used</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Crown className="w-3 h-3 mr-1" />
                            {user.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(user.status)}
                            <span className={`text-sm ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{user.scansUsed}</TableCell>
                        <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingUser(user)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspendUser(user.id)}
                            >
                              <Ban className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Plan Management</CardTitle>
                    <CardDescription>Configure pricing plans and features</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <Card key={plan.id} className={plan.isActive ? "border-blue-200" : "border-gray-200 opacity-60"}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <div className="text-2xl font-bold mt-2">
                              ${plan.price}
                              {plan.price > 0 && <span className="text-sm font-normal">/month</span>}
                            </div>
                          </div>
                          <Switch checked={plan.isActive} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm">
                            <strong>Scans:</strong> {plan.scansPerMonth} per month
                          </p>
                          <p className="text-sm">
                            <strong>Pages:</strong> {plan.pagesPerScan} per scan
                          </p>
                          {plan.stripePriceId && (
                            <p className="text-xs text-gray-500">
                              Stripe ID: {plan.stripePriceId}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1 mb-4">
                          {plan.features.map((feature, index) => (
                            <p key={index} className="text-xs text-gray-600">• {feature}</p>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setEditingPlan(plan)}
                        >
                          <Edit className="w-3 h-3 mr-2" />
                          Edit Plan
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing Configuration</CardTitle>
                <CardDescription>Configure payment providers and billing settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="provider">Payment Provider</Label>
                      <Select value={billingConfig.provider} onValueChange={(value: any) => 
                        setBillingConfig(prev => ({ ...prev, provider: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={billingConfig.currency} onValueChange={(value) => 
                        setBillingConfig(prev => ({ ...prev, currency: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        value={billingConfig.taxRate}
                        onChange={(e) => setBillingConfig(prev => ({ 
                          ...prev, 
                          taxRate: parseFloat(e.target.value) || 0 
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stripePublishable">Stripe Publishable Key</Label>
                      <Input
                        id="stripePublishable"
                        type="text"
                        value={billingConfig.stripePublishableKey}
                        onChange={(e) => setBillingConfig(prev => ({ 
                          ...prev, 
                          stripePublishableKey: e.target.value 
                        }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="stripeSecret">Stripe Secret Key</Label>
                      <Input
                        id="stripeSecret"
                        type="password"
                        value={billingConfig.stripeSecretKey}
                        onChange={(e) => setBillingConfig(prev => ({ 
                          ...prev, 
                          stripeSecretKey: e.target.value 
                        }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="webhookSecret">Webhook Secret</Label>
                      <Input
                        id="webhookSecret"
                        type="password"
                        value={billingConfig.webhookSecret}
                        onChange={(e) => setBillingConfig(prev => ({ 
                          ...prev, 
                          webhookSecret: e.target.value 
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={billingConfig.isEnabled}
                    onCheckedChange={(checked) => setBillingConfig(prev => ({ 
                      ...prev, 
                      isEnabled: checked 
                    }))}
                  />
                  <Label>Enable Billing System</Label>
                </div>

                <Button onClick={handleSaveBilling} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Configuration"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMTP Tab */}
          <TabsContent value="smtp">
            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>Configure email delivery settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        value={smtpConfig.host}
                        onChange={(e) => setSMTPConfig(prev => ({ ...prev, host: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="smtpPort">Port</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={smtpConfig.port}
                        onChange={(e) => setSMTPConfig(prev => ({ 
                          ...prev, 
                          port: parseInt(e.target.value) || 587 
                        }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="smtpUsername">Username</Label>
                      <Input
                        id="smtpUsername"
                        value={smtpConfig.username}
                        onChange={(e) => setSMTPConfig(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="smtpPassword">Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={smtpConfig.password}
                        onChange={(e) => setSMTPConfig(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={smtpConfig.fromEmail}
                        onChange={(e) => setSMTPConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="fromName">From Name</Label>
                      <Input
                        id="fromName"
                        value={smtpConfig.fromName}
                        onChange={(e) => setSMTPConfig(prev => ({ ...prev, fromName: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="encryption">Encryption</Label>
                      <Select value={smtpConfig.encryption} onValueChange={(value: any) => 
                        setSMTPConfig(prev => ({ ...prev, encryption: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="tls">TLS</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={smtpConfig.isEnabled}
                        onCheckedChange={(checked) => setSMTPConfig(prev => ({ 
                          ...prev, 
                          isEnabled: checked 
                        }))}
                      />
                      <Label>Enable SMTP</Label>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={handleSaveSMTP} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Configuration"}
                  </Button>
                  <Button variant="outline" onClick={handleTestSMTP} disabled={isLoading}>
                    <Mail className="w-4 h-4 mr-2" />
                    {isLoading ? "Testing..." : "Send Test Email"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Website Content Management</CardTitle>
                    <CardDescription>Edit website pages content and copy</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Content Preview</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {websiteContent.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell>{content.page}</TableCell>
                        <TableCell>{content.section}</TableCell>
                        <TableCell>{content.title}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {content.content}
                        </TableCell>
                        <TableCell>
                          <Badge variant={content.isActive ? "default" : "secondary"}>
                            {content.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingContent(content)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Monthly Recurring Revenue</span>
                      <span className="font-bold">${stats.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Annual Run Rate</span>
                      <span className="font-bold">${(stats.monthlyRevenue * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Revenue Per User</span>
                      <span className="font-bold">${(stats.monthlyRevenue / stats.activeUsers).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Free Users</span>
                      <span className="font-bold">
                        {users.filter(u => u.plan === 'Free').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pro Users</span>
                      <span className="font-bold">
                        {users.filter(u => u.plan === 'Pro').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Agency Users</span>
                      <span className="font-bold">
                        {users.filter(u => u.plan === 'Agency').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and settings</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="userName">Name</Label>
                <Input
                  id="userName"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="userPlan">Plan</Label>
                <Select value={editingUser.plan} onValueChange={(value) => 
                  setEditingUser({ ...editingUser, plan: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Agency">Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleSaveUser(editingUser)}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={!!editingContent} onOpenChange={() => setEditingContent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>Update website content and copy</DialogDescription>
          </DialogHeader>
          {editingContent && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="contentTitle">Title</Label>
                <Input
                  id="contentTitle"
                  value={editingContent.title}
                  onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contentText">Content</Label>
                <Textarea
                  id="contentText"
                  rows={6}
                  value={editingContent.content}
                  onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingContent.isActive}
                  onCheckedChange={(checked) => setEditingContent({ 
                    ...editingContent, 
                    isActive: checked 
                  })}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={() => handleSaveContent(editingContent)}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;