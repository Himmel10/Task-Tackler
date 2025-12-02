import { useState } from 'react';
import { Share2, Trash2 } from 'lucide-react';

interface SharedUser {
  id: string;
  email: string;
  username: string;
  permission: 'VIEW' | 'EDIT' | 'MANAGE';
}

interface TaskSharingProps {
  taskId: string;
  sharedUsers: SharedUser[];
  onShare?: (taskId: string, email: string, permission: 'VIEW' | 'EDIT' | 'MANAGE') => void;
  onUpdatePermission?: (userId: string, permission: 'VIEW' | 'EDIT' | 'MANAGE') => void;
  onUnshare?: (userId: string) => void;
}

export default function TaskSharing({
  taskId,
  sharedUsers,
  onShare,
  onUpdatePermission,
  onUnshare,
}: TaskSharingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'VIEW' | 'EDIT' | 'MANAGE'>('VIEW');

  const handleShare = () => {
    if (email.trim()) {
      onShare?.(taskId, email, permission);
      setEmail('');
      setPermission('VIEW');
    }
  };

  const getPermissionColor = (perm: string) => {
    switch (perm) {
      case 'MANAGE':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'EDIT':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'VIEW':
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        <Share2 size={18} />
        Share Task
      </button>

      {isOpen && (
        <div className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-3">
          {/* Share form */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Share with email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Permission level
            </label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as 'VIEW' | 'EDIT' | 'MANAGE')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="VIEW">View only</option>
              <option value="EDIT">Can edit</option>
              <option value="MANAGE">Full access</option>
            </select>

            <button
              onClick={handleShare}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Share
            </button>
          </div>

          {/* Shared with list */}
          {sharedUsers.length > 0 && (
            <div className="border-t border-gray-300 dark:border-gray-600 pt-3 space-y-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Shared with:</h4>
              {sharedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{user.username}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={user.permission}
                      onChange={(e) =>
                        onUpdatePermission?.(user.id, e.target.value as 'VIEW' | 'EDIT' | 'MANAGE')
                      }
                      className={`text-xs px-2 py-1 rounded border-0 focus:outline-none cursor-pointer ${getPermissionColor(
                        user.permission
                      )}`}
                    >
                      <option value="VIEW">View</option>
                      <option value="EDIT">Edit</option>
                      <option value="MANAGE">Manage</option>
                    </select>
                    <button
                      onClick={() => onUnshare?.(user.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
