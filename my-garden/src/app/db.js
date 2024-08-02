import Dexie from 'dexie';

export const dexieDb = new Dexie('Database');

dexieDb.version(1).stores({
  plots: '++id, title, img, location'
});