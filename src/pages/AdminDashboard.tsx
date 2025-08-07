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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Zap,
  Loader2
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  full_name: string;
  plan: string;
  plan_status: 'active' | 'suspended' | 'cancelled';
  role: 'user' | 'admin';
  created_at: string;
  last_login: string;
  scans_used: number;
  total_spent: number;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  scans_per_month: number;
  pages_per_scan: number;
  features: string[];
  stripe_price_id?: string;
  is_active: boolean;
}

interface AdminConfig {
  id: string;
  category: string;
  config_data: any;
  is_enabled: boolean;
}

interface WebsiteContent {
  id: string;
  page: string;
  section: string;
  title: string;
  content: string;
  is_active: boolean;
}

// Mock data for demo mode
const MOCK_USERS: User[] = [
  {
    id: 'demo-admin-uuid-001',
    email: 'admin@accessscan.com',
    full_name: 'Admin User',
    plan: 'agency',
    plan_status: 'active',
    role: 'admin',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    scans_used: 25,
    total_spent: 147.00
  },
  {
    id: 'demo-user-uuid-002',
    email: 'user@example.com',
    full_name: 'Demo User',
    plan: 'pro',
    plan_status: 'active',
    role: 'user',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    scans_used: 7,
    total_spent: 19.00
  },
  {
    id: 'user-003',
    email: 'john@company.com',
    full_name: 'John Smith',
    plan: 'free',
    plan_status: 'active',
    role: 'user',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    scans_used: 1,
    total_spent: 0.00
  }
];

