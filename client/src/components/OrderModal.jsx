import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  MessageSquare,
  Send,
  MapPin,
  User,
  Phone,
  CreditCard,
  Bike
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';

const STATUS_STEPS = [
  { id: 'pending', label: 'Pending', activeClass: 'bg-amber-500 text-black font-semibold' },
  { id: 'confirmed', label: 'Confirmed', activeClass: 'bg-blue-600 text-white font-semibold' },
  { id: 'preparing', label: 'Preparing', activeClass: 'bg-purple-600 text-white font-semibold' },
  { id: 'out_for_delivery', label: 'Out for Delivery', activeClass: 'bg-orange-600 text-white font-semibold' },
  { id: 'delivered', label: 'Delivered', activeClass: 'bg-emerald-600 text-white font-semibold' },
  { id: 'cancelled', label: 'Cancelled', activeClass: 'bg-rose-600 text-white font-semibold' }
];

export default function OrderModal({ isOpen, onClose, order }) {
  const { riders, updateOrderStatus, settings } = useAdmin();
  const [currentStatus, setCurrentStatus] = useState('pending');
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [waLinks, setWaLinks] = useState(null);

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.orderStatus || 'pending');
      setSelectedRiderId(order.riderId || '');
      // Fetch dynamic WhatsApp dispatch texts
      api.getOrderWhatsAppLinks(order.id)
        .then(res => setWaLinks(res.data))
        .catch(() => setWaLinks(null));
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleStatusChange = async (newStatus) => {
    setCurrentStatus(newStatus);
    const selectedRider = riders.find(r => r.id === selectedRiderId);
    await updateOrderStatus(order.id, newStatus, {
      riderId: selectedRiderId,
      riderName: selectedRider?.name || null
    });
  };

  const handleRiderChange = async (rId) => {
    setSelectedRiderId(rId);
    const selectedRider = riders.find(r => r.id === rId);
    await updateOrderStatus(order.id, currentStatus, {
      riderId: rId,
      riderName: selectedRider?.name || null
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const formattedTime = new Date(order.orderTime).toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-3xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Order #{order.orderNumber}
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase">
                  {currentStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Placed on {formattedTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintReceipt}
              className="btn-secondary text-xs py-1.5 px-3"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status Pipeline Buttons */}
          <div className="no-print space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
              Order Status Pipeline
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {STATUS_STEPS.map(step => {
                const isCurrent = currentStatus === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStatusChange(step.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      isCurrent
                        ? `${step.activeClass} border-transparent shadow-sm`
                        : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick WhatsApp Dispatch Action Bar */}
          {waLinks && (
            <div className="no-print p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                    WhatsApp Quick Dispatch
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Send formatted order notifications with 1-click
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {waLinks.customerUrl && (
                  <a
                    href={waLinks.customerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Msg Customer</span>
                  </a>
                )}

                {waLinks.riderUrl && (
                  <a
                    href={waLinks.riderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>Dispatch Rider</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Customer & Delivery Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 space-y-2">
              <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-zinc-400 block">
                Customer Information
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <User className="w-4 h-4 text-amber-500" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-300">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{order.customerPhone || 'No phone provided'}</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-zinc-300 pt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p>{order.address?.fullAddress || 'Store Pickup / Standard Delivery'}</p>
                  {order.address?.landmark && (
                    <p className="text-[11px] text-gray-400">Landmark: {order.address.landmark}</p>
                  )}
                  {order.address?.city && (
                    <p className="text-[11px] text-gray-400">{order.address.city} {order.address?.pincode ? `(${order.address.pincode})` : ''}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment & Rider Box */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 space-y-3">
              <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-zinc-400 block">
                Payment & Rider
              </span>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-gray-600 dark:text-zinc-300">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  Payment Method:
                </span>
                <span className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 font-semibold uppercase">
                  {order.paymentMethod} ({order.paymentStatus})
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-gray-600 dark:text-zinc-300 flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-amber-500" />
                  Assigned Delivery Rider:
                </label>
                <select
                  value={selectedRiderId}
                  onChange={e => handleRiderChange(e.target.value)}
                  className="control-select text-xs py-1.5"
                >
                  <option value="">-- No Rider Assigned --</option>
                  {riders.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.vehicle || 'Rider'})
                    </option>
                  ))}
                </select>
              </div>

              {order.notes && (
                <div className="p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
                  Note: "{order.notes}"
                </div>
              )}
            </div>
          </div>

          {/* Items Table & Total (Printable Receipt Container) */}
          <div id="printable-receipt" className="space-y-3">
            <div className="hidden print:block text-center border-b pb-2 mb-2">
              <h1 className="text-xl font-bold">{settings.storeName}</h1>
              <p className="text-xs">{settings.address}</p>
              <p className="text-xs">Order #{order.orderNumber} • {formattedTime}</p>
              <p className="text-xs">Customer: {order.customerName} ({order.customerPhone})</p>
            </div>

            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 block">
              Ordered Items ({order.items?.length || 0})
            </span>

            <div className="rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-zinc-800/70 text-gray-500 dark:text-zinc-400 font-semibold border-b border-gray-200 dark:border-zinc-700">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="text-gray-800 dark:text-zinc-200">
                      <td className="p-3 font-medium">{item.name}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">₹{item.price}</td>
                      <td className="p-3 text-right font-semibold">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bill Summary */}
            <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 space-y-1.5 text-xs text-gray-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-gray-900 dark:text-white font-medium">₹{order.itemTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Coupon Discount ({order.couponCode || 'PROMO'})</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 dark:border-zinc-700 flex justify-between text-sm font-bold text-gray-900 dark:text-white">
                <span>Grand Total</span>
                <span className="text-amber-600 dark:text-amber-400 text-base">₹{order.grandTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-end gap-2.5 no-print">
          <button
            onClick={onClose}
            className="btn-primary text-xs py-2 px-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
