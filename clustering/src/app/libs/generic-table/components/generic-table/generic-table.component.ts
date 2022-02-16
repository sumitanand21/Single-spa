import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { debounceTime, map } from 'rxjs/operators';
import { Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit {
  @ViewChild('tabData', { static: false }) input: any;
  @Output() emitOutData = new EventEmitter<any>();

  @Input()
  set totalItems(value) {
    if (value) {
      this.config.totalItems = value;
    }
  }
  @Input() enableAPI = false;
  @Input() gentableId = 'gentableId';
  @Input() enableSearch = true;
  @Input() enablePagination = true;
  @Input() pageArr: number[] = [25, 50, 100];
  @Input() datasourceTable: any[] = [];
  @Input() uniqueFeild = 'fontEndId';
  @Input() selectedRow: string | number = 0;
  @Input() dataStructure: any[] = [];
  @Input() defaultCurrentPage = 1;
  @Input() defauultItempg = 25;

  @Input() searchFilterObj: any = '';
  @Input() exactFilterObj: any = '';
  @Input() defaultngxFilterObj: any = '';

  itemPerPage = this.defauultItempg;
  inputCurrentpage = this.defaultCurrentPage;
  searchFilter = '';

  sortKey = 'fontEndId';
  reverseSort = false;
  config: any = {
    id: this.gentableId,
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };



  selectCount = {};
  valueSubject = new BehaviorSubject<any>(null);

  constructor() { }

  ngOnInit() {
    this.valueSubject.pipe(debounceTime(1000)).subscribe(value => {
      this.emitOnAction(value);
    });
  }

  asd(){
    console.log("input",this.input);
  }


  emitOnAction(action) {
    const data = {searchText: this.searchFilter, config: this.config};
    this.emitOutObject(data, action);

  }

  sortTask(key) {
    if (key === this.sortKey) {
      this.reverseSort = !this.reverseSort;
    } else {
      this.sortKey = key;
      this.reverseSort = true;
    }
    this.valueSubject.next('onSort');
  }

  // on search
  onsearchChange(paginationId) {
    this.asd();
    if (typeof this.searchFilterObj === 'object' && !this.enableAPI) {
      const [firstKey] = Object.keys(this.searchFilterObj);
      if (firstKey) {
        // this.searchFilterObj[firstKey] = this.searchFilter;
        this.searchFilterObj = {[firstKey] : this.searchFilter};
      }
    }
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
    this.valueSubject.next('onSearch');
  }
  // change page on input
  changepageinp(inputVal, lastpage, paginationId) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
    } else {
      this.config.currentPage = inputVal;
      this.valueSubject.next('onPageInput');
    }
  }

  // onpage change
  changepage(evt, paginationId) {
    this.config.currentPage = evt;
    this.inputCurrentpage = evt;
    this.valueSubject.next('onPageChange');
  }

  // set new page size for pagination
  setNewPageSize(pageSize, paginationId) {
    this.config.itemsPerPage = pageSize;
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.valueSubject.next('onPageSize');
  }


  selectAll(dataSetObj) {
    this.datasourceTable.forEach(it => {
      it[dataSetObj.bodyModel] = dataSetObj.headerModel;
    });
    if (dataSetObj.headerModel === true) {
      this.selectCount[dataSetObj.bodyModel] = this.datasourceTable.length;
    } else {
      this.selectCount[dataSetObj.bodyModel] = 0;
    }

    this.emitOutObject(dataSetObj, 'checkboxAll');

  }

  onIndividualSelect(value, dataSetObj, dataSourceObj, index) {

    if (value === false) {
      this.selectCount[dataSetObj.bodyModel]--;
    } else {
      this.selectCount[dataSetObj.bodyModel]++;
    }
    if (this.selectCount[dataSetObj.bodyModel] === this.datasourceTable.length) {
      dataSetObj.headerModel = true;
    } else {
      dataSetObj.headerModel = false;
    }

    this.emitOutObject({ dataSourceObj, dataSetObj, index }, 'checkbox');
  }

  linkClicked(dataSourceObj, index, dataSetObj, evt?) {
    evt.stopPropagation();
    this.activateRow(dataSourceObj);
    this.emitOutObject({ dataSourceObj, dataSetObj, index }, 'linkClicked');
  }

  getrowClicked(dataSourceObj, index, dataSetObj?) {
    this.activateRow(dataSourceObj);
    this.emitOutObject({ dataSourceObj, dataSetObj, index }, 'rowClicked');
  }

  activateRow(dataSourceObj) {
    this.selectedRow = dataSourceObj[this.uniqueFeild];
  }

  emitOutObject(data, action) {
    const dataObj = { data, action };
    this.emitOutData.emit(dataObj);
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
  }

}
