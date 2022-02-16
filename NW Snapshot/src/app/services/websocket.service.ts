import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
declare var require: any;

import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketClientState } from '../constants/app.constants';
import { ConfigurationService } from './configuration.service';
import { webSocket } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  private client: Client;
  private state: BehaviorSubject<SocketClientState>;
  constructor(private global: GlobalService, public configurationService: ConfigurationService) {
  }
  connect(url) {
    const sockJsProtocols = ['xhr-streaming', 'xhr-polling'];
    const conn = Stomp.over(new SockJS(url, null, {transports: sockJsProtocols}));
    return conn;
  }

  connectToStatusWebSocket(requestId) {

    const baseUrl = this.configurationService.setWebSocketUrl();
    const socketData = webSocket({
      url: `${baseUrl}/compare/ws/${requestId}`,
      deserializer: ({ data }) => {
        if (data) {
          return JSON.parse(data);
        }
      }
    });
    return socketData;
  }
}
