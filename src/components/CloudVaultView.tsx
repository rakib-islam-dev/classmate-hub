import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SharedFile } from '../types';
import { 
  UploadCloud, 
  Download, 
  Lock, 
  FileText, 
  Code, 
  FileSpreadsheet, 
  Search, 
  Eye, 
  X 
} from 'lucide-react';

export const CloudVaultView: React.FC = () => {
  const { sharedFiles, addSharedFile, downloadFile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<SharedFile | null>(null);

  // New File Form
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [courseCode, setCourseCode] = useState('CSE 311');
  const [department] = useState('Computer Science');
  const [fileType, setFileType] = useState<SharedFile['fileType']>('pdf');
  const [previewContent, setPreviewContent] = useState('');

  const filteredFiles = sharedFiles.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    await addSharedFile({
      name: fileName.trim().endsWith(`.${fileType}`) ? fileName.trim() : `${fileName.trim()}.${fileType}`,
      description: description.trim(),
      size: `${(Math.random() * 3 + 0.8).toFixed(1)} MB`,
      fileType,
      courseCode: courseCode.trim() || 'CSE 311',
      department,
      encrypted: true,
      contentPreview: previewContent.trim() || `=== ${fileName.toUpperCase()} ===\n• Verified end-to-end client encrypted lecture notes.\n• Contains complete solved theorems and sample proofs.`
    });

    setFileName('');
    setDescription('');
    setPreviewContent('');
    setIsUploadModalOpen(false);
  };

  const getIconForType = (type: SharedFile['fileType']) => {
    switch (type) {
      case 'code':
        return <Code className="w-5 h-5 text-emerald-500" />;
      case 'doc':
      case 'slide':
        return <FileSpreadsheet className="w-5 h-5 text-amber-500" />;
      default:
        return <FileText className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Vault Header Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Lock className="w-3 h-3" /> AES-256 E2E Cloud Vault
            </span>
            <span className="text-xs text-slate-300">Zero-Knowledge Campus Storage</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Encrypted Academic Files & Note Vault</h1>
          <p className="text-xs text-slate-300">
            Share compiled course problem sets, lecture PDF summaries, and project source archives securely.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl text-xs sm:text-sm text-white shadow-sm transition-all self-start sm:self-auto shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Encrypted File</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files by course code (e.g. CSE 311, FIN 301), document name, or keywords..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-900 dark:text-white outline-hidden"
          />
        </div>
      </div>

      {/* Files List Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map(file => (
          <div
            key={file.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-2xs flex flex-col justify-between space-y-3 transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  {getIconForType(file.fileType)}
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {file.courseCode}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                  {file.description}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>SHA-256 Digest</span>
                <span className="truncate max-w-[140px] text-slate-600 dark:text-slate-300">{file.hash}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <img src={file.uploaderAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                <span className="text-[11px] text-slate-500 truncate max-w-[90px]">{file.uploaderName}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {file.contentPreview && (
                  <button
                    onClick={() => setPreviewFile(file)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Preview Notes"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => downloadFile(file.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  <Download className="w-3 h-3" />
                  <span>Get ({file.size})</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* FILE PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{previewFile.courseCode}</span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{previewFile.name}</h3>
              </div>
              <button onClick={() => setPreviewFile(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-64 border border-slate-800">
              {previewFile.contentPreview}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Downloads: {previewFile.downloadCount} classmates</span>
              <button
                onClick={() => {
                  downloadFile(previewFile.id);
                  setPreviewFile(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Decrypt & Download Complete File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Store Encrypted File in Cloud Vault</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">File Name *</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Distributed_Systems_Final_Exam_Bank"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CSE 311"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">File Type</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as SharedFile['fileType'])}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="pdf">PDF Lecture / Notes (.pdf)</option>
                    <option value="code">Source Code Archive (.cpp/.py/.rs)</option>
                    <option value="doc">Document / Spreadsheet (.xlsx/.docx)</option>
                    <option value="slide">Presentation Slides (.pptx)</option>
                    <option value="zip">Compressed Archive (.zip)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Summary / Key Topics Covered</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Complete solved midterms with detailed step-by-step algorithms..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Text Excerpt / Quick Preview Notes</label>
                <textarea
                  rows={3}
                  value={previewContent}
                  onChange={(e) => setPreviewContent(e.target.value)}
                  placeholder="Paste brief highlights or formulas so peers can preview without downloading..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Encrypt & Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
