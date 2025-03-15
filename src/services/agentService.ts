
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
    
    // If the active agent is LoanEligibilityChecker and we have context, handle the conversation flow
    const previousContext = JSON.parse(localStorage.getItem('currentAgentContext') || '{}');
    if (previousContext.agent === "LoanEligibilityChecker" && Object.keys(previousContext).length > 0) {
      return await handleLoanEligibilityCheckerConversation(message, previousContext);
    }
    
    console.log(`Intent classified: Using ${agent} to respond`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save current agent context to localStorage for conversation continuity
    localStorage.setItem('currentAgentContext', JSON.stringify({
      agent,
      ...context
    }));
    
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

// Loan Eligibility Checker Agent implementation
const handleLoanEligibilityCheckerConversation = async (
  message: string, 
  context: Record<string, any>
): Promise<AgentResponse> => {
  console.log("LoanEligibilityChecker handling message with context:", context);
  
  let response = "";
  let updatedContext = { ...context };
  const loanType = context.loanType || "loan";
  
  // Conversation flow based on the current stage
  switch (context.stage) {
    case "employmentStatus":
      // Process employment status response
      updatedContext.employmentStatus = message;
      updatedContext.stage = "monthlyIncome";
      response = `Thank you. For a ${loanType} loan, we'll need to assess your financial situation. What is your approximate monthly income (in INR)?`;
      break;
      
    case "monthlyIncome":
      // Process monthly income response and ask for credit score
      const income = parseFloat(message.replace(/[^0-9.]/g, ''));
      updatedContext.monthlyIncome = income;
      updatedContext.stage = "creditScore";
      response = "That's helpful information. Do you know your credit score? If you don't know the exact number, you can say 'I don't know'.";
      break;
      
    case "creditScore":
      // Process credit score and ask about existing loans
      if (message.toLowerCase().includes("don't know") || message.toLowerCase().includes("not sure")) {
        updatedContext.creditScore = "unknown";
        response = "No problem. A credit score is a number that represents your creditworthiness. It ranges from 300 to 900 in India, with higher scores indicating better credit health. ";
      } else {
        const creditScore = parseInt(message.replace(/[^0-9]/g, ''), 10);
        updatedContext.creditScore = creditScore || "unknown";
      }
      updatedContext.stage = "existingLoans";
      response += "Do you have any existing loans or EMIs that you're currently paying? (Yes/No)";
      break;
      
    case "existingLoans":
      // Process existing loans response and provide eligibility assessment
      updatedContext.hasExistingLoans = message.toLowerCase().includes("yes");
      updatedContext.stage = "loanAmount";
      response = `Thank you. How much ${loanType} loan amount are you looking for (in INR)?`;
      break;
      
    case "loanAmount":
      // Process loan amount and check eligibility
      const requestedAmount = parseFloat(message.replace(/[^0-9.]/g, ''));
      updatedContext.requestedLoanAmount = requestedAmount;
      updatedContext.stage = "assessment";
      
      // Determine eligibility based on provided information
      const eligibilityResult = checkLoanEligibility(updatedContext);
      response = generateEligibilityResponse(eligibilityResult, updatedContext);
      
      // Reset the conversation if assessment is complete
      localStorage.removeItem('currentAgentContext');
      break;
      
    default:
      // Start a new eligibility check if context is invalid
      updatedContext.stage = "employmentStatus";
      response = `Let's check your eligibility for a ${loanType} loan. What is your current employment status?`;
  }
  
  // Save updated context for next message
  localStorage.setItem('currentAgentContext', JSON.stringify(updatedContext));
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    text: response,
    agent: "LoanEligibilityChecker",
    context: updatedContext
  };
};

interface EligibilityResult {
  isEligible: boolean;
  maxLoanAmount?: number;
  reason?: string;
  suggestedActions?: string[];
}

