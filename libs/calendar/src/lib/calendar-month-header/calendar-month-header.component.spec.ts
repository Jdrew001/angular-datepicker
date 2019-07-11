import { PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CdkAriaLive } from '@angular/cdk/a11y';

import { MockDirective, MockPipe } from 'ng-mocks';

import { Month } from 'date-utils';

import { CalendarMonthHeaderComponent } from './calendar-month-header.component';
import { MonthAndYearPipe } from '../month-and-year/month-and-year.pipe';

type MonthStep = 'previous' | 'next';

describe('CalendarMonthHeaderComponent', () => {
  let component: CalendarMonthHeaderComponent;
  let fixture: ComponentFixture<CalendarMonthHeaderComponent>;
  let mockDate: Date;

  beforeAll(() => {
    mockDate = new Date(2019, Month.June);
    jasmine.clock().mockDate(mockDate);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CalendarMonthHeaderComponent,
        MockDirective(CdkAriaLive),
        MockPipe(MonthAndYearPipe, mockPipeTransform<MonthAndYearPipe>('monthAndYearPipe'))]
    })
      .compileComponents();
  }));

  function mockPipeTransform<TPipe extends PipeTransform>(pipeName: string) {
    return (...parameters: Parameters<TPipe['transform']>) => `${pipeName}(${parameters.map(param => `${param}`).join(', ')})`;
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarMonthHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the name of the current year and month by default', () => {
    fixture.detectChanges();

    expect(getCaption()).toEqual(`monthAndYearPipe(${mockDate}, undefined, undefined)`);
  });

  it('should display the year and the name of the month received via input', () => {
    const month = new Date(2019, Month.February);
    component.month = month;

    fixture.detectChanges();

    expect(getCaption()).toEqual(`monthAndYearPipe(${month}, undefined, undefined)`);
  });

  it('should format month for the provided locale', () => {
    component.locale = 'hu';
    fixture.detectChanges();

    expect(getCaption()).toEqual(`monthAndYearPipe(${mockDate}, ${component.locale}, undefined)`);
  });

  it('should format month with the provided date format', () => {
    component.monthAndYearFormat = 'MMM y';
    fixture.detectChanges();

    expect(getCaption()).toEqual(`monthAndYearPipe(${mockDate}, undefined, ${component.monthAndYearFormat})`);
  });

  describe('month steppers', () => {
    it('should be visible if showMonthStepper is true', () => {
      component.showMonthStepper = true;

      fixture.detectChanges();

      expect(getMonthStepperButtons()).toBeTruthy();
    });

    it('should be hidden if showMonthStepper is false', () => {
      component.showMonthStepper = false;

      fixture.detectChanges();

      expect(getMonthStepperButtons()).toBeFalsy();
    });

    it('should emit monthStep on next month click', () => {
      component.showMonthStepper = true;
      spyOn(component.monthStep, 'emit');
      fixture.detectChanges();

      stepMonth('next');

      expect(component.monthStep.emit).toHaveBeenCalledWith(1);
    });

    it('should emit monthStep on previous month click', () => {
      component.showMonthStepper = true;
      spyOn(component.monthStep, 'emit');
      fixture.detectChanges();

      stepMonth('previous');

      expect(component.monthStep.emit).toHaveBeenCalledWith(-1);
    });

    it('should announce month change politely', () => {
      fixture.detectChanges();

      expect(getCaptionDebugElement().attributes.cdkAriaLive).toBe('polite');
    });
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  function getCaption() {
    return getCaptionDebugElement().nativeElement.textContent;
  }

  function getCaptionDebugElement() {
    return fixture.debugElement.query(By.css('.calendar-month-header__caption'));
  }

  function stepMonth(monthStep: MonthStep) {
    return getMonthStepperButton(monthStep).triggerEventHandler('click', null);
  }

  function getMonthStepperButton(monthStep: MonthStep) {
    return fixture.debugElement.query(By.css(`.calendar-month-header__stepper--${monthStep}`));
  }

  function getMonthStepperButtons() {
    return fixture.debugElement.query(By.css('.calendar-month-header__stepper'));
  }
});
