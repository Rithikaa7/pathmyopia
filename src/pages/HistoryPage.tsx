import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Trash2,
  ArrowUpDown,
  Download,
  ScanEye,
  AlertTriangle,
  ArrowRight,
  Database
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
    link.setAttribute('download', `OcuLoom_History_Export_${Date.now()}.csv`);
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DADBD3] hover:border-[#777B76] text-[#171A19] rounded-xs text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-[#254E43]" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#254E43] text-white rounded-xs text-xs font-mono uppercase tracking-wider hover:bg-[#1B3B32] transition-colors"
          >
            <ScanEye className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search & Filter Toolbar */}
        <div className="bg-white/80 p-4 rounded-xs border border-[#DADBD3] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-[#777B76] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by specimen ID, title, or researcher notes..."
              className="w-full pl-9 pr-4 py-1.5 border border-[#DADBD3] rounded-xs bg-white text-xs text-[#171A19] focus:outline-none focus:border-[#254E43] font-mono"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* PM Class Filter */}
            <div className="flex items-center gap-1.5 bg-[#F5F3ED] border border-[#DADBD3] px-2.5 py-1.5 rounded-xs">
              <span className="text-[#777B76]">PM:</span>
              <select
                value={pmFilter}
                onChange={(e) => setPmFilter(e.target.value as any)}
                className="bg-transparent font-medium text-[#171A19] focus:outline-none cursor-pointer"
              >
                <option value="all">All Classes</option>
                <option value="pm">PM Positive</option>
                <option value="non_pm">Non-PM Controls</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 bg-[#F5F3ED] border border-[#DADBD3] px-2.5 py-1.5 rounded-xs">
              <span className="text-[#777B76]">Grade:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="bg-transparent font-medium text-[#171A19] focus:outline-none cursor-pointer"
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
            <div className="flex items-center gap-1.5 bg-[#F5F3ED] border border-[#DADBD3] px-2.5 py-1.5 rounded-xs">
              <ArrowUpDown className="w-3 h-3 text-[#777B76]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium text-[#171A19] focus:outline-none cursor-pointer"
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
            description="No analyses match your search query or filter criteria. Try clearing filters or analyzing a new fundus photograph."
            action={{
              label: 'Analyze New Image',
              onClick: () => setSearchTerm(''),
              icon: ScanEye,
            }}
          />
        ) : (
          <div className="bg-white/80 rounded-xs border border-[#DADBD3] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F3ED] border-b border-[#DADBD3] text-[#777B76] font-mono uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Specimen Preview</th>
                    <th className="py-3 px-4">Identifier & Cohort</th>
                    <th className="py-3 px-4">PM Probability</th>
                    <th className="py-3 px-4">Severity Grade</th>
                    <th className="py-3 px-4">Model & Mode</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DADBD3]/60 text-[#171A19]">
                  {filtered.map((rec) => {
                    const isPM = rec.pmClassification?.predictedClass === 'Pathological Myopia';
                    return (
                      <tr key={rec.id} className="hover:bg-[#F5F3ED]/50 transition-colors">
                        <td className="py-2.5 px-4">
                          <Link to={`/results/${rec.id}`}>
                            <img
                              src={rec.thumbnailUrl || rec.imageUrl}
                              alt={rec.title}
                              className="w-10 h-10 rounded-xs object-cover border border-[#DADBD3] hover:opacity-80 transition-opacity"
                            />
                          </Link>
                        </td>
                        <td className="py-2.5 px-4">
                          <Link
                            to={`/results/${rec.id}`}
                            className="font-medium text-[#171A19] hover:underline block"
                          >
                            {rec.title}
                          </Link>
                          <div className="text-[10px] text-[#777B76] font-mono">
                            {rec.imageIdentifier || rec.id}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          {rec.pmClassification ? (
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isPM ? 'bg-[#B97854]' : 'bg-[#254E43]'
                                }`}
                              />
                              <span className="font-mono text-[#171A19]">
                                {(rec.pmClassification.probability * 100).toFixed(1)}%
                              </span>
                              <span className="text-[10px] text-[#777B76] font-mono">
                                ({isPM ? 'PM Positive' : 'Control'})
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#777B76] italic font-mono text-[10px]">Not evaluated</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          {rec.severity ? (
                            <span className="px-1.5 py-0.2 rounded-xs font-mono text-[10px] bg-[#F5F3ED] text-[#171A19] border border-[#DADBD3]">
                              {rec.severity.label}
                            </span>
                          ) : (
                            <span className="text-[#777B76] font-mono text-[10px]">N/A</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="text-[#171A19] font-sans">RETFound-MT</div>
                          <span
                            className={`inline-block px-1.5 py-0.2 rounded-xs text-[9px] font-mono ${
                              rec.isDemo
                                ? 'bg-[#B97854]/10 text-[#B97854] border border-[#B97854]/30'
                                : 'bg-[#254E43]/10 text-[#254E43] border border-[#254E43]/30'
                            }`}
                          >
                            {rec.isDemo ? 'Demo Mode' : 'Cloud Live'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-[10px] text-[#777B76] font-mono">
                          {rec.timestamp}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/results/${rec.id}`}
                              className="px-2 py-1 rounded-xs bg-[#F5F3ED] hover:bg-[#254E43] hover:text-white text-[#171A19] font-mono text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1 border border-[#DADBD3]"
                            >
                              <span>View</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(rec.id)}
                              className="p-1 rounded-xs text-[#777B76] hover:text-[#B97854] hover:bg-[#B97854]/10 transition-colors"
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

            <div className="p-3 bg-[#F5F3ED] border-t border-[#DADBD3] flex items-center justify-between text-xs text-[#777B76] font-mono text-[11px]">
              <span className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-[#777B76]" />
                Indexed {filtered.length} of {records.length} records in local workspace
              </span>
              <span>
                Storage: Local browser persistence
              </span>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-[#17231F]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#F5F3ED] rounded-xs shadow-xl border border-[#DADBD3] max-w-sm w-full p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#B97854] font-serif text-base">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirm Record Deletion</span>
              </div>
              <p className="text-xs text-[#777B76] leading-relaxed font-sans">
                Are you sure you want to permanently delete this analysis record from your local workspace? This action cannot be undone.
              </p>
              <div className="pt-2 flex justify-end gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3 py-1.5 rounded-xs border border-[#DADBD3] text-[#777B76] hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-3 py-1.5 rounded-xs bg-[#B97854] text-white hover:bg-[#9E6241]"
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
