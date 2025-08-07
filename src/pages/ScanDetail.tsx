import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Calendar,
  Globe,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Info,
  ExternalLink,
  Copy
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import ReportViewer from "@/components/ReportViewer";

interface Issue {
  id: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  rule: string;
  description: string;
  element: string;
  page: string;
  fix: string;
  wcagLevel: string;
  impact: string;
  helpUrl: string;
}

interface ScanResult {
  id: string;
  url: string;
  score: number;
  totalIssues: number;
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
  pagesScanned: number;
  issues: Issue[];
  timestamp: string;
  scanDuration: number;
  userAgent: string;
}

const ScanDetail = () => {
  const { scanId } = useParams();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch scan details
    setTimeout(() => {
      const mockScanResult: ScanResult = {
        id: scanId || "1",
        url: "https://example.com",
        score: 78,
        totalIssues: 15,
        critical: 3,
        serious: 5,
        moderate: 4,
        minor: 3,
        pagesScanned: 5,
        scanDuration: 45,
        userAgent: "AccessScan Bot 1.0",
        timestamp: new Date().toISOString(),
        issues: [
          {
            id: "1",
            severity: "critical",
            rule: "color-contrast",
            description: "Elements must have sufficient color contrast",
            element: "button.primary",
            page: "/",
            fix: "Increase contrast ratio to at least 4.5:1 for normal text",
            wcagLevel: "AA",
            impact: "serious",
            helpUrl: "https://dequeuniversity.com/rules/axe/4.4/color-contrast"
          },
          {
            id: "2",
            severity: "critical",
            rule: "keyboard-trap",
            description: "Page must not have keyboard traps",
            element: "div.modal",
            page: "/contact",
            fix: "Ensure users can navigate away from modal using keyboard",
            wcagLevel: "A",
            impact: "critical",
            helpUrl: "https://dequeuniversity.com/rules/axe/4.4/no-keyboard-trap"
          },
          {
            id: "3",
            severity: "serious",
            rule: "alt-text",
            description: "Images must have alternative text",
            element: "img.hero-image",
            page: "/about",
            fix: "Add descriptive alt attribute to image",
            wcagLevel: "A",
            impact: "critical",
            helpUrl: "https://dequeuniversity.com/rules/axe/4.4/image-alt"
          },
          {
            id: "4",
            severity: "serious",
            rule: "form-labels",
            description: "Form elements must have labels",
            element: "input#search",
            page: "/",
            fix: "Associate label with form control using 'for' attribute",
            wcagLevel: "A",
            impact: "critical",
            helpUrl: "https://dequeuniversity.com/rules/axe/4.4/label"
          },
          {
            id: "5",
            severity: "moderate",
            rule: "heading-order",
            description: "Heading levels should only increase by one",
            element: "h3.section-title",
            page: "/services",
            fix: "Change h3 to h2 or add intermediate h2",
            wcagLevel: "AA",
            impact: "moderate",
            helpUrl: "https://dequeuniversity.com/rules/axe/4.4/heading-order"
          }
        ]
      };
      
      setScanResult(mockScanResult);
      setIsLoading(false);
    }, 1000);
  }, [scanId]);

  const handleDownloadPDF = () => {
    showSuccess("PDF report will be generated and downloaded");
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    showSuccess("Report link copied to clipboard");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scan results...</p>
        </div>
      </div>
    );
  }

  if (!scanResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Scan not found</h1>
          <p className="text-gray-600 mb-4">The requested scan could not be found.</p>
          <Link to="/dashboard">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Scan Results</h1>
                <p className="text-sm text-gray-500">Scan ID: {scanResult.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scan Metadata */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Website</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-600">{scanResult.url}</p>
                    <button
                      onClick={() => copyToClipboard(scanResult.url)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <a
                      href={scanResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Scanned</p>
                  <p className="text-sm text-gray-600">
                    {new Date(scanResult.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Duration</p>
                  <p className="text-sm text-gray-600">{scanResult.scanDuration}s</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Pages</p>
                  <p className="text-sm text-gray-600">{scanResult.pagesScanned} scanned</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Viewer */}
        <ReportViewer 
          results={scanResult}
          onDownloadPDF={handleDownloadPDF}
          onShare={handleShare}
        />

        {/* Additional Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Actions you can take to improve your website's accessibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Schedule Regular Scans</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Set up automated weekly scans to catch new issues
                  </div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Export Issues to CSV</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Download a spreadsheet for your development team
                  </div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Get Expert Help</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Connect with accessibility consultants
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ScanDetail;