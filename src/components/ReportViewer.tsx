import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  CheckCircle, 
  Download, 
  Share2, 
  Calendar,
  Globe,
  TrendingUp,
  AlertTriangle,
  Info,
  Loader2
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { generatePDFReport, generateSimplePDFReport } from "@/utils/pdfGenerator";

interface Issue {
  id: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  rule: string;
  description: string;
  element: string;
  page: string;
  fix: string;
  wcagLevel: string;
}

interface ScanResult {
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
}

interface ReportViewerProps {
  results: ScanResult;
  onDownloadPDF?: () => void;
  onShare?: () => void;
}

const ReportViewer = ({ results, onDownloadPDF, onShare }: ReportViewerProps) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "serious": return "destructive";
      case "moderate": return "secondary";
      case "minor": return "outline";
      default: return "outline";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "serious": return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "moderate": return <Info className="w-4 h-4 text-yellow-500" />;
      case "minor": return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return "Excellent accessibility";
    if (score >= 70) return "Good accessibility with room for improvement";
    if (score >= 50) return "Fair accessibility, needs attention";
    return "Poor accessibility, immediate action required";
  };

  const filteredIssues = selectedSeverity === "all" 
    ? results.issues 
    : results.issues.filter(issue => issue.severity === selectedSeverity);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    
    try {
      showSuccess("Generating PDF report...");
      
      // Use the detailed PDF generator
      await generatePDFReport(results);
      
      showSuccess("PDF report downloaded successfully!");
      
      // Call the optional callback
      if (onDownloadPDF) {
        onDownloadPDF();
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      showError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Accessibility Report for ${results.url}`,
        text: `Accessibility scan results: Score ${results.score}/100 with ${results.totalIssues} issues found.`,
        url: window.location.href
      }).then(() => {
        showSuccess("Report shared successfully!");
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        showSuccess("Report link copied to clipboard!");
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      showSuccess("Report link copied to clipboard!");
    }
    
    if (onShare) {
      onShare();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Accessibility Scan Report</CardTitle>
              <CardDescription className="flex items-center space-x-4 text-base">
                <span className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>{results.url}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(results.timestamp)}</span>
                </span>
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="pt-6 text-center">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(results.score)}`}>
              {results.score}
            </div>
            <p className="text-sm text-gray-600 mb-2">Accessibility Score</p>
            <p className="text-xs text-gray-500">{getScoreDescription(results.score)}</p>
            <div className="mt-4">
              <Progress value={results.score} className="w-full" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {results.critical}
            </div>
            <p className="text-sm text-gray-600">Critical</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {results.serious}
            </div>
            <p className="text-sm text-gray-600">Serious</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {results.moderate}
            </div>
            <p className="text-sm text-gray-600">Moderate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {results.minor}
            </div>
            <p className="text-sm text-gray-600">Minor</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{results.totalIssues}</div>
              <p className="text-sm text-gray-600">Total Issues Found</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{results.pagesScanned}</div>
              <p className="text-sm text-gray-600">Pages Scanned</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {Math.round((results.totalIssues / results.pagesScanned) * 10) / 10}
              </div>
              <p className="text-sm text-gray-600">Avg Issues per Page</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Issues</CardTitle>
          <CardDescription>
            Detailed list of accessibility violations found during the scan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({results.totalIssues})</TabsTrigger>
              <TabsTrigger value="critical">Critical ({results.critical})</TabsTrigger>
              <TabsTrigger value="serious">Serious ({results.serious})</TabsTrigger>
              <TabsTrigger value="moderate">Moderate ({results.moderate})</TabsTrigger>
              <TabsTrigger value="minor">Minor ({results.minor})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedSeverity} className="space-y-4 mt-6">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>No {selectedSeverity === "all" ? "" : selectedSeverity} issues found!</p>
                </div>
              ) : (
                filteredIssues.map((issue) => (
                  <Card key={issue.id} className="border-l-4 border-l-gray-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getSeverityIcon(issue.severity)}
                          <Badge variant={getSeverityColor(issue.severity)}>
                            {issue.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            WCAG {issue.wcagLevel}
                          </Badge>
                          <span className="text-sm text-gray-500 font-mono">
                            {issue.rule}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-lg mb-2">{issue.description}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <strong className="text-gray-700">Element:</strong>
                          <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                            {issue.element}
                          </code>
                        </div>
                        <div>
                          <strong className="text-gray-700">Page:</strong>
                          <span className="ml-2 text-blue-600">{issue.page}</span>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">
                          💡 How to fix this issue:
                        </h5>
                        <p className="text-blue-800 text-sm">{issue.fix}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.critical > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">🚨 Critical Issues</h4>
                <p className="text-red-800 text-sm">
                  Address critical accessibility issues immediately as they prevent users from accessing content.
                </p>
              </div>
            )}
            
            {results.serious > 0 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">⚠️ Serious Issues</h4>
                <p className="text-orange-800 text-sm">
                  Fix serious issues to ensure your website is usable by people with disabilities.
                </p>
              </div>
            )}
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">✅ Next Steps</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Test your website with screen readers</li>
                <li>• Verify keyboard navigation works properly</li>
                <li>• Consider hiring an accessibility expert for a manual audit</li>
                <li>• Set up regular automated scans to catch new issues</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportViewer;