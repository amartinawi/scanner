import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Globe, Zap, Shield, Download } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

const Index = () => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  const handleScan = async () => {
    if (!url) {
      showError("Please enter a valid URL");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      setScanProgress(100);
      
      // Mock scan results
      const mockResults = {
        url: url,
        score: 78,
        totalIssues: 12,
        critical: 2,
        serious: 4,
        moderate: 4,
        minor: 2,
        pagesScanned: 3,
        issues: [
          {
            id: 1,
            severity: "critical",
            rule: "color-contrast",
            description: "Elements must have sufficient color contrast",
            element: "button.primary",
            page: "/",
            fix: "Increase contrast ratio to at least 4.5:1"
          },
          {
            id: 2,
            severity: "serious",
            rule: "alt-text",
            description: "Images must have alternative text",
            element: "img.hero-image",
            page: "/about",
            fix: "Add descriptive alt attribute to image"
          },
          {
            id: 3,
            severity: "moderate",
            rule: "heading-order",
            description: "Heading levels should only increase by one",
            element: "h3.section-title",
            page: "/services",
            fix: "Change h3 to h2 or add intermediate h2"
          }
        ]
      };
      
      setScanResults(mockResults);
      setIsScanning(false);
      showSuccess("Scan completed successfully!");
    }, 3000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "destructive";
      case "serious": return "destructive";
      case "moderate": return "secondary";
      case "minor": return "outline";
      default: return "outline";
    }
  };

  const getSeverityIcon = (severity) => {
    return severity === "critical" || severity === "serious" ? 
      <AlertCircle className="w-4 h-4" /> : 
      <CheckCircle className="w-4 h-4" />;
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
              <Button variant="ghost">Sign In</Button>
              <Button>Get Started</Button>
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
          
          {/* Scanner Input */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Free Accessibility Scan</span>
              </CardTitle>
              <CardDescription>
                Enter your website URL to get started with a free accessibility audit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleScan} 
                  disabled={isScanning}
                  className="px-8"
                >
                  {isScanning ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Scan Now
                    </>
                  )}
                </Button>
              </div>
              
              {isScanning && (
                <div className="mt-4">
                  <Progress value={scanProgress} className="w-full" />
                  <p className="text-sm text-gray-600 mt-2">
                    Scanning your website for accessibility issues...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scan Results */}
        {scanResults && (
          <div className="mb-12">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Scan Results</CardTitle>
                    <CardDescription className="text-lg">
                      {scanResults.url} • {scanResults.pagesScanned} pages scanned
                    </CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Score Overview */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {scanResults.score}
                      </div>
                      <p className="text-sm text-gray-600">Accessibility Score</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-red-600 mb-2">
                        {scanResults.critical}
                      </div>
                      <p className="text-sm text-gray-600">Critical Issues</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        {scanResults.serious}
                      </div>
                      <p className="text-sm text-gray-600">Serious Issues</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">
                        {scanResults.moderate}
                      </div>
                      <p className="text-sm text-gray-600">Moderate Issues</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {scanResults.minor}
                      </div>
                      <p className="text-sm text-gray-600">Minor Issues</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Issues List */}
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All Issues</TabsTrigger>
                    <TabsTrigger value="critical">Critical</TabsTrigger>
                    <TabsTrigger value="serious">Serious</TabsTrigger>
                    <TabsTrigger value="moderate">Moderate</TabsTrigger>
                    <TabsTrigger value="minor">Minor</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    {scanResults.issues.map((issue) => (
                      <Card key={issue.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getSeverityIcon(issue.severity)}
                                <Badge variant={getSeverityColor(issue.severity)}>
                                  {issue.severity.toUpperCase()}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {issue.rule}
                                </span>
                              </div>
                              <h4 className="font-semibold mb-2">{issue.description}</h4>
                              <div className="text-sm text-gray-600 mb-2">
                                <strong>Element:</strong> <code className="bg-gray-100 px-1 rounded">{issue.element}</code>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                <strong>Page:</strong> {issue.page}
                              </div>
                              <div className="text-sm">
                                <strong>How to fix:</strong> {issue.fix}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>Fast Scanning</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get comprehensive accessibility reports in seconds using industry-standard tools.
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
                <ul className="space-y-2 text-sm">
                  <li>• 1 scan per month</li>
                  <li>• Up to 3 pages</li>
                  <li>• Basic report</li>
                  <li>• Email support</li>
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-blue-500 border-2">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For small businesses</CardDescription>
                <div className="text-3xl font-bold">$19<span className="text-sm">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 10 scans per month</li>
                  <li>• Up to 25 pages</li>
                  <li>• PDF reports</li>
                  <li>• Scan history</li>
                  <li>• Priority support</li>
                </ul>
                <Button className="w-full mt-4">
                  Start Free Trial
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
                <ul className="space-y-2 text-sm">
                  <li>• Unlimited scans</li>
                  <li>• Unlimited pages</li>
                  <li>• White-label reports</li>
                  <li>• Team collaboration</li>
                  <li>• API access</li>
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
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
                <li>Features</li>
                <li>Pricing</li>
                <li>API</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>WCAG Guidelines</li>
                <li>Blog</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Status</li>
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