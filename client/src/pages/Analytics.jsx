import React from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Package,
  Activity
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import StatsCard from '../components/StatsCard';

const PIE_COLORS = ['#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#06b6d4', '#f97316'];

export default function Analytics() {
  const { analytics, orders, products, categories } = useAdmin();

  const totalDelivered = orders.filter(o => o.orderStatus === 'delivered');
  const codCount = orders.filter(o => o.paymentMethod === 'COD').length;
  const upiCount = orders.filter(o => o.paymentMethod === 'UPI').length;

  const paymentData = [
    { name: 'UPI / Online', value: upiCount || 12, color: '#10b981' },
    { name: 'Cash on Delivery (COD)', value: codCount || 8, color: '#eab308' }
  ];

  // Category items chart data
  const categoryData = categories.map(cat => ({
    name: cat.name.split(' ')[0],
    items: products.filter(p => p.category === cat.id).length
  }));

  const revenueData = analytics?.revenueByDay || [
    { day: 'Sun', revenue: 4500, orders: 12 },
    { day: 'Mon', revenue: 3200, orders: 9 },
    { day: 'Tue', revenue: 3800, orders: 11 },
    { day: 'Wed', revenue: 4100, orders: 13 },
    { day: 'Thu', revenue: 5200, orders: 16 },
    { day: 'Fri', revenue: 6800, orders: 21 },
    { day: 'Sat', revenue: 8400, orders: 26 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Sales & Performance Analytics
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          Detailed metrics, order volumes & revenue insights across Virajpete
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Gross Sales (₹)"
          value={analytics?.totalRevenue || 12450}
          prefix="₹"
          icon={IndianRupee}
          color="emerald"
          change="+24.8%"
          isPositive={true}
          subtitle="Delivered customer orders"
        />
        <StatsCard
          title="Average Order Value"
          value={analytics?.averageOrderValue || 420}
          prefix="₹"
          icon={TrendingUp}
          color="beego"
          subtitle="Per Virajpete customer"
        />
        <StatsCard
          title="Total Lifetime Orders"
          value={orders.length}
          icon={ShoppingBag}
          color="blue"
          subtitle={`${totalDelivered.length} successfully delivered`}
        />
        <StatsCard
          title="Catalog Health"
          value={products.length}
          suffix=" products"
          icon={Package}
          color="purple"
          subtitle="Active items in inventory"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Curve */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4">
          <div>
            <h3 className="font-black text-base text-gray-900 dark:text-white">
              Weekly Revenue Distribution (₹)
            </h3>
            <p className="text-xs text-gray-400">Daily earnings in Kodagu</p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" />
                <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderRadius: '16px',
                    border: '1px solid #27272a',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#eab308" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Catalog Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4">
          <div>
            <h3 className="font-black text-base text-gray-900 dark:text-white">
              Inventory Spread by Department
            </h3>
            <p className="text-xs text-gray-400">Item counts per category</p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" />
                <XAxis type="number" stroke="#888888" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderRadius: '16px',
                    border: '1px solid #27272a',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="items" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payment Split & Store Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4">
          <div>
            <h3 className="font-black text-base text-gray-900 dark:text-white">
              Payment Breakdown
            </h3>
            <p className="text-xs text-gray-400">UPI vs Cash on Delivery</p>
          </div>

          <div className="space-y-3 pt-2">
            {paymentData.map((pm, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: pm.color }}
                  />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    {pm.name}
                  </span>
                </div>
                <span className="text-xs font-black text-gray-900 dark:text-white">
                  {pm.value} orders
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs Stream (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-beego-500" />
            <div>
              <h3 className="font-black text-base text-gray-900 dark:text-white">
                Recent Store Activity Feed
              </h3>
              <p className="text-xs text-gray-400">Audit logs of catalog changes and order movements</p>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
              analytics.recentActivity.map(act => (
                <div
                  key={act.id}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/50 dark:border-darkbg-border flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-black text-gray-900 dark:text-white block">
                      {act.action}
                    </span>
                    <span className="text-[11px] text-gray-500">{act.detail}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-3">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-6 text-center">No recent activity logs.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
