import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import {ChangeDetectorRef } from '@angular/core';
import { ForecastService } from './services/forecast.service';
import { SessionService } from 'src/app/auth/session.service';
import { SESSION } from 'src/app/constants/app.constants';
import { SOCKET_FEATURE } from 'src/config/app.cofig';
import { GlobalService } from 'src/app/services/global.service';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit, AfterViewChecked {
  constructor(
    public forecastService: ForecastService,
    private cdref: ChangeDetectorRef,
    public global: GlobalService,
    private router: Router,
    private sessionStorage: SessionService) {
      this.sessionStorage.setKeyValue(SESSION.FEATURE, SOCKET_FEATURE.FORECAST);
      this.forecastService.activatedPath = this.router.url;
     }

  ngOnInit() {
    // this.connectSocket();
    // this.getdatatableAPI();
    // this.getdatainforecastAPI();
    // this.checkmodelparam();
    // this.getapiDataForTest();
  }
 getapiDataForTest() {
   this.forecastService.getAllModelConfigs('FORECAST').subscribe((res) => {
   });
 }
 ngAfterViewChecked() {
    this.cdref.detectChanges();
     }

  forecastNavigation(navigationpath, newConfig?) {
      switch (newConfig) {
        case 1:
          if (this.forecastService.ForeCastSelection) {
            navigationpath = '/' + this.global.prefixUrl + navigationpath ;
            navigationpath = navigationpath.replace('_page_', 'forecastselect');
          } else if (this.forecastService.ForeCastProcessing) {
            navigationpath = '/' + this.global.prefixUrl + navigationpath ;
            navigationpath = navigationpath.replace('_page_', 'forecastprocess');
          }
          break;

        case 2:
          navigationpath = this.forecastService.activatedPath + '/' + navigationpath;
          break;

        case 3:
          navigationpath = this.forecastService.activatedPath.replace('/updateconfig', '');
          break;

        default:
          navigationpath = '/' + this.global.prefixUrl + navigationpath;
          break;

      }
      this.forecastService.activatedPath = navigationpath;
      this.router.navigate([navigationpath]);
  }


// tempforecast: any[];
// dataintempforecast: any[];
//   checkAll(ev) {
//    // this.forecastData.forEach(x => x.checkboxdata = ev.target.checked);
//     if(this.all == true){
//       this.addforecastData = [];
//       for(var y=0;y<this.forecastData.length;y++){
//         if(this.forecastData[y].defaultDataRange != null) {
//           this.forecastDisabled = false;
//           this.addforecastData.push(this.forecastData[y]);
//           this.forecastData[y].checkboxdata = ev.target.checked;
//         }
//         else{
//           this.errorMsgHeaderText = "Validation Error";
//           this.errorMsgBodyText = "Please fill all the details."
//           this.openValidation();
//           this.forecastDisabled = false;
//         }

//       }
//         this.addforecastcount = this.addforecastData.length;
//         this.addtoforecastcheckbox = this.addforecastcount;
// //        this.forecastDisabled = false;
//     }
//     else{
//       this.forecastData.forEach(x => x.checkboxdata = ev.target.unchecked);
//       this.addforecastData = [];
//       this.addforecastcount = this.addforecastData.length;
//       this.forecastDisabled = true;
//     }
//     var frsttab_length = this.addforecastData.length;
//     var secondtab_length = this.datainforecastData.length;
//     var validationcheck = frsttab_length + secondtab_length;
//     this.forecastvalidation = validationcheck;
//   }

//   isAllChecked() {
//     return this.forecastData.every(_ => _.checkboxdata);
//   }
//   datacheckAll(ev) {
//     this.datainforecastData.forEach(x => x.datacheckboxdata = ev.target.checked);
//     if(this.dataall == true){
//         this.checkboxarrayData = [];
//         this.checkboxarrayData.push(...this.datainforecastData);
//         this.forecastcountcheck = this.checkboxarrayData.length;
//         if(this.forecastcountcheck == "0"){
//           this.isDisabled = true;
//         }
//         else{
//           this.isDisabled = false;
//         }
//     }
//     if(this.dataall == false) {
//       this.checkboxarrayData = [];
//       this.forecastcountcheck = this.checkboxarrayData.length;
//       this.isDisabled = true;
//     }
//   }

//   dataisAllChecked() {
//     return this.datainforecastData.every(_ => _.datacheckboxdata);
//   }
//   pageChanged(event: PageChangedEvent): void {
//     const startItem = (event.page - 1);
//     const endItem = event.page * event.itemsPerPage;
//     this.startPageIndex = startItem;
//     this.endPageIndex = endItem;
//     const userData = { "start_index": this.startPageIndex };
//     this.getforecastAPI(userData).subscribe(data => {
//       if (data.data != "API FAILED") {
//         this.forecastData = data.data;
//         this.tempforecast = this.forecastData;
//         this.tableData = data.recordsTotal;
//         //this.foretableLength = this.forecastData.length;
//        } else {
//         this.forecastData = [];
//         this.tempforecast = [];
//         this.tableData = [];
//         this.foretableLength = 0;
//         this.errorModalType = "";
//         this.errorMsgBodyText = "Something went wrong. Please try again later.";
//         this.openErrorModal();
//       }
//     });
//   }
// // Page change for datain forecast
// datainpageChanged(event: PageChangedEvent): void {
//   const startItem = (event.page - 1);
//   const endItem = event.page * event.itemsPerPage;
//   this.startPageIndex = startItem;
//   this.endPageIndex = endItem;
//   const forecastuserData = { "start_index": this.startPageIndex };
//     this.getdatainforecastAPIdata(forecastuserData).subscribe(data => {
//       if (data.data != "API FAILED") {
//         this.datainforecastData = data.data;
//         this.tableDataval = data.recordsTotal;
//         this.dataintempforecast = this.datainforecastData;
// //        this.foretableLength = this.datainforecastData.length;
//        } else {
//         this.datainforecastData = [];
//         this.foretableLength = 0;
//         this.dataintempforecast = [];
//         this.tableDataval = [];
//         this.errorModalType = "";
//         this.errorMsgBodyText = "Something went wrong. Please try again later.";
//         this.openErrorModal();
//       }
//     });
// }

//   editDatainforecast(editinforecast){
//     this.editinforecastObject = editinforecast;
//     this.editforecastName = this.editinforecastObject.pmId;
//     this.editSampletime = this.editinforecastObject.sampleTime;
//     this.mintime = this.editinforecastObject.defaultDataRange;
//     this.threadId = this.editinforecastObject.threadId;
//     var frwdprdata = this.editinforecastObject.timeForForwardPrediction;
//     this.frwrdPredict = frwdprdata.toString().replace(/\D/g, '');
//     var replaceString = frwdprdata.toString().replace(/[^a-z]/gi, '');
//     if(replaceString == "h"){
//       this.editHours = true;
//       this.editDays = false;
//       this.editSeconds = false;
//       this.editMinutes = false;
//     }
//     else if(replaceString == "m"){
//       this.editMinutes = true;
//       this.editHours = false;
//       this.editDays = false;
//       this.editSeconds = false;
//     }
//     else if(replaceString == "s"){
//       this.editSeconds = true;
//       this.editMinutes = false;
//       this.editHours = false;
//       this.editDays = false;
//     }
//     else if(replaceString == "Day"){
//       this.editDays = true;
//       this.editSeconds = false;
//       this.editMinutes = false;
//       this.editHours = false;
//     }
//     this.editForecastparam = this.editinforecastObject.modelParameter;
//   }
//   addforecastData = [];
//   sample(checkboxData,element){
//     document.getElementById('forecast-div').style.position = "initial";
//     document.getElementById('forecast-div').style.width = "95%";
//     let inputcss = document.getElementsByTagName("input");
//     var checkboxcount = 0;
//     this.globalsinglecheck = element;
//     this.forecastObject = checkboxData;
//     if(this.addforecastData.find(function(el){
//        return el.pmId === checkboxData.pmId }) == undefined){
//         if(this.forecastObject.defaultDataRange != null) {
//           this.forecastDisabled = false;
//           this.addforecastData.push(this.forecastObject);
//           }
//           else{
//             if(element.checked == true){
//             this.errorMsgHeaderText = "Validation Error";
//             this.errorMsgBodyText = "Please fill all the details."
//             this.openValidation();
//             element.checked = false;
//             this.forecastDisabled = true;
//             }
//             if(element.checked == false){
//               this.forecastDisabled = false;
//             }
//           }
//       }
//       else{
//         let index = this.addforecastData.findIndex(x => x.pmId === checkboxData.pmId)
//           this.addforecastData.splice(index,1)
//       }
//       // Checkbox Count starts here

//       for (var i=0; i<inputcss.length; i++) {
//         if (inputcss[i].type == "checkbox" && inputcss[i].checked == true
//         && this.forecastObject.defaultDataRange != null){
//           checkboxcount++;
//         }
//      }
//      this.addforecastcount = checkboxcount;
//      this.addtoforecastcheckbox = this.addforecastData.length;
//     if(this.addforecastcount>=1){
//       this.forecastDisabled = false;
//     }
//     else{
//       this.forecastDisabled = true;
//     }
//     var frsttab_length = this.addforecastData.length;
//     var secondtab_length = this.datainforecastData.length;
//     var validationcheck = frsttab_length + secondtab_length;
//     this.forecastvalidation = validationcheck;
//   }
//   editforecast(forecastEdit){
//     this.editforecastObject = forecastEdit;
//     this.editforecastName = this.editforecastObject.pmId;
//     this.threadId = this.editforecastObject.threadId;
//     this.editSampletime = this.editforecastObject.sampleTime;
//     var datarangesplit = this.editforecastObject.defaultDataRange;
//     if(datarangesplit == null || datarangesplit == undefined){
//       datarangesplit = "";
//     }
//     var convertdatarange = datarangesplit.split(',');
//     this.mintime = convertdatarange[0];
//     this.maxtime = convertdatarange[1];
//     this.editid = this.editforecastObject.id;
//     this.editne = this.editforecastObject.ne;
//     this.pmType = this.editforecastObject.pmType;
//     this.podNumber = this.editforecastObject.podNumber;
//     this.jobStatus = this.editforecastObject.jobStatus;
//     var frwdprdata = this.editforecastObject.timeForForwardPrediction;
//     this.editForecastparam = this.editforecastObject.modelParameter;
//     this.frwrdPredict = frwdprdata.toString().replace(/\D/g, '');
//     var replaceString = frwdprdata.toString().replace(/[^a-z]/gi, '');
//     this.editSeconds = true;
//     if(replaceString == "h"){
//       this.editHours = true;
//       this.editDays = false;
//       this.editSeconds = false;
//       this.editMinutes = false;
//     }
//     else if(replaceString == "m"){
//       this.editMinutes = true;
//       this.editHours = false;
//       this.editDays = false;
//       this.editSeconds = false;
//     }
//     else if(replaceString == "s"){
//       this.editSeconds = true;
//       this.editMinutes = false;
//       this.editHours = false;
//       this.editDays = false;
//     }
//     else if(replaceString == "D"){
//       this.editDays = true;
//       this.editSeconds = false;
//       this.editMinutes = false;
//       this.editHours = false;
//     }
//     this.checkmodelparam();
//   }
//   openforecastEdit(edittemplate: TemplateRef<any>) {
//       this.modalEditRef = this.modalService.show(edittemplate);
//   }
//   opendatainforecastEdit(edittemplate: TemplateRef<any>){
//       this.modalEditRef = this.modalService.show(edittemplate);
//   }
//   getCallData(callObj, rowIndex){
//     if(this.oldRowIndex != null){
//       document.getElementById("trdata"+this.oldRowIndex).style.backgroundColor = "initial";
//     }
//     document.getElementById("trdata"+rowIndex).style.backgroundColor = "#f3e59b";
//     this.oldRowIndex = rowIndex;
//     document.getElementById("trdata").style.backgroundColor = "#f3e59b";
//   }
//   getCallDataforecast(forecastcallObj, forecastrowIndex){
//     if(this.oldForecastRowIndex != null){
//       document.getElementById("trdataforecast"+this.oldForecastRowIndex).style.backgroundColor = "initial";
//     }
//     document.getElementById("trdataforecast"+forecastrowIndex).style.backgroundColor = "#f3e59b";
//     this.oldForecastRowIndex = forecastrowIndex;
//     document.getElementById("trdataforecast").style.backgroundColor = "#f3e59b";
//   }

//   // Tab change functionality starts here
//   tabChange(divId: any, btnId: any){
//     if (document.getElementById(divId).style.display == 'none') {
//       $('#' + this.lastDivId).hide();
//       $('#' + this.lastBtnId).css("color", "black")
//       $('#' + this.lastBtnId).css("borderBottom", "0px solid #3B73B7");
//       $('#' + divId).show();
//       $('#' + btnId).css("color", "#3B73B7")
//       $('#' + btnId).css("borderBottom", "2px solid #3B73B7");
//       if(divId == "dataforecast-div"){
//         this.isDisabled = true;
//         this.dataall = false;
//         this.datainforecastData = [];
//         this.checkboxarrayData = [];
//         document.getElementById("forecatselectdiv").style.display = "none";
//         document.getElementById("forecastgraphdiv").style.display = "none";
//         document.getElementById("datainforecastdiv").style.display = "flex";
//         this.getdatainforecastAPI();
//       }
//       if(divId == "graph-div"){
//         document.getElementById("forecatselectdiv").style.display = "none";
//         document.getElementById("datainforecastdiv").style.display = "none";
//         document.getElementById("forecastgraphdiv").style.display = "flex";
//         $('#forecastIframe').attr('src',this.global.forecastiframe);
//       }
//       if(divId == "forecast-div"){
//         this.forecastDisabled = true;
//         this.all = false;
//         this.forecastData = [];
//         this.addforecastData = [];
//         document.getElementById("forecatselectdiv").style.display = "flex";
//         document.getElementById("datainforecastdiv").style.display = "none";
//         document.getElementById("forecastgraphdiv").style.display = "none";
//         this.getdatatableAPI();
//         this.checkmodelparam();
//       }
//     }
//     this.lastDivId = divId;
//     this.lastBtnId = btnId;
//   }
//   // Tab change functionality Ends here

//   deleteForecastData(ID, name) {
//     this.deleteforecastID = ID;
//     this.deleteforecastName = name;
//   }
//   removeForecastData(pmid){
//     this.deleteforecastID = this.removingpmid;
//   }
//   private jwt() {
//     this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
//     return new RequestOptions({ headers: this.headers });
//   }
//   getModelConfig() {
// 		return this.http.get(this.global.baseURL + this.global.forecastModelConfig).map((res: Response) => res.json());
// 	}
//    getforecastAPI(forecastdata:any) {
//     return this.http.post(this.global.baseURL +
// this.global.forecast_datatable,forecastdata,
// this.jwt())
// .map((res: Response) => res.json());
//   }
//    getdatainforecastAPIdata(datainforecastdata:any) {
//     return this.http.post(this.global.baseURL +
// this.global.datainforecast_datatable,datainforecastdata,this.jwt()).map((res: Response) => res.json());
//   }
//   getdatatableAPI(){
//       this.Loader = true;
//       this.forecastData = [];
//       if(this.forecastData.length == 0){
//         this.forecastDisabled = true;
//         this.all = false;
//       }
//       const userData = { "start_index": this.startPageIndex };
//       this.getforecastAPI(userData).subscribe(data => {
//         if (data.data != "API FAILED") {
//           this.forecastData = data.data;
//           this.tempforecast = this.forecastData;
//           this.tableData = data.recordsTotal;
//           this.foretableLength = this.forecastData.length;
//           this.Loader = false;
//          } else {
//           this.forecastData = [];
//           this.tableData = [];
//           this.foretableLength = 0;
//           this.tempforecast = [];
//           this.Loader = false;
//           this.errorModalType = "";
//           this.errorMsgBodyText = "Something went wrong. Please try again later.";
//           this.openErrorModal();
//         }
//       });
//   }
// // Data in forecast get data tables api starts here
//   getdatainforecastAPI(){
//       this.Loader = true;
//       this.datainforecastData = [];
//       this.dataall = false;
//       if(this.datainforecastData.length == 0){
//         this.isDisabled = true;
//         this.dataall = false;
//       }
//       this.forecastcountcheck = 0;
//       const forecastuserData = { "start_index": this.startPageIndex };
//       this.getdatainforecastAPIdata(forecastuserData).subscribe(data => {
//         if (data.data != "API FAILED") {
//           this.datainforecastData = data.data;
//           this.dataintempforecast = this.datainforecastData;
//           this.tableDataval = data.recordsTotal;
//           this.Loader = false;
//          } else {
//           this.datainforecastData = [];
//           this.foretableLength = 0;
//           this.tableDataval = [];
//           this.dataintempforecast = [];
//           this.Loader = false;
//           this.errorModalType = "";
//           this.errorMsgBodyText = "Something went wrong. Please try again later.";
//           this.openErrorModal();
//         }
//       });
//   }
//   // configs api starts here
//   checkmodelparam(){
//     this.getModelConfig().subscribe(data => {
//       if(data.status != "fail"){
//         this.ModelConfigArr = [];
//         this.ModelConfigArr.push(...data.data);
//         this.ModelConfigArr.push(this.editForecastparam);
//       }
//     });
//   }
//   // Configs api ends here

// // Update forecast data starts here

// saveforecastAPI(){
//     var forecastName = this.editforecastName;
//     var sampleTime = this.editSampletime;
//     var minTimeedit = this.mintime+","+this.maxtime;
//     var editfrwrdPredict = this.frwrdPredict;
//     var forecastParamedit = this.editForecastparam;
//     var forecasteditid = this.editid;
//     var forecasteditne = this.editne;
//     var forecastpmType = this.pmType;
//     var forecastpodNumber = this.podNumber;
//     var forecastjobStatus = this.jobStatus;
//     var threadIdValue = this.threadId;
//     var that = this;
//     // this.temp_forecast = forecastName;
//     that = this;
//     $.ajax({
//       url: this.global.baseURL + this.global.editforecastAPI,
//       data: {
//         editforecastName : forecastName,
//         editsampleTime: sampleTime,
//         editminTime: minTimeedit,
//         editPredict: editfrwrdPredict,
//         threadId: threadIdValue,
//         editforecastParam: forecastParamedit,
//         //editforecasteditid: forecasteditid,
//         editforecasteditne: forecasteditne,
//         editforecastpmType: forecastpmType,
//         editforecastpodNumber: forecastpodNumber,
//         editforecastjobStatus: forecastjobStatus
//       },
//       dataType: 'json',
//       type: "POST",
//       success: function (data) {
//         that.startPageIndex = 0;
//         that.getdatatableAPI();
//         var closeBtn = document.getElementById('editModalClose');
//         closeBtn.click();
//         if (data.status == "success") {

//         } else if (data.status == "Failed" || data.status == "failed") {
//           that.showToastrinfo(forecastName);
//           that.errorMsgHeaderText = "ERROR";
//           that.errorMsgBodyText = "The system has failed to edit the schedule.";
//           that.errorModalType = "ApiError";
//           that.openErrorModal();
//         }
//       }
//     });
// }
// showApiStatusInfo(msg) {
//   this.toastr.info('', msg, {
//     timeOut: 25000,
//     positionClass: 'toast-bottom-right',
//   });
// }
// showToastrSuccess(msg) {
//   this.toastr.success('Successfully', msg, {
//     timeOut: 25000,
//     positionClass: 'toast-bottom-right',
//   });
// }

// //Info
// showToastrinfo(msg) {
//   this.toastr.info('Something Went wrong', msg, {
//     timeOut: 25000,
//     positionClass: 'toast-bottom-right',
//   });
// }

// // Delete forecast data starts here

// // Error Model Data

// openErrorModal() {
//   var btn = document.getElementById('hiddenBtn');
//   btn.click();
// }
// openValidation(){
//   var validationbtn = document.getElementById('hiddenvalidation');
//   validationbtn.click();
// }
// dismissModal(){
//   document.getElementById('forecast-div').style.position = "fixed";
//   document.getElementById('forecast-div').style.width = "95%";
//   setTimeout(() => {
//     document.getElementById('forecast-div').style.position = "initial";
//     document.getElementById('forecast-div').style.width = "95%";
//   },100);
// }
// closeModal(){
//   document.getElementById('forecast-div').style.position = "fixed";
//   document.getElementById('forecast-div').style.width = "95%";
//   setTimeout(() => {
//     document.getElementById('forecast-div').style.position = "initial";
//     document.getElementById('forecast-div').style.width = "95%";
//   },100);
// }

// // Add to forecast Starts here

// addForecast(){
//   this.addforecastcount = this.addtoforecastcheckbox;
// }
// removeForecast(){
//   var loopvalue;
//   this.pmcountval = "";
//   $("#datahtml" ).prop("checked", false );
//   var removableData = JSON.stringify(this.checkboxarrayData);
//   for (loopvalue = 0; loopvalue < this.checkboxarrayData.length; loopvalue++) {
//     this.pmcountval += this.checkboxarrayData[loopvalue].pmId + " , ";
//   }
//   // this.dataall = false;
//   let thatval = this;
//   thatval = this;
//   $.ajax({
//    url: this.global.baseURL + this.global.removeForecastAPI,
//    data: {"removedArray": removableData},
//    type: "POST",
//    dataType: 'json',
//    success: function (data) {
//     thatval.getdatainforecastAPI();
//     thatval.datainforecastData = [];
//     thatval.checkboxarrayData = [];
//     thatval.dataall = false;
//     this.dataall = false;
//     let closeBtn = document.getElementById('editModalClose');
//     closeBtn.click();
//     if (data.status == "success") {
//       thatval.getdatainforecastAPI();
//       thatval.datainforecastData = [];
//       thatval.checkboxarrayData = [];
//       thatval.forecastcountcheck = 0;
//       thatval.dataall = false;
//       thatval.forecastDisabled = true;
//       thatval.isDisabled = true;
//     } else if (data.status == "Failed" || data.status == "failed") {
//       thatval.errorMsgHeaderText = "ERROR";
//       thatval.errorMsgBodyText = "The system has failed to edit the schedule.";
//       thatval.errorModalType = "ApiError";
//       thatval.openErrorModal();
//     }
//    }
//  });
// }

// ErrormodelForecast(){
//   if(this.forecastvalidation>5){
//     this.errorMsgHeaderText = "Validation Error";
//     this.errorMsgBodyText = "Number of Active forecasts are exceeding more than 5"
//     this.openValidation();
//   }
// }
// addtoForecastData(checkboxData){
//   this.publishingData = this.addforecastData;
//   var thatdata = this;
//   thatdata = this;
//   thatdata.getdatatableAPI();
//   var str = "",p;
//   for(p=0; p<this.addforecastData.length;p++){
//      str += this.addforecastData[p].pmId + " , ";
//   }
//   this.addcountval = str;
//   var ajaxData = JSON.stringify(this.publishingData);
//   $.ajax({
//       url: this.global.baseURL + this.global.addtoforecastAPI,
//       data: {"ajaxData":ajaxData},
//       dataType: 'json',
//       type: "POST",
//       success: function (data) {
//         thatdata.startPageIndex = 0;
//         thatdata.getdatatableAPI();
//         thatdata.forecastData = [];
//         thatdata.addforecastData = [];
//         var closeBtn = document.getElementById('editModalClose');
//         closeBtn.click();
//         if (data.status == "success") {
//           thatdata.showApiStatusInfo("Added Successfully");
//           thatdata.getdatatableAPI();
//           thatdata.forecastData = [];
//           thatdata.addforecastData = [];
//           thatdata.forecastDisabled = true;
//           thatdata.isDisabled = true;
//           thatdata.all = false;
//         } else if (data.status == "Failed" || data.status == "failed") {
//           thatdata.errorMsgHeaderText = "ERROR";
//           thatdata.errorMsgBodyText = "The system has failed to edit the schedule.";
//           thatdata.errorModalType = "ApiError";
//           thatdata.openErrorModal();
//         }
//       }
//     });
// }

// checkboxarrayData = [];

// // Delete using icon starts here
// removeicon(removedata){
//   this.arraydeleteData = removedata;
//   this.removingpmid = removedata.pmId;
//   if(this.checkboxarrayData.find(function(el){
//     return el.pmId === removedata.pmId}) == undefined){
//     this.checkboxarrayData.push(this.arraydeleteData);
//   }
//   else{
//     let index = this.checkboxarrayData.findIndex(x => x.pmId === removedata.pmId);
//         this.checkboxarrayData.splice(index,1);
//   }
// }
// // Delete using icon ends Here


// // Single Checkbox selection for data in forecast starts here
// checkboxselection(dataincheckbox){
// this.arrayForecastdata = dataincheckbox;
// this.removingpmid = dataincheckbox.pmId;
// if(this.checkboxarrayData.find(function(el){
//   return el.pmId === dataincheckbox.pmId}) == undefined){
//   this.checkboxarrayData.push(this.arrayForecastdata);
// }
// else{
//   let index = this.checkboxarrayData.findIndex(x => x.pmId === dataincheckbox.pmId);
//       this.checkboxarrayData.splice(index,1);
// }
// var inputElements = document.getElementsByTagName("input");
// var datacheckboxcount = 0;
// for (var x=0; x<inputElements.length; x++) {
//   if (inputElements[x].type == "checkbox" && inputElements[x].checked == true){
//     datacheckboxcount++;
//   }
// }
// this.forecastcountcheck = this.checkboxarrayData.length;

// if(this.forecastcountcheck>=1){
// this.isDisabled = false;
// }
// else{
// this.isDisabled = true;
// }

// this.dataall == false;
// }

// // Single Checkbox selection for data in forecast Ends here

// cancelForecast(){
//   var closeBtn = document.getElementById('deleteModalClose');
//   closeBtn.click();
// }
// keepdatacancel(){
//   var closekeepBtn = document.getElementById('deleteModalClose');
//   closekeepBtn.click();
// }
// keepForecastdata(){
//   var closekeepforecast = document.getElementById('deleteModalClose');
//   closekeepforecast.click();
// }

// // Webscoket starts here
// showToastrTriggered(msg) {
//   this.toastr.success('', msg, {
//     timeOut: 25000,
//     positionClass: 'toast-bottom-right',
//     closeButton:true
//   });
// }


// connectSocket():void{
//   this.socket = this.websocket.connect();
// // webscoket for data update
//   this.socket.connect({}, frame => {
//       this.socket.subscribe('/training/pmForecastStatus', message => {
//       this.message = message.body;
//       var temp_msg = JSON.parse(this.message);
//       var update_toaster= "";
//       if(temp_msg.jobStatus == "ACTIVE"){
//         update_toaster = "Forecast Started for "+temp_msg.pmId;
//       }
//       if(temp_msg.jobStatus == "DELETED"){
//         update_toaster = "Forecast Stopped for "+temp_msg.pmId;
//       }
//       this.showToastrTriggered(update_toaster);
//     })
//   });
// }

// disconnect():void{
//   this.socket.disconnect();
// }

// Webscoket code ends here
}


