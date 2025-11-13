import { Injectable } from '@angular/core';
import { dummyPosts } from '../../data/dummy-posts';

@Injectable({
  providedIn: 'root',
})
export class DB {
  private dbName = 'renthubDB';
  private version = 2; // Increment this whenever you add new object stores
  private db: IDBDatabase | null = null;

  /** Initialize DB (only runs once per session) */
  async init(): Promise<void> {
    if (this.db) return;

    this.db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result as IDBDatabase;

        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('posts')) {
          db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('comments')) {
          const store = db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });
          store.createIndex('postId', 'postId', { unique: false });
        }

        if (!db.objectStoreNames.contains('favorites')) {
          const store = db.createObjectStore('favorites', { keyPath: 'id', autoIncrement: true });
          store.createIndex('userId', 'userId', { unique: false });
        }
      };

      request.onsuccess = async (event: any) => {
        const db = event.target.result as IDBDatabase;
        this.db = db;

        // Wait for dummy data to be seeded before resolving
        await this.seedDummyData(db);
        resolve(db);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async seedDummyData(db: IDBDatabase) {
    const tx = db.transaction('posts', 'readonly');
    const store = tx.objectStore('posts');

    const existingPosts = await new Promise<any[]>((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (existingPosts.length > 0) return; // Already seeded

    const writeTx = db.transaction('posts', 'readwrite');
    const writeStore = writeTx.objectStore('posts');
    for (const post of dummyPosts) {
      writeStore.add(post);
    }

    await new Promise((resolve, reject) => {
      writeTx.oncomplete = () => resolve(true);
      writeTx.onerror = () => reject(writeTx.error);
    });
  }

  /** Utility: safely get a store */
  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized. Call init() before using.');
    const tx = this.db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  /** Add a record */
  async add(store: string, data: any): Promise<number> {
    await this.init();
    return new Promise<number>((resolve, reject) => {
      const objectStore = this.getStore(store, 'readwrite');
      const req = objectStore.add(data);
      req.onsuccess = () => resolve(req.result as number);
      req.onerror = () => reject(req.error);
    });
  }

  /** Update or overwrite record */
  async update(store: string, data: any): Promise<void> {
    await this.init();
    return new Promise<void>((resolve, reject) => {
      const objectStore = this.getStore(store, 'readwrite');
      const req = objectStore.put(data);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /** Delete record by key */
  async delete(store: string, key: number): Promise<void> {
    await this.init();
    return new Promise<void>((resolve, reject) => {
      const objectStore = this.getStore(store, 'readwrite');
      const req = objectStore.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /** Get all records from a store */
  async getAll<T = any>(store: string): Promise<T[]> {
    await this.init();
    return new Promise<T[]>((resolve, reject) => {
      const objectStore = this.getStore(store);
      const req = objectStore.getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  /** Get record by key */
  async getByKey<T = any>(store: string, key: number): Promise<T | undefined> {
    await this.init();
    return new Promise<T | undefined>((resolve, reject) => {
      const objectStore = this.getStore(store);
      const req = objectStore.get(key);
      req.onsuccess = () => resolve(req.result as T);
      req.onerror = () => reject(req.error);
    });
  }

  /** Query by index (e.g., comments by postId) */
  async getByIndex<T = any>(
    store: string,
    indexName: string,
    value: any
  ): Promise<T[]> {
    await this.init();
    return new Promise<T[]>((resolve, reject) => {
      const objectStore = this.getStore(store);
      const index = objectStore.index(indexName);
      const req = index.getAll(value);
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  /** Clear a store */
  async clear(store: string): Promise<void> {
    await this.init();
    return new Promise<void>((resolve, reject) => {
      const objectStore = this.getStore(store, 'readwrite');
      const req = objectStore.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

}




