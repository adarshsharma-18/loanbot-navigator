import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const LoanDistribution = () => {
  const [loanData, setLoanData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        // Replace with your API endpoint to fetch loan distribution data
        const response = await fetch('https://api.example.com/loan-distribution');
        const data = await response.json();

        // Assuming the API returns an array of loan types with their counts
        const formattedData = [
          { name: 'Home Loan', value: data.homeLoanCount },
          { name: 'Business Loan', value: data.businessLoanCount },
          { name: 'Personal Loan', value: data.personalLoanCount },
        ];

        setLoanData(formattedData);
      } catch (error) {
        console.error('Error fetching loan distribution data:', error);
        // Fallback data
        setLoanData([
          { name: 'Home Loan', value: 40 },
          { name: 'Business Loan', value: 30 },
          { name: 'Personal Loan', value: 30 },
        ]);
      }
    };

    fetchLoanData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="loan-distribution">
      <h3 className="text-lg font-bold">Loan Type Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip />
          <Pie
            data={loanData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {loanData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoanDistribution; 