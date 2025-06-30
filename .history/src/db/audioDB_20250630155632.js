// db/audioDB.js
import { openDB } from "idb";

const DB_NAME = "AudioFilesDB";
const DB_VERSION = 1;
const STORE_NAME = "audioFiles";

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
};

export const updateFileCategory = async (fileId, newCategory) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const file = await store.get(fileId);

  if (!file) {
    console.warn("❌ فایل با این id پیدا نشد:", fileId);
    return;
  }

  const updatedFile = {
    ...file,
    category: newCategory,
  };

  await store.put(updatedFile);
  await tx.done;
};

export const deleteMusicById = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.delete(id);
  await tx.done;
};
