import Dexie from 'dexie';
  
export class SimplifiedDatabase extends Dexie {
  storage: Dexie.Table<any, any>;
}

export class BrowserCacheDatabase {
  private databaseName: string;
  private database: SimplifiedDatabase;

  constructor(databaseName: string) {
    this.databaseName = databaseName;
    this.initDb()
  }

  public async rebuild(): Promise<any> {
    await this.database.delete()
    this.initDb()
  }

  public initDb() {
    this.database = new SimplifiedDatabase(this.databaseName);
    this.database.version(1).stores({storage: ""})
  }

  public get(key: string): Promise<any> {
    return this.database.storage.get(key);
  }

  put(key, value) {
    return this.database.storage.put(value, key)
  }
}
