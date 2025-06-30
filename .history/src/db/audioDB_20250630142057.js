import { openDB } from "idb";

const DB_NAME = "AudioFilesDB";
const DB_VERSION = 1;
const STORE_NAME = "audioFiles";

export async function initAudioDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("category", "category");
        store.createIndex("isFav", "isFav");
      }
    },
  });
}

export async function addAudioFile(file) {
  const db = await initAudioDB();

  const fileWithId = {
    ...file,
    id: file.id || crypto.randomUUID(),
  };

  await db.put(STORE_NAME, fileWithId);
  return fileWithId.id;
}

export async function getAllAudioFiles() {
  const db = await initAudioDB();
  return db.getAll(STORE_NAME);
}

export async function updateFileCategory(fileId, newCategoryId) {
  const db = await initAudioDB();

  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const file = await store.get(fileId);
  if (!file) return;

  file.category = newCategoryId;
  await store.put(file);

  await tx.done;
}

export async function deleteAudioFile(id) {
  const db = await initAudioDB();
  await db.delete(STORE_NAME, id);
}

export async function deleteAudioFilesByCategory(categoryId) {
  const db = await initAudioDB();

  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const index = store.index("category");

  const files = await index.getAll(categoryId);

  for (const file of files) {
    await store.delete(file.id);
  }

  await tx.done;
}
