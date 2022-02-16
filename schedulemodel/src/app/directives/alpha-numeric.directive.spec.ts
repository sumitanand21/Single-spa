import { AlphaNumericDirective } from './alpha-numeric.directive';
import { Component, ElementRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser"
@Component({
  template: `<input type="text" [appAlphaNumeric]="inputVal">`
})
class TestComponent {
  inputVal = '';
}

describe('AlphaNumericDirective', () => {

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  let elementRef: ElementRef

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlphaNumericDirective, TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    elementRef = fixture.nativeElement;
    inputEl = fixture.debugElement.query(By.directive(AlphaNumericDirective));
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new AlphaNumericDirective(elementRef);
    expect(directive).toBeTruthy();
  });

  it('should allow numbers only', () => {
    component.inputVal = 'num';
    fixture.detectChanges();
    const event = new Event('input', {} as any);
    inputEl.nativeElement.value = '1a';
    inputEl.nativeElement.dispatchEvent(event);
    expect(inputEl.nativeElement.value).toBe('1');
  });

  it('should allow text only', () => {
    component.inputVal = 'text';
    fixture.detectChanges();
    const event = new Event('input', {} as any);
    inputEl.nativeElement.value = ' 1a';
    inputEl.nativeElement.dispatchEvent(event);
    expect(inputEl.nativeElement.value).toBe('1a');
  });

  it('should allow positive decimal only', () => {
    component.inputVal = 'positivefloat';
    fixture.detectChanges();
    const event = new Event('input', {} as any);
    inputEl.nativeElement.value = ' -1a.0';
    inputEl.nativeElement.dispatchEvent(event);
    expect(inputEl.nativeElement.value).toBe('1.0');
  });

  it('should allow maskNum only', () => {
    component.inputVal = 'maskNum';
    fixture.detectChanges();
    const event = new Event('input', {} as any);
    inputEl.nativeElement.value = ' -1a,0';
    inputEl.nativeElement.dispatchEvent(event);
    expect(inputEl.nativeElement.value).toBe('1, 0');
  });

  it('should handle empty value for numbers only', () => {
    component.inputVal = 'num';
    fixture.detectChanges();
    const event = new Event('input', {} as any);
    inputEl.nativeElement.value = '';
    inputEl.nativeElement.dispatchEvent(event);
    expect(inputEl.nativeElement.value).toBe('');
  });

  it('should handle empty value for text only', () => {
    component.inputVal = 'text';
    fixture.detectChanges();
    const event = new Event('input', {} as any);
    inputEl.nativeElement.value = '';
    inputEl.nativeElement.dispatchEvent(event);
    expect(inputEl.nativeElement.value).toBe('');
  });

  it('should handle empty value for positive decimal only', () => {
    component.inputVal = 'positivefloat';
    fixture.detectChanges();
    const event = new Event('input', {} as any);
    inputEl.nativeElement.value = '';
    inputEl.nativeElement.dispatchEvent(event);
    expect(inputEl.nativeElement.value).toBe('');
  });

  it('should keep first occurence of decimal', () => {
    component.inputVal = 'positivefloat';
    fixture.detectChanges();
    const event = new Event('input', {} as any);
    inputEl.nativeElement.value = '1.4.9';
    inputEl.nativeElement.dispatchEvent(event);
    expect(inputEl.nativeElement.value).toBe('1.49');
  });

  it('should keep first occurence of comma', () => {
    component.inputVal = 'maskNum';
    fixture.detectChanges();
    const event = new Event('input', {} as any);
    inputEl.nativeElement.value = '1,4,9';
    inputEl.nativeElement.dispatchEvent(event);
    expect(inputEl.nativeElement.value).toBe('1, 49');
  });

  it('should handle empty value for maskNum', () => {
    component.inputVal = 'maskNum';
    fixture.detectChanges();
    const event = new Event('input', {} as any);
    inputEl.nativeElement.value = '';
    inputEl.nativeElement.dispatchEvent(event);
    expect(inputEl.nativeElement.value).toBe('');
  });

  it('should handle no value after comma for maskNum', () => {
    component.inputVal = 'maskNum';
    fixture.detectChanges();
    const event = new Event('input', {} as any);
    inputEl.nativeElement.value = '1,';
    inputEl.nativeElement.dispatchEvent(event);
    expect(inputEl.nativeElement.value).toBe('1,');
  });

});
