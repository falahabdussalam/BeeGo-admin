import React, { useState } from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Plus,
  Zap,
  MessageSquare,
  Clock,
  CheckCircle2,
  Bike
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { useAdmin } from '../context/AdminContext';
import StatsCard from '../components/StatsCard';
import ProductModal from '../components/ProductModal';
import OrderModal from '../components/OrderModal';
import CouponModal from '../components/CouponModal';

export default function Dashboard() {
  const {
    analytics,
    orders,
    products,
    categories,
    settings,
    setActiveTab,
    toggleProductStock,
    updateOrderStatus
  } = useAdmin();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.orderStatus));
  const lowStockProducts = products.filter(p => p.stock <= 10 || !p.inStock);

  const chartData = analytics?.revenueByDay || [
    { day: 'Mon', revenue: 2400 },
    { day: 'Tue', revenue: 3100 },
    { day: 'Wed', revenue: 2800 },
    { day: 'Thu', revenue: 4200 },
    { day: 'Fri', revenue: 5600 },
    { day: 'Sat', revenue: 7800 },
    { day: 'Sun', revenue: 6400 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-beego-500/10 to-transparent border border-beego-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🐝</span>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Virajpete Store Command Center
            </h1>
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
            Live operations, catalog management & instant 30-min WhatsApp dispatch for Kodagu.
          </p>
        </div>

        {/* Quick Action Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-beego-500 hover:bg-beego-600 text-black font-black text-xs shadow-glow-yellow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
          <button
            onClick={() => setIsCouponModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gray-900 dark:bg-white hover:bg-gray-800 text-white dark:text-black font-black text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-4 h-4 text-beego-400 dark:text-beego-600" />
            <span>New Coupon</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={analytics?.totalRevenue || 12450}
          prefix="₹"
          icon={IndianRupee}
          color="emerald"
          change="+18.4%"
          isPositive={true}
          subtitle="Delivered orders in Virajpete"
        />
        <StatsCard
          title="Orders in Queue"
          value={pendingOrders.length}
          icon={ShoppingBag}
          color="beego"
          subtitle={pendingOrders.length ? "Action needed in kitchen / dispatch" : "All orders dispatched"}
        />
        <StatsCard
          title="Active Catalog"
          value={products.length}
          suffix=" items"
          icon={Package}
          color="blue"
          subtitle={`${categories.length} categories active`}
        />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          color="rose"
          subtitle={lowStockProducts.length > 0 ? "Items need restocking" : "Stock healthy"}
        />
      </div>

      {/* Analytics Graph & Active Orders Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Graph (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-gray-900 dark:text-white">
                Revenue & Sales Trajectory
              </h3>
              <p className="text-xs text-gray-400 font-medium">Daily order collections across Virajpete</p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-bold text-beego-600 dark:text-beego-400 hover:underline flex items-center gap-1"
            >
              <span>Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#eab308"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Incoming Order Queue (1 col) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-black text-base text-gray-900 dark:text-white">
                  Live Dispatch Queue
                </h3>
              </div>
              <span className="text-xs font-bold text-gray-400">
                {pendingOrders.length} pending
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[280px] pr-1">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-gray-500">All Virajpete orders fulfilled!</p>
                </div>
              ) : (
                pendingOrders.slice(0, 4).map(ord => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="p-3.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border hover:border-beego-500 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-900 dark:text-white">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-beego-500/10 text-beego-600 dark:text-beego-400 uppercase">
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">
                      {ord.customerName} • {ord.items.length} items
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>₹{ord.grandTotal} ({ord.paymentMethod})</span>
                      <span>{ord.riderName || 'No rider'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className="w-full py-2.5 rounded-2xl bg-gray-100 dark:bg-darkbg hover:bg-gray-200 text-gray-900 dark:text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2"
          >
            <span>View All Orders Board</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Low Stock Items & Quick Restock */}
      {lowStockProducts.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-rose-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-gray-900 dark:text-white">
                  Stock Depletion Alerts ({lowStockProducts.length})
                </h3>
                <p className="text-xs text-gray-400">These items have 10 or fewer units in Virajpete store</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-bold text-beego-600 dark:text-beego-400 hover:underline"
            >
              Manage Catalog →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.slice(0, 6).map(prod => (
              <div
                key={prod.id}
                className="p-3 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white truncate">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-rose-500 font-bold">
                      {prod.stock} units remaining ({prod.inStock ? 'Active' : 'Out of Stock'})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleProductStock(prod.id, prod.inStock)}
                  className={`text-[10px] font-black px-2.5 py-1.5 rounded-xl transition-all shrink-0 ${
                    prod.inStock
                      ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                  }`}
                >
                  {prod.inStock ? 'Mark Out' : 'Restock'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
      />
      {selectedOrder && (
        <OrderModal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
