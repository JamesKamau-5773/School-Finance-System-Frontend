/**
 * IndexedDB utility for caching large financial datasets locally
 * Stores: Student records, transaction histories, inventory data
 */

const DB_NAME = 'SchoolFinanceDB';
const DB_VERSION = 1;

const STORES = {
  STUDENTS: 'students',
  TRANSACTIONS: 'transactions',
  INVENTORY: 'inventory',
  FEES: 'fees',
};

/**
 * Initialize database and create object stores
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      // Create stores if they don't exist
      Object.values(STORES).forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          const objectStore = db.createObjectStore(store, { keyPath: 'id' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      });
    };
  });
};

/**
 * Save data to IndexedDB
 */
export const saveToIndexedDB = async (storeName, data) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    // Add timestamp
    const dataWithTimestamp = {
      ...data,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(dataWithTimestamp);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB save error:', error);
    throw error;
  }
};

/**
 * Retrieve data from IndexedDB
 */
export const getFromIndexedDB = async (storeName, key) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB get error:', error);
    throw error;
  }
};

/**
 * Get all records from a store
 */
export const getAllFromIndexedDB = async (storeName) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB getAll error:', error);
    throw error;
  }
};

/**
 * Delete data from IndexedDB
 */
export const deleteFromIndexedDB = async (storeName, key) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB delete error:', error);
    throw error;
  }
};

/**
 * Clear entire store
 */
export const clearStoreIndexedDB = async (storeName) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB clear error:', error);
    throw error;
  }
};

/**
 * Get records by timestamp range (useful for caching recent data)
 */
export const getByTimeRange = async (storeName, startTime, endTime) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index('timestamp');

    const range = IDBKeyRange.bound(startTime, endTime);

    return new Promise((resolve, reject) => {
      const request = index.getAll(range);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB time range error:', error);
    throw error;
  }
};

export default {
  initDB,
  saveToIndexedDB,
  getFromIndexedDB,
  getAllFromIndexedDB,
  deleteFromIndexedDB,
  clearStoreIndexedDB,
  getByTimeRange,
  STORES,
};
