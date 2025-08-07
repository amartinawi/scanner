import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Globe, Zap, Shield, Download, ArrowRight } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { Link, useNavigate } from "react-router-dom";
import ScannerEngine from "@/components/ScannerEngine";
import ReportViewer from "@/components/ReportViewer";

interface ScanResult {
  url: string;
  score: number;
  totalIssues: number;
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
  pagesScanned: number;
  issues: Array<{
    id: string;
    severity: 'critical' | 'serious' | 'moderate' | 'minor';
    rule: string;
    description: string;
    element: string;
    page: string;
    fix: string;
    wcagLevel: string;
  }>;
  timestamp: string;
}

const Index = () => {
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const navigate = useNavigate();

  const handleScanComplete = (results: ScanResult) => {
    setScanResults(results);
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('scan-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDownloadPDF = () => {
    if (!scanResults) return;
    
    // In a real app, this would generate and download a PDF
    showSuccess("PDF report generation started. Download will begin shortly.");
    
    // Simulate PDF generation
    setTimeout(() => {
      showSuccess("PDF report downloaded successfully!");
    }, 2000);
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleStartFreeTrial = () => {
    navigate('/signup');
  };

  const handleContactSales = () => {
    showSuccess("Redirecting to contact form...");
    // In real app: navigate('/contact') or open contact modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AccessScan</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleSignIn}>Sign In</Button>
              <Button onClick={handleGetStarted}>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Make Your Website Accessible to Everyone
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Scan your website for ADA/WCAG compliance issues and get actionable reports 
            to improve accessibility for all users.
          </p>
          
          {/* Scanner Component */}
          <ScannerEngine onScanComplete={handleScanComplete} maxPages={3} />
        </div>

        {/* Scan Results */}
        {scanResults && (
          <div id="scan-results" className="mb-12">
            <ReportViewer 
              results={scanResults} 
              onDownloadPDF={handleDownloadPDF}
              onShare={() => showSuccess("Report link copied to clipboard!")}
            />
          </div>
        )}

        {/* Features Section */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>Fast Scanning</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get comprehensive accessibility reports in seconds using industry-standard tools like axe-core.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>WCAG Compliant</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Ensure your website meets WCAG 2.1 AA standards and ADA compliance requirements.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-purple-600" />
                <span>Detailed Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Download professional PDF reports with actionable fixes for your development team.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Simple, Transparent Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for trying out</CardDescription>
                <div className="text-3xl font-bold">$0</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-6">
                  <li>• 1 scan per month</li>
                  <li>• Up to 3 pages</li>
                  <li>• Basic web report</li>
                  <li>• Email support</li>
                </ul>
                <Button className="w-full" variant="outline" onClick={handleGetStarted}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-blue-500 border-2 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For small businesses</CardDescription>
                <div className="text-3xl font-bold">$19<span className="text-sm">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-6">
                  <li>• 10 scans per month</li>
                  <li>• Up to 25 pages</li>
                  <li>• PDF reports</li>
                  <li>• Scan history</li>
                  <li>• Priority support</li>
                </ul>
                <Button className="w-full" onClick={handleStartFreeTrial}>
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Agency</CardTitle>
                <CardDescription>For agencies & teams</CardDescription>
                <div className="text-3xl font-bold">$49<span className="text-sm">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-6">
                  <li>• Unlimited scans</li>
                  <li>• Unlimited pages</li>
                  <li>• White-label reports</li>
                  <li>• Team collaboration</li>
                  <li>• API access</li>
                </ul>
                <Button className="w-full" variant="outline" onClick={handleContactSales}>
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <Link to="/pricing">
              <Button variant="ghost" className="text-blue-600">
                View detailed pricing comparison
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Trusted by thousands of websites
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-2xl font-bold text-gray-400">TechCorp</div>
            <div className="text-2xl font-bold text-gray-400">StartupXYZ</div>
            <div className="text-2xl font-bold text-gray-400">NonProfit</div>
            <div className="text-2xl font-bold text-gray-400">Agency Co</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6" />
                <span className="text-xl font-bold">AccessScan</span>
              </div>
              <p className="text-gray-400">
                Making the web accessible for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><button className="hover:text-white">API</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white">Documentation</button></li>
                <li><button className="hover:text-white">WCAG Guidelines</button></li>
                <li><button className="hover:text-white">Blog</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white">Help Center</button></li>
                <li><button className="hover:text-white">Contact Us</button></li>
                <li><button className="hover:text-white">Status</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AccessScan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;