
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart, Lock, MessageSquare, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-loan/10 text-loan rounded-full text-sm font-medium">
                AI-Powered Loan Advisory
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Smart Financial Decisions with AI Guidance
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Navigate the complex world of loans with our AI assistant. Get personalized advice, compare options, and make informed decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="button-primary">
                  Get Started
                </Link>
                <Link to="/login" className="button-secondary">
                  Log In
                </Link>
              </div>
            </div>
            
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-loan/20 rounded-full blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-border/50">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-loan rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Loan Navigator</h3>
                    <p className="text-xs text-muted-foreground">Your AI financial advisor</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="message-bubble-user animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    I need help choosing between a fixed and variable rate mortgage.
                  </div>
                  <div className="message-bubble-ai animate-slide-up" style={{ animationDelay: '0.6s' }}>
                    Based on your profile and current market conditions, a fixed-rate mortgage at 4.2% would save you $12,500 over the next 5 years compared to the variable option.
                  </div>
                  <div className="message-bubble-user animate-slide-up" style={{ animationDelay: '0.8s' }}>
                    Can you show me how the payments would look?
                  </div>
                  <div className="message-bubble-ai animate-slide-up" style={{ animationDelay: '1s' }}>
                    <div className="mb-3">Here's a comparison of your monthly payments:</div>
                    <div className="flex space-x-4 text-sm">
                      <div className="flex-1 p-2 bg-muted rounded-md">
                        <div className="font-medium mb-1">Fixed Rate</div>
                        <div className="text-loan font-bold mb-1">$1,870/mo</div>
                        <div className="text-xs text-muted-foreground">Stability for 5 years</div>
                      </div>
                      <div className="flex-1 p-2 bg-muted rounded-md">
                        <div className="font-medium mb-1">Variable Rate</div>
                        <div className="font-bold mb-1">$1,720/mo</div>
                        <div className="text-xs text-muted-foreground">May increase over time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-6 md:px-12 bg-muted">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simplifying Financial Decisions</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our AI assistant provides personalized guidance to help you navigate your loan journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <MessageSquare className="text-loan" />,
                  title: "Natural Conversations",
                  description: "Talk to our AI as you would with a human advisor. No complicated forms."
                },
                {
                  icon: <BarChart className="text-loan" />,
                  title: "Data-Driven Insights",
                  description: "Get recommendations based on real-time market data and your financial profile."
                },
                {
                  icon: <Lock className="text-loan" />,
                  title: "Secure & Private",
                  description: "Your financial information is encrypted and never shared without permission."
                },
                {
                  icon: <Sparkles className="text-loan" />,
                  title: "Personalized Options",
                  description: "Receive loan options tailored to your specific financial situation and goals."
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl shadow-sm border border-border/50 animate-fade-in"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-loan/10 rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto bg-gradient-to-r from-loan-light via-loan/10 to-white p-12 rounded-3xl relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-loan/5 to-transparent"></div>
            <div className="relative z-10 md:max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to make smarter loan decisions?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of users who have simplified their loan process with our AI assistant.
              </p>
              <Link to="/signup" className="button-primary inline-flex items-center">
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="absolute right-0 bottom-0 w-96 h-96 opacity-10 bg-loan rounded-full -mr-20 -mb-20 blur-3xl"></div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-loan to-loan-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="ml-2 text-xl font-medium">LoanNavigator</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-foreground hover:text-loan transition-colors">Terms</a>
              <a href="#" className="text-foreground hover:text-loan transition-colors">Privacy</a>
              <a href="#" className="text-foreground hover:text-loan transition-colors">About</a>
              <a href="#" className="text-foreground hover:text-loan transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} LoanNavigator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
