import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureGroupComponent } from './feature-group.component';
import { SharedModule } from '../../../../shared/shared.module';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('FeatureGroupComponent', () => {
  let component: FeatureGroupComponent;
  let fixture: ComponentFixture<FeatureGroupComponent>;
  const routePath = [{ path: 'forecast/modelconfig', redirectTo: '' }];
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureGroupComponent ],
      imports: [
        SharedModule,
        // HttpClientTestingModule,
        RouterTestingModule.withRoutes(routePath),
        // ToastrModule.forRoot(),
        // BrowserAnimationsModule,
        // RouterModule.forRoot(routes),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset pagination on search change', () => {
    component.onsearchChange('');
    expect(component.inputCurrentpage).toBe(component.defaultCurrentPage);
  });

  it('should change pagination input', () => {
    component.changepageinp(2, 3);
    expect(component.config.currentPage).toBe(2);
  });

  it('should change pagination input', () => {
    component.changepageinp(4, 3);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
  });

  it('should change pagination page', () => {
    component.changepage(1);
    expect(component.inputCurrentpage).toBe(1);
  });

  it('should set new page size', () => {
    component.setNewPageSize(100);
    expect(component.config.itemsPerPage).toBe(100);
  });

  it('should set data set details', () => {
    const detailsObj = { dataArr : ['alarm_data'], selVal : 'alarm_data' };
    component.setDataSetDetails(detailsObj);
    expect(component.selectedDataSet).toBe(detailsObj.selVal);
  });

  it('should set empty data set details', () => {
    const detailsObj = { dataArr : [], selVal : '' };
    component.setDataSetDetails(detailsObj);
    expect(component.selectedDataSet).toBe(detailsObj.selVal);
  });

  it('should set Feature Label details', () => {
    const detailsObj = { dataArr : ['alarm_data'], selVal : 'alarm_data' };
    component.setFeatureLabel(detailsObj);
    expect(component.selectedLabel).toBe(detailsObj.selVal);
  });

  it('should set empty Feature Label details', () => {
    const detailsObj = { dataArr : [], selVal : '' };
    component.setFeatureLabel(detailsObj);
    expect(component.selectedLabel).toBe(detailsObj.selVal);
  });

  it('should set Feature Group details', () => {
    const detailsObj = { dataArr : ['Group1'], selVal : 'Group1', enable: true };
    component.setFeatureGrpDetails(detailsObj);
    expect(component.selectedFeaturegroup).toBe(detailsObj.selVal);
  });

  it('should set empty Feature Group details', () => {
    const detailsObj = { dataArr : [], selVal : '', enable: false };
    component.setFeatureGrpDetails(detailsObj);
    expect(component.selectedFeaturegroup).toBe(detailsObj.selVal);
  });

  it('should set Time Filter details', () => {
    const detailsObj = { dataArr : [{time_column : '@timeStamp'}], selVal : '@timeStamp', enable: true };
    component.setTimeFtrDetails(detailsObj);
    expect(component.selectedTimeFilterFeature).toBe(detailsObj.selVal);
  });

  it('should set empty Time Filter details', () => {
    const detailsObj = { dataArr : [], selVal : '', enable: false };
    component.setTimeFtrDetails(detailsObj);
    expect(component.selectedTimeFilterFeature).toBe(detailsObj.selVal);
  });

  it('should set Time Filter Date details', () => {
    const detailsObj = { to_Time  : new Date(), from_Time: new Date() };
    const spyMenu = spyOn(component, 'openTimeEditMenu');
    component.setTimeFtrDate(detailsObj);
    expect(spyMenu).toHaveBeenCalled();
  });

  it('should set empty Time Filter Date details', () => {
    const detailsObj = { to_Time  : '', from_Time: '' };
    const spyMenu = spyOn(component, 'openTimeEditMenu');
    component.setTimeFtrDate(detailsObj);
    expect(spyMenu).toHaveBeenCalled();
  });

  it('should set Feature List details', () => {
    const detailsObj = { dataArr   : [{name : '@timestamp' , type: 'date'}] };
    const spySearch = spyOn(component, 'onsearchChange');
    component.setFeatureListDetails(detailsObj);
    expect(spySearch).toHaveBeenCalled();
  });

  it('should set empty Feature List details', () => {
    const detailsObj = { dataArr   : [] };
    const spySearch = spyOn(component, 'onsearchChange');
    component.setFeatureListDetails(detailsObj);
    expect(spySearch).toHaveBeenCalled();
  });

  it('should select All Feature', () => {
    component.selectAllFeature(true);
    expect(component.featureDetails.every(it => it.checkSelect)).toBeTruthy();
  });

  it('should deselect All Feature', () => {
    component.selectAllFeature(false);
    expect(component.selectedFeature.length).toBe(0);
  });

  it('should check on feature selection', () => {
    component.selectedTimeFilterFeature = '@timestamp';
    const featureObj = {checkSelect : false, name: '@timestamp'};
    component.onSelectFeature(featureObj);
    expect(component.selectedTimeFilterFeature).toBe('');
  });

  it('should check on feature group checkbox selection', () => {
    component.OnFeatureGrpCheckBox(false);
    expect(component.showSelected ).toBeFalsy();
  });

  it('should check on Time Filter checkbox selection', () => {
    component.OnTimeFilterCheckBox(false);
    expect(component.selectedTimeFilterFeature).toEqual('');
  });

  it('should show selected Feature', () => {
    component.featureDetails = [{name: 'xyz', checkSelect : true}];
    component.showSelectedFeature();
    expect(component.showSelected ).toBeTruthy();
  });

  it('should show selected Feature', () => {
    component.featureDetails = [{name: 'xyz', checkSelect : false}];
    component.showSelectedFeature();
    expect(component.checkAllFeature  ).toBeFalsy();
  });


});
