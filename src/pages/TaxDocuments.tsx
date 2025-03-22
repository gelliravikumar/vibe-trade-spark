
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  FileSpreadsheet,
  FilePdf,
  DownloadCloud,
  Mail,
  Printer,
  Calculator,
  HelpCircle,
  Check,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';

// Sample tax statements
const taxStatements = [
  {
    id: 1,
    type: "P&L Statement",
    year: "FY 2023-24",
    date: "2024-03-31",
    format: "PDF",
    size: "1.2 MB"
  },
  {
    id: 2,
    type: "Capital Gains Statement",
    year: "FY 2023-24",
    date: "2024-03-31",
    format: "XLSX",
    size: "845 KB"
  },
  {
    id: 3,
    type: "Transaction Statement",
    year: "FY 2023-24",
    date: "2024-03-31",
    format: "PDF",
    size: "2.1 MB"
  },
  {
    id: 4,
    type: "Contract Notes",
    year: "FY 2023-24",
    date: "2024-03-31",
    format: "ZIP",
    size: "4.8 MB"
  },
  {
    id: 5,
    type: "P&L Statement",
    year: "FY 2022-23",
    date: "2023-03-31",
    format: "PDF",
    size: "1.1 MB"
  },
  {
    id: 6,
    type: "Capital Gains Statement",
    year: "FY 2022-23",
    date: "2023-03-31",
    format: "XLSX",
    size: "756 KB"
  }
];

// Sample tax forms
const taxForms = [
  {
    id: 1,
    name: "Form 10D - CAS Statement Request",
    description: "Request for Consolidated Account Statement from depositories",
    format: "PDF",
    size: "125 KB"
  },
  {
    id: 2,
    name: "Form ITR-2 - Income Tax Return",
    description: "For individuals having income from capital gains",
    format: "PDF",
    size: "350 KB"
  },
  {
    id: 3,
    name: "Form 26AS - Tax Credit Statement",
    description: "Annual Tax Statement showing tax deducted at source",
    format: "PDF",
    size: "210 KB"
  },
  {
    id: 4,
    name: "Form 15G/15H - TDS Exemption",
    description: "Declaration for not deducting tax at source",
    format: "PDF",
    size: "180 KB"
  }
];

// Sample tax rates
const taxRates = [
  {
    category: "Short Term Capital Gains (Equity)",
    rate: "15%",
    applicability: "Equity shares and equity-oriented mutual funds held for less than 12 months",
    section: "111A"
  },
  {
    category: "Long Term Capital Gains (Equity)",
    rate: "10% above ₹1 lakh",
    applicability: "Equity shares and equity-oriented mutual funds held for more than 12 months",
    section: "112A"
  },
  {
    category: "Short Term Capital Gains (Non-Equity)",
    rate: "As per income tax slab",
    applicability: "Debt funds, gold, property held for less than 36 months",
    section: "Slab rates"
  },
  {
    category: "Long Term Capital Gains (Non-Equity)",
    rate: "20% with indexation",
    applicability: "Debt funds, gold, property held for more than 36 months",
    section: "112"
  },
  {
    category: "Intraday Trading",
    rate: "As per income tax slab",
    applicability: "Speculative business income from intraday equity trading",
    section: "Slab rates"
  },
  {
    category: "F&O Trading",
    rate: "As per income tax slab",
    applicability: "Non-speculative business income from F&O trading",
    section: "Slab rates"
  }
];

