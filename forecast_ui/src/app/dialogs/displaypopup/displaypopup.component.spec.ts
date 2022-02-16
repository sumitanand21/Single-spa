import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { DisplaypopupComponent } from './displaypopup.component';

describe('DisplaypopupComponent', () => {
  let component: DisplaypopupComponent;
  let fixture: ComponentFixture<DisplaypopupComponent>;
  const dialogMock = {
    close: () => { }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplaypopupComponent],
      imports: [MatDialogModule, SharedModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaypopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide Values', () => {
    component.data = { header: 'Alert', buttonText: 'Ok', message: 'delete', dispCancel: true };
    component.ngOnInit();
    expect(component.dispCancel).toBeTruthy();
  });

  it('should close dialog', () => {
    const spyClose = spyOn(component.dialogRef, 'close').and.callThrough();
    component.returnvalue();
    expect(spyClose).toHaveBeenCalled();
  });


});
