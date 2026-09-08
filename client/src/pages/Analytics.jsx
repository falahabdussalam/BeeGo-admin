import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Package,
  Activity,
  BarChart2
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import StatsCard from '../components/StatsCard';

export default function Analytics() {
  const { analytics, orders, products, categories } = useAdmin();

  const totalDelivered = orders.filter(o => o.orderStatus === 'delivered');
  const codCount = orders.filter(o => o.paymentMethod === 'COD').length;
  const upiCount = orders.filter(o => o.paymentMethod === 'UPI').length;

  const paymentData = [
    { name: 'UPI / Online', value: upiCount, color: '#10b981' },
    { name: 'Cash on Delivery (COD)', value: codCount, color: '#f59e0b' }
  ];

  // Category items chart data
  const categoryData = categories.map(cat => ({
    name: cat.name ? cat.name.split(' ')[0] : 'Unnamed',
    items: products.filter(p => p.category === cat.id).length
  }));

  const revenueData = analytics?.revenueByDay || [];
  const hasRevenueData = revenueData.some(d => d.revenue > 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Sales & Revenue Analytics
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          Key performance indicators, order distribution, and payment breakdown
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Gross Revenue"
          value={analytics?.totalRevenue || 0}
          prefix="₹"
          icon={IndianRupee}
          color="emerald"
          subtitle={totalDelivered.length ? `${totalDelivered.length} orders delivered` : "No delivered orders yet"}
        />
        <StatsCard
          title="Average Order Value"
          value={analytics?.averageOrderValue || 0}
          prefix="₹"
          icon={TrendingUp}
          color="beego"
          subtitle={orders.length ? `Calculated across ${orders.length} orders` : "Awaiting first order"}
        />
        <StatsCard
          title="Total Orders"
          value={orders.length}
          icon={ShoppingBag}
          color="blue"
          subtitle={`${totalDelivered.length} completed`}
        />
        <StatsCard
          title="Active Products"
          value={products.length}
          suffix=" items"
          icon={Package}
          color="purple"
          subtitle={`${categories.length} categories active`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Bar Chart */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              7-Day Revenue Trajectory (₹)
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Daily earnings from delivered orders</p>
          </div>

          <div className="h-64 w-full pt-4">
            {hasRevenueData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" />
                  <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderRadius: '8px',
                      border: '1px solid #27272a',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <BarChart2 className="w-8 h-8 text-gray-300 dark:text-zinc-700" />
                <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                  No sales recorded in the past 7 days
                </p>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500">
                  Revenue bars will automatically populate as orders arrive.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Catalog Distribution */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              Products per Category
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Inventory spread across departments</p>
          </div>

          <div className="h-64 w-full pt-4">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" />
                  <XAxis type="number" stroke="#888888" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderRadius: '8px',
                      border: '1px solid #27272a',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="items" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <Package className="w-8 h-8 text-gray-300 dark:text-zinc-700" />
                <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                  No categories created yet
                </p>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500">
                  Create categories in the Categories tab to view distribution.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Split & Store Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              Payment Breakdown
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Payment methods used by customers</p>
          </div>

          <div className="space-y-2.5 pt-1">
            {paymentData.map((pm, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: pm.color }}
                  />
                  <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                    {pm.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {pm.value} {pm.value === 1 ? 'order' : 'orders'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs Stream (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Store Activity Log
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Audit trail of catalog and order changes</p>
            </div>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto">
            {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
              analytics.recentActivity.map(act => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white block">
                      {act.action}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-zinc-400">{act.detail}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 whitespace-nowrap ml-3">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 dark:text-zinc-500 py-8 text-center">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
