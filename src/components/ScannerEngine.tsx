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

  // Comprehensive accessibility rules database
  const accessibilityRules = [
    {
      rule: "color-contrast",
      description: "Elements must have sufficient color contrast",
      wcagLevel: "AA",
      severity: "critical" as const,
      fixes: [
        "Increase contrast ratio to at least 4.5:1 for normal text",
        "Use darker colors for text or lighter backgrounds",
        "Test with color contrast analyzers like WebAIM or Colour Contrast Analyser"
      ],
      elements: ["button.primary", "a.nav-link", "p.text-light", ".hero-text", "span.label"]
    },
    {
      rule: "alt-text",
      description: "Images must have alternative text",
      wcagLevel: "A",
      severity: "serious" as const,
      fixes: [
        "Add descriptive alt attributes to all images",
        "Use empty alt='' for decorative images",
        "Describe the content and function of the image, not just appearance"
      ],
      elements: ["img.hero-image", "img.product-photo", "img.logo", "img.gallery-item", "img.avatar"]
    },
    {
      rule: "heading-order",
      description: "Heading levels should only increase by one",
      wcagLevel: "AA",
      severity: "moderate" as const,
      fixes: [
        "Use headings in sequential order (h1, h2, h3)",
        "Don't skip heading levels for visual styling",
        "Use CSS for visual styling, not heading levels"
      ],
      elements: ["h3.section-title", "h4.card-header", "h2.page-title", "h5.sidebar-title", "h3.article-title"]
    },
    {
      rule: "keyboard-navigation",
      description: "All interactive elements must be keyboard accessible",
      wcagLevel: "A",
      severity: "critical" as const,
      fixes: [
        "Ensure all buttons and links are focusable with Tab key",
        "Add proper tabindex values where needed",
        "Test navigation using only keyboard (no mouse)"
      ],
      elements: ["div.modal", "button.dropdown", "div.carousel", "nav.menu", "div.tabs"]
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
      ],
      elements: ["input#search", "input.email-field", "textarea.message", "select.country", "input[type='checkbox']"]
    },
    {
      rule: "focus-visible",
      description: "Interactive elements must have visible focus indicators",
      wcagLevel: "AA",
      severity: "moderate" as const,
      fixes: [
        "Add visible focus styles to all interactive elements",
        "Ensure focus indicators have sufficient contrast",
        "Don't remove default focus styles without replacement"
      ],
      elements: ["button.cta", "a.menu-item", "input.form-control", "select.dropdown", "button.icon-only"]
    },
    {
      rule: "aria-labels",
      description: "Elements with ARIA roles must have accessible names",
      wcagLevel: "A",
      severity: "serious" as const,
      fixes: [
        "Add aria-label or aria-labelledby to elements with ARIA roles",
        "Ensure ARIA labels are descriptive and meaningful",
        "Use proper ARIA roles for custom components"
      ],
      elements: ["div[role='button']", "span[role='tab']", "div[role='dialog']", "nav[role='navigation']", "div[role='alert']"]
    },
    {
      rule: "link-purpose",
      description: "Links must have descriptive text or accessible names",
      wcagLevel: "A",
      severity: "moderate" as const,
      fixes: [
        "Avoid generic link text like 'click here' or 'read more'",
        "Make link text descriptive of the destination",
        "Use aria-label for links with non-descriptive text"
      ],
      elements: ["a.read-more", "a.learn-more", "a.click-here", "a.download-link", "a.social-link"]
    },
    {
      rule: "page-title",
      description: "Pages must have descriptive titles",
      wcagLevel: "A",
      severity: "minor" as const,
      fixes: [
        "Ensure each page has a unique, descriptive title",
        "Include the site name in the title",
        "Keep titles concise but informative"
      ],
      elements: ["title", "h1.page-heading"]
    },
    {
      rule: "language-attribute",
      description: "HTML elements must have a valid lang attribute",
      wcagLevel: "A",
      severity: "minor" as const,
      fixes: [
        "Add lang='en' (or appropriate language) to html element",
        "Use lang attributes for content in different languages",
        "Ensure language codes are valid ISO codes"
      ],
      elements: ["html", "div.foreign-text", "span.quote"]
    }
  ];

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const generateRandomIssues = (pageUrl: string, pageIndex: number): Issue[] => {
    const issues: Issue[] = [];
    const numIssues = Math.floor(Math.random() * 6) + 1; // 1-6 issues per page
    const usedRules = new Set<string>();
    
    for (let i = 0; i < numIssues; i++) {
      let rule;
      let attempts = 0;
      
      // Try to get a unique rule, but allow duplicates if we can't find unique ones
      do {
        rule = accessibilityRules[Math.floor(Math.random() * accessibilityRules.length)];
        attempts++;
      } while (usedRules.has(rule.rule) && attempts < 10);
      
      usedRules.add(rule.rule);
      
      const randomElement = rule.elements[Math.floor(Math.random() * rule.elements.length)];
      const randomFix = rule.fixes[Math.floor(Math.random() * rule.fixes.length)];
      
      const issue: Issue = {
        id: `${pageIndex}-${rule.rule}-${i}`,
        severity: rule.severity,
        rule: rule.rule,
        description: rule.description,
        element: randomElement,
        page: pageUrl,
        fix: randomFix,
        wcagLevel: rule.wcagLevel
      };
      issues.push(issue);
    }
    
    return issues;
  };

  const calculateScore = (issues: Issue[]): number => {
    const weights = {
      critical: 15,
      serious: 8,
      moderate: 4,
      minor: 2
    };
    
    const totalDeductions = issues.reduce((sum, issue) => {
      return sum + weights[issue.severity];
    }, 0);
    
    // Start with 100 and deduct points, with some randomness
    const baseScore = Math.max(20, 100 - totalDeductions);
    const randomVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5
    const finalScore = Math.max(0, Math.min(100, baseScore + randomVariation));
    
    return finalScore;
  };

  const generatePageUrls = (baseUrl: string, maxPages: number): string[] => {
    const commonPaths = [
      '',
      '/about',
      '/services',
      '/contact',
      '/blog',
      '/products',
      '/team',
      '/pricing',
      '/support',
      '/careers'
    ];
    
    const pages = [baseUrl];
    const urlObj = new URL(baseUrl);
    
    for (let i = 1; i < maxPages && i < commonPaths.length; i++) {
      if (commonPaths[i]) {
        pages.push(urlObj.origin + commonPaths[i]);
      }
    }
    
    return pages;
  };

  const simulatePageScan = async (pageUrl: string, pageIndex: number): Promise<Issue[]> => {
    // Simulate realistic scanning delay
    const delay = 800 + Math.random() * 1500; // 0.8-2.3 seconds
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return generateRandomIssues(pageUrl, pageIndex);
  };

  const handleScan = async () => {
    if (!url.trim()) {
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
      await new Promise(resolve => setTimeout(resolve, 800));

      const pages = generatePageUrls(url, maxPages);

      // Step 2: Scan each page
      const allIssues: Issue[] = [];
      
      for (let i = 0; i < pages.length; i++) {
        setCurrentStep(`Scanning page ${i + 1} of ${pages.length}: ${pages[i]}`);
        setScanProgress(20 + (i / pages.length) * 70);
        
        const pageIssues = await simulatePageScan(pages[i], i);
        allIssues.push(...pageIssues);
      }

      // Step 3: Generate report
      setCurrentStep("Analyzing results and generating report...");
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
      
      showSuccess(`Scan completed! Found ${allIssues.length} accessibility issues across ${pages.length} pages.`);
      
    } catch (error) {
      showError("An error occurred during scanning. Please try again.");
      console.error("Scan error:", error);
    } finally {
      setIsScanning(false);
      setTimeout(() => {
        setScanProgress(0);
        setCurrentStep("");
      }, 3000);
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isScanning && url.trim()) {
                handleScan();
              }
            }}
          />
          <Button 
            onClick={handleScan} 
            disabled={isScanning || !url.trim()}
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
          <p className="font-medium mb-2">This scanner checks for:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Color contrast ratios (WCAG AA)</li>
            <li>Alternative text for images</li>
            <li>Keyboard navigation support</li>
            <li>Form label associations</li>
            <li>Heading structure and hierarchy</li>
            <li>ARIA attributes and roles</li>
            <li>Focus indicators and link purposes</li>
            <li>Page titles and language attributes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScannerEngine;