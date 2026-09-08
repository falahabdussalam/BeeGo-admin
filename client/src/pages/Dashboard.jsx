import React, { useState } from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  Plus,
  Tag,
  CheckCircle2,
  TrendingUp,
  Inbox
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
    setActiveTab,
    toggleProductStock
  } = useAdmin();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.orderStatus));
  const lowStockProducts = products.filter(p => p.stock <= 10 || !p.inStock);

  const chartData = analytics?.revenueByDay || [];
  const hasRevenueData = chartData.some(d => d.revenue > 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Monitor real-time sales, order dispatch, and catalog inventory
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCouponModalOpen(true)}
            className="btn-secondary text-xs py-2 px-3"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>New Coupon</span>
          </button>
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="btn-primary text-xs py-2 px-3"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={analytics?.totalRevenue || 0}
          prefix="₹"
          icon={IndianRupee}
          color="emerald"
          subtitle={orders.length ? `${orders.length} total orders recorded` : "No delivered orders yet"}
        />
        <StatsCard
          title="Active Orders"
          value={pendingOrders.length}
          icon={ShoppingBag}
          color="beego"
          subtitle={pendingOrders.length ? "Orders pending dispatch" : "All orders fulfilled"}
        />
        <StatsCard
          title="Total Products"
          value={products.length}
          suffix=" items"
          icon={Package}
          color="blue"
          subtitle={`${categories.length} categories`}
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          color="rose"
          subtitle={lowStockProducts.length > 0 ? "Items needing restocking" : "Stock healthy"}
        />
      </div>

      {/* Empty Catalog Notice if fresh */}
      {products.length === 0 && (
        <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Your store catalog is empty
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-md mx-auto mt-1">
              Add products and categories to start receiving orders through your BeeGo storefront.
            </p>
          </div>
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="btn-primary text-xs py-2 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Product</span>
          </button>
        </div>
      )}

      {/* Analytics Graph & Active Orders Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Graph (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Revenue Trajectory
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Order revenue over the past 7 days</p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full pt-4">
            {hasRevenueData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <TrendingUp className="w-8 h-8 text-gray-300 dark:text-zinc-700" />
                <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                  No revenue data yet
                </p>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500 max-w-xs">
                  Sales trajectory will be charted automatically as customer orders are delivered.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Live Incoming Order Queue (1 col) */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                  Order Queue
                </h3>
              </div>
              <span className="text-xs text-gray-500 dark:text-zinc-400">
                {pendingOrders.length} pending
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[260px]">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                  <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">No pending orders</p>
                </div>
              ) : (
                pendingOrders.slice(0, 4).map(ord => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-amber-500 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 uppercase">
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-zinc-300 truncate">
                      {ord.customerName} • {ord.items?.length || 0} items
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400">
                      <span>₹{ord.grandTotal} ({ord.paymentMethod})</span>
                      <span>{ord.riderName || 'Unassigned'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className="btn-secondary w-full text-xs py-2"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Low Stock Items & Quick Restock */}
      {lowStockProducts.length > 0 && (
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                  Low Stock Alerts ({lowStockProducts.length})
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Items with 10 or fewer units in inventory</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Manage Catalog →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.slice(0, 6).map(prod => (
              <div
                key={prod.id}
                className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-9 h-9 rounded-md object-cover shrink-0 border border-gray-200 dark:border-zinc-700"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-md bg-gray-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                      {prod.stock} units ({prod.inStock ? 'In Stock' : 'Out of Stock'})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleProductStock(prod.id, prod.inStock)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors shrink-0 ${
                    prod.inStock
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100'
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
