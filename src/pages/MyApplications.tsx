import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { loanService } from '../services/loanService';
import { LoanApplication } from '../types/loan';
import { ArrowLeft, FileText, IndianRupee, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const MyApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      
      try {
        const userApplications = await loanService.getApplications(user.id);
        setApplications(userApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const getStatusColor = (status: LoanApplication['status']) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusIcon = (status: LoanApplication['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
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
              <h1 className="text-3xl font-bold">My Applications</h1>
              <p className="text-muted-foreground mt-1">Track your loan applications</p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-loan mx-auto"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-border">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground mb-6">You haven't submitted any loan applications yet.</p>
              <button
                onClick={() => navigate('/loan-application')}
                className="button-primary"
              >
                Apply Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white rounded-xl shadow-sm border border-border p-6 hover:border-loan/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{application.loanType}</h3>
                      <p className="text-sm text-muted-foreground">
                        Applied on {format(new Date(application.submittedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Amount</p>
                      <p className="font-medium flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {parseInt(application.loanAmount).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Income</p>
                      <p className="font-medium flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {parseInt(application.monthlyIncome).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Employment Type</p>
                      <p className="font-medium">{application.employmentType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Documents</p>
                      <p className="font-medium">{application.documents.length} uploaded</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => navigate(`/loan-application/${application.id}`)}
                      className="button-secondary"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyApplications; 