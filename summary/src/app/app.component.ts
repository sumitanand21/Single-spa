import { Component, forwardRef, Inject } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { singleSpaPropsSubject } from './../single-spa/single-spa-props';
import { Router } from '@angular/router';
import { GlobalService } from './services/global.service';
import { FEATURES, SOCKET_FEATURE } from 'src/config/app.cofig';
import { FeatureGuard } from './guards/feature-guard.service';
@Component({
  selector: 'summary-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public socket: any;
  message;
  namespace;
  constructor(
    private websocket: WebsocketService,
    private router: Router) {
  }


}
