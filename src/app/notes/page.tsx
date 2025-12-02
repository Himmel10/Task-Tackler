'use client';

export const dynamic = 'force-dynamic';

import { Header, Sidebar } from '@/components';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useThemeListener } from '@/hooks/useThemeListener';
import { Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Notes() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { getThemeClasses } = useThemeListener();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setMounted(true);
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/signin');
    }
  }, [mounted, isLoading, user, router]);

  useEffect(() => {
    // Save notes to localStorage
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  if (!mounted || isLoading || !user) {
    return <div className={`min-h-screen ${getThemeClasses().bg}`} />;
  }

  const handleSaveNote = () => {
    if (title.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
      setTitle('');
      setContent('');
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className={`min-h-screen ${getThemeClasses().bg}`}>
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Page Title */}
            <div>
              <h2 className={`text-3xl font-bold ${getThemeClasses().text} mb-2`}>📝 Notes</h2>
            </div>

            {/* Notes Section */}
            <div className={`${getThemeClasses().card} backdrop-blur rounded-lg p-6 border`}>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Note title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full ${getThemeClasses().input} rounded px-4 py-2 focus:outline-none focus:ring-2 mb-3`}
                />
                <textarea
                  placeholder="Note content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`w-full ${getThemeClasses().input} rounded px-4 py-2 focus:outline-none focus:ring-2 h-32 resize-none`}
                />
                <button
                  onClick={handleSaveNote}
                  className={`mt-3 ${getThemeClasses().accent} text-slate-900 hover:opacity-80 font-bold px-6 py-2 rounded transition-colors`}
                >
                  Save Note
                </button>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {notes.length === 0 ? (
                  <div className={`${getThemeClasses().mutedText} text-center py-8`}>No notes yet. Create your first note!</div>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className={`${getThemeClasses().cardAlt} rounded-lg p-4 border group ${getThemeClasses().hover} transition-colors`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className={`font-bold ${getThemeClasses().text} mb-1`}>{note.title}</h3>
                          <p className={`${getThemeClasses().mutedText} text-sm`}>{note.content || '(no content)'}</p>
                          <div className={`text-xs ${getThemeClasses().dimText} mt-2`}>
                            {new Date(note.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className={`${getThemeClasses().mutedText} hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
