import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SingleSpaService } from '../../services/single-spa.service';

@Component({
  selector: 'app-spa-host',
  templateUrl: './spa-verticle-host.component.html',
  styleUrls: ['./spa-verticle-host.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpaVerticleHostComponent implements OnInit, OnDestroy {
  isAppUnderMaintainance = false;
  constructor(private singleSpaService: SingleSpaService, private route: ActivatedRoute) { }

  @ViewChild('appVertContainer', { static: true })
  appVertContainerRef: ElementRef;
  @ViewChild('appInnerNavContainerRef', { static: true })
  appInnerNavContainerRef: ElementRef;
  contentApp;
  navApp;
  mainApp;
  ngOnInit() {
    this.contentApp = this.route.snapshot.data;
    this.navApp = this.route.snapshot.data.innerNav;
    this.isAppUnderMaintainance = false;
    if (this.contentApp) {
      this.singleSpaService.loaderSpaApp = true;
      this.mountMicroApp(this.contentApp, this.appVertContainerRef);
    }
    if (this.navApp) {
      this.mountMicroApp(this.navApp, this.appInnerNavContainerRef);
    }
  }
  mountMicroApp(app, elRef) {
    this.mount(app, elRef).subscribe((res) => {
      this.singleSpaService.loaderSpaApp = false;
    }, error => {
      this.singleSpaService.loaderSpaApp = false;
      elRef.nativeElement.innerHTML = `<div style="text-align:center">
      <h1>
        ` + app.app.toUpperCase() + `  app is under maintenance
      </h1>
      <h4 style="color: red;">Error</h4>
      <h6>` + error + `</h6>
      <h5>Note : Browser reload needed if configurations are updated. If not please check on above error </h5>
    </div>`;
    });
  }
  mount(app, elRef): Observable<unknown> {
    return this.singleSpaService.mount(app.app, elRef.nativeElement,
      app.mainApp, app.apiEndPoint, app.microApp, app.innerApps);
  }

  unmount(app): Observable<unknown> {
    return this.singleSpaService.unmount(app);
  }
  ngOnDestroy(): void {
    if (this.contentApp && this.singleSpaService.loadedParcels[this.contentApp.app]) {
       this.unmount(this.contentApp.app).subscribe();
    }
    if (this.navApp && this.singleSpaService.loadedParcels[this.navApp.app]) {
      this.unmount(this.navApp.app).subscribe();
   }
  }
}
