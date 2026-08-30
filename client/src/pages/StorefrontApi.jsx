import React, { useState, useEffect } from 'react';
import {
  Globe2,
  Code2,
  Download,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Database,
  RefreshCw,
  Server
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';

export default function StorefrontApi() {
  const { showToast, settings, refreshAllData } = useAdmin();
  const [catalogJson, setCatalogJson] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  const fetchCatalogPreview = async () => {
    try {
      setLoadingCatalog(true);
      const res = await api.getStorefrontCatalog();
      setCatalogJson(res);
    } catch (err) {
      showToast('Failed to fetch live catalog bundle: ' + err.message, 'error');
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    fetchCatalogPreview();
  }, []);

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Code snippet copied to clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBackup = () => {
    window.open('/api/settings/backup/export', '_blank');
    showToast('Downloading full store backup JSON... 💾');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          await api.restoreBackup(parsed);
          showToast('Database restored successfully from file! 🎉');
          refreshAllData();
          fetchCatalogPreview();
        } catch (err) {
          showToast('Invalid JSON file format: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const reactIntegrationSnippet = `// In your BeeGo React Storefront (e.g. bee-go.vercel.app):
import { useEffect, useState } from 'react';

export function useBeeGoCatalog() {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your deployed admin backend URL (or http://localhost:5000 in dev)
    const BACKEND_API = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000/api' 
      : 'https://your-beego-admin-backend.onrender.com/api';

    fetch(\`\${BACKEND_API}/storefront/catalog\`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // data.products    -> All products added via Admin Panel
          // data.categories  -> All categories
          // data.coupons     -> Active promo codes
          // data.store       -> Store Open/Close & WhatsApp
          setCatalog(data);
        }
      })
      .catch(err => console.error('BeeGo API sync error:', err))
      .finally(() => setLoading(false));
  }, []);

  return { catalog, loading };
}`;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Storefront Integration & REST API Hub
            </h1>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-beego-500 text-black">
              bee-go.vercel.app
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Connect and synchronize your live frontend with this backend database
          </p>
        </div>

        <a
          href="https://bee-go.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-black text-xs shadow-sm flex items-center gap-2 hover:bg-gray-800 transition-all"
        >
          <span>Open bee-go.vercel.app</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* API Endpoints Directory */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-beego-500" />
          <h2 className="font-black text-base text-gray-900 dark:text-white">
            Available Live REST API Endpoints
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-black text-[10px]">GET</span>
              <span className="font-bold text-gray-900 dark:text-white">/api/storefront/catalog</span>
            </div>
            <p className="text-[11px] text-gray-400">Complete bundle with categories, active products, coupons & store status.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-black text-[10px]">GET</span>
              <span className="font-bold text-gray-900 dark:text-white">/api/products?category=food</span>
            </div>
            <p className="text-[11px] text-gray-400">Filtered products list with instant search & category queries.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white font-black text-[10px]">POST</span>
              <span className="font-bold text-gray-900 dark:text-white">/api/storefront/order</span>
            </div>
            <p className="text-[11px] text-gray-400">Places customer orders directly into admin queue with WhatsApp dispatch.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-black text-[10px]">GET</span>
              <span className="font-bold text-gray-900 dark:text-white">/api/storefront/status</span>
            </div>
            <p className="text-[11px] text-gray-400">Quick ping for Store Open/Close status & emergency announcement.</p>
          </div>
        </div>
      </div>

      {/* Ready-to-use Frontend Code Snippet */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="font-black text-base text-gray-900 dark:text-white">
                Frontend Integration Snippet (React)
              </h3>
              <p className="text-xs text-gray-400">Copy & paste into your storefront codebase</p>
            </div>
          </div>

          <button
            onClick={() => handleCopyCode(reactIntegrationSnippet)}
            className="px-3 py-1.5 rounded-xl bg-beego-500/10 hover:bg-beego-500/20 text-beego-700 dark:text-beego-400 font-extrabold text-xs flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-gray-950 text-gray-200 font-mono text-xs overflow-x-auto max-h-72">
          <pre>{reactIntegrationSnippet}</pre>
        </div>
      </div>

      {/* Database Backup & Restore & Raw JSON Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup / Restore Controls */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              <h3 className="font-black text-base text-gray-900 dark:text-white">
                Catalog Backup & Data Portability
              </h3>
            </div>
            <p className="text-xs text-gray-400">
              Download complete snapshot of products, categories, coupons, and orders, or upload a JSON backup file to restore.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={handleDownloadBackup}
              className="w-full py-3 rounded-2xl bg-beego-500 hover:bg-beego-600 text-black font-black text-xs shadow-glow-yellow flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Database Backup (JSON)</span>
            </button>

            <label className="w-full py-3 rounded-2xl bg-gray-100 dark:bg-darkbg hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-black text-xs border border-gray-200/60 dark:border-darkbg-border flex items-center justify-center gap-2 cursor-pointer transition-all">
              <Upload className="w-4 h-4" />
              <span>Restore from Backup File (.json)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Live Catalog Output Viewer */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-beego-500" />
              <h3 className="font-black text-base text-gray-900 dark:text-white">
                Live Storefront Payload
              </h3>
            </div>
            <button
              onClick={fetchCatalogPreview}
              disabled={loadingCatalog}
              className="p-2 rounded-xl bg-gray-100 dark:bg-darkbg text-gray-600 dark:text-gray-400 hover:text-beego-500 transition-all"
              title="Refresh JSON preview"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingCatalog ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-950 text-gray-300 font-mono text-[11px] overflow-auto max-h-56">
            <pre>
              {catalogJson ? JSON.stringify(catalogJson, null, 2) : 'Loading catalog payload...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
