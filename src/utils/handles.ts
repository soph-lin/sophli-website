import dayjs from 'dayjs';
import { random, chance } from './misc';

// Development setting - set to true to see all handles as discovered
const DISCOVER_ALL_HANDLES = true;

export interface PullCordHandle {
  id: string;
  icon: string;
  message: string;
  x?: number;
  y?: number;
  includeOriginalHandle?: boolean;
  pullSound?: string;
  category: 'seasonal' | 'zoo' | 'ocean' | 'household' | 'misc';
}

const pc = (
  id: string,
  icon: string | string[],
  message: string | string[],
  category: PullCordHandle['category'] = 'misc',
  opts: Partial<
    Omit<PullCordHandle, 'id' | 'icon' | 'message' | 'category'>
  > = {}
): PullCordHandle => {
  if (!opts.x) opts.x = -10;
  if (!opts.y) opts.y = 160;
  if (!opts.includeOriginalHandle) opts.includeOriginalHandle = false;
  return {
    id,
    icon: typeof icon === 'string' ? icon : random(icon),
    message: typeof message === 'string' ? message : random(message),
    category,
    ...opts,
  };
};

export const specialHandles: Record<string, PullCordHandle> = {
  '02/14': pc('valentine', '🌹', 'a rose for thee', 'seasonal', { x: -7 }),
  '10/31': pc(
    'halloween',
    '🎃',
    ['a spooky surprise!', `it's heavy! how strong is this cord??`],
    'seasonal'
  ),
  '12/25': pc(
    'christmas',
    '🎁',
    'a gift for you on a special day 🎄',
    'seasonal'
  ),
};

export const miscHandles: PullCordHandle[] = [
  pc('spider', '🕷️', 'aaah! spider!', 'household', {
    includeOriginalHandle: true,
  }),
  pc('anchor', '⚓', 'ahoy matey!', 'ocean', { x: -11 }),
  pc('bell', '🔔', 'ring ring', 'household', { pullSound: '/audio/bell.mp3' }),
  pc('fish', ['🐟', '🐠', '🦞', '🐡', '🦐', '🦀'], 'what a catch!', 'ocean', {
    pullSound: '/audio/splash.mp3',
  }),
  pc('monkey', '🐒', 'monkey see, monkey do', 'zoo', {
    x: -5,
    y: 152,
    includeOriginalHandle: true,
  }),
  pc('gorilla', '🦧', 'monkey see, monkey do', 'zoo', {
    x: -11,
    y: 150,
    includeOriginalHandle: true,
  }),
  pc('orangutan', '🦍', 'monkey see, monkey do', 'zoo', {
    x: -12,
    y: 150,
    includeOriginalHandle: true,
  }),
];

export const allHandles = [...Object.values(specialHandles), ...miscHandles];

// Handle discovery management
const DISCOVERED_HANDLES_KEY = 'discovered-handles';

export function getDiscoveredHandles(): string[] {
  if (typeof window === 'undefined') return [];

  // If dev mode is enabled, return all handle IDs
  if (DISCOVER_ALL_HANDLES) {
    return allHandles.map(handle => handle.id);
  }

  const stored = localStorage.getItem(DISCOVERED_HANDLES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addDiscoveredHandle(handleId: string): void {
  if (typeof window === 'undefined') return;
  const discovered = getDiscoveredHandles();
  if (!discovered.includes(handleId)) {
    discovered.push(handleId);
    localStorage.setItem(DISCOVERED_HANDLES_KEY, JSON.stringify(discovered));
  }
}

export function getCurrentHandle(): PullCordHandle | null {
  const today = dayjs().format('MM/dd');

  // Check for special date handles first
  if (today in specialHandles) {
    return specialHandles[today];
  }

  // Check for random misc handles
  if (chance(1 / 20)) {
    return random(miscHandles);
  }

  return null;
}

export function getHandleById(id: string): PullCordHandle | undefined {
  return allHandles.find(handle => handle.id === id);
}
