import { useState } from 'react';
import { Download, FileJson, FileText, File } from 'lucide-react';

interface ExportComponentProps {
  userId: string;
  onExport?: (format: 'CSV' | 'JSON' | 'PDF' | 'EXCEL') => Promise<void>;
  exportHistory?: Array<{
    id: string;
    fileName: string;
    format: string;
    taskCount: number;
    createdAt: string;
  }>;
}

export default function ExportTasks({ onExport, exportHistory = [] }: Omit<ExportComponentProps, 'userId'>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'CSV' | 'JSON' | 'PDF' | 'EXCEL') => {
    setIsExporting(true);
    try {
      await onExport?.(format);
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'CSV':
        return <FileText size={18} className="text-green-500" />;
      case 'JSON':
        return <FileJson size={18} className="text-blue-500" />;
      case 'PDF':
        return <File size={18} className="text-red-500" />;
      default:
        return <File size={18} className="text-orange-500" />;
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        <Download size={18} />
        Export Tasks
      </button>

      {isOpen && (
        <div className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-4">
          {/* Export options */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { format: 'CSV' as const, label: 'CSV', icon: <FileText /> },
              { format: 'JSON' as const, label: 'JSON', icon: <FileJson /> },
              { format: 'PDF' as const, label: 'PDF', icon: <File /> },
              { format: 'EXCEL' as const, label: 'Excel', icon: <File /> },
            ].map(({ format, label, icon }) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                disabled={isExporting}
                className="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Export history */}
          {exportHistory.length > 0 && (
            <div className="border-t border-gray-300 dark:border-gray-600 pt-3 space-y-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Recent exports:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {exportHistory.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex items-center gap-2">
                      {getFormatIcon(exp.format)}
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {exp.fileName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {exp.taskCount} tasks • {new Date(exp.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
