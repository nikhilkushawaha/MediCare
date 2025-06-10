
// Simple localStorage-based database for hospital management
export interface DatabaseSchema {
  patients: Record<string, any>;
  doctors: Record<string, any>;
  appointments: Record<string, any>;
  medicalRecords: Record<string, any>;
}

class LocalDatabase {
  private storageKey = 'hospital_management_data';
  
  constructor() {
    this.initializeDatabase();
  }
  
  private initializeDatabase() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialData: DatabaseSchema = {
        patients: {},
        doctors: {},
        appointments: {},
        medicalRecords: {}
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }
  
  private getDatabase(): DatabaseSchema {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }
  
  private saveDatabase(data: DatabaseSchema) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
  
  // Generic CRUD operations
  getAll<T>(collection: keyof DatabaseSchema): Record<string, T> {
    const db = this.getDatabase();
    return db[collection] as Record<string, T>;
  }
  
  getById<T>(collection: keyof DatabaseSchema, id: string): T | null {
    const db = this.getDatabase();
    return db[collection][id] as T || null;
  }
  
  create<T>(collection: keyof DatabaseSchema, item: T): string {
    const db = this.getDatabase();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    db[collection][id] = { ...item, id };
    this.saveDatabase(db);
    return id;
  }
  
  update<T>(collection: keyof DatabaseSchema, id: string, item: T): boolean {
    const db = this.getDatabase();
    if (!db[collection][id]) return false;
    
    db[collection][id] = { ...item, id };
    this.saveDatabase(db);
    return true;
  }
  
  delete(collection: keyof DatabaseSchema, id: string): boolean {
    const db = this.getDatabase();
    if (!db[collection][id]) return false;
    
    delete db[collection][id];
    this.saveDatabase(db);
    return true;
  }
  
  search<T>(collection: keyof DatabaseSchema, query: string): T[] {
    const db = this.getDatabase();
    const items = db[collection];
    const results: T[] = [];
    
    const lowerQuery = query.toLowerCase();
    
    for (const id in items) {
      const item = items[id];
      // Search through all string properties
      const stringValues = Object.values(item)
        .filter(val => typeof val === 'string')
        .map(val => String(val).toLowerCase());
      
      if (stringValues.some(val => val.includes(lowerQuery))) {
        results.push(item as T);
      }
    }
    
    return results;
  }
}

export const db = new LocalDatabase();
