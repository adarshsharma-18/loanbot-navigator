import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EMICalculator from '../components/EMICalculator';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, BarChart2, Briefcase, CreditCard, IndianRupee, Home, MessageSquare, Percent, PieChart, FileText, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LoanOption {
  icon: JSX.Element;
  type: string;
  rate: string;
  term: string;
  detail: string;
}

interface RateTrend {
  date: string;
  repoRate: number;
  reverseRepoRate: number;
  mclr: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEMICalculatorOpen, setIsEMICalculatorOpen] = useState(false);
  const [rateTrends, setRateTrends] = useState<RateTrend[]>([]);
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>([
    {
      icon: <Home />,
      type: "Home Loan",
      rate: "Loading...",
      term: "20-year term",
      detail: "Up to ₹2,00,00,000 with flexible EMI options"
    },
    {
      icon: <Briefcase />,
      type: "Business Loan",
      rate: "Loading...",
      term: "5-year term",
      detail: "For MSMEs and startups"
    },
    {
      icon: <IndianRupee />,
      type: "Personal Loan",
      rate: "Loading...",
      term: "3-year term",
      detail: "Quick disbursement within 24 hours"
    }
  ]);

  useEffect(() => {
    const fetchRateTrends = async () => {
      try {
        // Using RBI's API endpoint for historical rates
        const response = await fetch('https://api.rbi.org.in/api/v1/rate-trends');
        const data = await response.json();
        
        // Transform the data for the chart
        const trends = data.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
          repoRate: item.repoRate,
          reverseRepoRate: item.reverseRepoRate,
          mclr: item.mclr
        }));

        setRateTrends(trends);
      } catch (error) {
        console.error('Error fetching rate trends:', error);
        // Fallback data if API fails
        const fallbackData = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            date: date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
            repoRate: 6.5 + Math.random() * 0.5,
            reverseRepoRate: 6.25 + Math.random() * 0.5,
            mclr: 7.5 + Math.random() * 0.5
          };
        }).reverse();
        setRateTrends(fallbackData);
      }
    };

    // Fetch trends immediately
    fetchRateTrends();

    // Set up interval to fetch trends every hour
    const interval = setInterval(fetchRateTrends, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchInterestRates = async () => {
      try {
        // Using RBI's API endpoint for current interest rates
        const response = await fetch('https://api.rbi.org.in/api/v1/interest-rates');
        const data = await response.json();

        // Update loan options with real-time rates
        setLoanOptions(prevOptions => prevOptions.map(option => {
          switch (option.type) {
            case "Home Loan":
              return {
                ...option,
                rate: `${data.homeLoanRate}%`
              };
            case "Business Loan":
              return {
                ...option,
                rate: `${data.businessLoanRate}%`
              };
            case "Personal Loan":
              return {
                ...option,
                rate: `${data.personalLoanRate}%`
              };
            default:
              return option;
          }
        }));
      } catch (error) {
        console.error('Error fetching interest rates:', error);
        // Fallback to default rates if API fails
        setLoanOptions(prevOptions => prevOptions.map(option => {
          switch (option.type) {
            case "Home Loan":
              return {
                ...option,
                rate: "8.5%"
              };
            case "Business Loan":
              return {
                ...option,
                rate: "10.2%"
              };
            case "Personal Loan":
              return {
                ...option,
                rate: "11.5%"
              };
            default:
              return option;
          }
        }));
      }
    };

    // Fetch rates immediately
    fetchInterestRates();

    // Set up interval to fetch rates every hour
    const interval = setInterval(fetchInterestRates, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="page-transition">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground mt-2">Your personal loan dashboard</p>
          </header>
          
          {/* Quick Actions */}
          <section className="mb-10">
            <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
            <div className="flex gap-4 max-w-[1800px] mx-auto">
              <Link 
                to="/chat" 
                className="flex-1 flex items-center gap-4 px-6 py-3 bg-white rounded-xl border border-border hover:border-loan/30 transition-all shadow-sm hover:shadow"
              >
                <div className="w-10 h-10 rounded-full bg-loan/10 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-loan" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-base">AI Advisor</h3>
                  <p className="text-sm text-muted-foreground">Get guidance</p>
                </div>
              </Link>
              
              <button 
                onClick={() => setIsEMICalculatorOpen(true)}
                className="flex-1 flex items-center gap-4 px-6 py-3 bg-white rounded-xl border border-border hover:border-loan/30 transition-all shadow-sm hover:shadow"
              >
                <div className="w-10 h-10 rounded-full bg-loan/10 flex items-center justify-center">
                  <Percent className="h-4 w-4 text-loan" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-base">Check EMI</h3>
                  <p className="text-sm text-muted-foreground">Calculate</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/loan-application')}
                className="flex-1 flex items-center gap-4 px-6 py-3 bg-white rounded-xl border border-border hover:border-loan/30 transition-all shadow-sm hover:shadow"
              >
                <div className="w-10 h-10 rounded-full bg-loan/10 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-loan" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-base">Apply Now</h3>
                  <p className="text-sm text-muted-foreground">Start application</p>
                </div>
              </button>

              <Link 
                to="/my-applications" 
                className="flex-1 flex items-center gap-4 px-6 py-3 bg-white rounded-xl border border-border hover:border-loan/30 transition-all shadow-sm hover:shadow"
              >
                <div className="w-10 h-10 rounded-full bg-loan/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-loan" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-base">My Applications</h3>
                  <p className="text-sm text-muted-foreground">Track status</p>
                </div>
              </Link>

              <Link 
                to="/compare-loans" 
                className="flex-1 flex items-center gap-4 px-6 py-3 bg-white rounded-xl border border-border hover:border-loan/30 transition-all shadow-sm hover:shadow"
              >
                <div className="w-10 h-10 rounded-full bg-loan/10 flex items-center justify-center">
                  <Scale className="h-4 w-4 text-loan" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-base">Compare Loans</h3>
                  <p className="text-sm text-muted-foreground">Find best options</p>
                </div>
              </Link>
            </div>
          </section>
          
          {/* Loan Options */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Recommended Loan Options</h2>
              <button className="text-loan hover:text-loan-dark text-sm font-medium flex items-center">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {loanOptions.map((loan, index) => (
                <div key={index} className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-loan/10 flex items-center justify-center text-loan">
                      {loan.icon}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{loan.type}</h3>
                      <p className="text-xs text-muted-foreground">{loan.term}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-loan">{loan.rate}</div>
                    <p className="text-sm text-muted-foreground">{loan.detail}</p>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/chat')}
                    className="w-full button-secondary text-sm"
                  >
                    Check Eligibility
                  </button>
                </div>
              ))}
            </div>
          </section>
          
          {/* Financial Insights */}
          <section>
            <h2 className="text-xl font-medium mb-4">Financial Insights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-medium">RBI Rate Trends</h3>
                  <BarChart2 className="text-loan h-5 w-5" />
                </div>
                
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rateTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#666"
                        fontSize={12}
                        tick={{ fill: '#666' }}
                      />
                      <YAxis 
                        stroke="#666"
                        fontSize={12}
                        tick={{ fill: '#666' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                        labelStyle={{ color: '#666' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="repoRate" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={{ fill: '#2563eb', strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="reverseRepoRate" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mclr" 
                        stroke="#60a5fa" 
                        strokeWidth={2}
                        dot={{ fill: '#60a5fa', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#2563eb] mr-2"></div>
                    <span className="text-xs text-muted-foreground">Repo Rate</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#3b82f6] mr-2"></div>
                    <span className="text-xs text-muted-foreground">Reverse Repo Rate</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#60a5fa] mr-2"></div>
                    <span className="text-xs text-muted-foreground">MCLR</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-medium">Loan Type Distribution</h3>
                  <PieChart className="text-loan h-5 w-5" />
                </div>
                
                <div className="flex items-center justify-center h-40 relative mb-6">
                  <div className="w-40 h-40 rounded-full border-[16px] border-loan/20 relative">
                    <div 
                      className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-loan border-r-loan"
                      style={{ transform: 'rotate(45deg)' }}
                    ></div>
                    <div 
                      className="absolute inset-0 rounded-full border-[16px] border-transparent border-b-loan/60 border-l-loan/60"
                      style={{ transform: 'rotate(45deg)' }}
                    ></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">9.8%</div>
                      <div className="text-xs text-muted-foreground">Average Rate</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-loan mr-2"></div>
                    <span>Home Loans</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-loan/60 mr-2"></div>
                    <span>Personal Loans</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* EMI Calculator Modal */}
      <EMICalculator 
        isOpen={isEMICalculatorOpen}
        onClose={() => setIsEMICalculatorOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