const TaxDocuments = () => {
  const [selectedYear, setSelectedYear] = useState<string>("FY 2023-24");
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tax statements based on year and search query
  const filteredStatements = taxStatements.filter(statement => {
    return statement.year === selectedYear && 
           (statement.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
            statement.format.toLowerCase().includes(searchQuery.toLowerCase()));
  });
  
  const handleDownload = (id: number, type: string) => {
    toast.success(`${type} has been downloaded successfully.`);
  };
  
  const handleGenerateStatement = () => {
    toast.success("Your custom tax statement is being generated. You'll receive an email when it's ready.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <FileText className="h-8 w-8 mr-3 text-primary" />
                  Tax Documents
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  Access and download your tax statements, forms, and other documents needed for income tax filing in India.
                </p>
              </div>
              
              <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
                <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FY 2023-24">FY 2023-24</SelectItem>
                    <SelectItem value="FY 2022-23">FY 2022-23</SelectItem>
                    <SelectItem value="FY 2021-22">FY 2021-22</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search documents..."
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="statements">
              <TabsList className="mb-6">
                <TabsTrigger value="statements" className="flex items-center gap-1">
                  <FileSpreadsheet className="h-4 w-4" />
                  Tax Statements
                </TabsTrigger>
                <TabsTrigger value="forms" className="flex items-center gap-1">
                  <FilePdf className="h-4 w-4" />
                  Tax Forms
                </TabsTrigger>
                <TabsTrigger value="calculator" className="flex items-center gap-1">
                  <Calculator className="h-4 w-4" />
                  Tax Calculator
                </TabsTrigger>
                <TabsTrigger value="info" className="flex items-center gap-1">
                  <HelpCircle className="h-4 w-4" />
                  Tax Information
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="statements">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Your Tax Statements</CardTitle>
                    <CardDescription>
                      Download your trading activity statements for income tax filing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredStatements.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Statement Type</TableHead>
                            <TableHead>Financial Year</TableHead>
                            <TableHead>Generated Date</TableHead>
                            <TableHead>Format</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredStatements.map((statement) => (
                            <TableRow key={statement.id}>
                              <TableCell className="font-medium">{statement.type}</TableCell>
                              <TableCell>{statement.year}</TableCell>
                              <TableCell>{statement.date}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{statement.format}</Badge>
                              </TableCell>
                              <TableCell>{statement.size}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="flex items-center gap-1"
                                    onClick={() => handleDownload(statement.id, statement.type)}
                                  >
                                    <Download className="h-4 w-4" />
                                    <span className="hidden sm:inline">Download</span>
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="flex items-center gap-1"
                                    onClick={() => toast.success(`${statement.type} has been sent to your registered email.`)}
                                  >
                                    <Mail className="h-4 w-4" />
                                    <span className="hidden sm:inline">Email</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No statements found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery ? 
                            `No statements match your search criteria.` : 
                            `No tax statements are available for ${selectedYear}.`}
                        </p>
                        {searchQuery && (
                          <Button onClick={() => setSearchQuery('')}>
                            Clear Search
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Generate Custom Statement</CardTitle>
                    <CardDescription>
                      Create a custom statement for specific date ranges or transaction types
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Statement Type</label>
                        <Select defaultValue="pnl">
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pnl">P&L Statement</SelectItem>
                            <SelectItem value="capitalgains">Capital Gains</SelectItem>
                            <SelectItem value="transactions">Transactions</SelectItem>
                            <SelectItem value="contractnotes">Contract Notes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">From Date</label>
                        <Input type="date" defaultValue="2023-04-01" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">To Date</label>
                        <Input type="date" defaultValue="2024-03-31" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Format</label>
                        <Select defaultValue="pdf">
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Additional Options</label>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="include-charges" className="rounded border-gray-300" />
                          <label htmlFor="include-charges">Include Charges & Taxes</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="include-unrealized" className="rounded border-gray-300" />
                          <label htmlFor="include-unrealized">Include Unrealized P&L</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="separate-segments" className="rounded border-gray-300" />
                          <label htmlFor="separate-segments">Separate by Segments</label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button variant="outline">Reset</Button>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex items-center gap-1">
                        <Printer className="h-4 w-4" />
                        <span>Print</span>
                      </Button>
                      <Button className="flex items-center gap-1" onClick={handleGenerateStatement}>
                        <DownloadCloud className="h-4 w-4" />
                        <span>Generate Statement</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="forms">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {taxForms.map((form) => (
                    <Card key={form.id}>
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{form.name}</CardTitle>
                          <Badge variant="outline">{form.format}</Badge>
                        </div>
                        <CardDescription>{form.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Size: {form.size}</span>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => handleDownload(form.id, form.name)}
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => toast.success(`Form instructions have been sent to your email.`)}
                            >
                              <HelpCircle className="h-4 w-4" />
                              Instructions
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>ITR Filing Guide for Traders</CardTitle>
                    <CardDescription>
                      Essential information for filing income tax returns as a trader in India
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Check className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Which ITR Form to Use?</h3>
                          <p className="text-sm text-muted-foreground">
                            <strong>ITR-2:</strong> For individuals with capital gains from stocks and mutual funds.<br />
                            <strong>ITR-3:</strong> If you classify your trading as a business activity (intraday/F&O).<br />
                            <strong>ITR-4:</strong> For traders with presumptive income under 44AD/44ADA.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Check className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Documents Required</h3>
                          <p className="text-sm text-muted-foreground">
                            <strong>For all traders:</strong> P&L Statement, Balance Sheet (for business), Capital Gains Statement, Form 26AS<br />
                            <strong>Additional:</strong> Contract Notes, Bank Statements, Demat Transaction Statements
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 rounded-lg border bg-warning/10">
                        <div className="bg-warning/20 p-2 rounded-full">
                          <AlertCircle className="h-6 w-6 text-warning" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Important Deadlines</h3>
                          <p className="text-sm text-muted-foreground">
                            <strong>Regular filing:</strong> July 31st of the assessment year<br />
                            <strong>For audit cases:</strong> October 31st of the assessment year<br />
                            <strong>Belated return:</strong> December 31st of the assessment year
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => toast.success("ITR Filing Guide has been sent to your email.")}
                    >
                      Email Guide
                    </Button>
                    <Button 
                      onClick={() => handleDownload(0, "Complete ITR Filing Guide")}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download Complete Guide
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="calculator">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Capital Gains Tax Calculator</CardTitle>
                    <CardDescription>
                      Calculate your tax liability on stock and mutual fund investments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Investment Type</label>
                          <Select defaultValue="equity">
                            <SelectTrigger>
                              <SelectValue placeholder="Select investment type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equity">Equity Shares</SelectItem>
                              <SelectItem value="equity_mf">Equity Mutual Funds</SelectItem>
                              <SelectItem value="debt_mf">Debt Mutual Funds</SelectItem>
                              <SelectItem value="gold">Gold ETFs/Bonds</SelectItem>
                              <SelectItem value="real_estate">Real Estate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Holding Period</label>
                          <Select defaultValue="long_term">
                            <SelectTrigger>
                              <SelectValue placeholder="Select holding period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="long_term">Long Term (>1 year for equity, >3 years for others)</SelectItem>
                              <SelectItem value="short_term">Short Term</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Purchase Value (₹)</label>
                          <Input type="number" placeholder="Enter purchase value" defaultValue="100000" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Selling Value (₹)</label>
                          <Input type="number" placeholder="Enter selling value" defaultValue="150000" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Purchase Date</label>
                          <Input type="date" defaultValue="2022-01-01" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Selling Date</label>
                          <Input type="date" defaultValue="2023-02-01" />
                        </div>
                        
                        <Button className="w-full">Calculate Tax</Button>
                      </div>
                      
                      <div className="bg-muted/20 p-6 rounded-lg space-y-6">
                        <h3 className="text-lg font-medium">Tax Calculation Results</h3>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Purchase Value:</span>
                            <span className="font-medium">₹1,00,000</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Selling Value:</span>
                            <span className="font-medium">₹1,50,000</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Capital Gains:</span>
                            <span className="font-medium">₹50,000</span>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax Rate:</span>
                            <span className="font-medium">10% (LTCG for Equity above ₹1 lakh exemption)</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Exemption Amount:</span>
                            <span className="font-medium">₹1,00,000</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Taxable Amount:</span>
                            <span className="font-medium">₹0</span>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Tax Payable:</span>
                            <span className="text-xl font-bold">₹0</span>
                          </div>
                          
                          <div className="p-3 bg-primary/10 rounded-md text-sm text-muted-foreground">
                            <p>
                              <strong>Note:</strong> Long-term capital gains from equity and equity mutual funds up to ₹1,00,000 in a financial year are exempt from tax. This is just an estimate - please consult a tax professional for specific advice.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Other Tax Calculators</CardTitle>
                    <CardDescription>
                      Additional tools to help you estimate your tax liability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-muted/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Income Tax Calculator</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-3">
                            Calculate your total income tax liability based on all income sources.
                          </p>
                          <Button className="w-full">Use Calculator</Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">F&O Trading Tax Calculator</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-3">
                            Calculate your tax liability for futures and options trading income.
                          </p>
                          <Button className="w-full">Use Calculator</Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Advance Tax Calculator</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-3">
                            Determine your quarterly advance tax payment amounts and due dates.
                          </p>
                          <Button className="w-full">Use Calculator</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="info">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Tax Rates & Information for Indian Traders</CardTitle>
                    <CardDescription>
                      Current tax rates and rules applicable to different trading activities in India
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Category</TableHead>
                          <TableHead>Tax Rate</TableHead>
                          <TableHead>Applicability</TableHead>
                          <TableHead>Section</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {taxRates.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.category}</TableCell>
                            <TableCell>{item.rate}</TableCell>
                            <TableCell className="text-sm">{item.applicability}</TableCell>
                            <TableCell>{item.section}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Securities Transaction Tax (STT)</CardTitle>
                      <CardDescription>
                        Applicable STT rates for different transaction types
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                          <span>Equity Delivery (Buy)</span>
                          <span>0.1%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                          <span>Equity Delivery (Sell)</span>
                          <span>0.1%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                          <span>Equity Intraday (Sell only)</span>
                          <span>0.025%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                          <span>Futures (Sell only)</span>
                          <span>0.01%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                          <span>Options (Sell only - Premium)</span>
                          <span>0.05%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                          <span>Options (Exercise)</span>
                          <span>0.125%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Important Tax Deadlines</CardTitle>
                      <CardDescription>
                        Key dates for financial year 2023-24 (Assessment Year 2024-25)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>June 15, 2023</span>
                          </div>
                          <span>First Advance Tax Installment (15%)</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>September 15, 2023</span>
                          </div>
                          <span>Second Advance Tax Installment (45%)</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>December 15, 2023</span>
                          </div>
                          <span>Third Advance Tax Installment (75%)</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>March 15, 2024</span>
                          </div>
                          <span>Fourth Advance Tax Installment (100%)</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>July 31, 2024</span>
                          </div>
                          <span>Due date for filing ITR (non-audit cases)</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>October 31, 2024</span>
                          </div>
                          <span>Due date for filing ITR (audit cases)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TaxDocuments;
