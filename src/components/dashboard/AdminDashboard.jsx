import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, ShoppingBag, DollarSign, Activity } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalWallets] = useState(0);
  const [totalSales, setTotalSharewallet] = useState(0);
  const [userVerifications, setUserVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [usersRes, walletRes, shareWalletRes, clientsRes, salesDataRes, verificationsRes] = await Promise.all([
          fetch('/api/total-users'),
          fetch('/api/total-wallets'),
          fetch('/api/total-sharedwallets'),
          fetch('/api/users')
        ]);

        if (!usersRes.ok || !walletRes.ok || !shareWalletRes.ok || !verificationsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const users = await usersRes.json();
        const wallets = await walletRes.json();
        const sharewallet = await shareWalletRes.json();
        const clients = await clientsRes.json();
        const salesData = await salesDataRes.json();
        const verifications = await verificationsRes.json();

        setTotalUsers(users.count);
        setTotalWallets(wallets.count);
        setTotalSharewallet(sharewallet.amount);
        setUserVerifications(verifications);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dashboard data:', err);
        setDemoData();
      } finally {
        setLoading(false);
      }
    };

    const setDemoData = () => {
      setTotalUsers(10293);
      setTotalSales(589000);
      setTotalClients(2040);
      setSalesData([
        { name: 'Jan', value: 20 },
        { name: 'Feb', value: 40 },
        { name: 'Mar', value: 30 },
        { name: 'Apr', value: 70 },
        { name: 'May', value: 50 },
        { name: 'Jun', value: 60 },
        { name: 'Jul', value: 180 },
        { name: 'Aug', value: 70 },
        { name: 'Sep', value: 90 },
        { name: 'Oct', value: 110 },
        { name: 'Nov', value: 100 },
        { name: 'Dec', value: 120 },
      ]);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error loading dashboard data.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value={totalUsers} icon={<Users />} />
        <StatCard title="Total Orders" value={totalOrders} icon={<ShoppingBag />} />
        <StatCard title="Total Sales" value={`$${totalSales}`} icon={<DollarSign />} />
        <StatCard title="Total Clients" value={totalClients} icon={<Activity />} />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex items-center space-x-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <h2 className="text-gray-500 text-sm">{title}</h2>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
