
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, BarChart2, Briefcase, CreditCard, DollarSign, Home, MessageSquare, Percent, PieChart } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                to="/chat" 
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-border hover:border-loan/30 transition-all shadow-sm hover:shadow text-center"
              >
                <div className="w-12 h-12 rounded-full bg-loan/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-5 w-5 text-loan" />
                </div>
                <h3 className="font-medium">Chat with AI</h3>
                <p className="text-sm text-muted-foreground mt-1">Get loan advice</p>
              </Link>
              
              <button 
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-border hover:border-loan/30 transition-all shadow-sm hover:shadow text-center"
              >
                <div className="w-12 h-12 rounded-full bg-loan/10 flex items-center justify-center mb-4">
                  <Percent className="h-5 w-5 text-loan" />
                </div>
                <h3 className="font-medium">Check Rates</h3>
                <p className="text-sm text-muted-foreground mt-1">Current offers</p>
              </button>
              
              <button 
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-border hover:border-loan/30 transition-all shadow-sm hover:shadow text-center"
              >
                <div className="w-12 h-12 rounded-full bg-loan/10 flex items-center justify-center mb-4">
                  <CreditCard className="h-5 w-5 text-loan" />
                </div>
                <h3 className="font-medium">Apply</h3>
                <p className="text-sm text-muted-foreground mt-1">Start an application</p>
              </button>
              
              <button 
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-border hover:border-loan/30 transition-all shadow-sm hover:shadow text-center"
              >
                <div className="w-12 h-12 rounded-full bg-loan/10 flex items-center justify-center mb-4">
                  <PieChart className="h-5 w-5 text-loan" />
                </div>
                <h3 className="font-medium">Calculate</h3>
                <p className="text-sm text-muted-foreground mt-1">Payment estimates</p>
              </button>
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
              {[
                {
                  icon: <Home />,
                  type: "Mortgage",
                  rate: "4.5%",
                  term: "30-year fixed",
                  detail: "For home purchases up to $500,000"
                },
                {
                  icon: <Briefcase />,
                  type: "Business Loan",
                  rate: "6.2%",
                  term: "5-year term",
                  detail: "For established businesses"
                },
                {
                  icon: <DollarSign />,
                  type: "Personal Loan",
                  rate: "8.9%",
                  term: "3-year term",
                  detail: "For debt consolidation or expenses"
                }
              ].map((loan, index) => (
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
                  
                  <button className="w-full button-secondary text-sm">Check Eligibility</button>
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
                  <h3 className="font-medium">Interest Rate Trends</h3>
                  <BarChart2 className="text-loan h-5 w-5" />
                </div>
                
                <div className="h-40 flex items-end space-x-2">
                  {[35, 40, 35, 50, 45, 60, 55, 65, 60, 70, 75, 65].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-loan/30 rounded-t-sm transition-all duration-500"
                        style={{ 
                          height: `${height}%`,
                          animationDelay: `${i * 0.1}s` 
                        }}
                      ></div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {String.fromCharCode(74 - i)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground text-center mt-4">
                  Last 12 months
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-medium">Loan Type Comparison</h3>
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
                      <div className="text-2xl font-bold">5.4%</div>
                      <div className="text-xs text-muted-foreground">Average Rate</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-loan mr-2"></div>
                    <span>Fixed Rate</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-loan/60 mr-2"></div>
                    <span>Variable Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
