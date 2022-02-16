import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SingleSpaService } from '../../services/single-spa.service';

@Component({
  selector: 'app-spa-host',
  template: `<div #appContainer>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpaHostComponent implements OnInit, OnDestroy {
  isAppUnderMaintainance = false;
  constructor(private singleSpaService: SingleSpaService, private route: ActivatedRoute) { }

  @ViewChild('appContainer', { static: true })
  appContainerRef: ElementRef;

  appName;
  mainApp;
  ngOnInit() {
    this.appName = this.route.snapshot.data;
    this.isAppUnderMaintainance = false;
    this.mount().subscribe((res) => {
    }, error => {
      this.appContainerRef.nativeElement.innerHTML = `<div style="text-align:center">
      <h1>
        ` + this.appName.app.toUpperCase() + `  app is under maintenance
      </h1>
      <h4 style="color: red;">Error</h4>
      <h6>` + error + `</h6>
      <h5>Note : Browser reload needed if configurations are updated. If not please check on above error </h5>
    </div>`;
    });
  }

  mount(): Observable<unknown> {
    return this.singleSpaService.mount(this.appName.app, this.appContainerRef.nativeElement,
      this.appName.mainApp, this.appName.apiEndPoint, this.appName.microApp);
  }

  unmount(): Observable<unknown> {
    return this.singleSpaService.unmount(this.appName.app);
  }
  ngOnDestroy(): void {
    if (this.singleSpaService.loadedParcels[this.appName.app]) {
       this.unmount().subscribe();
    }
  }
}
