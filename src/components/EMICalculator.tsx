import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EMICalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMICalculator: React.FC<EMICalculatorProps> = ({ isOpen, onClose }) => {
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [emi, setEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100; // Monthly interest rate
    const time = parseFloat(loanTerm) * 12; // Total number of months

    if (principal && rate && time) {
      const emiAmount = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
      const totalPaymentAmount = emiAmount * time;
      const totalInterestAmount = totalPaymentAmount - principal;

      setEmi(emiAmount);
      setTotalInterest(totalInterestAmount);
      setTotalPayment(totalPaymentAmount);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">EMI Calculator</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loan Amount (₹)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
              placeholder="Enter loan amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Interest Rate (% per annum)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
              placeholder="Enter interest rate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loan Term (Years)</label>
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
              placeholder="Enter loan term"
            />
          </div>

          <button
            onClick={calculateEMI}
            className="w-full button-primary mt-4"
          >
            Calculate EMI
          </button>

          {emi !== null && (
            <div className="mt-6 space-y-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly EMI</span>
                <span className="font-bold text-lg">{formatCurrency(emi)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="font-bold text-lg">{formatCurrency(totalInterest!)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Payment</span>
                <span className="font-bold text-lg">{formatCurrency(totalPayment!)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EMICalculator; 