const MOCK_PLANS: Plan[] = [
  {
    id: 'plan-free',
    name: 'Free',
    price: 0,
    scans_per_month: 1,
    pages_per_scan: 3,
    features: ['Basic reporting', 'Email support', 'WCAG AA scanning'],
    is_active: true
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    price: 19,
    scans_per_month: 10,
    pages_per_scan: 25,
    features: ['PDF reports', 'Priority support', 'Scan history', 'WCAG AAA scanning'],
    stripe_price_id: 'price_pro_monthly',
    is_active: true
  },
  {
    id: 'plan-agency',
    name: 'Agency',
    price: 49,
    scans_per_month: -1,
    pages_per_scan: -1,
    features: ['White-label reports', 'API access', 'Team collaboration', 'Phone support'],
    stripe_price_id: 'price_agency_monthly',
    is_active: true
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { profile, isAdmin, loading: authLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [adminConfigs, setAdminConfigs] = useState<AdminConfig[]>([]);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalScans: 0,
    avgScore: 0,
    conversionRate: 0,
    churnRate: 0
  });

  // Dialog states
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingContent, setEditingContent] = useState<WebsiteContent | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('AdminDashboard - Auth State:', {
      authLoading,
      user: user ? { id: user.id, email: user.email } : null,
      profile: profile ? { id: profile.id, email: profile.email, role: profile.role } : null,
      isAdmin
    });
  }, [authLoading, user, profile, isAdmin]);

  // Check if we're in demo mode
  useEffect(() => {
    if (user && user.id.startsWith('demo-')) {
      console.log('Demo mode detected for user:', user.email);
      setIsDemoMode(true);
    }
  }, [user]);

  // Redirect logic - only redirect non-admin users after auth is complete
  useEffect(() => {
    // Wait for auth to complete
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }

    // If no user at all, redirect to login
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    // If user exists but is not admin, show access denied
    if (!isAdmin) {
      console.log('User is not admin:', { 
        userEmail: user.email, 
        profileRole: profile?.role, 
        isAdmin 
      });
      // Don't redirect immediately, let the access denied screen show
      return;
    }

    console.log('Admin access granted for:', user.email);
  }, [authLoading, user, isAdmin, profile, navigate]);

  // Load data when admin access is confirmed
  useEffect(() => {
    if (!authLoading && isAdmin) {
      console.log('Loading admin data, demo mode:', isDemoMode);
      if (isDemoMode) {
        loadDemoData();
      } else {
        loadAllData();
      }
    }
  }, [authLoading, isAdmin, isDemoMode]);

  const loadDemoData = () => {
    console.log('Loading demo data...');
    setUsers(MOCK_USERS);
    setPlans(MOCK_PLANS);
    setAdminConfigs([
      {
        id: 'smtp',
        category: 'email',
        config_data: {
          host: 'smtp.example.com',
          port: 587,
          username: 'noreply@accessscan.com',
          encryption: 'tls',
          fromEmail: 'noreply@accessscan.com',
          fromName: 'AccessScan'
        },
        is_enabled: true
      },
      {
        id: 'billing',
        category: 'payments',
        config_data: {
          provider: 'stripe',
          currency: 'USD',
          taxRate: 0,
          stripePublishableKey: 'pk_test_demo...',
          stripeSecretKey: 'sk_test_demo...'
        },
        is_enabled: true
      }
    ]);
    setWebsiteContent([
      {
        id: 'content-1',
        page: 'home',
        section: 'hero',
        title: 'Make Your Website Accessible to Everyone',
        content: 'Scan your website for ADA/WCAG compliance issues and get actionable reports to improve accessibility for all users.',
        is_active: true
      },
      {
        id: 'content-2',
        page: 'pricing',
        section: 'header',
        title: 'Simple, Transparent Pricing',
        content: 'Choose the perfect plan for your accessibility scanning needs.',
        is_active: true
      }
    ]);
    
    // Calculate demo stats
    const totalUsers = MOCK_USERS.length;
    const activeUsers = MOCK_USERS.filter(u => u.plan_status === 'active').length;
    const totalRevenue = MOCK_USERS.reduce((sum, u) => sum + u.total_spent, 0);
    const totalScans = MOCK_USERS.reduce((sum, u) => sum + u.scans_used, 0);
    const paidUsers = MOCK_USERS.filter(u => u.plan !== 'free').length;
    
    setStats({
      totalUsers,
      activeUsers,
      totalRevenue,
      monthlyRevenue: totalRevenue * 0.6, // Simulate monthly revenue
      totalScans,
      avgScore: 82,
      conversionRate: (paidUsers / totalUsers) * 100,
      churnRate: 3.2
    });
    console.log('Demo data loaded successfully');
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadPlans(),
        loadAdminConfigs(),
        loadWebsiteContent(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
      showError('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading users:', error);
      return;
    }

    setUsers(data || []);
  };

  const loadPlans = async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price', { ascending: true });

    if (error) {
      console.error('Error loading plans:', error);
      return;
    }

    setPlans(data || []);
  };

  const loadAdminConfigs = async () => {
    const { data, error } = await supabase
      .from('admin_configs')
      .select('*');

    if (error) {
      console.error('Error loading admin configs:', error);
      return;
    }

    setAdminConfigs(data || []);
  };

  const loadWebsiteContent = async () => {
    const { data, error } = await supabase
      .from('website_content')
      .select('*')
      .order('page', { ascending: true });

    if (error) {
      console.error('Error loading website content:', error);
      return;
    }

    setWebsiteContent(data || []);
  };

  const loadStats = async () => {
    try {
      // Get user stats
      const { data: userStats } = await supabase
        .from('profiles')
        .select('plan, plan_status, total_spent, scans_used');

      // Get scan stats
      const { data: scanStats } = await supabase
        .from('scans')
        .select('score, created_at');

      if (userStats) {
        const totalUsers = userStats.length;
        const activeUsers = userStats.filter(u => u.plan_status === 'active').length;
        const totalRevenue = userStats.reduce((sum, u) => sum + (u.total_spent || 0), 0);
        const totalScans = userStats.reduce((sum, u) => sum + (u.scans_used || 0), 0);
        
        const paidUsers = userStats.filter(u => u.plan !== 'free').length;
        const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;

        let avgScore = 0;
        if (scanStats && scanStats.length > 0) {
          avgScore = scanStats.reduce((sum, s) => sum + s.score, 0) / scanStats.length;
        }

        const monthlyRevenue = totalRevenue * 0.1; // Simplified calculation

        setStats({
          totalUsers,
          activeUsers,
          totalRevenue,
          monthlyRevenue,
          totalScans,
          avgScore: Math.round(avgScore),
          conversionRate: Math.round(conversionRate * 10) / 10,
          churnRate: 3.2 // Placeholder
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSaveUser = async (user: User) => {
    if (isDemoMode) {
      // Update demo data
      setUsers(prev => prev.map(u => u.id === user.id ? user : u));
      setEditingUser(null);
      showSuccess('Demo user updated successfully');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: user.full_name,
        email: user.email,
        plan: user.plan,
        plan_status: user.plan_status,
        role: user.role,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      showError('Failed to update user');
      return;
    }

    await loadUsers();
    setEditingUser(null);
    showSuccess('User updated successfully');
  };

  const handleSavePlan = async (plan: Plan) => {
    if (isDemoMode) {
      setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
      setEditingPlan(null);
      showSuccess('Demo plan updated successfully');
      return;
    }

    const { error } = await supabase
      .from('plans')
      .update({
        name: plan.name,
        price: plan.price,
        scans_per_month: plan.scans_per_month,
        pages_per_scan: plan.pages_per_scan,
        features: plan.features,
        stripe_price_id: plan.stripe_price_id,
        is_active: plan.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', plan.id);

    if (error) {
      showError('Failed to update plan');
      return;
    }

    await loadPlans();
    setEditingPlan(null);
    showSuccess('Plan updated successfully');
  };

  const handleSaveContent = async (content: WebsiteContent) => {
    if (isDemoMode) {
      setWebsiteContent(prev => prev.map(c => c.id === content.id ? content : c));
      setEditingContent(null);
      showSuccess('Demo content updated successfully');
      return;
    }

    const { error } = await supabase
      .from('website_content')
      .update({
        title: content.title,
        content: content.content,
        is_active: content.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', content.id);

    if (error) {
      showError('Failed to update content');
      return;
    }

    await loadWebsiteContent();
    setEditingContent(null);
    showSuccess('Content updated successfully');
  };

  const handleSaveConfig = async (configId: string, configData: any) => {
    if (isDemoMode) {
      setAdminConfigs(prev => prev.map(c => 
        c.id === configId ? { ...c, config_data: configData } : c
      ));
      showSuccess('Demo configuration saved successfully');
      return;
    }

    const { error } = await supabase
      .from('admin_configs')
      .update({
        config_data: configData,
        updated_at: new Date().toISOString()
      })
      .eq('id', configId);

    if (error) {
      showError('Failed to save configuration');
      return;
    }

    await loadAdminConfigs();
    showSuccess('Configuration saved successfully');
  };

  const handleSuspendUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newStatus = user.plan_status === 'suspended' ? 'active' : 'suspended';
    
    if (isDemoMode) {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, plan_status: newStatus } : u
      ));
      showSuccess('Demo user status updated');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ 
        plan_status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      showError('Failed to update user status');
      return;
    }

    await loadUsers();
    showSuccess('User status updated');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'suspended': return 'text-red-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'suspended': return <Ban className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const smtpConfig = adminConfigs.find(c => c.id === 'smtp')?.config_data || {};
  const billingConfig = adminConfigs.find(c => c.id === 'billing')?.config_data || {};

  // Show loading while auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Show access denied only if we have a user but they're not admin
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">Administrator privileges required.</p>
          <p className="text-sm text-gray-500 mb-4">
            Current user: {user.email} (Role: {profile?.role || 'unknown'})
          </p>
          <div className="space-x-2">
            <Button onClick={() => navigate('/login')}>
              Return to Login
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If no user, redirect to login (this should be handled by the useEffect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Main admin dashboard - only show if user exists and is admin
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
                <p className="text-sm text-gray-500">
                  AccessScan Platform Management
                  {isDemoMode && <span className="ml-2 text-orange-600 font-medium">(Demo Mode)</span>}
                </p>
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
        {isDemoMode && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Demo Mode Active</h3>
                <p className="text-sm text-blue-600">
                  You're viewing demo data. Changes will be simulated but not persisted to the database.
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p>Loading...</p>
            </div>
          </div>
        )}

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
                      <p className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(0)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ${stats.totalRevenue.toFixed(0)} total
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
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge variant="default" className="text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMTP Service</span>
                      <Badge variant={smtpConfig.host ? "default" : "secondary"} 
                             className={smtpConfig.host ? "text-green-600" : "text-yellow-600"}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {smtpConfig.host ? "Configured" : "Needs Setup"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Billing Integration</span>
                      <Badge variant={billingConfig.stripePublishableKey ? "default" : "secondary"}
                             className={billingConfig.stripePublishableKey ? "text-green-600" : "text-yellow-600"}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {billingConfig.stripePublishableKey ? "Connected" : "Needs Setup"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("users")}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users ({users.length})
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("plans")}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Configure Plans ({plans.length})
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("content")}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Edit Content ({websiteContent.length})
                    </Button>
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
                  <Button onClick={isDemoMode ? loadDemoData : loadUsers}>
                    <Database className="w-4 h-4 mr-2" />
                    Refresh
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
                      <TableHead>Role</TableHead>
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
                            <p className="font-medium">{user.full_name || 'No name'}</p>
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
                            {getStatusIcon(user.plan_status)}
                            <span className={`text-sm ${getStatusColor(user.plan_status)}`}>
                              {user.plan_status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.scans_used}</TableCell>
                        <TableCell>${user.total_spent.toFixed(2)}</TableCell>
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
                  <Button onClick={isDemoMode ? loadDemoData : loadPlans}>
                    <Database className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <Card key={plan.id} className={plan.is_active ? "border-blue-200" : "border-gray-200 opacity-60"}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <div className="text-2xl font-bold mt-2">
                              ${plan.price}
                              {plan.price > 0 && <span className="text-sm font-normal">/month</span>}
                            </div>
                          </div>
                          <Badge variant={plan.is_active ? "default" : "secondary"}>
                            {plan.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm">
                            <strong>Scans:</strong> {plan.scans_per_month === -1 ? 'Unlimited' : plan.scans_per_month} per month
                          </p>
                          <p className="text-sm">
                            <strong>Pages:</strong> {plan.pages_per_scan === -1 ? 'Unlimited' : plan.pages_per_scan} per scan
                          </p>
                          {plan.stripe_price_id && (
                            <p className="text-xs text-gray-500">
                              Stripe ID: {plan.stripe_price_id}
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
                        value={smtpConfig.host || ''}
                        onChange={(e) => {
                          const newConfig = { ...smtpConfig, host: e.target.value };
                          setAdminConfigs(prev => prev.map(c => 
                            c.id === 'smtp' ? { ...c, config_data: newConfig } : c
                          ));
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="smtpPort">Port</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={smtpConfig.port || 587}
                        onChange={(e) => {
                          const newConfig = { ...smtpConfig, port: parseInt(e.target.value) || 587 };
                          setAdminConfigs(prev => prev.map(c => 
                            c.id === 'smtp' ? { ...c, config_data: newConfig } : c
                          ));
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="smtpUsername">Username</Label>
                      <Input
                        id="smtpUsername"
                        value={smtpConfig.username || ''}
                        onChange={(e) => {
                          const newConfig = { ...smtpConfig, username: e.target.value };
                          setAdminConfigs(prev => prev.map(c => 
                            c.id === 'smtp' ? { ...c, config_data: newConfig } : c
                          ));
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={smtpConfig.fromEmail || ''}
                        onChange={(e) => {
                          const newConfig = { ...smtpConfig, fromEmail: e.target.value };
                          setAdminConfigs(prev => prev.map(c => 
                            c.id === 'smtp' ? { ...c, config_data: newConfig } : c
                          ));
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="fromName">From Name</Label>
                      <Input
                        id="fromName"
                        value={smtpConfig.fromName || ''}
                        onChange={(e) => {
                          const newConfig = { ...smtpConfig, fromName: e.target.value };
                          setAdminConfigs(prev => prev.map(c => 
                            c.id === 'smtp' ? { ...c, config_data: newConfig } : c
                          ));
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="encryption">Encryption</Label>
                      <Select 
                        value={smtpConfig.encryption || 'tls'} 
                        onValueChange={(value) => {
                          const newConfig = { ...smtpConfig, encryption: value };
                          setAdminConfigs(prev => prev.map(c => 
                            c.id === 'smtp' ? { ...c, config_data: newConfig } : c
                          ));
                        }}
                      >
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
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveConfig('smtp', smtpConfig)} 
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save SMTP Configuration"}
                </Button>
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
                      <Select 
                        value={billingConfig.provider || 'stripe'} 
                        onValueChange={(value) => {
                          const newConfig = { ...billingConfig, provider: value };
                          setAdminConfigs(prev => prev.map(c => 
                            c.id === 'billing' ? { ...c, config_data: newConfig } : c
                          ));
                        }}
                      >
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
                      <Select 
                        value={billingConfig.currency || 'USD'} 
                        onValueChange={(value) => {
                          const newConfig = { ...billingConfig, currency: value };
                          setAdminConfigs(prev => prev.map(c => 
                            c.id === 'billing' ? { ...c, config_data: newConfig } : c
                          ));
                        }}
                      >
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
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stripePublishable">Stripe Publishable Key</Label>
                      <Input
                        id="stripe Publishable"
                        type="text"
                        value={billingConfig.stripePublishableKey || ''}
                        onChange={(e) => {
                          const newConfig = { ...billingConfig, stripePublishableKey: e.target.value };
                          setAdminConfigs(prev => prev.map(c => 
                            c.id === 'billing' ? { ...c, config_data: newConfig } : c
                          ));
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="stripeSecret">Stripe Secret Key</Label>
                      <Input
                        id="stripeSecret"
                        type="password"
                        value={billingConfig.stripeSecretKey || ''}
                        onChange={(e) => {
                          const newConfig = { ...billingConfig, stripeSecretKey: e.target.value };
                          setAdminConfigs(prev => prev.map(c => 
                            c.id === 'billing' ? { ...c, config_data: newConfig } : c
                          ));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveConfig('billing', billingConfig)} 
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Billing Configuration"}
                </Button>
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
                  <Button onClick={isDemoMode ? loadDemoData : loadWebsiteContent}>
                    <Database className="w-4 h-4 mr-2" />
                    Refresh
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
                          <Badge variant={content.is_active ? "default" : "secondary"}>
                            {content.is_active ? "Active" : "Inactive"}
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
                      <span className="font-bold">${stats.monthlyRevenue.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Annual Run Rate</span>
                      <span className="font-bold">${(stats.monthlyRevenue * 12).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Revenue Per User</span>
                      <span className="font-bold">
                        ${stats.activeUsers > 0 ? (stats.monthlyRevenue / stats.activeUsers).toFixed(2) : '0.00'}
                      </span>
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
                        {users.filter(u => u.plan === 'free').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pro Users</span>
                      <span className="font-bold">
                        {users.filter(u => u.plan === 'pro').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Agency Users</span>
                      <span className="font-bold">
                        {users.filter(u => u.plan === 'agency').length}
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
                <Label htmlFor="userName">Full Name</Label>
                <Input
                  id="userName"
                  value={editingUser.full_name}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
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
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="userRole">Role</Label>
                <Select value={editingUser.role} onValueChange={(value: 'user' | 'admin') => 
                  setEditingUser({ ...editingUser, role: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="userStatus">Status</Label>
                <Select value={editingUser.plan_status} onValueChange={(value: 'active' | 'suspended' | 'cancelled') => 
                  setEditingUser({ ...editingUser, plan_status: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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

      {/* Edit Plan Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>Update plan configuration and features</DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="planName">Plan Name</Label>
                  <Input
                    id="planName"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="planPrice">Price ($)</Label>
                  <Input
                    id="planPrice"
                    type="number"
                    step="0.01"
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scansPerMonth">Scans per Month (-1 for unlimited)</Label>
                  <Input
                    id="scansPerMonth"
                    type="number"
                    value={editingPlan.scans_per_month}
                    onChange={(e) => setEditingPlan({ ...editingPlan, scans_per_month: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="pagesPerScan">Pages per Scan (-1 for unlimited)</Label>
                  <Input
                    id="pagesPerScan"
                    type="number"
                    value={editingPlan.pages_per_scan}
                    onChange={(e) => setEditingPlan({ ...editingPlan, pages_per_scan: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="stripePriceId">Stripe Price ID</Label>
                <Input
                  id="stripePriceId"
                  value={editingPlan.stripe_price_id || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, stripe_price_id: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  rows={4}
                  value={editingPlan.features.join('\n')}
                  onChange={(e) => setEditingPlan({ 
                    ...editingPlan, 
                    features: e.target.value.split('\n').filter(f => f.trim()) 
                  })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingPlan.is_active}
                  onCheckedChange={(checked) => setEditingPlan({ 
                    ...editingPlan, 
                    is_active: checked 
                  })}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={() => handleSavePlan(editingPlan)}>
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
                  checked={editingContent.is_active}
                  onCheckedChange={(checked) => setEditingContent({ 
                    ...editingContent, 
                    is_active: checked 
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