// Function to check loan eligibility based on Indian banking sector rules
const checkLoanEligibility = (context: Record<string, any>): EligibilityResult => {
  const { 
    loanType, 
    employmentStatus, 
    monthlyIncome, 
    creditScore, 
    hasExistingLoans, 
    requestedLoanAmount 
  } = context;
  
  // Default result
  const result: EligibilityResult = {
    isEligible: false,
    suggestedActions: []
  };
  
  // Basic income eligibility check
  if (monthlyIncome < 15000) {
    result.reason = "Your monthly income is below the minimum requirement for most loan types.";
    result.suggestedActions?.push("Look for loan options specifically designed for low-income individuals.");
    return result;
  }
  
  // Credit score check (if available)
  if (creditScore !== "unknown" && creditScore < 650) {
    result.isEligible = false;
    result.reason = "Your credit score is below the minimum threshold required by most lenders.";
    result.suggestedActions?.push("Work on improving your credit score before applying.");
    result.suggestedActions?.push("Consider a secured loan option that requires collateral.");
    return result;
  }
  
  // Calculate affordability based on 50% of income (standard Indian banking practice)
  const maxEmi = monthlyIncome * 0.5;
  
  // Different loan types have different multipliers for maximum loan amount
  // These are simplified versions of actual banking practices in India
  let loanMultiplier = 36; // Default for personal loans (3 years)
  
  switch (loanType.toLowerCase()) {
    case "home":
    case "mortgage":
      loanMultiplier = 300; // 25 years
      break;
    case "business":
      loanMultiplier = 60; // 5 years
      break;
    case "car":
      loanMultiplier = 84; // 7 years
      break;
    case "education":
      loanMultiplier = 120; // 10 years
      break;
  }
  
  // Simplified calculation (not accounting for interest rates)
  const affordableLoanAmount = maxEmi * loanMultiplier;
  
  // Reduce affordable amount if user has existing loans
  const effectiveAffordableAmount = hasExistingLoans ? affordableLoanAmount * 0.7 : affordableLoanAmount;
  
  // Final eligibility check
  if (requestedLoanAmount <= effectiveAffordableAmount) {
    result.isEligible = true;
    result.maxLoanAmount = effectiveAffordableAmount;
  } else {
    result.isEligible = false;
    result.reason = "The requested loan amount exceeds your estimated affordability.";
    result.maxLoanAmount = effectiveAffordableAmount;
    result.suggestedActions?.push(`Consider reducing your loan request to under ₹${effectiveAffordableAmount.toLocaleString('en-IN')}.`);
  }
  
  return result;
};

// Generate human-friendly response based on eligibility result
const generateEligibilityResponse = (
  result: EligibilityResult, 
  context: Record<string, any>
): string => {
  const { loanType, employmentStatus, monthlyIncome, requestedLoanAmount } = context;
  
  if (result.isEligible) {
    return `
Great news! Based on the information you've provided, you appear to be eligible for a ${loanType} loan of ₹${requestedLoanAmount.toLocaleString('en-IN')}.

Here's a summary of your information:
- Employment Status: ${employmentStatus}
- Monthly Income: ₹${monthlyIncome.toLocaleString('en-IN')}
- Requested Loan Amount: ₹${requestedLoanAmount.toLocaleString('en-IN')}

Your estimated maximum affordable loan amount is ₹${result.maxLoanAmount?.toLocaleString('en-IN')}.

Please note that this is an initial assessment. Actual loan approval will depend on the lender's specific criteria, documentation verification, and a detailed credit assessment. Would you like to learn about the application process for this loan?
    `;
  } else {
    // Not eligible
    let response = `
Based on the information you've provided, we've determined that you may face challenges in qualifying for a ${loanType} loan of ₹${requestedLoanAmount.toLocaleString('en-IN')}.

Reason: ${result.reason}

Here's a summary of your information:
- Employment Status: ${employmentStatus}
- Monthly Income: ₹${monthlyIncome.toLocaleString('en-IN')}
- Requested Loan Amount: ₹${requestedLoanAmount.toLocaleString('en-IN')}
    `;
    
    // Add maximum loan amount if available
    if (result.maxLoanAmount) {
      response += `\nYour estimated maximum affordable loan amount is ₹${result.maxLoanAmount.toLocaleString('en-IN')}.`;
    }
    
    // Add suggestions
    if (result.suggestedActions && result.suggestedActions.length > 0) {
      response += "\n\nHere are some suggestions:\n";
      result.suggestedActions.forEach(action => {
        response += `- ${action}\n`;
      });
    }
    
    response += "\nWould you like to know how to improve your chances of loan approval?";
    
    return response;
  }
};
