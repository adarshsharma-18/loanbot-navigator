export interface LoanApplication {
  id: string;
  userId: string;
  loanType: string;
  fullName: string;
  email: string;
  phone: string;
  panNumber: string;
  monthlyIncome: string;
  employmentType: string;
  loanAmount: string;
  purpose: string;
  documents: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  submittedAt: string;
  updatedAt: string;
} 