import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';

export enum Databases {
  Cache = 'alveott_cache',
  Annotations = 'alveott_annotations',
}

@Injectable()
export class DBService {
  private databases: Array<any> = [];

  constructor() {
    this.useDatabase(Databases.Cache);
    this.useDatabase(Databases.Annotations);
  }

  public useDatabase(databaseName: string) {
    this.databases.push({
      'name': databaseName,
      'instance': new Database(databaseName)
    });
  }

  public instance(databaseName: string): Database {
    for (const database of this.databases) {
      if (database['name'] === databaseName) {
        return database['instance'];
      }
    }
    return null;
  }
}

class Database {
  databaseName: string;
  database: PouchDB;

  constructor(databaseName: string) {
    this.databaseName = databaseName;

    this.database = new PouchDB(this.databaseName);
  }

  public destroy(): any {
    return new Promise((complete, reject) =>
      {
        this.database.destroy().then(
          data => {
            this.database = new PouchDB(this.databaseName);
            complete();
          },
          error => reject(error)
        );
      }
    );
  }

  public get(key: string): any {
    return this.database.get(key);
  }

  public put(key: string, value: any): any {
    value._id = key;

    // TODO: This could probably be handled better by returning a promise.
    return this.get(key).then(result => {
      value._rev = result._rev;
      return this.database.put(value);
    }).catch(error => {
      if (error.status === 404) {
        return this.database.put(value);
      }
      else if (error.status === 409) {
        return this.put(key, value);
      }
      else {
        console.log(error);
      }
    });
  }
}
