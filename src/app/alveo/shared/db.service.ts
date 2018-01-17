import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';

@Injectable()
export class DBService {
  private database: any;

  constructor() {
    this.database = new PouchDB('alveott');
  }

  public clear() {
    this.database.destroy().then(
      data => {
        this.database = new PouchDB('alveott');
      },
      error => {
        console.log(error);
      }
    );
  }

  public get(key: string) {
    return this.database.get(key);
  }

  public put(key: string, value: any) {
    value._id = key;
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
