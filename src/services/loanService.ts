import { LoanApplication } from '../types/loan';

// In a real application, this would be an API endpoint
const API_BASE_URL = 'https://api.loannavigator.com/v1';

export const loanService = {
  async submitApplication(application: Omit<LoanApplication, 'id' | 'status' | 'submittedAt' | 'updatedAt'>): Promise<LoanApplication> {
    try {
      // In a real application, this would be an API call
      // For now, we'll simulate the API call and store in localStorage
      const newApplication: LoanApplication = {
        ...application,
        id: `loan-${Date.now()}`,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Get existing applications
      const existingApplications = JSON.parse(localStorage.getItem('loan_applications') || '[]');
      
      // Add new application
      existingApplications.push(newApplication);
      
      // Save back to localStorage
      localStorage.setItem('loan_applications', JSON.stringify(existingApplications));

      return newApplication;
    } catch (error) {
      console.error('Error submitting loan application:', error);
      throw error;
    }
  },

  async getApplications(userId: string): Promise<LoanApplication[]> {
    try {
      // In a real application, this would be an API call
      const applications = JSON.parse(localStorage.getItem('loan_applications') || '[]');
      return applications.filter((app: LoanApplication) => app.userId === userId);
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      throw error;
    }
  },

  async getApplication(id: string): Promise<LoanApplication | null> {
    try {
      // In a real application, this would be an API call
      const applications = JSON.parse(localStorage.getItem('loan_applications') || '[]');
      return applications.find((app: LoanApplication) => app.id === id) || null;
    } catch (error) {
      console.error('Error fetching loan application:', error);
      throw error;
    }
  },

  async updateApplicationStatus(id: string, status: LoanApplication['status']): Promise<LoanApplication> {
    try {
      // In a real application, this would be an API call
      const applications = JSON.parse(localStorage.getItem('loan_applications') || '[]');
      const applicationIndex = applications.findIndex((app: LoanApplication) => app.id === id);

      if (applicationIndex === -1) {
        throw new Error('Application not found');
      }

      applications[applicationIndex] = {
        ...applications[applicationIndex],
        status,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('loan_applications', JSON.stringify(applications));
      return applications[applicationIndex];
    } catch (error) {
      console.error('Error updating loan application status:', error);
      throw error;
    }
  }
}; 