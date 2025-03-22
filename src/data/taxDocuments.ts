
// Tax rates and information for Indian traders

export interface TaxRate {
  category: string;
  rate: string;
  applicability: string;
  section: string;
}

export interface STTRate {
  transactionType: string;
  rate: string;
  applicability: string;
}

export interface TaxDeadline {
  date: string;
  description: string;
  applicable: string;
  penalty?: string;
}

export const capitalGainsTaxRates: TaxRate[] = [
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
  }
];

export const tradingIncomeTaxRates: TaxRate[] = [
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
  },
  {
    category: "Currency Trading",
    rate: "As per income tax slab",
    applicability: "Non-speculative business income from currency trading",
    section: "Slab rates"
  }
];

export const securitiesTransactionTaxRates: STTRate[] = [
  {
    transactionType: "Equity Delivery (Buy)",
    rate: "0.1%",
    applicability: "On the value of equity shares purchased"
  },
  {
    transactionType: "Equity Delivery (Sell)",
    rate: "0.1%",
    applicability: "On the value of equity shares sold"
  },
  {
    transactionType: "Equity Intraday (Sell only)",
    rate: "0.025%",
    applicability: "On the value of equity shares sold same day"
  },
  {
    transactionType: "Futures (Sell only)",
    rate: "0.01%",
    applicability: "On the value of futures contracts sold"
  },
  {
    transactionType: "Options (Sell only - Premium)",
    rate: "0.05%",
    applicability: "On the option premium when sold"
  },
  {
    transactionType: "Options (Exercise)",
    rate: "0.125%",
    applicability: "On the settlement price when exercised"
  }
];

export const taxDeadlines: TaxDeadline[] = [
  {
    date: "June 15",
    description: "First Advance Tax Installment",
    applicable: "15% of total advance tax liability",
    penalty: "Interest under section 234C for shortfall"
  },
  {
    date: "September 15",
    description: "Second Advance Tax Installment",
    applicable: "45% of total advance tax liability (cumulative)",
    penalty: "Interest under section 234C for shortfall"
  },
  {
    date: "December 15",
    description: "Third Advance Tax Installment",
    applicable: "75% of total advance tax liability (cumulative)",
    penalty: "Interest under section 234C for shortfall"
  },
  {
    date: "March 15",
    description: "Fourth Advance Tax Installment",
    applicable: "100% of total advance tax liability (cumulative)",
    penalty: "Interest under section 234C for shortfall"
  },
  {
    date: "July 31",
    description: "Filing Income Tax Return (non-audit cases)",
    applicable: "Individual taxpayers without audit requirement",
    penalty: "Late fee under section 234F of up to ₹10,000"
  },
  {
    date: "October 31",
    description: "Filing Income Tax Return (audit cases)",
    applicable: "Individuals & businesses requiring tax audit",
    penalty: "Late fee under section 234F of up to ₹10,000"
  }
];

export const taxDocumentTypes = [
  {
    name: "Profit & Loss Statement",
    description: "Summary of trading income and expenses for tax filing",
    format: "PDF/Excel",
    requiredFor: "Income from trading activities"
  },
  {
    name: "Capital Gains Statement",
    description: "Details of gain/loss from delivery equity & other investments",
    format: "PDF/Excel",
    requiredFor: "Short-term and long-term capital gains tax calculation"
  },
  {
    name: "Contract Notes",
    description: "Documentation for every buy/sell transaction in securities",
    format: "PDF",
    requiredFor: "Verification of transactions by tax authorities"
  },
  {
    name: "Form 26AS",
    description: "Annual tax credit statement showing TDS deductions",
    format: "PDF",
    requiredFor: "Reconciliation of TDS credits"
  },
  {
    name: "ITR Form",
    description: "Income tax return form for filing annual returns",
    format: "PDF/XML",
    requiredFor: "Annual income tax filing"
  },
  {
    name: "Form 10D (CAS)",
    description: "Consolidated Account Statement from depositories",
    format: "PDF",
    requiredFor: "Verification of holdings and transactions"
  }
];
