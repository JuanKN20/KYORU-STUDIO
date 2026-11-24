type ScrollSnapshot = {
  x: number;
  y: number;
  width: number;
  height: number;
  context?: { id: string; top: number };
  focusId?: string;
};

type Entry = { scroll?: ScrollSnapshot; discipline?: string | null };
export type NavigationEntry = { key: string; pathname: string; hash: string };

const entries = new Map<string, Entry>();
const maxEntries = 100;
let committed: NavigationEntry | undefined;

// Native fragment entries may have no React Router key (it reports "default").
export const entryKeyFor = ({ key, pathname, search, hash }: NavigationEntry & { search: string }) =>
  key === 'default' ? `default:${pathname}${search}${hash}` : key;

export const readEntry = (key: string) => entries.get(key);
export const lastCommittedEntry = () => committed;
export const markCommittedEntry = (entry: NavigationEntry) => { committed = entry; };

export function rememberEntry(key: string, update: Partial<Entry>) {
  const entry = { ...entries.get(key), ...update };
  entries.delete(key);
  entries.set(key, entry);
  if (entries.size > maxEntries) {
    const oldest = entries.keys().next();
    if (!oldest.done) entries.delete(oldest.value);
  }
}
