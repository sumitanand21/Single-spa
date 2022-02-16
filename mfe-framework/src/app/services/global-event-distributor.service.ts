import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BroadcastData } from './../models/BroadcastData';
@Injectable({
  providedIn: 'root'
})
export class GlobalEventDistributorService {

  dataSubject = new BehaviorSubject<any>(undefined);
  stores = []; // not in use currently
  broadcastStore = []; // store data
  preloadingTopicStatus = [];
  constructor() {
      this.stores = [];
  }

  // set and trigger the custom data event
   broadCostData(topic, data) {
     this.broadcastStore[topic] = data;
     this.dataSubject.next(this.broadcastStore);
   }

   // trigger the container data event
   setDataFromContainer(data) {
    this.dataSubject.next(data);
  }

   // set custom data
   setbroadCostData(topic, data) {
    this.broadcastStore[topic] = data;
  }

  // get preload url status
  getTopicStatus(topic): boolean {
    return this.preloadingTopicStatus[topic];
  }

  // set proload url status
  setTopicStatus(topic, status) {
    this.preloadingTopicStatus[topic] = status;
  }

  // get all custom data
   getBroadcastStore() {
     return this.broadcastStore;
   }

   // get custom data using topic name
   getBroadcastStoreByTopic(topic) {
    return this.broadcastStore[topic] ? this.broadcastStore[topic] : [];
  }

  // event listener for container data event
   getDataFromContainer() {
     return this.dataSubject.asObservable();
   }

  registerStore(store) {
      this.stores.push(store);
  }

  dispatch(event) {
      console.log('event', event);
  }
}
