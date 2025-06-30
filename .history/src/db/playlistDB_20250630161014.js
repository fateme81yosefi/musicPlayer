import { openDB } from "idb";

const DB_NAME = "PlaylistDB";
const DB_VERSION = 1;
const STORE_NAME = "playlists";

export async function initPlaylistDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export async function addPlaylist(playlist) {
  const db = await initPlaylistDB();

  const playlistWithId = {
    ...playlist,
    id: playlist.id || crypto.randomUUID(),
  };

  await db.put(STORE_NAME, playlistWithId);
  return playlistWithId.id;
}

export async function getAllPlaylists() {
  const db = await initPlaylistDB();
  return db.getAll(STORE_NAME);
}

export async function deletePlaylist(id) {
  const db = await initPlaylistDB();
  await db.delete(STORE_NAME, id);
}
