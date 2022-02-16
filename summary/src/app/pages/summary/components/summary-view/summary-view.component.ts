import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/notification.service';
import { SummaryService } from '../../services/summary.service';
import { GlobalService } from 'src/app/services/global.service';
@Component({
  selector: 'summary-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.scss']
})
export class SummaryViewComponent implements OnInit, OnDestroy {

  dataSetLoader = false;
  dateRangeValue: any;
  datepickerConfig: any;
  endRangeValue: any;
  startRangeValue: any;
  timeFrameValue: any = '15m';
  timeFrameDesc: any = 'Last 15 mins';
  showDates = false;
  dateChangedStatus = true;
  userInputRefreshTime = 1;
  userInputTimeType: any = 'sec';
  selectedUrl: any = '';
  options = '';
  datasetDropdown = [];
  subscription;
  constructor(public summaryService: SummaryService,
              public sanitizer: DomSanitizer,
              private router: Router,
              public global: GlobalService,
              private notify: NotificationService) {
  }

  ngOnInit() {
    this.getDashboardList();
  }
  dashboardNavigation(navigationpath) {
    this.router.navigate(['/' + this.global.prefixUrl + navigationpath]);
  }
  datasetChange(selectedDataset) {
    const selectedObj = this.datasetDropdown.filter(it => it.key === selectedDataset);
    this.selectedUrl = selectedObj.length > 0 ? this.sanitizer.bypassSecurityTrustResourceUrl(selectedObj[0].value) : '';
  }

  getDashboardList() {
    this.dataSetLoader = true;
    this.subscription = this.summaryService.getIframeList().subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.datasetDropdown = res.data && res.data.data && res.data.data.length > 0 ? [...res.data.data] : [];
        // tslint:disable-next-line:max-line-length
        this.options = this.datasetDropdown.length > 0 ? this.datasetDropdown[0] : '';

        this.getIframeDetails(this.options);
      } else {
        this.datasetDropdown = [];
        this.getIframeDetails(null);
        this.notify.showToastrWarning('Alert', 'API failed to fetch data set');
      }
      this.dataSetLoader = false;
    }, err => {
      this.dataSetLoader = false;
      this.getIframeDetails(null);
      this.datasetDropdown = [];
      this.notify.showToastrError('Alert', 'API failed to fetch data set');
    });
  }

  getIframeDetails(selectedDataSet) {
    if (selectedDataSet) {
      this.dataSetLoader = true;
      this.summaryService.dashboardDetails = selectedDataSet;

      if (selectedDataSet.dashBoardType !== 'Static Dashboard') {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([`/${this.global.prefixUrl}/summary/summaryview/iframe`]); // navigate to same route
        });
        // this.router.navigate([`/${this.global.prefixUrl}/summary/summaryview/iframe`]);
      } else {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([`/${this.global.prefixUrl}/summary/summaryview/sdashboard`]); // navigate to same route
        });
        // this.router.navigate([`/${this.global.prefixUrl}/summary/summaryview/sdashboard`]);
      }
      // this.selectedUrl = res.data && res.data.data && res.data.data.url ?
      // this.sanitizer.bypassSecurityTrustResourceUrl(res.data.data.url) : '';

      this.dataSetLoader = false;

    } else {
      // this.selectedUrl = '';
      this.summaryService.dashboardDetails = null;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
