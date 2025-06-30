import { openDB } from 'idb';

const DB_NAME = 'PlaylistDB';
const DB_VERSION = 1;
const STORE_NAME = 'playlists';

export const initPlaylistDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        });
      }
    }
  });
};

export const getPlaylists = async () => {
  const db = await initPlaylistDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return await store.getAll();
};
