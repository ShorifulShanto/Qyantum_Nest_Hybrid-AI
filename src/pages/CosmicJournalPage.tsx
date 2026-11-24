import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { BackButton } from '../components/BackButton';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Edit3,
  Download,
  X,
  Sparkles,
} from 'lucide-react';
import { exportJournalToMarkdown } from '../services/journalService';

interface CosmicJournalPageProps {
  entries: JournalEntry[];
  onSaveEntry: (
    entryData: {
      title: string;
      content: string;
      category: JournalEntry['category'];
      targetSubject?: string;
      tags: string[];
    },
    existingId?: string
  ) => void;
  onDeleteEntry: (id: string) => void;
  onBack?: () => void;
}

export const CosmicJournalPage: React.FC<CosmicJournalPageProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<JournalEntry['category']>('Observation');
  const [targetSubject, setTargetSubject] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [copiedExport, setCopiedExport] = useState<boolean>(false);

  const categories = ['All', 'Observation', 'Theory', 'Mission Log', 'Sonification', 'General'];

  const filteredEntries = entries.filter((entry) => {
    const matchesCat = selectedCategory === 'All' || entry.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.targetSubject &&
        entry.targetSubject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.tags && entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesQuery;
  });

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('Observation');
    setTargetSubject('');
    setTags([]);
    setTagInput('');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setCategory(entry.category);
    setTargetSubject(entry.targetSubject || '');
    setTags(entry.tags || []);
    setTagInput('');
    setIsEditorOpen(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSaveEntry(
      {
        title: title.trim(),
        content: content.trim(),
        category,
        targetSubject: targetSubject.trim() || undefined,
        tags,
      },
      editingId || undefined
    );

    setIsEditorOpen(false);
  };

  const handleExport = () => {
    const md = exportJournalToMarkdown(entries);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_nest_cosmic_journal_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          {onBack && <BackButton onBack={onBack} label="Back" />}
          <div className="flex items-center gap-2 text-xs font-mono text-[#5DA9FF] uppercase tracking-widest pt-1">
            <BookOpen className="w-4 h-4" />
            <span>Research Archives · Personal Reflections</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-headline text-white">
            Cosmic Journal
          </h1>
          <p className="text-[#94A3B8] text-sm max-w-2xl">
            Document scientific hypotheses, observational reflections, and thoughts alongside your space exploration. All entries are encrypted and persisted locally.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-2 transition-colors"
            title="Download journal as Markdown file"
          >
            <Download className="w-4 h-4 text-[#5DA9FF]" />
            <span>{copiedExport ? 'Exported!' : 'Export Log'}</span>
          </button>

          <button
            onClick={handleOpenNew}
            className="px-5 py-2.5 rounded-xl cosmic-gradient text-white text-xs font-mono font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(93,169,255,0.4)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Reflection</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Segmented Filter */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#050816]/70 rounded-xl border border-white/10 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#5DA9FF] text-[#050816] font-bold shadow-md'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, subjects, tags..."
            className="w-full px-4 py-2 pl-9 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#5DA9FF]"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Journal Entries Grid */}
      {filteredEntries.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold font-headline text-white">No Journal Entries Found</h3>
          <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
            {searchQuery || selectedCategory !== 'All'
              ? 'No entries match your search query or filter. Try selecting a different category or clearing the search.'
              : 'Begin logging your celestial thoughts and observational notes. Write your first reflection today!'}
          </p>
          <button
            onClick={handleOpenNew}
            className="px-4 py-2 rounded-xl cosmic-gradient text-white font-mono text-xs uppercase"
          >
            Create First Log
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="glass-card-interactive rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                {/* Meta Top Line */}
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span
                    className={`px-2.5 py-0.5 rounded border uppercase text-[10px] font-bold ${
                      entry.category === 'Observation'
                        ? 'bg-[#5DA9FF]/10 text-[#5DA9FF] border-[#5DA9FF]/30'
                        : entry.category === 'Theory'
                        ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30'
                        : entry.category === 'Sonification'
                        ? 'bg-[#F472B6]/10 text-[#F472B6] border-[#F472B6]/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {entry.category}
                  </span>

                  <span className="text-[#94A3B8]">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Target Subject if defined */}
                {entry.targetSubject && (
                  <p className="text-xs font-mono text-[#5DA9FF] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Subject: {entry.targetSubject}</span>
                  </p>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold font-headline text-white leading-snug">
                  {entry.title}
                </h3>

                {/* Content */}
                <p className="text-xs text-[#CBD5E1] leading-relaxed line-clamp-4 whitespace-pre-wrap">
                  {entry.content}
                </p>

                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(entry)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-[#5DA9FF] transition-colors flex items-center gap-1 text-xs font-mono"
                  title="Edit entry"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-[#94A3B8] hover:text-rose-400 transition-colors flex items-center gap-1 text-xs font-mono"
                  title="Delete entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal Drawer */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl border border-white/20 p-6 lg:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#5DA9FF]" />
                <h2 className="text-2xl font-bold font-headline text-white">
                  {editingId ? 'Edit Cosmic Reflection' : 'New Cosmic Reflection'}
                </h2>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[#94A3B8]">ENTRY TITLE *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Atmospheric Chemistry of TRAPPIST-1e"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#5DA9FF] font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#94A3B8]">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#5DA9FF]"
                  >
                    <option value="Observation">Observation</option>
                    <option value="Theory">Theory & Model</option>
                    <option value="Mission Log">Mission Log</option>
                    <option value="Sonification">Sonification Notes</option>
                    <option value="General">General Reflection</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#94A3B8]">TARGET SUBJECT (OPTIONAL)</label>
                  <input
                    type="text"
                    value={targetSubject}
                    onChange={(e) => setTargetSubject(e.target.value)}
                    placeholder="e.g. Jupiter / Vela Pulsar / Kepler-452b"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#5DA9FF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#94A3B8]">RESEARCH NOTES & REFLECTION *</label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Record your scientific thoughts, theoretical hypotheses, and observational reflections..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#5DA9FF] font-sans text-sm leading-relaxed"
                />
              </div>

              {/* Tags Management */}
              <div className="space-y-2">
                <label className="text-[#94A3B8]">TAGS</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type a tag and press Add"
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono"
                  >
                    Add Tag
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono bg-[#5DA9FF]/10 text-[#5DA9FF] border border-[#5DA9FF]/30 px-2.5 py-0.5 rounded-md flex items-center gap-1.5"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl cosmic-gradient text-white font-bold uppercase tracking-wider shadow-lg hover:scale-102 active:scale-98 transition-all"
                >
                  Save to Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
