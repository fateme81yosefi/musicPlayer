// src/db/audioDB.js
import { openDB } from "idb";

const DB_NAME = "AudioFilesDB";
const DB_VERSION = 1;
const STORE_NAME = "audioFiles";

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("category", "category");
      }
    },
  });
};

export const getStoredFiles = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  return await store.getAll();
};

export const storeFile = async (file) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const fileWithId = {
    ...file,
    id: file.id || generateRandomId(),
    type: file.type || "audio/mpeg",
  };

  await store.put(fileWithId);
  await tx.done;
  return fileWithId.id;
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

// ❌ حذف یک فایل
export const deleteMusicById = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.delete(id);
  await tx.done;
};

// ❌❌ حذف همه فایل‌ها
export const deleteAllAudioFiles = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.clear(); // 🔥 بهتر از delete تک‌تک
  await tx.done;
};

// 🆔 تولید آیدی یکتا
const generateRandomId = () => {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 8)
  );
};
