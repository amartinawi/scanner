import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Globe, Loader2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

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

interface ScannerEngineProps {
  onScanComplete?: (results: ScanResult) => void;
  maxPages?: number;
}

const ScannerEngine = ({ onScanComplete, maxPages = 5 }: ScannerEngineProps) => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  // Mock accessibility rules database
  const accessibilityRules = [
    {
      rule: "color-contrast",
      description: "Elements must have sufficient color contrast",
      wcagLevel: "AA",
      severity: "critical" as const,
      fixes: [
        "Increase contrast ratio to at least 4.5:1 for normal text",
        "Use darker colors for text or lighter backgrounds",
        "Test with color contrast analyzers"
      ]
    },
    {
      rule: "alt-text",
      description: "Images must have alternative text",
      wcagLevel: "A",
      severity: "serious" as const,
      fixes: [
        "Add descriptive alt attributes to all images",
        "Use empty alt='' for decorative images",
        "Describe the content and function of the image"
      ]
    },
    {
      rule: "heading-order",
      description: "Heading levels should only increase by one",
      wcagLevel: "AA",
      severity: "moderate" as const,
      fixes: [
        "Use headings in sequential order (h1, h2, h3)",
        "Don't skip heading levels",
        "Use CSS for visual styling, not heading levels"
      ]
    },
    {
      rule: "keyboard-navigation",
      description: "All interactive elements must be keyboard accessible",
      wcagLevel: "A",
      severity: "critical" as const,
      fixes: [
        "Ensure all buttons and links are focusable",
        "Add proper tabindex values",
        "Test navigation with Tab key only"
      ]
    },
    {
      rule: "form-labels",
      description: "Form inputs must have associated labels",
      wcagLevel: "A",
      severity: "serious" as const,
      fixes: [
        "Associate labels with form controls using 'for' attribute",
        "Use aria-label for inputs without visible labels",
        "Provide clear, descriptive label text"
      ]
    }
  ];

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const simulatePageScan = async (pageUrl: string, pageIndex: number): Promise<Issue[]> => {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate random issues for demo
    const issues: Issue[] = [];
    const numIssues = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < numIssues; i++) {
      const rule = accessibilityRules[Math.floor(Math.random() * accessibilityRules.length)];
      const issue: Issue = {
        id: `${pageIndex}-${i}`,
        severity: rule.severity,
        rule: rule.rule,
        description: rule.description,
        element: `element-${Math.floor(Math.random() * 100)}`,
        page: pageUrl,
        fix: rule.fixes[Math.floor(Math.random() * rule.fixes.length)],
        wcagLevel: rule.wcagLevel
      };
      issues.push(issue);
    }
    
    return issues;
  };

  const calculateScore = (issues: Issue[]): number => {
    const weights = {
      critical: 10,
      serious: 5,
      moderate: 2,
      minor: 1
    };
    
    const totalDeductions = issues.reduce((sum, issue) => {
      return sum + weights[issue.severity];
    }, 0);
    
    // Start with 100 and deduct points
    const score = Math.max(0, 100 - totalDeductions);
    return Math.round(score);
  };

  const handleScan = async () => {
    if (!url) {
      showError("Please enter a valid URL");
      return;
    }

    if (!validateUrl(url)) {
      showError("Please enter a valid URL (including http:// or https://)");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setCurrentStep("Initializing scan...");

    try {
      // Step 1: Discover pages
      setCurrentStep("Discovering pages...");
      setScanProgress(10);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock page discovery
      const pages = [
        url,
        `${url}/about`,
        `${url}/services`,
        `${url}/contact`,
        `${url}/blog`
      ].slice(0, maxPages);

      // Step 2: Scan each page
      const allIssues: Issue[] = [];
      
      for (let i = 0; i < pages.length; i++) {
        setCurrentStep(`Scanning page ${i + 1} of ${pages.length}...`);
        setScanProgress(20 + (i / pages.length) * 70);
        
        const pageIssues = await simulatePageScan(pages[i], i);
        allIssues.push(...pageIssues);
      }

      // Step 3: Generate report
      setCurrentStep("Generating report...");
      setScanProgress(95);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Calculate statistics
      const issueStats = allIssues.reduce((stats, issue) => {
        stats[issue.severity]++;
        return stats;
      }, { critical: 0, serious: 0, moderate: 0, minor: 0 });

      const results: ScanResult = {
        url,
        score: calculateScore(allIssues),
        totalIssues: allIssues.length,
        critical: issueStats.critical,
        serious: issueStats.serious,
        moderate: issueStats.moderate,
        minor: issueStats.minor,
        pagesScanned: pages.length,
        issues: allIssues,
        timestamp: new Date().toISOString()
      };

      setScanProgress(100);
      setCurrentStep("Scan completed!");
      
      if (onScanComplete) {
        onScanComplete(results);
      }
      
      showSuccess(`Scan completed! Found ${allIssues.length} accessibility issues.`);
      
    } catch (error) {
      showError("An error occurred during scanning. Please try again.");
      console.error("Scan error:", error);
    } finally {
      setIsScanning(false);
      setTimeout(() => {
        setScanProgress(0);
        setCurrentStep("");
      }, 2000);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <span>Accessibility Scanner</span>
        </CardTitle>
        <CardDescription>
          Enter a website URL to scan for WCAG 2.1 AA compliance issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScanning}
            className="flex-1"
          />
          <Button 
            onClick={handleScan} 
            disabled={isScanning || !url}
            className="px-6"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Scan Now
              </>
            )}
          </Button>
        </div>

        {isScanning && (
          <div className="space-y-2">
            <Progress value={scanProgress} className="w-full" />
            <p className="text-sm text-gray-600 text-center">
              {currentStep}
            </p>
            <div className="text-xs text-gray-500 text-center">
              Scanning up to {maxPages} pages for accessibility issues...
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>This scanner checks for:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Color contrast ratios (WCAG AA)</li>
            <li>Alternative text for images</li>
            <li>Keyboard navigation support</li>
            <li>Form label associations</li>
            <li>Heading structure and hierarchy</li>
            <li>ARIA attributes and roles</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScannerEngine;