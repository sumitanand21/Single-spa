import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SingleSpaService } from './single-spa.service';

@Injectable({
  providedIn: 'root'
})
export class PreloadApiService {

  constructor(private singleSpaService: SingleSpaService, private http: HttpClient) { }

  loadApi(preloadUrlData: any) {
    if (preloadUrlData && preloadUrlData.length) {
      preloadUrlData.forEach(element => {
        if (element.isActive) {
          this.singleSpaService.globalEventDistributor.setTopicStatus(element.topic, false);
          this.http.get(element.url).subscribe((result) => {
            this.singleSpaService.globalEventDistributor.broadCostData(element.topic, result);
            this.singleSpaService.globalEventDistributor.setTopicStatus(element.topic, true);
          });
        }
      });
    }
  }

}
