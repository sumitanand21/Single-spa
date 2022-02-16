import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  setKeyValue(key, value) {
    sessionStorage.setItem(key, value);
  }
  getKeyValue(key) {
    return sessionStorage.getItem(key);
  }
  removeKey(key) {
    sessionStorage.removeItem(key);
  }
}
