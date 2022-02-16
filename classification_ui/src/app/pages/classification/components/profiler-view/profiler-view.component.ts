import { Component, Input, OnInit } from '@angular/core';
import { assetUrl, hostUrl } from 'src/single-spa/asset-url';

@Component({
  selector: 'app-profiler-view',
  templateUrl: './profiler-view.component.html',
  styleUrls: ['./profiler-view.component.scss']
})
export class ProfilerViewComponent implements OnInit {
  @Input() featureLoader = false;
  @Input()
  set profilerResult(value: any) {
      this.setAllInputDetails(value);
  }
  @Input()
  set profilerStatus(value: any) {
    if (value) {
      this.setProfilerStatus(value);
    }
  }
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage = this.defauultItempg;
  inputCurrentpage = this.defaultCurrentPage;
  pageArr = [25, 50, 100];
  config = {
    id: 'paginateFeature',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  valueFilterDD = [ 'Raised', 'Lost' , 'Stable'];
  valueFilterSelected = 'Raised';
  valueFilterDetails: any = {
    fromDate: '',
    fromTimeHr: '',
    fromTimeMin: '',
    toDate: '',
    toTimeHr: '',
    toTimeMin: '',
    filterFeature: '',
    minToDate: '',
    enableFilter: false
  };
  url = '';
  // url = [
  //   {
  //   attribute: 'Node ID',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Version Number Reason CBA OCt20202-3-53-lonng attribute testing',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Number of port',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal by 1506',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal by cv',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call dfde',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Reaso a4t',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Re',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Reason Ab',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Reason Abdd',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Reason Abddddd',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Reason Abddd',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Reason Abdddss',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call Reason AB',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call Reason ABww',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call Reas',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call Reasa',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call ',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call ',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call ',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call ',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call ',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call sss',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call sss',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call sss',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call sssss',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call sssss',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call sssss',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call sssss',
  //   value: '<=0.54325'
  //   },
  //   {
  //   attribute: 'Abnormal Call sssss',
  //   value: '<=0.54325'
  //   },
  //   ];
  showSelected = false;
  searchFilter = '';
  statusProfiler;
  constructor() { }

  ngOnInit() {
  }

  setProfilerStatus(status) {
    this.statusProfiler = status;
  }
   // on search
  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
      // alert("Invalid page number")
    } else {
      this.config.currentPage = inputVal;
    }
  }
  setAllInputDetails(data) {
    if (data && data !== '' && data.length > 0) {
      this.url = assetUrl(data);
    } else {
      this.url = '';
    }
  }
  // onpage change
  changepage(evt) {
    this.config.currentPage = evt;
    this.inputCurrentpage = evt;
  }

  // set new page size for pagination
  setNewPageSize(pageSize) {
    this.config.itemsPerPage = pageSize;
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
  }

}
