export interface AccessibilityRule {
  id: string;
  rule: string;
  title: string;
  description: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriterion: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  category: 'color' | 'keyboard' | 'images' | 'forms' | 'structure' | 'navigation' | 'multimedia' | 'content';
  fixes: string[];
  elements: string[];
  impact: string;
  helpUrl: string;
  testMethod: 'automated' | 'manual' | 'both';
}

export const ACCESSIBILITY_RULES: AccessibilityRule[] = [
  // Critical Issues
  {
    id: 'color-contrast',
    rule: 'color-contrast',
    title: 'Color Contrast',
    description: 'Elements must have sufficient color contrast',
    wcagLevel: 'AA',
    wcagCriterion: '1.4.3',
    severity: 'critical',
    category: 'color',
    fixes: [
      'Increase contrast ratio to at least 4.5:1 for normal text',
      'Use darker colors for text or lighter backgrounds',
      'Test with color contrast analyzers like WebAIM or Colour Contrast Analyser',
      'Consider using high contrast mode for better accessibility'
    ],
    elements: ['button.primary', 'a.nav-link', 'p.text-light', '.hero-text', 'span.label', '.card-text'],
    impact: 'Users with visual impairments cannot read low-contrast text',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
    testMethod: 'automated'
  },
  {
    id: 'keyboard-trap',
    rule: 'keyboard-trap',
    title: 'No Keyboard Trap',
    description: 'Page must not have keyboard traps',
    wcagLevel: 'A',
    wcagCriterion: '2.1.2',
    severity: 'critical',
    category: 'keyboard',
    fixes: [
      'Ensure users can navigate away from modal using keyboard',
      'Provide visible close button accessible via keyboard',
      'Implement proper focus management in dynamic content',
      'Test all interactive elements with Tab and Shift+Tab'
    ],
    elements: ['div.modal', 'div.popup', 'div.overlay', 'div.lightbox', 'div.dropdown-menu'],
    impact: 'Keyboard users become trapped and cannot navigate the page',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html',
    testMethod: 'manual'
  },
  {
    id: 'missing-alt-text',
    rule: 'image-alt',
    title: 'Images Must Have Alt Text',
    description: 'Images must have alternative text',
    wcagLevel: 'A',
    wcagCriterion: '1.1.1',
    severity: 'serious',
    category: 'images',
    fixes: [
      'Add descriptive alt attributes to all images',
      'Use empty alt="" for decorative images',
      'Describe the content and function of the image, not just appearance',
      'For complex images, provide detailed descriptions nearby'
    ],
    elements: ['img.hero-image', 'img.product-photo', 'img.logo', 'img.gallery-item', 'img.avatar', 'img.chart'],
    impact: 'Screen reader users cannot understand image content',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
    testMethod: 'automated'
  },
  {
    id: 'form-labels',
    rule: 'label',
    title: 'Form Labels',
    description: 'Form inputs must have associated labels',
    wcagLevel: 'A',
    wcagCriterion: '1.3.1',
    severity: 'serious',
    category: 'forms',
    fixes: [
      'Associate labels with form controls using "for" attribute',
      'Use aria-label for inputs without visible labels',
      'Provide clear, descriptive label text',
      'Group related form fields with fieldset and legend'
    ],
    elements: ['input#search', 'input.email-field', 'textarea.message', 'select.country', 'input[type="checkbox"]'],
    impact: 'Users cannot understand what information to enter in form fields',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html',
    testMethod: 'automated'
  },
  
  // Serious Issues
  {
    id: 'heading-order',
    rule: 'heading-order',
    title: 'Heading Structure',
    description: 'Heading levels should only increase by one',
    wcagLevel: 'AA',
    wcagCriterion: '1.3.1',
    severity: 'moderate',
    category: 'structure',
    fixes: [
      'Use headings in sequential order (h1, h2, h3)',
      'Don\'t skip heading levels for visual styling',
      'Use CSS for visual styling, not heading levels',
      'Ensure each page has exactly one h1 element'
    ],
    elements: ['h3.section-title', 'h4.card-header', 'h2.page-title', 'h5.sidebar-title', 'h3.article-title'],
    impact: 'Screen reader users cannot navigate content structure effectively',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
    testMethod: 'automated'
  },
  {
    id: 'focus-visible',
    rule: 'focus-visible',
    title: 'Focus Indicators',
    description: 'Interactive elements must have visible focus indicators',
    wcagLevel: 'AA',
    wcagCriterion: '2.4.7',
    severity: 'moderate',
    category: 'keyboard',
    fixes: [
      'Add visible focus styles to all interactive elements',
      'Ensure focus indicators have sufficient contrast (3:1 minimum)',
      'Don\'t remove default focus styles without replacement',
      'Make focus indicators at least 2px thick'
    ],
    elements: ['button.cta', 'a.menu-item', 'input.form-control', 'select.dropdown', 'button.icon-only'],
    impact: 'Keyboard users cannot see which element has focus',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html',
    testMethod: 'manual'
  },
  {
    id: 'aria-labels',
    rule: 'aria-label',
    title: 'ARIA Labels',
    description: 'Elements with ARIA roles must have accessible names',
    wcagLevel: 'A',
    wcagCriterion: '4.1.2',
    severity: 'serious',
    category: 'content',
    fixes: [
      'Add aria-label or aria-labelledby to elements with ARIA roles',
      'Ensure ARIA labels are descriptive and meaningful',
      'Use proper ARIA roles for custom components',
      'Test with screen readers to verify ARIA implementation'
    ],
    elements: ['div[role="button"]', 'span[role="tab"]', 'div[role="dialog"]', 'nav[role="navigation"]', 'div[role="alert"]'],
    impact: 'Screen readers cannot identify the purpose of interactive elements',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
    testMethod: 'automated'
  },
  
  // Moderate Issues
  {
    id: 'link-purpose',
    rule: 'link-name',
    title: 'Link Purpose',
    description: 'Links must have descriptive text or accessible names',
    wcagLevel: 'A',
    wcagCriterion: '2.4.4',
    severity: 'moderate',
    category: 'navigation',
    fixes: [
      'Avoid generic link text like "click here" or "read more"',
      'Make link text descriptive of the destination',
      'Use aria-label for links with non-descriptive text',
      'Provide context for links that open in new windows'
    ],
    elements: ['a.read-more', 'a.learn-more', 'a.click-here', 'a.download-link', 'a.social-link'],
    impact: 'Users cannot understand where links will take them',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html',
    testMethod: 'automated'
  },
  {
    id: 'page-title',
    rule: 'document-title',
    title: 'Page Title',
    description: 'Pages must have descriptive titles',
    wcagLevel: 'A',
    wcagCriterion: '2.4.2',
    severity: 'minor',
    category: 'navigation',
    fixes: [
      'Ensure each page has a unique, descriptive title',
      'Include the site name in the title',
      'Keep titles concise but informative (under 60 characters)',
      'Put the most important information first'
    ],
    elements: ['title', 'h1.page-heading'],
    impact: 'Users cannot identify page content from browser tabs or bookmarks',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html',
    testMethod: 'automated'
  },
  {
    id: 'language-attribute',
    rule: 'html-has-lang',
    title: 'Language Attribute',
    description: 'HTML elements must have a valid lang attribute',
    wcagLevel: 'A',
    wcagCriterion: '3.1.1',
    severity: 'minor',
    category: 'content',
    fixes: [
      'Add lang="en" (or appropriate language) to html element',
      'Use lang attributes for content in different languages',
      'Ensure language codes are valid ISO codes',
      'Update lang attribute when page language changes dynamically'
    ],
    elements: ['html', 'div.foreign-text', 'span.quote', 'blockquote.testimonial'],
    impact: 'Screen readers cannot pronounce content correctly',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
    testMethod: 'automated'
  },
  
  // Additional comprehensive rules
  {
    id: 'skip-link',
    rule: 'skip-link',
    title: 'Skip Navigation',
    description: 'Pages should provide a way to skip repetitive content',
    wcagLevel: 'A',
    wcagCriterion: '2.4.1',
    severity: 'moderate',
    category: 'navigation',
    fixes: [
      'Add a "Skip to main content" link at the beginning of the page',
      'Make skip links visible when focused',
      'Ensure skip links actually work and move focus correctly',
      'Consider multiple skip links for complex layouts'
    ],
    elements: ['a.skip-link', 'a.skip-to-content', 'nav.skip-navigation'],
    impact: 'Keyboard users must tab through all navigation on every page',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html',
    testMethod: 'manual'
  },
  {
    id: 'video-captions',
    rule: 'video-caption',
    title: 'Video Captions',
    description: 'Videos must have captions for audio content',
    wcagLevel: 'A',
    wcagCriterion: '1.2.2',
    severity: 'serious',
    category: 'multimedia',
    fixes: [
      'Provide accurate captions for all spoken content',
      'Include sound effects and music descriptions in captions',
      'Ensure captions are synchronized with audio',
      'Use proper caption formatting and timing'
    ],
    elements: ['video', 'iframe[src*="youtube"]', 'iframe[src*="vimeo"]', 'audio'],
    impact: 'Deaf and hard-of-hearing users cannot access audio content',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html',
    testMethod: 'manual'
  },
  {
    id: 'table-headers',
    rule: 'table-headers',
    title: 'Table Headers',
    description: 'Data tables must have proper header associations',
    wcagLevel: 'A',
    wcagCriterion: '1.3.1',
    severity: 'moderate',
    category: 'structure',
    fixes: [
      'Use th elements for table headers',
      'Associate headers with data cells using scope attribute',
      'Use caption element to describe table purpose',
      'Consider using thead, tbody, and tfoot for complex tables'
    ],
    elements: ['table', 'th', 'td', 'table.data-table'],
    impact: 'Screen reader users cannot understand table relationships',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
    testMethod: 'automated'
  },
  {
    id: 'error-identification',
    rule: 'error-message',
    title: 'Error Identification',
    description: 'Form errors must be clearly identified and described',
    wcagLevel: 'A',
    wcagCriterion: '3.3.1',
    severity: 'serious',
    category: 'forms',
    fixes: [
      'Clearly identify which fields have errors',
      'Provide specific error messages explaining the problem',
      'Use aria-describedby to associate errors with form fields',
      'Don\'t rely solely on color to indicate errors'
    ],
    elements: ['input.error', 'div.error-message', 'span.field-error', 'form .invalid'],
    impact: 'Users cannot understand what went wrong with form submission',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html',
    testMethod: 'automated'
  },
  {
    id: 'resize-text',
    rule: 'meta-viewport',
    title: 'Text Resize',
    description: 'Text must be resizable up to 200% without loss of functionality',
    wcagLevel: 'AA',
    wcagCriterion: '1.4.4',
    severity: 'moderate',
    category: 'content',
    fixes: [
      'Don\'t prevent zooming with viewport meta tag',
      'Use relative units (em, rem, %) instead of fixed pixels',
      'Test your site at 200% zoom level',
      'Ensure all functionality remains available when zoomed'
    ],
    elements: ['meta[name="viewport"]', 'body', 'div.container', 'p', 'span'],
    impact: 'Users with visual impairments cannot enlarge text to read it',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html',
    testMethod: 'manual'
  }
];

export const getRandomRules = (count: number = 5): AccessibilityRule[] => {
  const shuffled = [...ACCESSIBILITY_RULES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getRulesByCategory = (category: AccessibilityRule['category']): AccessibilityRule[] => {
  return ACCESSIBILITY_RULES.filter(rule => rule.category === category);
};

export const getRulesBySeverity = (severity: AccessibilityRule['severity']): AccessibilityRule[] => {
  return ACCESSIBILITY_RULES.filter(rule => rule.severity === severity);
};

export const calculateAccessibilityScore = (issues: Array<{ severity: string }>): number => {
  const weights = {
    critical: 20,
    serious: 12,
    moderate: 6,
    minor: 3
  };
  
  const totalDeductions = issues.reduce((sum, issue) => {
    return sum + (weights[issue.severity as keyof typeof weights] || 0);
  }, 0);
  
  // Start with 100 and deduct points
  const baseScore = Math.max(15, 100 - totalDeductions);
  
  // Add some realistic variation based on total issues
  const issueCount = issues.length;
  const variation = Math.max(-5, Math.min(5, (10 - issueCount) * 0.5));
  
  return Math.max(0, Math.min(100, Math.round(baseScore + variation)));
};