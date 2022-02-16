import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
declare var require: any;

import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketClientState } from '../constants/app.constants';

import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  private client: Client;
  private state: BehaviorSubject<SocketClientState>;
  constructor(private global: GlobalService, private configurationService: ConfigurationService) {
  }

  webSocketConnection: any;
  connect(url) {
    const sockJsProtocols = ['xhr-streaming', 'xhr-polling'];
    const conn = Stomp.over(new SockJS(url, null, { transports: sockJsProtocols }));
    return conn;
  }

  // Web socket for stream data for data preview
  connectToWebSocket(dataInp) {
    const baseUrl = this.configurationService.setWebSocketUrl();
    const streamDataSocketData = webSocket({
      url: `${baseUrl}/ws/stream/${dataInp.dataSetName}/${dataInp.pageNumber}/${dataInp.pageSize}/`,
      deserializer: ({ data }) => {
        if (data) {
          return JSON.parse(data);
        }
      }
    });
    return streamDataSocketData;
  }

  // Websocket for stream data schedule
  connectToStreamDataScheduleWebSocket(dataSetName) {
    const baseUrl = this.configurationService.setWebSocketUrl();
    const streamDataScheduleData = webSocket({
      url: `${baseUrl}/ws/status/${dataSetName}/`,
      deserializer: ({ data }) => {
        if (data) {
          return JSON.parse(data);
        }
      }
    });
    return streamDataScheduleData;
  }
}
