import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SingleSpaService } from '../../services/single-spa.service';
import { Observable, throwError } from 'rxjs';
import { Input } from '@angular/core';

@Component({
  selector: 'app-spa-host-nav',
  template: '<div #appNavContainer></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpaHostNavComponent implements OnInit, OnDestroy {

  constructor(private singleSpaService: SingleSpaService, private route: ActivatedRoute) { }

  @ViewChild('appNavContainer', { static: true })
  appNavContainerRef: ElementRef;

  appName;
  isAnyAppMounted = false;
  @Input()
  set navbarAppName(value) {
    if (value.app && value.mainApp && value.apiEndPoint) {
      if (this.isAnyAppMounted) {
        this.unmount().subscribe();
      }
      this.mount(value).subscribe((res) => {
        console.log(res);
        this.isAnyAppMounted = true;
        this.appName = value;
      }, error => {
        this.appNavContainerRef.nativeElement.innerHTML = `<div style="text-align:center">
      <h1>
        ` + value.app.toUpperCase() + `  app is under maintenance
      </h1>
      <h4 style="color: red;">Error</h4>
      <h6>` + error + `</h6>
      <h5>Note : Browser reload needed if configurations are updated. If not please check on above error </h5>
    </div>`;
      });
    }

  }
  ngOnInit() {
  }

  mount(appName): Observable<unknown> {
    return this.singleSpaService.mount(appName.app, this.appNavContainerRef.nativeElement, appName.mainApp, appName.apiEndPoint, appName.microApp);
  }

  unmount(): Observable<unknown> {
    if (this.isAnyAppMounted) {
      return this.singleSpaService.unmount(this.appName.app);
    } else {
      return throwError(new Error('Invalid request'));
    }
  }

  ngOnDestroy(): void {
    if ( this.appName && this.appName.app && this.singleSpaService.loadedParcels[this.appName.app]) {
      this.unmount().subscribe();
   }
  }
}
