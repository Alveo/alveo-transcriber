import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';

@Injectable()
export class DBService {
  private database: any;

  constructor() {
    this.database = new PouchDB('alveott');
  }

  public get(key: string) {
    return this.database.get(key);
  }

  public put(key: string, value: any) {
    value._id = key;
    return this.get(key).then(result => {
        value._rev = result._rev;
        return this.database.put(value);
    }, error => {
      if (error.status === 404) {
          return this.database.put(value);
      } else {
        console.log(error);
      }
    });
  }
}
