import PouchDB from 'pouchdb';

export class Database {
  private databaseName: string;
  private database: PouchDB;

  constructor(databaseName: string) {
    this.databaseName = databaseName;
    this.database = new PouchDB(this.databaseName);
  }

  public async rebuild(): Promise<any> {
    await this.database.destroy();
    this.database = new PouchDB(this.databaseName);
  }

  public get(key: string): Promise<any> {
    return this.database.get(key);
  }

  public async put(key: string, value: any): Promise<any> {
    value._id = key;

    try {
      var result = await this.get(key);
      value._rev = result._rev;
      await this.database.put(value);
    } catch (error) {
      if (error.status === 404) {
        await this.database.put(value);
      } else if (error.status === 409) {
        await this.put(key, value);
      } else {
        return Promise.reject(error);
      }
    }
  }
}
