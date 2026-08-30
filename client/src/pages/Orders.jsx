import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Printer,
  Clock,
  MapPin,
  Bike,
  Columns3,
  List,
  CheckCircle2
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import OrderModal from '../components/OrderModal';

const STATUS_COLUMNS = [
  { id: 'pending', title: 'Pending', color: 'border-amber-500 bg-amber-500/5', badge: 'bg-amber-500' },
  { id: 'confirmed', title: 'Confirmed', color: 'border-blue-500 bg-blue-500/5', badge: 'bg-blue-500' },
  { id: 'preparing', title: 'Preparing in Kitchen', color: 'border-purple-500 bg-purple-500/5', badge: 'bg-purple-500' },
  { id: 'out_for_delivery', title: 'Out for Delivery', color: 'border-orange-500 bg-orange-500/5', badge: 'bg-orange-500' },
  { id: 'delivered', title: 'Delivered', color: 'border-emerald-500 bg-emerald-500/5', badge: 'bg-emerald-500' }
];

export default function Orders() {
  const { orders, updateOrderStatus, riders } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          (o.customerPhone && o.customerPhone.includes(q))
        );
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Orders & Dispatch Board
            </h1>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Live Tracker
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Virajpete order processing, kitchen prep & WhatsApp rider routing
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-darkbg-card p-1 rounded-2xl border border-gray-200/60 dark:border-darkbg-border">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-darkbg shadow-xs text-beego-500'
                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              <Columns3 className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-darkbg shadow-xs text-beego-500'
                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Order # (e.g. VP-8891), customer name or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
        >
          <option value="all">All Order Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map(col => {
            const columnOrders = filteredOrders.filter(o => o.orderStatus === col.id);
            return (
              <div
                key={col.id}
                className={`p-4 rounded-3xl bg-white dark:bg-darkbg-card border ${col.color} flex flex-col justify-between min-h-[500px] shadow-xs`}
              >
                <div>
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-darkbg-border">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.badge}`} />
                      <h3 className="font-black text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                        {col.title}
                      </h3>
                    </div>
                    <span className="text-xs font-extrabold text-gray-400">
                      {columnOrders.length}
                    </span>
                  </div>

                  {/* Column Order Cards */}
                  <div className="space-y-3">
                    {columnOrders.length === 0 ? (
                      <div className="py-12 text-center text-gray-400 text-xs font-bold">
                        No orders here
                      </div>
                    ) : (
                      columnOrders.map(order => (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="p-3.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border hover:border-beego-500 cursor-pointer transition-all space-y-2 hover:shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-gray-900 dark:text-white">
                              #{order.orderNumber}
                            </span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-beego-500 text-black">
                              ₹{order.grandTotal}
                            </span>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                              {order.customerName}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">
                              {order.address.fullAddress}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-gray-200/50 dark:border-darkbg-border text-[10px] text-gray-400 font-semibold">
                            <span>{order.items.length} items • {order.paymentMethod}</span>
                            <span>{order.riderName ? `🛵 ${order.riderName.split(' ')[0]}` : 'Unassigned'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-darkbg text-gray-400 dark:text-gray-500 font-extrabold uppercase border-b border-gray-100 dark:border-darkbg-border">
                <tr>
                  <th className="p-4">Order ID & Time</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Items Summary</th>
                  <th className="p-4">Total & Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-darkbg-border font-medium">
                {filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/70 dark:hover:bg-darkbg-hover/50 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <span className="font-black text-sm text-gray-900 dark:text-white">
                          #{order.orderNumber}
                        </span>
                        <p className="text-[10px] text-gray-400">
                          {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {order.customerName}
                        </p>
                        <p className="text-[10px] text-gray-400">{order.customerPhone}</p>
                      </div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="text-gray-700 dark:text-gray-300 truncate">
                        {order.address.fullAddress}
                      </p>
                      <p className="text-[10px] text-gray-400">{order.address.city}</p>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {order.items.length} items
                      </span>
                      <p className="text-[10px] text-gray-400 truncate max-w-xs">
                        {order.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                      </p>
                    </td>

                    <td className="p-4">
                      <span className="font-black text-sm text-gray-900 dark:text-white">
                        ₹{order.grandTotal}
                      </span>
                      <span className="text-[10px] text-gray-400 block uppercase">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-beego-500/10 text-beego-600 dark:text-beego-400 border border-beego-500/20 uppercase">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-darkbg hover:bg-beego-500 hover:text-black text-gray-700 dark:text-gray-300 font-bold transition-all text-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
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
