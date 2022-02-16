import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertAnomalyModelConfigComponent } from './upsert-anomaly-model-config.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/libs/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AlphaNumericDirective } from 'src/app/directives/alpha-numeric.directive';

describe('UpsertAnomalyModelConfigComponent', () => {
  let component: UpsertAnomalyModelConfigComponent;
  let fixture: ComponentFixture<UpsertAnomalyModelConfigComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpsertAnomalyModelConfigComponent, AlphaNumericDirective],
      imports: [RouterTestingModule,
        HttpClientTestingModule,
        FormsModule, ReactiveFormsModule,
        MaterialModule, NgxPaginationModule,
        FilterPipeModule, Ng2SearchPipeModule,
        OrderModule, ModalModule.forRoot(),
        ToastrModule.forRoot(),
        BrowserAnimationsModule],
      providers: [DatePipe, BsModalService,
        { provide: ToastrService, useClass: ToastrService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertAnomalyModelConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.masterData = {
      id: '5fbe1343cf20c248346b4cfa',
      anomalyI: {
        encoders: [
          'None',
          'Label',
          'One-hot'
        ],
        scalers: [
          'None',
          'Standard',
          'Minmax',
          'Normalizer'
        ],
        optimizers: [
          'sgd',
          'adam',
          'adadeita',
          'adagrad'
        ],
        activations: [
          'relu',
          'sigmoid',
          'tanh',
          'linear',
          'hard_sigmoid'
        ],
        decoder_Activations: [
          'relu',
          'sigmoid',
          'tanh',
          'linear',
          'hard_sigmoid'
        ],
        metrics: [
          'Accuracy',
          'F1'
        ],
        datasetName: {
          ABCD: [
            'createdAt2 binary',
            'dLipsum traget_computers_personal_loan_accou',
            'dLipsum traget_computerss_personal_loan_accou',
            'crad eatdedAt binary',
            'crad eatdedAt1 binary'
          ],
          bcdE: [
            'createdAt2 binary',
            'dLipsum traget_computers_personal_loan_accou',
            'dLipsum traget_computerss_personal_loan_accou',
            'um traget_compuaters_personal_loan_account.gif compress',
            'createdAt1 binary'
          ],
          XYZA: [
            'createdAt binaryapplication category',
            'createdAt1 binaryapplication category',
            'um traget_computers_personal_loan_account.gif compress',
            'Lipsum traget_computers_personal3_loan_account.gif comp',
            'Lipsum traget_compueters_personal_loan_account.gif comp',
            'createdAt2 binary'
          ],
          LMNOQ: [
            'Lipsum traget_computers_personal2_loan_account.gif comp',
            'Lipsum traget_computeres_personal_loan_account.gif comp',
            'createdAtr binary',
            'createdAtq binary'
          ],
          PQRW: [
            'Lipsum traget_computers_personal_loan_account.gif comp',
            'Lipsum traget_computers_psersonal_loan_accosunt.gif comp',
            'createdAt binary',
            'createdAt2 binary',
            'dLipsum traget_computers_personal_loan_accou',
            'dLipsum traget_computerss_personal_loan_accou',
            'crad eatdedAt binary',
            'crad eatdedAt1 binary',
            'aget_computers_personal_loan_account.gif compress',
            'aget_computers_personal_aloan_account.gif compress',
            'createdAt binaryapplication category',
            'createdAt1 binaryapplication category',
            'um traget_computers_personal_loan_account.gif compress',
            'um traget_compuaters_personal_loan_account.gif compress',
            'createdAt1 binary',
            'createdaAt11 binary',
            'Lipsum traget_computers_personal3_loan_account.gif comp',
            'Lipsum traget_compueters_personal_loan_account.gif comp'
          ]
        }
      },
      anomalyII: {
        encoders: [
          'None',
          'Label',
          'One-hot'
        ],
        scalers: [
          'None',
          'Standard',
          'Minmax',
          'Normalizer'
        ],
        losses: [
          'None',
          'Standard',
          'Label',
          'sigmoid',
          'tanh'
        ],
        datasetName: {
          ACD: [
            'createdAt2 binary',
            'dLipsum traget_computers_personal_loan_accou',
            'dLipsum traget_computerss_personal_loan_accou',
            'crad eatdedAt binary',
            'crad eatdedAt1 binary'
          ],
          bsE: [
            'createdAt2 binary',
            'dLipsum traget_computers_personal_loan_accou',
            'dLipsum traget_computerss_personal_loan_accou',
            'um traget_compuaters_personal_loan_account.gif compress',
            'createdAt1 binary'
          ],
          XZA: [
            'createdAt binaryapplication category',
            'createdAt1 binaryapplication category',
            'um traget_computers_personal_loan_account.gif compress',
            'Lipsum traget_computers_personal3_loan_account.gif comp',
            'Lipsum traget_compueters_personal_loan_account.gif comp',
            'createdAt2 binary'
          ],
          LMjOQ: [
            'Lipsum traget_computers_personal2_loan_account.gif comp',
            'Lipsum traget_computeres_personal_loan_account.gif comp',
            'createdAtr binary',
            'createdAtq binary'
          ],
          PQsRW: [
            'Lipsum traget_computers_personal_loan_account.gif comp',
            'Lipsum traget_computers_psersonal_loan_accosunt.gif comp',
            'createdAt binary',
            'createdAt2 binary',
            'dLipsum traget_computers_personal_loan_accou',
            'dLipsum traget_computerss_personal_loan_accou',
            'crad eatdedAt binary',
            'crad eatdedAt1 binary',
            'aget_computers_personal_loan_account.gif compress',
            'aget_computers_personal_aloan_account.gif compress',
            'createdAt binaryapplication category',
            'createdAt1 binaryapplication category',
            'um traget_computers_personal_loan_account.gif compress',
            'um traget_compuaters_personal_loan_account.gif compress',
            'createdAt1 binary',
            'createdaAt11 binary',
            'Lipsum traget_computers_personal3_loan_account.gif comp',
            'Lipsum traget_compueters_personal_loan_account.gif comp'
          ]
        }
      }
    };
    component.setInitialMasterData('MODELI');
    component.setDataSetUniqueFeatures(component.datasets[0]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('on Update On Init', () => {
    component.anomalyService.AnomalymodelName = 'Model 1';
    const spySuccess = spyOn(component, 'getMasterData');
    component.ngOnInit();
    expect(component.anomalyService.AnomalyModel).toEqual(true);
    expect(component.anomalyService.AnomalyUpdateModel).toEqual(true);
    expect(spySuccess).toHaveBeenCalled();
  });
  it('on Create On Init', () => {
    component.anomalyService.AnomalymodelName = undefined;
    const spySuccess = spyOn(component, 'getMasterData');
    component.ngOnInit();

    expect(component.anomalyService.AnomalyModel).toEqual(true);
    expect(component.anomalyService.AnomalyUpdateModel).toEqual(true);
    expect(spySuccess).toHaveBeenCalled();
  });
  it('on load master Data On Init', () => {
    component.getMasterData();
    expect(component.masterDataLoading).toEqual(true);
  });
  it('on check all x features', () => {
    component.checkAlls(true);
    component.isAllChecked();
    expect(component.selectAll).toEqual(true);
  });
  it('on check all training filters', () => {
    component.checkAllunique(true);
    component.uniqueisAllChecked();
    expect(component.uniqueselectAll).toEqual(true);
  });
  it('on check all string features', () => {
    component.checkAllselected(true);
    component.isAllCheckedstring();
    expect(component.stringselectAll).toEqual(true);
  });
  it('on is check all', () => {
    const val = component.isAllChecked();
    expect(val).toBe();
  });
  it('should set the PageSize', () => {
    component.setNewPageSize(5);
    expect(component.config.itemsPerPage).toBe(5);
    expect(component.config.currentPage).toBe(1);
    expect(component.inputCurrentpage).toBe(1);
  });
  it('should Sort the table based on the keys', () => {
    component.sort('name');
    expect(component.key).toBe('name');
    expect(component.reverse).toBe(true);
  });
  it('changing the page on user input changepageinp', () => {
    component.config.currentPage = 2;
    component.changepageinp(2, 5);
    expect(component.config.currentPage).toBe(2);
    component.changepageinp(0, 5);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
    component.changepageinp(10, 5);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
  });
  it('should set on destroy ', () => {
    component.ngOnDestroy();

    expect(component.anomalyService.AnomalyModel).toEqual(false);
    expect(component.anomalyService.AnomalyUpdateModel).toEqual(false);
  });
  it('Should create form ', () => {
    component.createForm('MODELI');
    expect(component.upsertAnmModel).toBeDefined();
  });
  it('Should initialize form ', () => {
    const tempModelObj = {
      modelConfigName: 'OP1_AM1', modelType: 'Model 1', encoder: 'None', epochs: '100', scaler: '2', nodeList: '10, 13, 45, 69, 2, 3, 6, 8',
      dataSet: 'Company ABC Call log', uniqueFeature: 'ABCD',
      xFeatureList: ['Lipsum traget_computers_personal_loan_account.gif comp' ,
      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'createdAt binary' ,
      'createdAt binary' ,

      'dLipsum traget_computers_personal_loan_accou' ,
      'dLipsum traget_computers_personal_loan_accou' ,
      'crad eatdedAt binary' ,
      'crad eatdedAt binary' ,

      'aget_computers_personal_loan_account.gif compress' ,
      'aget_computers_personal_loan_account.gif compress' ,
      'createdAt binaryapplication category' ,
      'createdAt binaryapplication category' ,

      'um traget_computers_personal_loan_account.gif compress' ,
      'um traget_computers_personal_loan_account.gif compress' ,
      'createdAt binary' ,
      'createdAt binary' ,

      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'createdAt binary' ,
      'createdAt binary' ,

      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'createdAt binary' ,
      'createdAt binary' ,
      ],
      trainingFilter: ['Lipsum traget_computers_personal_loan_account.gif comp' ,
      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'createdAt binary' ,
      'createdAt binary' ,

      'dLipsum traget_computers_personal_loan_accou' ,
      'dLipsum traget_computers_personal_loan_accou' ,
      'crad eatdedAt binary' ,
      'crad eatdedAt binary' ,

      'aget_computers_personal_loan_account.gif compress' ,
      'aget_computers_personal_loan_account.gif compress' ,
      'createdAt binaryapplication category' ,
      'createdAt binaryapplication category' ,

      'um traget_computers_personal_loan_account.gif compress' ,
      'um traget_computers_personal_loan_account.gif compress' ,
      'createdAt binary' ,
      'createdAt binary' ,

      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'createdAt binary' ,
      'createdAt binary' ,

      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'createdAt binary' ,
      'createdAt binary' ,
      ],
      stringFeature: ['Lipsum traget_computers_personal_loan_account.gif comp' ,
      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'createdAt binary' ,
      'createdAt binary' ,

      'dLipsum traget_computers_personal_loan_accou' ,
      'dLipsum traget_computers_personal_loan_accou' ,
      'crad eatdedAt binary' ,
      'crad eatdedAt binary' ,

      'aget_computers_personal_loan_account.gif compress' ,
      'aget_computers_personal_loan_account.gif compress' ,
      'createdAt binaryapplication category' ,
      'createdAt binaryapplication category' ,

      'um traget_computers_personal_loan_account.gif compress' ,
      'um traget_computers_personal_loan_account.gif compress' ,
      'createdAt binary' ,
      'createdAt binary' ,

      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'createdAt binary' ,
      'createdAt binary' ,

      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'Lipsum traget_computers_personal_loan_account.gif comp' ,
      'createdAt binary' ,
      'createdAt binary' ,
      ]
    };
    component.setInitialDataToForm(tempModelObj, 'MODELI');
    expect(component.upsertAnmModel).toBeDefined();
    expect(component.upsertAnmModel.controls.modelConfigName.value).toBe(tempModelObj.modelConfigName);
    expect(component.upsertAnmModel.controls.modelType.value).toBe(tempModelObj.modelType);
  });
  it('should change page on search to Default', () => {
    component.onsearchChange('anomaly', 1);
    expect(component.inputCurrentpage).toBe(1);
    expect(component.config.currentPage).toBe(1);
  });
  it('should check current and page that has changed', () => {
    component.changepage(0);
    expect(component.inputCurrentpage).toBe(0);
    expect(component.config.currentPage).toBe(0);
  });
});
