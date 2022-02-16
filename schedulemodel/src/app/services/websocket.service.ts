import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
declare var require: any;

import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketClientState } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  private client: Client;
  private state: BehaviorSubject<SocketClientState>;
  constructor(private global: GlobalService) {
  }
  connect(url) {
    const sockJsProtocols = ['xhr-streaming', 'xhr-polling'];
    const conn = Stomp.over(new SockJS(url, null, {transports: sockJsProtocols}));
    return conn;
  }
}
