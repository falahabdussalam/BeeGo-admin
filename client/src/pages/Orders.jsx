import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Eye,
  Columns3,
  List,
  Clock,
  CheckCircle2,
  Package
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import OrderModal from '../components/OrderModal';

const STATUS_COLUMNS = [
  { id: 'pending', title: 'Pending', badge: 'bg-amber-500' },
  { id: 'confirmed', title: 'Confirmed', badge: 'bg-blue-500' },
  { id: 'preparing', title: 'Preparing', badge: 'bg-purple-500' },
  { id: 'out_for_delivery', title: 'Out for Delivery', badge: 'bg-orange-500' },
  { id: 'delivered', title: 'Delivered', badge: 'bg-emerald-500' }
];

export default function Orders() {
  const { orders } = useAdmin();
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
          (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
          (o.customerName && o.customerName.toLowerCase().includes(q)) ||
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Orders & Dispatch
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Live Tracker
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Real-time order processing, dispatch status, and customer tracking
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-white dark:bg-zinc-800 p-1 rounded-lg border border-gray-300 dark:border-zinc-700">
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'kanban'
                ? 'bg-gray-100 dark:bg-zinc-700 text-amber-600 dark:text-amber-400'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Columns3 className="w-4 h-4" />
            <span className="hidden sm:inline">Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'list'
                ? 'bg-gray-100 dark:bg-zinc-700 text-amber-600 dark:text-amber-400'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, or phone..."
            className="control-input pl-9"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="control-select"
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
      </div>

      {/* Orders Board or Empty State */}
      {orders.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-gray-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            No orders placed yet
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            When customers place orders from your online storefront, they will immediately appear here with sound alert notifications.
          </p>
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map(col => {
            const columnOrders = filteredOrders.filter(o => o.orderStatus === col.id);
            return (
              <div
                key={col.id}
                className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col justify-between min-h-[420px] shadow-sm"
              >
                <div>
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.badge}`} />
                      <h3 className="font-semibold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                        {col.title}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300">
                      {columnOrders.length}
                    </span>
                  </div>

                  {/* Orders Cards List */}
                  <div className="space-y-2.5">
                    {columnOrders.length === 0 ? (
                      <div className="text-center py-8 text-[11px] text-gray-400 dark:text-zinc-500">
                        No orders in this column
                      </div>
                    ) : (
                      columnOrders.map(ord => (
                        <div
                          key={ord.id}
                          onClick={() => setSelectedOrder(ord)}
                          className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 hover:border-amber-500 cursor-pointer transition-colors space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-gray-900 dark:text-white">
                              #{ord.orderNumber}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(ord.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <p className="text-xs font-medium text-gray-800 dark:text-zinc-200 truncate">
                            {ord.customerName}
                          </p>

                          <div className="text-[11px] text-gray-500 dark:text-zinc-400">
                            {ord.items?.length || 0} items • ₹{ord.grandTotal}
                          </div>

                          <div className="pt-1 border-t border-gray-200 dark:border-zinc-700 flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-gray-600 dark:text-zinc-300 uppercase">
                              {ord.paymentMethod}
                            </span>
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              Inspect →
                            </span>
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
        /* Table View */
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-zinc-800/70 text-gray-500 dark:text-zinc-400 font-semibold border-b border-gray-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total & Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 font-normal">
                {filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                          #{order.orderNumber}
                        </span>
                        <p className="text-[10px] text-gray-400">
                          {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.customerName}
                        </p>
                        <p className="text-[11px] text-gray-400">{order.customerPhone}</p>
                      </div>
                    </td>

                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-gray-700 dark:text-zinc-300 truncate">
                        {order.address?.fullAddress || 'N/A'}
                      </p>
                      <p className="text-[10px] text-gray-400">{order.address?.city}</p>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800 dark:text-zinc-200">
                        {order.items?.length || 0} items
                      </span>
                      <p className="text-[11px] text-gray-400 truncate max-w-xs">
                        {order.items?.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        ₹{order.grandTotal}
                      </span>
                      <span className="text-[10px] text-gray-400 block uppercase">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn-secondary text-xs py-1 px-2.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
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
