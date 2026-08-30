import React, { useState } from 'react';
import { Plus, MapPin, Bike, Phone, Clock, CheckCircle2, AlertCircle, Edit2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';
import RiderModal from '../components/RiderModal';

export default function Delivery() {
  const { zones, riders, showToast, refreshAllData } = useAdmin();
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [editingRider, setEditingRider] = useState(null);

  const handleToggleZone = async (zone) => {
    try {
      await api.updateZone(zone.id, { isActive: !zone.isActive });
      showToast(`Zone "${zone.name}" is now ${!zone.isActive ? 'Active' : 'Disabled'}`);
      refreshAllData(true);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateZoneFee = async (zone, newFee) => {
    try {
      await api.updateZone(zone.id, { deliveryFee: Number(newFee) });
      showToast(`Delivery fee for "${zone.name}" updated to ₹${newFee}`);
      refreshAllData(true);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleRiderStatus = async (rider, newStatus) => {
    try {
      await api.updateRider(rider.id, { status: newStatus });
      showToast(`Rider ${rider.name} status updated to ${newStatus}`);
      refreshAllData(true);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Delivery Zones & Fleet Operations
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Manage Virajpete delivery zones, pricing rules & active rider dispatches
          </p>
        </div>

        <button
          onClick={() => {
            setEditingRider(null);
            setIsRiderModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-beego-500 hover:bg-beego-600 text-black font-black text-xs shadow-glow-yellow flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register Rider</span>
        </button>
      </div>

      {/* Delivery Zones Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-black text-gray-900 dark:text-white">
            Virajpete Coverage Zones ({zones.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map(zone => (
            <div
              key={zone.id}
              className="p-5 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border flex flex-col justify-between space-y-4 hover:shadow-xs transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h3 className="font-black text-sm text-gray-900 dark:text-white">
                      {zone.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleToggleZone(zone)}
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full transition-all ${
                      zone.isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-gray-100 dark:bg-darkbg text-gray-400'
                    }`}
                  >
                    {zone.isActive ? 'Active Zone' : 'Disabled'}
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold">
                  <span>Area: {zone.area}</span>
                  <span>•</span>
                  <span>PIN: {zone.pincode}</span>
                  <span>•</span>
                  <span>Est: {zone.estimatedMinutes}</span>
                </div>
              </div>

              {/* Fee Control */}
              <div className="pt-3 border-t border-gray-100 dark:border-darkbg-border flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-gray-400 block font-semibold text-[11px]">Delivery Fee:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-black text-sm text-gray-900 dark:text-white">₹</span>
                    <input
                      type="number"
                      defaultValue={zone.deliveryFee}
                      onBlur={e => handleUpdateZoneFee(zone, e.target.value)}
                      className="w-16 px-2 py-1 rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-black text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-gray-400 block font-semibold text-[11px]">Free Delivery Above:</span>
                  <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                    ₹{zone.freeDeliveryAbove}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Riders Fleet Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bike className="w-5 h-5 text-beego-500" />
          <h2 className="text-lg font-black text-gray-900 dark:text-white">
            Active Delivery Fleet & Riders ({riders.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riders.map(rider => (
            <div
              key={rider.id}
              className="p-5 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border flex flex-col justify-between space-y-4 hover:shadow-xs transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-beego-500 text-black flex items-center justify-center font-black text-base shadow-sm">
                      {rider.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-gray-900 dark:text-white">
                        {rider.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-semibold">{rider.phone}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingRider(rider);
                      setIsRiderModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-darkbg-hover"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300 font-medium">
                  <p>🛵 <span className="font-bold">{rider.vehicle}</span></p>
                  <p>📍 {rider.zone}</p>
                </div>
              </div>

              {/* Status Switcher & Stats */}
              <div className="pt-3 border-t border-gray-100 dark:border-darkbg-border flex items-center justify-between">
                <div className="text-[11px] font-bold text-gray-400">
                  <span>⭐ {rider.rating || '5.0'}</span> • <span>{rider.completedOrders || 0} orders</span>
                </div>

                <select
                  value={rider.status}
                  onChange={e => handleToggleRiderStatus(rider, e.target.value)}
                  className="px-2.5 py-1 rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white"
                >
                  <option value="available">🟢 Available</option>
                  <option value="busy">🟡 On Delivery</option>
                  <option value="offline">⚪ Offline</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rider Modal */}
      <RiderModal
        isOpen={isRiderModalOpen}
        onClose={() => {
          setIsRiderModalOpen(false);
          setEditingRider(null);
        }}
        rider={editingRider}
      />
    </div>
  );
}
