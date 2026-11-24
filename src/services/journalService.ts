import { JournalEntry } from '../types';

const JOURNAL_STORAGE_KEY = 'qn_cosmic_journal';

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-1',
    title: 'Thermodynamic Potential of Europa’s Ice Shell',
    content:
      'After reviewing the Galileo and JWST spectrographic data, Europa’s chaotic ridged terrain (lenticulae) indicates active diapiric convective plumes. If tidal flexure from Jupiter sustains hydrothermal vents along its silicate mantle floor, the water-rock interface could generate redox chemical gradients comparable to Earth’s Lost City hydrothermal field.',
    category: 'Observation',
    targetSubject: 'Europa (Jupiter System)',
    tags: ['Astrobiology', 'Ocean Worlds', 'Tidal Flexure'],
    createdAt: '2026-11-20T14:30:00.000Z',
    updatedAt: '2026-11-20T14:30:00.000Z',
  },
  {
    id: 'entry-2',
    title: 'Acoustic Harmonics of the Perseus Cluster Void',
    content:
      'Listened to the 57-octave transposition of Chandra’s acoustic ripple data from the Perseus Cluster supermassive black hole. The B-flat pitch (57 octaves below middle C) represents sound waves traveling through intergalactic intracluster gas. It is profound to realize that sound truly propagates in deep space wherever gas density is non-zero.',
    category: 'Sonification',
    targetSubject: 'Perseus Black Hole',
    tags: ['Acoustics', 'Chandra X-Ray', 'Infrasound'],
    createdAt: '2026-11-21T09:15:00.000Z',
    updatedAt: '2026-11-21T09:15:00.000Z',
  },
  {
    id: 'entry-3',
    title: 'Circumstellar Habitable Boundaries in TRAPPIST-1',
    content:
      'Calculated the stellar flux for TRAPPIST-1e (0.66 S_earth). Because TRAPPIST-1 is an ultra-cool M-dwarf with emissions skewed toward the near-infrared, the planet’s water ice albedo feedback would be diminished compared to Earth, potentially preventing a snowball Earth state even under lower incident insolation.',
    category: 'Theory',
    targetSubject: 'TRAPPIST-1e',
    tags: ['Exoplanet', 'Goldilocks', 'Climate Modeling'],
    createdAt: '2026-11-22T04:45:00.000Z',
    updatedAt: '2026-11-22T04:45:00.000Z',
  },
];

export function getJournalEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        JOURNAL_STORAGE_KEY,
        JSON.stringify(INITIAL_JOURNAL_ENTRIES)
      );
      return INITIAL_JOURNAL_ENTRIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_JOURNAL_ENTRIES;
  }
}

export function saveJournalEntry(
  entryData: {
    title: string;
    content: string;
    category: JournalEntry['category'];
    targetSubject?: string;
    tags: string[];
  },
  existingId?: string
): JournalEntry[] {
  const current = getJournalEntries();
  const now = new Date().toISOString();

  if (existingId) {
    const updated = current.map((item) =>
      item.id === existingId
        ? {
            ...item,
            ...entryData,
            updatedAt: now,
          }
        : item
    );
    try {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  } else {
    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...entryData,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newEntry, ...current];
    try {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  }
}

export function deleteJournalEntry(id: string): JournalEntry[] {
  const current = getJournalEntries();
  const filtered = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
  return filtered;
}

export function exportJournalToMarkdown(entries: JournalEntry[]): string {
  let md = `# Quantum Nest · Cosmic Journal Research Log\n`;
  md += `Exported on: ${new Date().toUTCString()}\n\n---\n\n`;

  for (const entry of entries) {
    md += `## ${entry.title}\n`;
    md += `**Date:** ${new Date(entry.createdAt).toLocaleDateString()} | **Category:** ${entry.category}\n`;
    if (entry.targetSubject) {
      md += `**Subject:** ${entry.targetSubject}\n`;
    }
    if (entry.tags && entry.tags.length > 0) {
      md += `**Tags:** ${entry.tags.join(', ')}\n`;
    }
    md += `\n${entry.content}\n\n---\n\n`;
  }

  return md;
}
