import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SummaryService } from '../../services/summary.service';

@Component({
  selector: 'summary-iframe-dashboard',
  templateUrl: './iframe-dashboard.component.html',
  styleUrls: ['./iframe-dashboard.component.scss']
})
export class IframeDashboardComponent implements OnInit {

  constructor(public summaryService: SummaryService, private sanitizer: DomSanitizer) { }

  iFrameUrl: any='';
  ngOnInit() {
    this.getIframeData();
  }

  getIframeData() {
    if (this.summaryService.dashboardDetails.dashBoardUrl) {
      this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.summaryService.dashboardDetails.dashBoardUrl);
    }
    else {
      this.iFrameUrl = '';
    }
  }

}
