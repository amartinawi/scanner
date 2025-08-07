import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  X, 
  Shield, 
  Zap, 
  Users, 
  Download,
  BarChart3,
  Clock,
  Mail,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out",
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: {
        scansPerMonth: 1,
        pagesPerScan: 3,
        pdfReports: false,
        scanHistory: false,
        prioritySupport: false,
        apiAccess: false,
        whiteLabel: false,
        teamCollaboration: false,
        customBranding: false,
        sla: false
      },
      limitations: [
        "Basic web report only",
        "Email support",
        "Community forum access"
      ]
    },
    {
      name: "Pro",
      description: "For small businesses",
      monthlyPrice: 19,
      annualPrice: 190, // ~17/month
      popular: true,
      features: {
        scansPerMonth: 10,
        pagesPerScan: 25,
        pdfReports: true,
        scanHistory: true,
        prioritySupport: true,
        apiAccess: false,
        whiteLabel: false,
        teamCollaboration: false,
        customBranding: false,
        sla: false
      },
      limitations: [
        "PDF & web reports",
        "Priority email support",
        "Scan comparison tools"
      ]
    },
    {
      name: "Agency",
      description: "For agencies & teams",
      monthlyPrice: 49,
      annualPrice: 490, // ~41/month
      popular: false,
      features: {
        scansPerMonth: "Unlimited",
        pagesPerScan: "Unlimited",
        pdfReports: true,
        scanHistory: true,
        prioritySupport: true,
        apiAccess: true,
        whiteLabel: true,
        teamCollaboration: true,
        customBranding: true,
        sla: true
      },
      limitations: [
        "White-label reports",
        "Phone & email support",
        "99.9% uptime SLA",
        "Custom integrations"
      ]
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return "$0";
    const price = isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice;
    return `$${Math.round(price)}`;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.annualPrice;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return percentage > 0 ? `Save ${percentage}%` : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AccessScan</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your accessibility scanning needs. 
            All plans include our core scanning features and WCAG 2.1 AA compliance checking.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual
            </span>
            <Badge variant="secondary" className="ml-2">Save up to 20%</Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-blue-500 border-2' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{getPrice(plan)}</span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-gray-500 ml-1">/month</span>
                    )}
                  </div>
                  {isAnnual && getSavings(plan) && (
                    <Badge variant="outline" className="mt-2">
                      {getSavings(plan)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-sm">
                      {typeof plan.features.scansPerMonth === 'number' 
                        ? `${plan.features.scansPerMonth} scan${plan.features.scansPerMonth !== 1 ? 's' : ''} per month`
                        : `${plan.features.scansPerMonth} scans`
                      }
                    </span>
                  </li>
                  
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-sm">
                      Up to {plan.features.pagesPerScan} pages per scan
                    </span>
                  </li>
                  
                  <li className="flex items-center">
                    {plan.features.pdfReports ? (
                      <Check className="w-4 h-4 text-green-500 mr-3" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mr-3" />
                    )}
                    <span className={`text-sm ${!plan.features.pdfReports ? 'text-gray-400' : ''}`}>
                      PDF reports
                    </span>
                  </li>
                  
                  <li className="flex items-center">
                    {plan.features.scanHistory ? (
                      <Check className="w-4 h-4 text-green-500 mr-3" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mr-3" />
                    )}
                    <span className={`text-sm ${!plan.features.scanHistory ? 'text-gray-400' : ''}`}>
                      Scan history & comparison
                    </span>
                  </li>
                  
                  <li className="flex items-center">
                    {plan.features.prioritySupport ? (
                      <Check className="w-4 h-4 text-green-500 mr-3" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mr-3" />
                    )}
                    <span className={`text-sm ${!plan.features.prioritySupport ? 'text-gray-400' : ''}`}>
                      Priority support
                    </span>
                  </li>
                  
                  {plan.features.apiAccess && (
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3" />
                      <span className="text-sm">API access</span>
                    </li>
                  )}
                  
                  {plan.features.whiteLabel && (
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3" />
                      <span className="text-sm">White-label reports</span>
                    </li>
                  )}
                  
                  {plan.features.teamCollaboration && (
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3" />
                      <span className="text-sm">Team collaboration</span>
                    </li>
                  )}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.name === 'Free' ? 'Get Started' : 
                   plan.name === 'Agency' ? 'Contact Sales' : 'Start Free Trial'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
            <CardDescription>
              Compare all features across our plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Free</th>
                    <th className="text-center py-3 px-4">Pro</th>
                    <th className="text-center py-3 px-4">Agency</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Scans per month</td>
                    <td className="text-center py-3 px-4">1</td>
                    <td className="text-center py-3 px-4">10</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Pages per scan</td>
                    <td className="text-center py-3 px-4">3</td>
                    <td className="text-center py-3 px-4">25</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">WCAG 2.1 AA scanning</td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">PDF reports</td>
                    <td className="text-center py-3 px-4"><X className="w-4 h-4 text-gray-300 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Scan history</td>
                    <td className="text-center py-3 px-4"><X className="w-4 h-4 text-gray-300 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">API access</td>
                    <td className="text-center py-3 px-4"><X className="w-4 h-4 text-gray-300 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><X className="w-4 h-4 text-gray-300 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">White-label reports</td>
                    <td className="text-center py-3 px-4"><X className="w-4 h-4 text-gray-300 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><X className="w-4 h-4 text-gray-300 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Support</td>
                    <td className="text-center py-3 px-4">Email</td>
                    <td className="text-center py-3 px-4">Priority Email</td>
                    <td className="text-center py-3 px-4">Phone & Email</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-2">What accessibility standards do you check?</h4>
                <p className="text-sm text-gray-600 mb-4">
                  We check against WCAG 2.1 AA standards, which are the most widely adopted accessibility guidelines and required for ADA compliance.
                </p>
                
                <h4 className="font-medium mb-2">Can I upgrade or downgrade my plan?</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.
                </p>
                
                <h4 className="font-medium mb-2">Do you offer refunds?</h4>
                <p className="text-sm text-gray-600">
                  We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">How accurate are the scans?</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Our scans use industry-standard tools and catch 80-90% of accessibility issues. We recommend combining automated scans with manual testing for complete coverage.
                </p>
                
                <h4 className="font-medium mb-2">Can I scan password-protected sites?</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Currently, we only scan publicly accessible pages. Support for authenticated scanning is coming soon for Pro and Agency plans.
                </p>
                
                <h4 className="font-medium mb-2">Do you provide implementation help?</h4>
                <p className="text-sm text-gray-600">
                  Agency plan customers get access to our accessibility consultants who can provide guidance on fixing issues and implementing best practices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to make your website accessible?
          </h3>
          <p className="text-gray-600 mb-8">
            Start with a free scan and see how we can help improve your website's accessibility.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                Try Free Scan
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;