import React, { useState } from 'react';
import { Plus, MapPin, Bike, Edit2, Trash2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';
import RiderModal from '../components/RiderModal';

export default function Delivery() {
  const { zones, riders, showToast, refreshAllData } = useAdmin();
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [editingRider, setEditingRider] = useState(null);
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [zoneFormData, setZoneFormData] = useState({
    name: '',
    deliveryFee: 20,
    minMinutes: 20,
    maxMinutes: 35
  });

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

  const handleDeleteZone = async (zone) => {
    if (window.confirm(`Delete delivery zone "${zone.name}"?`)) {
      try {
        await api.deleteZone(zone.id);
        showToast('Zone deleted');
        refreshAllData(true);
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  const handleCreateZone = async (e) => {
    e.preventDefault();
    if (!zoneFormData.name.trim()) {
      showToast('Zone name is required', 'error');
      return;
    }
    try {
      await api.createZone(zoneFormData);
      showToast('Delivery zone created');
      setZoneFormData({ name: '', deliveryFee: 20, minMinutes: 20, maxMinutes: 35 });
      setIsAddingZone(false);
      refreshAllData(true);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleRiderStatus = async (rider, newStatus) => {
    try {
      await api.updateRider(rider.id, { status: newStatus });
      showToast(`Rider ${rider.name} status set to ${newStatus}`);
      refreshAllData(true);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteRider = async (rider) => {
    if (window.confirm(`Remove rider "${rider.name}" from fleet?`)) {
      try {
        await api.deleteRider(rider.id);
        showToast('Rider removed');
        refreshAllData(true);
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Delivery & Fleet Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Configure delivery coverage zones, pricing rules, and active delivery partners
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingZone(true)}
            className="btn-secondary text-xs py-2 px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Zone</span>
          </button>
          <button
            onClick={() => {
              setEditingRider(null);
              setIsRiderModalOpen(true);
            }}
            className="btn-primary text-xs py-2 px-3.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Rider</span>
          </button>
        </div>
      </div>

      {/* Add Zone Inline Form Modal */}
      {isAddingZone && (
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Create New Delivery Zone
            </h3>
            <button
              onClick={() => setIsAddingZone(false)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-zinc-400"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleCreateZone} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="control-label">Zone Name</label>
              <input
                type="text"
                required
                value={zoneFormData.name}
                onChange={e => setZoneFormData({ ...zoneFormData, name: e.target.value })}
                placeholder="e.g. Central Town"
                className="control-input"
              />
            </div>
            <div>
              <label className="control-label">Delivery Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={zoneFormData.deliveryFee}
                onChange={e => setZoneFormData({ ...zoneFormData, deliveryFee: e.target.value })}
                className="control-input"
              />
            </div>
            <div>
              <label className="control-label">Est. Time Range (Mins)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  value={zoneFormData.minMinutes}
                  onChange={e => setZoneFormData({ ...zoneFormData, minMinutes: e.target.value })}
                  className="control-input"
                  placeholder="Min"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  min="5"
                  value={zoneFormData.maxMinutes}
                  onChange={e => setZoneFormData({ ...zoneFormData, maxMinutes: e.target.value })}
                  className="control-input"
                  placeholder="Max"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="btn-primary w-full text-xs py-2"
              >
                Save Zone
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delivery Zones Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Coverage Zones ({zones.length})
          </h2>
        </div>

        {zones.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center space-y-2">
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              No delivery zones defined yet. Default store delivery fees will apply.
            </p>
            <button
              onClick={() => setIsAddingZone(true)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Delivery Zone</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map(zone => (
              <div
                key={zone.id}
                className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${zone.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                        {zone.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleZone(zone)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                          zone.isActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400'
                        }`}
                      >
                        {zone.isActive ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => handleDeleteZone(zone)}
                        className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                        title="Delete Zone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    Est: {zone.minMinutes || 20}-{zone.maxMinutes || 35} mins delivery
                  </p>
                </div>

                {/* Fee Control */}
                <div className="pt-2.5 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="text-xs flex items-center gap-2">
                    <span className="text-gray-500 dark:text-zinc-400 font-medium">Delivery Fee:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-900 dark:text-white">₹</span>
                      <input
                        type="number"
                        min="0"
                        defaultValue={zone.deliveryFee}
                        onBlur={e => handleUpdateZoneFee(zone, e.target.value)}
                        className="w-16 px-2 py-0.5 rounded-md border border-gray-300 dark:border-zinc-700 text-xs font-semibold text-gray-900 dark:text-white bg-white dark:bg-zinc-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Riders Fleet Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Bike className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Delivery Fleet ({riders.length})
          </h2>
        </div>

        {riders.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center space-y-2">
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              No delivery partners registered yet.
            </p>
            <button
              onClick={() => {
                setEditingRider(null);
                setIsRiderModalOpen(true);
              }}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Delivery Partner</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {riders.map(rider => (
              <div
                key={rider.id}
                className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col justify-between space-y-3 shadow-sm hover:border-gray-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold text-sm shadow-sm">
                        {rider.name ? rider.name.charAt(0).toUpperCase() : 'R'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                          {rider.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">{rider.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingRider(rider);
                          setIsRiderModalOpen(true);
                        }}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-white"
                        title="Edit Rider"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRider(rider)}
                        className="p-1 rounded-md text-gray-400 hover:text-rose-600"
                        title="Remove Rider"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 dark:text-zinc-300 space-y-0.5">
                    {rider.vehicle && <p>Vehicle: {rider.vehicle}</p>}
                    <p>Zone: {rider.zone || 'Primary Area'}</p>
                  </div>
                </div>

                {/* Status Switcher & Stats */}
                <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 dark:text-zinc-400">
                    {rider.completedOrders || 0} orders completed
                  </span>

                  <select
                    value={rider.status}
                    onChange={e => handleToggleRiderStatus(rider, e.target.value)}
                    className="px-2 py-0.5 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-gray-900 dark:text-white"
                  >
                    <option value="available">Available</option>
                    <option value="busy">On Delivery</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
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
