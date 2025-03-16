import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft, IndianRupee, Percent, Clock, CheckCircle, XCircle } from 'lucide-react';

interface LoanComparison {
  type: string;
  rate: string;
  term: string;
  processingFee: string;
  prepaymentCharges: string;
  minAmount: string;
  maxAmount: string;
  features: string[];
  requirements: string[];
}

const CompareLoans = () => {
  const navigate = useNavigate();
  const [selectedLoans, setSelectedLoans] = useState<string[]>(['home', 'personal', 'business']);

  const loanOptions: Record<string, LoanComparison> = {
    home: {
      type: "Home Loan",
      rate: "8.5%",
      term: "20 years",
      processingFee: "0.5%",
      prepaymentCharges: "2%",
      minAmount: "₹10,00,000",
      maxAmount: "₹2,00,00,000",
      features: [
        "Flexible EMI options",
        "Balance transfer facility",
        "Top-up loan available",
        "Tax benefits on interest"
      ],
      requirements: [
        "Property documents",
        "Income proof",
        "PAN & Aadhaar",
        "Bank statements"
      ]
    },
    personal: {
      type: "Personal Loan",
      rate: "11.5%",
      term: "5 years",
      processingFee: "2%",
      prepaymentCharges: "3%",
      minAmount: "₹50,000",
      maxAmount: "₹25,00,000",
      features: [
        "Quick disbursement",
        "No collateral required",
        "Flexible end-use",
        "Minimal documentation"
      ],
      requirements: [
        "Salary slips",
        "PAN & Aadhaar",
        "Bank statements",
        "Employment proof"
      ]
    },
    business: {
      type: "Business Loan",
      rate: "10.2%",
      term: "5 years",
      processingFee: "1.5%",
      prepaymentCharges: "2.5%",
      minAmount: "₹5,00,000",
      maxAmount: "₹50,00,000",
      features: [
        "Collateral-free options",
        "Quick processing",
        "Flexible repayment",
        "Business expansion support"
      ],
      requirements: [
        "Business proof",
        "IT returns",
        "Bank statements",
        "GST returns"
      ]
    }
  };

  const toggleLoan = (loanType: string) => {
    setSelectedLoans(prev => 
      prev.includes(loanType) 
        ? prev.filter(type => type !== loanType)
        : [...prev, loanType]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="page-transition">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Compare Loan Options</h1>
              <p className="text-muted-foreground mt-1">Find the best loan for your needs</p>
            </div>
          </div>

          {/* Loan Type Selection */}
          <div className="flex flex-wrap gap-4 mb-8">
            {Object.entries(loanOptions).map(([type, loan]) => (
              <button
                key={type}
                onClick={() => toggleLoan(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLoans.includes(type)
                    ? 'bg-loan text-white'
                    : 'bg-white text-muted-foreground hover:bg-muted'
                }`}
              >
                {loan.type}
              </button>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-border">
              <div className="col-span-1"></div>
              {selectedLoans.map(type => (
                <div key={type} className="text-center font-medium">
                  {loanOptions[type].type}
                </div>
              ))}
            </div>

            {/* Interest Rate */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-loan" />
                <span className="font-medium">Interest Rate</span>
              </div>
              {selectedLoans.map(type => (
                <div key={type} className="text-center">
                  <span className="text-2xl font-bold text-loan">{loanOptions[type].rate}</span>
                </div>
              ))}
            </div>

            {/* Term */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-loan" />
                <span className="font-medium">Loan Term</span>
              </div>
              {selectedLoans.map(type => (
                <div key={type} className="text-center">{loanOptions[type].term}</div>
              ))}
            </div>

            {/* Processing Fee */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-border">
              <div className="font-medium">Processing Fee</div>
              {selectedLoans.map(type => (
                <div key={type} className="text-center">{loanOptions[type].processingFee}</div>
              ))}
            </div>

            {/* Prepayment Charges */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-border">
              <div className="font-medium">Prepayment Charges</div>
              {selectedLoans.map(type => (
                <div key={type} className="text-center">{loanOptions[type].prepaymentCharges}</div>
              ))}
            </div>

            {/* Loan Amount Range */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-border">
              <div className="font-medium">Loan Amount Range</div>
              {selectedLoans.map(type => (
                <div key={type} className="text-center">
                  <div className="text-sm text-muted-foreground">{loanOptions[type].minAmount}</div>
                  <div className="text-sm text-muted-foreground">to</div>
                  <div className="text-sm text-muted-foreground">{loanOptions[type].maxAmount}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-border">
              <div className="font-medium">Key Features</div>
              {selectedLoans.map(type => (
                <div key={type} className="space-y-2">
                  {loanOptions[type].features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-4 gap-4 p-6">
              <div className="font-medium">Requirements</div>
              {selectedLoans.map(type => (
                <div key={type} className="space-y-2">
                  {loanOptions[type].requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompareLoans; 