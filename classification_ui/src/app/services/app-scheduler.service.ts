import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionService } from '../auth/session.service';
import { APP, SESSION, SUBSCRIPTIONS } from '../constants/app.constants';
import { WebsocketService } from './websocket.service';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { SOCKET_FEATURE } from 'src/config/app.cofig';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigurationService } from './configuration.service';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AppSchedulerService {
  socket;
  scSocket;
  alltasksData;
  constructor(
    public sanitizer: DomSanitizer,
    private sessionStorage: SessionService, private http: HttpClient,
    private websocket: WebsocketService,
    private configService: ConfigurationService) { }
  scheduleSocket(path, interval, methodName, modelType, jobType, req?, body?) {
    this.sessionStorage.setKeyValue(SESSION.TAB, path);
    this.sessionStorage.setKeyValue(SESSION.INTERVAL, interval);
    this.sessionStorage.setKeyValue(SESSION.METHODS, methodName);

    const today = new Date();
    const dd = today.getUTCDate();
    const mm = today.getUTCMonth() + 1;
    const yyyy = today.getUTCFullYear();
    const hours = today.getUTCHours();
    const minutes = today.getUTCMinutes();
    const sec = today.getUTCSeconds();
    let hr;
    let mn;
    let month;
    let day;
    if (hours < 10 && hours.toString().length < 2) {
      hr = '0' + hours;
    } else {
      hr = hours;
    }
    if (minutes < 10 && minutes.toString().length < 2) {
      mn = '0' + minutes;
    } else {
      mn = minutes;
    }
    if (mm < 10 && mm.toString().length < 2) {
      month = '0' + mm;
    } else {
      month = mm;
    }
    if (dd < 10 && dd.toString().length < 2) {
      day = '0' + dd;
    } else {
      day = dd;
    }
    const id = this.sessionStorage.getKeyValue(SESSION.ID);
    let expTime: any = this.sessionStorage.getKeyValue(SESSION.SES_EXP_TIME);
    let scName = this.sessionStorage.getKeyValue(SESSION.SC_NAME);
    const scheduleStart = yyyy + '-' + month + '-' + day + ' '
      + hr + ':'
      + mn + ':00 UTC';
    if (!expTime || isNaN(+expTime)) {
      expTime = 60;
    }
    const scheduleEnd = moment(scheduleStart).utc().add(expTime, 'minutes').format('YYYY-MM-DD HH:mm:ss UTC');
    this.sessionStorage.setKeyValue(SESSION.SES_TIME, scheduleEnd);
    let recurOn;
    let intervalTime;
    if (interval.includes('s')) {
      intervalTime = interval.replace('s', '');
      recurOn = 'SECOND';
    } else if (interval.includes('m')) {
      intervalTime = interval.replace('m', '');
      recurOn = 'MINUTE';
    } else if (interval.includes('h')) {
      intervalTime = interval.replace('h', '');
      recurOn = 'HOUR';
    }
    let myId = uuid.v4();
    const data = {
      modelType,
      methodName,
      req,
      body,
      interval_time: +intervalTime,
    };
    myId = myId.split('-')[0];
    if (id && id !== '') {
      if (scName) {
        scName = today.getTime().toString() + ':' + myId;
      }
      const scBody = {
        id,
        data,
        job_type: jobType,
        recur_on: recurOn,
        schedule_from: scheduleStart,
        schedule_name: scName,
        job_status: 'ACTIVE',
        interval_time: +intervalTime,
        schedule_to: scheduleEnd
      };
      if (recurOn) {
        return this.updateScheduleSocket(scBody);
      } else {
        return this.deleteScheduleSocket([id], 'DELETE');
      }

    } else if (recurOn) {
      const newName = today.getTime().toString() + ':' + myId;
      const scBody = {
        data,
        job_type: jobType,
        recur_on: recurOn,
        schedule_from: scheduleStart,
        schedule_name: newName,
        job_status: 'ACTIVE',
        interval_time: +intervalTime,
        schedule_to: scheduleEnd
      };
      this.sessionStorage.setKeyValue(SESSION.SC_NAME, newName);
      return this.createScheduleSocket(scBody);
    } else {
      return null;
    }
  }
  createScheduleSocket(scBody) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.POST_CREATE_TASK_API, scBody);
    // return this.http.put(this.configService.schedulerBaseUrl +
    //   ANOMALY_URLS.POST_CREATE_TASK_API,
    //   scBody, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
    //     return of({ status: 'success', data: res });
    //   }));
  }
  updateScheduleSocket(scBody) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.PUT_UPDATE_TASK_API, scBody);
    // return this.http.put(this.configService.schedulerBaseUrl +
    //   ANOMALY_URLS.PUT_UPDATE_TASK_API,
    //   scBody, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
    //     return of({ status: 'success', data: res });
    //   }));
  }
  deleteScheduleSocket(ids, actionType) {
    this.disconnectScSocket();
    // const data = {
    //   id: JSON.stringify(ids),
    //   actionType
    // };
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.ACTION_ON_TASK, data);
    // return this.http.post(this.configService.schedulerBaseUrl +
    //   ANOMALY_URLS.ACTION_ON_TASK +
    //   actionType,
    //   ids, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
    //     return of({ status: 'success', data: res });
    //   }));
    return null;
  }
  setSessionId(id) {
    this.sessionStorage.setKeyValue(SESSION.ID, id);
  }
  getSessionId() {
    return this.sessionStorage.getKeyValue(SESSION.ID);
  }
  deleteSession() {
    return this.sessionStorage.removeKey(SESSION.ID);
  }
  connectSocket() {
    this.disconnectSocket();
    const feature = this.sessionStorage.getKeyValue(SESSION.FEATURE);
    let socketURL;
    if (feature === SOCKET_FEATURE.FORECAST) {
      socketURL = this.sessionStorage.getKeyValue(SESSION.FORECAST_SOCKET_URL);
    } else if (feature === SOCKET_FEATURE.ANOMALY) {
      socketURL = this.sessionStorage.getKeyValue(SESSION.ANOMALY_SOCKET_URL);

    } else if (feature === SOCKET_FEATURE.CLASSIFICATION) {
      socketURL = this.sessionStorage.getKeyValue(SESSION.PROFILER_SOCKET_URL);

    } else if (feature === SOCKET_FEATURE.DATAMANAGEMENT) {
      socketURL = this.sessionStorage.getKeyValue(SESSION.DTMNG_SOCKET_URL);

    }
    this.socket = this.websocket.connect(socketURL);

    return this.socket;
  }
  connectScSocket() {
    this.disconnectSocket();
    const feature = this.sessionStorage.getKeyValue(SESSION.FEATURE);
    let socketURL;
    if (feature === SOCKET_FEATURE.FORECAST) {
      socketURL = this.sessionStorage.getKeyValue(SESSION.FORECAST_SOCKET_URL);
    } else if (feature === SOCKET_FEATURE.ANOMALY) {
      socketURL = this.sessionStorage.getKeyValue(SESSION.ANOMALY_SOCKET_URL);
    } else if (feature === SOCKET_FEATURE.CLASSIFICATION) {
      socketURL = this.sessionStorage.getKeyValue(SESSION.PROFILER_SOCKET_URL);
    } else if (feature === SOCKET_FEATURE.DATAMANAGEMENT) {
      socketURL = this.sessionStorage.getKeyValue(SESSION.DTMNG_SOCKET_URL);

    }
    this.scSocket = this.websocket.connect(socketURL);

    return this.scSocket;
  }
  disconnectSocket() {
    if (this.socket && this.socket !== null) {
      this.socket.disconnect();
    }
  }
  disconnectScSocket() {
    if (this.scSocket && this.scSocket !== null) {
      this.scSocket.disconnect();
    }
  }
  getUrls() {
    this.getAllUrls().subscribe((data: any) => {
      this.getdatatableAPI();
      if (data.status === 'success') {
        if (data.forecast) {
          this.sessionStorage.setKeyValue(SESSION.FORECAST_SOCKET_URL, data.forecast);
        }
        if (data.anomaly) {
          this.sessionStorage.setKeyValue(SESSION.ANOMALY_SOCKET_URL, data.anomaly);
        }
        if (data.profiler) {
          this.sessionStorage.setKeyValue(SESSION.PROFILER_SOCKET_URL, data.profiler);
        }
        if (data.dataMng) {
          this.sessionStorage.setKeyValue(SESSION.DTMNG_SOCKET_URL, data.dataMng);
        }
        if (data.socketExpTime) {
          this.sessionStorage.setKeyValue(SESSION.SES_EXP_TIME, data.socketExpTime);
        }
      }
    });
    return true;
  }
  getAllUrls() {
    // return this.http.get('./assets/res/getUrls.json');
    // return this.http.get(APP.BASE_URL + APP.SOCKET_URL);
    return of(this.configService.getUrlDetails());
      // return this.configService.getConfigurationDetails().pipe(map(res => {
      //   console.log('config res', res);
      //   const response = this.configService.setConfigObject(res);
      //   return response;
      // }, err => {
      //   console.log('configerror', err);
      //   const response =  this.configService.setConfigObject();
      //   return response;
      // }));
  }

  getTopic(link, uid?, type?): string {
    const feature = this.sessionStorage.getKeyValue(SESSION.FEATURE);
    const id = this.sessionStorage.getKeyValue(SESSION.ID);
    const method = this.sessionStorage.getKeyValue(SESSION.METHODS);
    if (feature === SOCKET_FEATURE.FORECAST) {
      if (link === SUBSCRIPTIONS.FR_PROC_TABLE) {

        const subUrl = '/' + feature + '/' + id + '/' + method;
        return subUrl;
      } else if (link === SUBSCRIPTIONS.FR_PROC_TABLE_VIEW_DETAILS) {

        const subUrl = '/' + feature + '/' + uid;
        return subUrl;
      } else if (link === SUBSCRIPTIONS.DTMNG_JOBSTATUS) {
        const subUrl = '/' + feature + '/datamanagement/' + uid;
        return subUrl;
      }
    } else if (feature === SOCKET_FEATURE.ANOMALY) {
      if (link === SUBSCRIPTIONS.ANMD_ANMD_TABLE) {
        const subUrl = '/' + feature + '/' + 'alltrainedmodels';
        return subUrl;
      } else if (link === SUBSCRIPTIONS.ANMD_ANMD_RESULT) {
        const subUrl = '/' + feature + '/' + uid;
        return subUrl;
      } else if (link === SUBSCRIPTIONS.ANMD_ALL_TASK_TRAINED_MODELS) {
        const subUrl = '/' + feature + '/' + uid;
        return subUrl;
      } else if (link === SUBSCRIPTIONS.ANMD_ALL_TASK_TRAINING_STATUS) {
        const subUrl = '/' + feature + '/' + uid;
        return subUrl;
      } else if (link === SUBSCRIPTIONS.ANMD_ALL_TASK) {
        const subUrl = '/' + feature + '/' + method;
        return subUrl;
      } else if (link === SUBSCRIPTIONS.ANMD_ANM_PROFILING) {
        const subUrl = '/' + feature + '/' + type + '/' + uid;
        return subUrl;
      }
    } else if (feature === SOCKET_FEATURE.CLASSIFICATION) {
      if (link === SUBSCRIPTIONS.PROFILER_RESULT) {
        const subUrl = '/' + feature + '/' + '2021-01-01T02:02:02Z';
        return subUrl;
      } else if (link === SUBSCRIPTIONS.PROFILER_RESULT_UID) {
        const subUrl = '/' + feature + '/' + uid;
        return subUrl;
      }
    } else if (feature === SOCKET_FEATURE.DATAMANAGEMENT) {
      if (link === SUBSCRIPTIONS.DTMNG_JOBSTATUS) {
        const subUrl = '/' + feature + '/datamanagement/' + uid;
        return subUrl;
      }
    }
    return null;
  }
  deleteScSocket() {
    const id = this.getSessionId();
    if (id) {
      this.deleteScheduleSocket(id, 'DELETE')
        .subscribe((res: any) => {
          if (res.status === 'success') {
            //   this.notfyService.showToastrInfo('APP-SCHEDULER', 'Deleted');
          } else {
            // this.notfyService.showToastrWarning('APP-SCHEDULER', 'has issue while deleting');
          }
          this.deleteSession();
        }, (error) => {
          // this.notfyService.showToastrError('APP-SCHEDULER', 'Deletion Failed');
        });
    }
  }

  clearSocketSessions() {
    this.invalidateSession();
  }
  invalidateSession() {
    const sessionTimeOut = this.sessionStorage.getKeyValue(SESSION.SES_TIME);
    const today = new Date();
    const todayTime = today.getTime();
    if (todayTime > new Date(sessionTimeOut).getTime()) {
      this.sessionStorage.removeKey(SESSION.ID);
      return true;
    }
    return false;
  }
  getdatatableAPI() {
    this.getAllTasks().subscribe((res: any) => {
      if (res.status === 'success') {
        const taskstableData =
          this.alltasksData = res && res.data ? res.data : [];
        const today = new Date();
        const todayTime = today.getTime();
        this.alltasksData = this.alltasksData.filter((el) => el.data &&
          el.data.modelType === 'FORECAST' &&
          (!isNaN(el.interval_time)) &&
          todayTime > new Date(el.schedule_to).getTime()
        );
        if (this.alltasksData && this.alltasksData.length > 0) {
          const ids = this.alltasksData.map(x => {
            return x.id;
          });
          if (ids && ids.length && ids.length > 0) {
            this.deleteSchedules(ids, 'DELETE');
          }
        }
      }
    }, err => {
    });
  }
  getAllTasks() {
    // return this.http.get(APP.BASE_URL + APP.SCHEDULES_URL);
    // return this.http.get('./assets/res/allt.json');
    return this.http.get(this.configService.schedulerBaseUrl +
      APP.SCHEDULES_URL,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  actionOnTask(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.ACTION_ON_TASK, data);
    // return this.http.post(this.configService.schedulerBaseUrl +
    //   ANOMALY_URLS.ACTION_ON_TASK +
    //   data.actionType,
    //   data.id, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
    //     return of({ status: 'success', data: res });
    //   }));
    return null;
  }
  deleteSchedules(selectedScheduleId, actionType) {
    const data = {
      id: JSON.stringify(selectedScheduleId),
      actionType
    };
    this.actionOnTask(JSON.stringify(data)).subscribe((result: any) => {
    }, (error) => {
    });
  }
}
