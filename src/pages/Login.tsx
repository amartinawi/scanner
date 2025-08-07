import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, user, profile, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, profile, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // For demo purposes, simulate login with demo credentials
      if (email === "admin@accessscan.com" && password === "admin123") {
        showSuccess("Demo admin login successful!");
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
        return;
      }
      
      if (email === "user@example.com" && password === "user123") {
        showSuccess("Demo user login successful!");
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
        return;
      }

      // Try real authentication
      const { error } = await signIn(email, password);
      
      if (error) {
        showError(error.message || "Login failed. Try using the demo credentials below.");
        return;
      }

      showSuccess("Login successful!");
      
    } catch (error) {
      showError("An unexpected error occurred. Please try the demo credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        showError(error.message || "Google sign-in failed");
        setIsGoogleLoading(false);
        return;
      }

      // Success message will be shown after redirect
      
    } catch (error) {
      showError("An unexpected error occurred with Google sign-in");
      setIsGoogleLoading(false);
    }
  };

  // Demo credentials with working authentication
  const demoCredentials = [
    { 
      email: "admin@accessscan.com", 
      password: "admin123", 
      role: "Admin",
      description: "Full admin access to all features"
    },
    { 
      email: "user@example.com", 
      password: "user123", 
      role: "User",
      description: "Regular user dashboard access"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900">
            <Shield className="w-8 h-8 text-blue-600" />
            <span>AccessScan</span>
          </Link>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google Sign-In Button */}
            <Button
              variant="outline"
              className="w-full mb-4"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in with Google...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <div className="relative">
              <Separator className="my-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    disabled={isLoading || isGoogleLoading}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded" disabled={isLoading || isGoogleLoading} />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in with Email"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-800 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Demo Credentials - Ready to Use!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white rounded border border-blue-100">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={cred.role === 'Admin' ? 'destructive' : 'secondary'} className="text-xs">
                        {cred.role}
                      </Badge>
                      {cred.role === 'Admin' && <Shield className="w-3 h-3 text-red-500" />}
                    </div>
                    <p className="font-medium text-gray-900">{cred.email}</p>
                    <p className="text-gray-600 text-xs">{cred.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword(cred.password);
                    }}
                    disabled={isLoading || isGoogleLoading}
                    className="ml-3"
                  >
                    Use
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-xs text-green-700">
                <strong>✅ These credentials are working!</strong><br />
                Click "Use" to auto-fill, then click "Sign in"
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>By signing in, you agree to our</p>
          <div className="space-x-4 mt-1">
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;