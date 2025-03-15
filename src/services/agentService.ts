
import { toast } from "sonner";

// Define interfaces for our agent system
export interface AgentResponse {
  text: string;
  agent: string;
  context?: Record<string, any>;
}

// Mock implementation of the Intent Classifier & Router Agent
// This will be replaced with actual API calls to your Python backend
export const classifyIntentAndGetResponse = async (message: string): Promise<AgentResponse> => {
  console.log("Classifying intent for message:", message);
  
  try {
    // In a real implementation, this would be an API call to your Python backend
    // For now, we'll simulate the intent classification with some basic rules
    
    // Simple intent matching patterns
    const loanTypes = ["business", "home", "personal", "education", "car", "mortgage"];
    const eligibilityTerms = ["eligible", "qualify", "can i get", "eligibility", "requirements"];
    const applicationTerms = ["apply", "application", "process", "documents", "how to get"];
    const financialTerms = ["credit score", "interest", "emi", "financial", "budget", "debt"];
    
    // Default to the intent classifier if no specific intent is matched
    let agent = "IntentClassifier";
    let response = "";
    let context = {};
    
    // Check for loan eligibility questions
    const hasLoanType = loanTypes.some(type => message.toLowerCase().includes(type));
    
    if (hasLoanType) {
      const matchedLoanType = loanTypes.find(type => message.toLowerCase().includes(type)) || "";
      
      if (eligibilityTerms.some(term => message.toLowerCase().includes(term))) {
        agent = "LoanEligibilityChecker";
        response = `I'd be happy to check your eligibility for a ${matchedLoanType} loan. Let me ask you a few questions. What is your current employment status?`;
        context = { loanType: matchedLoanType, stage: "employmentStatus" };
      } 
      else if (applicationTerms.some(term => message.toLowerCase().includes(term))) {
        agent = "LoanApplicationGuide";
        response = `I can guide you through the ${matchedLoanType} loan application process. Would you like to know about the required documents or the steps involved?`;
        context = { loanType: matchedLoanType };
      }
      else {
        agent = "IntentClassifier";
        response = `I see you're interested in a ${matchedLoanType} loan. Would you like to check your eligibility, learn about the application process, or understand the financial aspects?`;
        context = { loanType: matchedLoanType };
      }
    } 
    // Financial literacy queries
    else if (financialTerms.some(term => message.toLowerCase().includes(term))) {
      agent = "FinancialLiteracyCoach";
      if (message.toLowerCase().includes("credit score")) {
        response = "A credit score is a number that represents your creditworthiness. It ranges from 300 to 900 in India, with higher scores indicating better credit health. Would you like to know how to improve your credit score?";
      } else if (message.toLowerCase().includes("interest")) {
        response = "Interest is the cost of borrowing money, typically expressed as an annual percentage rate (APR). Would you like me to explain how interest rates affect your loan amount?";
      } else if (message.toLowerCase().includes("emi")) {
        response = "EMI stands for Equated Monthly Installment. It's the amount you pay every month to repay your loan, including both principal and interest. Would you like me to explain how EMIs are calculated?";
      } else {
        response = "Financial literacy is key to making informed loan decisions. What specific financial aspect would you like to learn more about: credit scores, interest rates, EMIs, or budgeting?";
      }
    }
    // Greeting or general inquiry
    else if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi") || message.length < 10) {
      agent = "IntentClassifier";
      response = "Hello! I'm your AI Loan Advisor. I can help you check loan eligibility, guide you through the application process, or explain financial concepts. What type of loan are you interested in?";
    }
    // Default response for unclassified intents
    else {
      agent = "IntentClassifier";
      response = "I'm here to help with your loan-related questions. Are you looking for information about loan eligibility, the application process, or understanding financial concepts?";
    }
    
    console.log(`Intent classified: Using ${agent} to respond`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      text: response,
      agent: agent,
      context: context
    };
  } catch (error) {
    console.error("Error in intent classification:", error);
    toast.error("There was an issue processing your request");
    return {
      text: "I'm having trouble understanding your request right now. Please try again in a moment.",
      agent: "IntentClassifier"
    };
  }
};
