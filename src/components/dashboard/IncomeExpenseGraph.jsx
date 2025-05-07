import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const IncomeExpenseGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/transactions") 
      .then((response) => response.json())
      .then((transactions) => {
        // Process data to group by date and sum income/expense
        const groupedData = transactions.reduce((acc, item) => {
          const date = item.date.split("T")[0]; // Extract only the date part
          if (!acc[date]) {
            acc[date] = { date, income: 0, expense: 0 };
          }
          if (item.type === "income") {
            acc[date].income += parseFloat(item.amount);
          } else {
            acc[date].expense += parseFloat(item.amount);
          }
          return acc;
        }, {});

        // Convert object to array and sort by date
        const formattedData = Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
        setData(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Income vs Expense Trends</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="date" tickFormatter={(tick) => tick} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#4CAF50" name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#F44336" name="Expense" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseGraph;
