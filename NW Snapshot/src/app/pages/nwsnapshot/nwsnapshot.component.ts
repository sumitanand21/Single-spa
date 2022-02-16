import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { NwSnapshotService } from './services/nwsnapshot.service';
import { SessionService } from 'src/app/auth/session.service';
import { SOCKET_FEATURE } from 'src/config/app.cofig';
import { SESSION } from 'src/app/constants/app.constants';
import { GlobalService } from 'src/app/services/global.service';
@Component({
  selector: 'app-clustering',
  templateUrl: './nwsnapshot.component.html',
  styleUrls: ['./nwsnapshot.component.scss']
})
export class NwSnapshotComponent implements OnInit, AfterViewChecked {

  constructor(
    public nwSnapshotService: NwSnapshotService,
    public global: GlobalService,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private sessionStorage: SessionService) {
    this.sessionStorage.setKeyValue(SESSION.FEATURE, SOCKET_FEATURE.ANOMALY);
    this.nwSnapshotService.activatedPath = this.router.url;
  }

  showTabView = true;
  ngOnInit() {
  }

  ngAfterViewChecked() {

    if (this.nwSnapshotService.Classification ||
      this.nwSnapshotService.RCA ||
      this.nwSnapshotService.ClusteringExecution) {
      this.showTabView = true;
    } else {
      this.showTabView = false;
    }

    this.cdref.detectChanges();

  }
  clusteringNavigation(navigationpath, newConfig?) {
    switch (newConfig) {
      case 1:
        if (this.nwSnapshotService.Classification) {
          navigationpath = '/' + this.global.prefixUrl + navigationpath;
          navigationpath = navigationpath.replace('_page_', 'classification');
        } else if (this.nwSnapshotService.ClusteringExecution) {
          navigationpath = '/' + this.global.prefixUrl + navigationpath;
          navigationpath = navigationpath.replace('_page_', 'execution');
        } else if (this.nwSnapshotService.RCA) {
          navigationpath = '/' + this.global.prefixUrl + navigationpath;
          navigationpath = navigationpath.replace('_page_', 'rca');
        }
        break;

      case 2:
        navigationpath = this.nwSnapshotService.activatedPath + '/' + navigationpath;
        break;

      case 3:
        navigationpath = this.nwSnapshotService.activatedPath.replace('/upsertmodelconfig', '');
        break;

      case 4:
        navigationpath = this.nwSnapshotService.activatedPath.replace(/\/modeltraining.*$/, '');
        break;

      default:
        navigationpath = '/' + this.global.prefixUrl + navigationpath;
        break;

    }
    this.nwSnapshotService.activatedPath = navigationpath;
    this.router.navigate([navigationpath]);
  }

}
