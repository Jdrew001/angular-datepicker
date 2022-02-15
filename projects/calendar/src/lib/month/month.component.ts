import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { WeekDay } from '@angular/common';
import { areDatesInSameMonth, getDaysOfMonth, getWeekNumber, isDateAfter, isSameDate, isValidDate, startOfDay } from '../date-utils/date.utils';

@Component({
  selector: 'lib-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthComponent implements AfterViewInit, OnChanges {
  daysOfMonth!: Array<{day: Date, weekNumber: number}>;
  firstDayOfMonth!: string;
  currentDate = startOfDay(new Date());
  highlightedWeekNum!: number;
  highlightedDate!: Date;
  selectedWeek!: number;

  _selectedDate?: Date;
  get selectedDate() { return this._selectedDate!; }
  @Input() set selectedDate(val: Date) {
    if(val) {
      this._selectedDate = val;

      this.detectSelectedWeek();
    }
  }

  @Input() min?: Date | null;
  @Input() locale?: string;
  @Input() activeDate!: Date;
  @Input() weekSelect!: boolean;

  private _month!: Date;

  @Input()
  get month() {
    return this._month;
  }
  set month(month: Date) {
    if (!this._month || !areDatesInSameMonth(this._month, month)) {
      this._month = month;
      let tempData = getDaysOfMonth(this._month);
      this.daysOfMonth = this.prepareData(tempData);
      this.firstDayOfMonth = WeekDay[this.daysOfMonth[0].day.getDay()].toLowerCase();
    }
  }

  @Output() selectedDateChange = new EventEmitter<Date>();
  @Output() activeDateChange = new EventEmitter<Date>();

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.changeDetectorRef.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.entries(changes).some(([input, change]) => input !== 'month' && !change.firstChange)) {
      this.changeDetectorRef.detectChanges();
    }
  }

  isSelected(dayOfMonth: Date) {
    return !!this.selectedDate && isSameDate(dayOfMonth, this.selectedDate);
  }

  isDisabled(dayOfMonth: Date) {
    return !!this.min && isDateAfter(this.min, dayOfMonth);
  }

  isActive(dayOfMonth: Date) {
    return !!this.activeDate && isSameDate(dayOfMonth, this.activeDate);
  }

  isCurrent(dayOfMonth: Date) {
    return !!this.currentDate && isSameDate(dayOfMonth, this.currentDate);
  }

  onDateClick(date: any) {
    if (isValidDate(date)) {
      this.selectDate(date);
    }
  }

  //hover event will update the highlighted week num
  detectHighlight(dayOfMonth: {day: Date, weekNumber: number}) {
    this.highlightedWeekNum = dayOfMonth.weekNumber;
    this.highlightedDate = dayOfMonth.day;
    this.changeDetectorRef.detectChanges();
  }

  //highlight hovered week or day depending on flag
  shouldHighlight(dayOfMonth: {day: Date, weekNumber: number}) {
    // week select true, highlight row
    if (this.weekSelect) {
      return dayOfMonth.weekNumber == this.highlightedWeekNum;
    } else {
      return dayOfMonth.day == this.highlightedDate;
    }
  }

  shouldHighlightWeek(dayOfMonth: {day: Date, weekNumber: number}) {
    if (this.weekSelect) {
      return dayOfMonth.weekNumber == this.selectedWeek;
    }

    return false;
  }

  detectSelectedWeek() {
    this.selectedWeek = getWeekNumber(this.selectedDate!);
  }

  // Prepare data for consumption in the calendar
  private prepareData(days: Array<Date>): Array<{day: Date, weekNumber: number}> {
    return days.map(day => ({day: day, weekNumber: getWeekNumber(day)}));
  }

  private selectDate(date: Date) {
    if (!this.isSelected(date) && !this.isDisabled(date)) {
      this.selectedDateChange.emit(date);
    }
  }
}
