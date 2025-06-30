import { openDB } from 'idb';

const DB_NAME = 'MyAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'audios';

export const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('category', 'category');
            }
        },
    });
};

const generateId = () => crypto.randomUUID();

export const storeFile = async (file) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const fileWithId = {
        ...file,
        id: file.id || generateId(),
        type: file.type || 'audio/mpeg',
    };

    await store.put(fileWithId);
    await tx.done;
    return fileWithId.id;
};

export const deleteMusicById = async (id) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record = await store.get(id);
    if (!record) {
        console.warn(`Record with id='${id}' not found.`);
        return false;
    }

    await store.delete(id);
    await tx.done;
    return true;
};

export const getStoredFiles = async () => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const allRecords = await store.getAll();
    await tx.done;
    return allRecords;
};

export const updateFileCategory = async (id, newCategory) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const record = await store.get(id);
    if (!record) {
        throw new Error("Record not found");
    }

    record.category = newCategory;
    await store.put(record);
    await tx.done;

    return record;
};


export const deleteAllAudioFiles = async () => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const allKeys = await store.getAllKeys();
    for (const key of allKeys) {
        await store.delete(STORE_NAME,key);
    }
};
