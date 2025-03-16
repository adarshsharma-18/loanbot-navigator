import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loanService } from '../services/loanService';
import { toast } from 'sonner';

interface FormData {
  loanType: string;
  fullName: string;
  email: string;
  phone: string;
  panNumber: string;
  monthlyIncome: string;
  employmentType: string;
  loanAmount: string;
  purpose: string;
  documents: FileList | null;
}

const LoanApplication = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    loanType: '',
    fullName: '',
    email: '',
    phone: '',
    panNumber: '',
    monthlyIncome: '',
    employmentType: '',
    loanAmount: '',
    purpose: '',
    documents: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: e.target.files
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to submit an application');
      return;
    }

    setIsSubmitting(true);

    try {
      // Process documents
      const processedDocuments = formData.documents ? Array.from(formData.documents).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file) // In a real app, this would be uploaded to a storage service
      })) : [];

      // Submit application
      await loanService.submitApplication({
        userId: user.id,
        ...formData,
        documents: processedDocuments
      });

      setSubmitSuccess(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 max-w-4xl mx-auto w-full">
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
              <h1 className="text-3xl font-bold">Loan Application</h1>
              <p className="text-muted-foreground mt-1">Fill in your details to apply for a loan</p>
            </div>
          </div>

          {submitSuccess ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-border">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Application Submitted Successfully!</h3>
              <p className="text-muted-foreground mb-6">We'll review your application and get back to you soon.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="button-primary"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-sm border border-border p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium mb-1">Loan Type</label>
                  <select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
                    required
                  >
                    <option value="">Select loan type</option>
                    <option value="home">Home Loan</option>
                    <option value="personal">Personal Loan</option>
                    <option value="business">Business Loan</option>
                    <option value="education">Education Loan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
                    required
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Income (₹)</label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Employment Type</label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
                    required
                  >
                    <option value="">Select employment type</option>
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self Employed</option>
                    <option value="business">Business Owner</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Loan Amount (₹)</label>
                  <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Purpose of Loan</label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Documents</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-loan"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload PAN card, Aadhaar card, income proof, and other relevant documents
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="button-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default LoanApplication; 