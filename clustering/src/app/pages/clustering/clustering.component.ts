import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ClusteringService } from './services/clustering.service';
import { SessionService } from 'src/app/auth/session.service';
import { SOCKET_FEATURE } from 'src/config/app.cofig';
import { SESSION } from 'src/app/constants/app.constants';
import { GlobalService } from 'src/app/services/global.service';
@Component({
  selector: 'app-clustering',
  templateUrl: './clustering.component.html',
  styleUrls: ['./clustering.component.scss']
})
export class ClusteringComponent implements OnInit, AfterViewChecked {

  constructor(
    public clusteringService: ClusteringService,
    public global: GlobalService,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private sessionStorage: SessionService) {
    this.sessionStorage.setKeyValue(SESSION.FEATURE, SOCKET_FEATURE.ANOMALY);
    this.clusteringService.activatedPath = this.router.url;
  }

  showTabView = true;
  ngOnInit() {
  }

  ngAfterViewChecked() {

    if (this.clusteringService.Classification ||
      this.clusteringService.RCA ||
      this.clusteringService.ClusteringExecution) {
      this.showTabView = true;
    } else {
      this.showTabView = false;
    }

    this.cdref.detectChanges();

  }
  clusteringNavigation(navigationpath, newConfig?) {
    switch (newConfig) {
      case 1:
        if (this.clusteringService.Classification) {
          navigationpath = '/' + this.global.prefixUrl + navigationpath;
          navigationpath = navigationpath.replace('_page_', 'classification');
        } else if (this.clusteringService.ClusteringExecution) {
          navigationpath = '/' + this.global.prefixUrl + navigationpath;
          navigationpath = navigationpath.replace('_page_', 'execution');
        } else if (this.clusteringService.RCA) {
          navigationpath = '/' + this.global.prefixUrl + navigationpath;
          navigationpath = navigationpath.replace('_page_', 'rca');
        }
        break;

      case 2:
        navigationpath = this.clusteringService.activatedPath + '/' + navigationpath;
        break;

      case 3:
        navigationpath = this.clusteringService.activatedPath.replace('/upsertmodelconfig', '');
        break;

      case 4:
        navigationpath = this.clusteringService.activatedPath.replace(/\/modeltraining.*$/, '');
        break;

      default:
        navigationpath = '/' + this.global.prefixUrl + navigationpath;
        break;

    }
    this.clusteringService.activatedPath = navigationpath;
    this.router.navigate([navigationpath]);
  }

}
