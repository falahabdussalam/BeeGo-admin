import React, { useState, useEffect } from 'react';
import {
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
  const { showToast, refreshAllData } = useAdmin();
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
    showToast('Code snippet copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBackup = () => {
    window.open('/api/settings/backup/export', '_blank');
    showToast('Downloading full store backup JSON');
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
          showToast('Database restored successfully from backup file');
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

  const reactIntegrationSnippet = `// In your React Storefront (e.g. Next.js, Vite, or Create React App):
import { useEffect, useState } from 'react';

export function useStoreCatalog() {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BACKEND_API = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000/api' 
      : '/api';

    fetch(\`\${BACKEND_API}/storefront/catalog\`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // data.products    -> Active products from Admin Panel
          // data.categories  -> Store categories
          // data.coupons     -> Active promo codes
          // data.store       -> Store settings & operating hours
          setCatalog(data);
        }
      })
      .catch(err => console.error('API sync error:', err))
      .finally(() => setLoading(false));
  }, []);

  return { catalog, loading };
}`;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Storefront API & Integration
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            REST endpoints, client integration snippets, and database backup tools
          </p>
        </div>

        <a
          href="https://bee-go.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs py-2 px-3.5"
        >
          <span>Open Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* API Endpoints Directory */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-amber-500" />
          <h2 className="font-semibold text-sm text-gray-900 dark:text-white">
            Available REST Endpoints
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-1.5 py-0.5 rounded-sm bg-emerald-600 text-white font-bold text-[10px]">GET</span>
              <span className="font-semibold text-gray-900 dark:text-white">/api/storefront/catalog</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400">Complete bundle with categories, products, coupons & store status.</p>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-1.5 py-0.5 rounded-sm bg-emerald-600 text-white font-bold text-[10px]">GET</span>
              <span className="font-semibold text-gray-900 dark:text-white">/api/products</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400">Filtered products list with search and category filters.</p>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-1.5 py-0.5 rounded-sm bg-blue-600 text-white font-bold text-[10px]">POST</span>
              <span className="font-semibold text-gray-900 dark:text-white">/api/storefront/order</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400">Places customer orders directly into admin dispatch queue.</p>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-1.5 py-0.5 rounded-sm bg-emerald-600 text-white font-bold text-[10px]">GET</span>
              <span className="font-semibold text-gray-900 dark:text-white">/api/storefront/status</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400">Ping store open/closed state and emergency notice.</p>
          </div>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              Frontend Integration Snippet (React)
            </h3>
          </div>

          <button
            onClick={() => handleCopyCode(reactIntegrationSnippet)}
            className="btn-secondary text-xs py-1 px-2.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="p-3.5 rounded-lg bg-gray-950 text-gray-200 font-mono text-xs overflow-x-auto max-h-64 border border-zinc-800">
          <pre>{reactIntegrationSnippet}</pre>
        </div>
      </div>

      {/* Database Backup & Restore & Raw JSON Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup / Restore Controls */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-500" />
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Database Backup & Restore
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Download snapshot of all active products, categories, coupons, and orders as JSON, or upload a backup file to restore.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleDownloadBackup}
              className="btn-primary w-full text-xs py-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Full Database Backup (JSON)</span>
            </button>

            <label className="btn-secondary w-full text-xs py-2 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
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
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Live Storefront Payload
              </h3>
            </div>
            <button
              onClick={fetchCatalogPreview}
              disabled={loadingCatalog}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-white"
              title="Refresh JSON preview"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingCatalog ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="p-3 rounded-lg bg-gray-950 text-gray-300 font-mono text-[11px] overflow-auto max-h-48 border border-zinc-800">
            <pre>
              {catalogJson ? JSON.stringify(catalogJson, null, 2) : 'Loading catalog payload...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
