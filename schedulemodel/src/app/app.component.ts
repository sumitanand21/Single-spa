import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { assetUrl } from '../single-spa/asset-url';
import { Router } from '@angular/router';
@Component({
  selector: 'schedule-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public socket: any;
  message;
  constructor(private websocket: WebsocketService, private router: Router) {
    // const x = assetUrl('asdf');
    console.log('asd', router);
    // this.router.config[0].path = prefixUrl;
    // this.router.config[1].redirectTo = prefixUrl;

  }


}
