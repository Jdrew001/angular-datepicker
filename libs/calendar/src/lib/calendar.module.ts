import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';

import { CalendarComponent } from './calendar.component';
import { CalendarMonthComponent } from './calendar-month/calendar-month.component';
import { CalendarWeekComponent } from './calendar-week/calendar-week.component';
import { CalendarMonthHeaderComponent } from './calendar-month-header/calendar-month-header.component';
import { MonthAndYearPipe } from './month-and-year/month-and-year.pipe';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarMonthComponent,
    CalendarWeekComponent,
    CalendarMonthHeaderComponent,
    MonthAndYearPipe,
  ],
  imports: [
    CommonModule,
    A11yModule,
  ],
  exports: [CalendarComponent]
})
export class CalendarModule { }
