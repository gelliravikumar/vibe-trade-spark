
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/common/Loader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { AlertCircle, CreditCard, ExternalLink, Shield, Zap, CheckCircle2, Wallet } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { AssetTable } from '@/components/markets/AssetTable';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RealTrading = () => {
  const { isLoading } = useData();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <PageLoader />
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-8/12 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl font-bold">Real Trading</h1>
              <Button className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Add Funds
              </Button>
            </div>
            
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important Notice</AlertTitle>
              <AlertDescription>
                Real trading involves financial risk. Never invest more than you can afford to lose. 
                Please ensure you understand the risks before proceeding.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-amber-500">
                    <Shield className="mr-2 h-5 w-5" />
                    <span className="text-lg font-medium">Verification Required</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline" className="w-full">Complete Verification</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center">
                    <Wallet className="mr-2 h-5 w-5 text-primary" />
                    ₹0.00
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="w-full">Deposit Funds</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Trading Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-destructive">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span className="text-lg font-medium">Disabled</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline" className="w-full" disabled>
                    Requires Verification
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Tabs defaultValue="verify">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="verify">Verify Account</TabsTrigger>
                <TabsTrigger value="deposit">Deposit Funds</TabsTrigger>
                <TabsTrigger value="trade">Start Trading</TabsTrigger>
                <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              </TabsList>
              
              <TabsContent value="verify" className="p-4 border rounded-lg mt-4">
                <h3 className="text-lg font-medium mb-4">Complete Your Verification</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted rounded-full p-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">1. Create Account</h4>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-muted rounded-full p-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">2. Identity Verification</h4>
                      <p className="text-sm text-muted-foreground">Upload your ID documents</p>
                      <Button size="sm" className="mt-2">Start Verification</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-muted rounded-full p-2">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">3. Bank Account Verification</h4>
                      <p className="text-sm text-muted-foreground">Link your bank account</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-muted rounded-full p-2">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">4. Complete Risk Assessment</h4>
                      <p className="text-sm text-muted-foreground">Answer a few questions about trading</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="deposit" className="p-4 border rounded-lg mt-4">
                <h3 className="text-lg font-medium mb-4">Deposit Methods</h3>
                <p className="text-muted-foreground mb-4">Account verification required before making a deposit</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" /> UPI Payment
                      </CardTitle>
                      <CardDescription>Fast and secure</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button disabled className="w-full">Verify Account First</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Wallet className="mr-2 h-5 w-5" /> Bank Transfer
                      </CardTitle>
                      <CardDescription>NEFT/RTGS/IMPS</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button disabled className="w-full">Verify Account First</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="trade" className="p-4 border rounded-lg mt-4">
                <div className="text-center p-6">
                  <Zap className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Ready to start real trading?</h3>
                  <p className="text-muted-foreground mb-4">Complete verification, add funds, and start trading real assets.</p>
                  <Button className="mr-2">Complete Verification</Button>
                  <Button variant="outline">Try Paper Trading</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="withdraw" className="p-4 border rounded-lg mt-4">
                <h3 className="text-lg font-medium mb-4">Withdraw Funds</h3>
                <p className="text-muted-foreground mb-4">Account verification required before withdrawing</p>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Funds Available</AlertTitle>
                  <AlertDescription>
                    You don't have any funds available for withdrawal. Deposit funds and complete verification first.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="w-full md:w-4/12 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Why Trade With Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Secure Platform</h4>
                    <p className="text-sm text-muted-foreground">Advanced security measures to protect your assets</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Low Fees</h4>
                    <p className="text-sm text-muted-foreground">Competitive trading fees starting at just 0.05%</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Multiple Payment Options</h4>
                    <p className="text-sm text-muted-foreground">Deposit via UPI, bank transfer, and more</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <ExternalLink className="h-4 w-4" /> Learn More
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
                <CardDescription>Popular trading assets</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <AssetTable type="ALL" showSearch={false} compact={true} limit={5} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RealTrading;
