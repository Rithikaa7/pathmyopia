import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Trash2,
  ArrowUpDown,
  Download,
  ScanEye,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Database,
  ExternalLink
} from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { EmptyState } from '../components/FeedbackStates';
import { getAnalysisHistory, deleteAnalysis } from '../services/api';
import { AnalysisRecord } from '../types';

export const HistoryPage: React.FC = () => {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pmFilter, setPmFilter] = useState<'all' | 'pm' | 'non_pm'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | '0' | '1' | '2' | '3' | '4'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'prob' | 'id'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setRecords(getAnalysisHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteAnalysis(id);
    setRecords(records.filter((r) => r.id !== id));
    setDeleteConfirmId(null);
  };

  // Filter and sort records
  const filtered = records
    .filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.imageIdentifier && r.imageIdentifier.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.researcherNotes && r.researcherNotes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchPm =
        pmFilter === 'all' ||
        (pmFilter === 'pm' && r.pmClassification?.predictedClass === 'Pathological Myopia') ||
        (pmFilter === 'non_pm' && r.pmClassification?.predictedClass === 'Non-PM');

      const matchSev =
        severityFilter === 'all' ||
        (r.severity && r.severity.level.toString() === severityFilter);

      return matchSearch && matchPm && matchSev;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortBy === 'prob') {
        const probA = a.pmClassification?.probability ?? 0;
        const probB = b.pmClassification?.probability ?? 0;
        comparison = probB - probA;
      } else if (sortBy === 'id') {
        comparison = (a.imageIdentifier || a.id).localeCompare(b.imageIdentifier || b.id);
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

  const exportAllHistoryCSV = () => {
    const headers = ['id', 'imageIdentifier', 'title', 'timestamp', 'pmClass', 'pmProbability', 'severity', 'isDemo'];
    const rows = filtered.map((r) => [
      r.id,
      r.imageIdentifier || '',
      `"${r.title.replace(/"/g, '""')}"`,
      r.timestamp,
      r.pmClassification?.predictedClass || '',
      r.pmClassification?.probability || '',
      r.severity?.label || '',
      r.isDemo ? 'true' : 'false',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PathMyo_History_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <PageContainer
      title="Analysis History & Cohort Records"
      subtitle="Search, filter, and inspect saved pathological myopia analyses. Data is securely persisted in local browser storage."
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={exportAllHistoryCSV}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-subtle transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover shadow-subtle transition-colors"
          >
            <ScanEye className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by image ID, title, or researcher notes..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* PM Class Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
              <span className="text-slate-500 font-medium">PM:</span>
              <select
                value={pmFilter}
                onChange={(e) => setPmFilter(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">All Classes</option>
                <option value="pm">PM Positive</option>
                <option value="non_pm">Non-PM Controls</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
              <span className="text-slate-500 font-medium">Grade:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">All Grades</option>
                <option value="0">Category 0</option>
                <option value="1">Category 1</option>
                <option value="2">Category 2</option>
                <option value="3">Category 3</option>
                <option value="4">Category 4</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="date">Sort by Date</option>
                <option value="prob">Sort by P(PM)</option>
                <option value="id">Sort by ID</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No Matching Records Found"
            description="No analyses match your search query or filter criteria. Try clearing filters or analyzing a new fundus image."
            action={{
              label: 'Analyze New Image',
              onClick: () => setSearchTerm(''),
              icon: ScanEye,
            }}
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Fundus Preview</th>
                    <th className="py-3 px-4">Image ID & Title</th>
                    <th className="py-3 px-4">PM Probability</th>
                    <th className="py-3 px-4">Severity Grade</th>
                    <th className="py-3 px-4">Model & Mode</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((rec) => {
                    const isPM = rec.pmClassification?.predictedClass === 'Pathological Myopia';
                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4">
                          <Link to={`/results/${rec.id}`}>
                            <img
                              src={rec.thumbnailUrl || rec.imageUrl}
                              alt={rec.title}
                              className="w-11 h-11 rounded-lg object-cover border border-slate-200 shadow-xs hover:scale-105 transition-transform"
                            />
                          </Link>
                        </td>
                        <td className="py-2.5 px-4">
                          <Link
                            to={`/results/${rec.id}`}
                            className="font-bold text-slate-900 hover:text-primary transition-colors block"
                          >
                            {rec.title}
                          </Link>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {rec.imageIdentifier || rec.id}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          {rec.pmClassification ? (
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isPM ? 'bg-red-500' : 'bg-emerald-500'
                                }`}
                              />
                              <span className="font-mono font-bold text-slate-900">
                                {(rec.pmClassification.probability * 100).toFixed(1)}%
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                ({isPM ? 'PM Positive' : 'Control'})
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Not evaluated</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          {rec.severity ? (
                            <span className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                              {rec.severity.label}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">N/A</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="text-slate-800 font-medium">RETFound Multi-Task</div>
                          <span
                            className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-mono ${
                              rec.isDemo
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {rec.isDemo ? 'Demo Mode' : 'Connected'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-[11px] text-slate-500 font-mono">
                          {rec.timestamp}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/results/${rec.id}`}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-primary hover:text-white text-slate-700 font-semibold transition-colors inline-flex items-center gap-1"
                            >
                              <span>View</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(rec.id)}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                Showing {filtered.length} of {records.length} records in local workspace
              </span>
              <span className="text-[11px] text-slate-400">
                Storage: Local browser persistence
              </span>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-card border border-slate-200 max-w-sm w-full p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirm Record Deletion</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete this analysis record from your local workspace? This action cannot be undone.
              </p>
              <div className="pt-2 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow-xs"
                >
                  Delete Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
