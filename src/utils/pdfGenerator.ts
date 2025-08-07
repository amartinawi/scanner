import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

export const generatePDFReport = async (scanResult: ScanResult): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.35);
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Header
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Accessibility Scan Report', margin, yPosition);
    yPosition += 15;

    // Website info
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    yPosition = addText(`Website: ${scanResult.url}`, margin, yPosition, pageWidth - 2 * margin, 12);
    yPosition = addText(`Scan Date: ${new Date(scanResult.timestamp).toLocaleDateString()}`, margin, yPosition, pageWidth - 2 * margin, 12);
    yPosition = addText(`Pages Scanned: ${scanResult.pagesScanned}`, margin, yPosition, pageWidth - 2 * margin, 12);
    yPosition += 10;

    // Score section
    checkNewPage(30);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Accessibility Score', margin, yPosition);
    yPosition += 10;

    // Score box
    const scoreColor = scanResult.score >= 90 ? [34, 197, 94] : scanResult.score >= 70 ? [234, 179, 8] : [239, 68, 68];
    pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.rect(margin, yPosition, 40, 20, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(scanResult.score.toString(), margin + 15, yPosition + 13);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Accessibility Score', margin + 50, yPosition + 8);
    
    const scoreDescription = scanResult.score >= 90 ? 'Excellent accessibility' :
                           scanResult.score >= 70 ? 'Good accessibility with room for improvement' :
                           scanResult.score >= 50 ? 'Fair accessibility, needs attention' :
                           'Poor accessibility, immediate action required';
    pdf.text(scoreDescription, margin + 50, yPosition + 16);
    yPosition += 30;

    // Issues summary
    checkNewPage(40);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Issues Summary', margin, yPosition);
    yPosition += 10;

    const summaryData = [
      { label: 'Critical', count: scanResult.critical, color: [239, 68, 68] },
      { label: 'Serious', count: scanResult.serious, color: [249, 115, 22] },
      { label: 'Moderate', count: scanResult.moderate, color: [234, 179, 8] },
      { label: 'Minor', count: scanResult.minor, color: [34, 197, 94] }
    ];

    summaryData.forEach((item, index) => {
      const x = margin + (index * 40);
      pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
      pdf.rect(x, yPosition, 30, 15, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(item.count.toString(), x + 12, yPosition + 10);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text(item.label, x + 2, yPosition + 22);
    });
    yPosition += 35;

    // Issues list
    checkNewPage(20);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Detailed Issues', margin, yPosition);
    yPosition += 15;

    scanResult.issues.forEach((issue, index) => {
      checkNewPage(40);
      
      // Issue header
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      const severityColor = issue.severity === 'critical' ? [239, 68, 68] :
                           issue.severity === 'serious' ? [249, 115, 22] :
                           issue.severity === 'moderate' ? [234, 179, 8] : [34, 197, 94];
      
      pdf.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
      pdf.rect(margin, yPosition, 20, 6, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text(issue.severity.toUpperCase(), margin + 2, yPosition + 4);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.text(`${issue.description}`, margin + 25, yPosition + 4);
      yPosition += 10;

      // Issue details
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      yPosition = addText(`Rule: ${issue.rule} (WCAG ${issue.wcagLevel})`, margin, yPosition, pageWidth - 2 * margin, 10);
      yPosition = addText(`Element: ${issue.element}`, margin, yPosition, pageWidth - 2 * margin, 10);
      yPosition = addText(`Page: ${issue.page}`, margin, yPosition, pageWidth - 2 * margin, 10);
      yPosition = addText(`Fix: ${issue.fix}`, margin, yPosition, pageWidth - 2 * margin, 10);
      yPosition += 5;
    });

    // Recommendations
    checkNewPage(50);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recommendations', margin, yPosition);
    yPosition += 15;

    const recommendations = [
      'Test your website with screen readers like NVDA or JAWS',
      'Verify keyboard navigation works properly throughout the site',
      'Consider hiring an accessibility expert for a manual audit',
      'Set up regular automated scans to catch new issues',
      'Train your development team on accessibility best practices',
      'Create an accessibility statement for your website'
    ];

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    recommendations.forEach((rec, index) => {
      checkNewPage(8);
      yPosition = addText(`• ${rec}`, margin, yPosition, pageWidth - 2 * margin, 10);
      yPosition += 2;
    });

    // Footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated by AccessScan - Page ${i} of ${totalPages}`, margin, pageHeight - 10);
      pdf.text(`Report generated on ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, pageHeight - 10);
    }

    // Generate filename
    const urlObj = new URL(scanResult.url);
    const domain = urlObj.hostname.replace('www.', '');
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `accessibility-report-${domain}-${dateStr}.pdf`;

    // Save the PDF
    pdf.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};

export const generateSimplePDFReport = async (scanResult: ScanResult): Promise<void> => {
  try {
    const pdf = new jsPDF();
    
    // Simple text-based report for faster generation
    pdf.setFontSize(20);
    pdf.text('Accessibility Scan Report', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Website: ${scanResult.url}`, 20, 50);
    pdf.text(`Scan Date: ${new Date(scanResult.timestamp).toLocaleDateString()}`, 20, 60);
    pdf.text(`Pages Scanned: ${scanResult.pagesScanned}`, 20, 70);
    pdf.text(`Accessibility Score: ${scanResult.score}/100`, 20, 80);
    
    pdf.text(`Issues Found:`, 20, 100);
    pdf.text(`• Critical: ${scanResult.critical}`, 30, 110);
    pdf.text(`• Serious: ${scanResult.serious}`, 30, 120);
    pdf.text(`• Moderate: ${scanResult.moderate}`, 30, 130);
    pdf.text(`• Minor: ${scanResult.minor}`, 30, 140);
    
    // Generate filename
    const urlObj = new URL(scanResult.url);
    const domain = urlObj.hostname.replace('www.', '');
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `accessibility-report-${domain}-${dateStr}.pdf`;
    
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating simple PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};