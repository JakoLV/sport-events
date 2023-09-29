import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Sports, Status } from 'src/app/shared/enums/sports-event.enum';
import { SportsEvent } from 'src/app/shared/models/sports-event.model';
import { EventsService } from 'src/app/shared/services/events.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss'],
})
export class EventCreateComponent {
  eventForm: FormGroup = new FormGroup({});
  sports = Object.values(Sports);
  statuses = Object.values(Status);
  minEndDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private eventsService: EventsService
  ) {
    this.eventForm = this.fb.group({
      id: [uuidv4()],
      name: ['asd', [Validators.required, Validators.minLength(1)]],
      sport: ['Football', [Validators.required]],
      status: ['Inactive', [Validators.required]],
      startDate: [new Date('2024/09/13'), Validators.required],
      startTime: ['13:13', Validators.required],
      finishDate: [new Date('2024/09/13'), Validators.required],
      finishTime: ['14:14', Validators.required],
    });
  }

  /**
   * Opens the date picker on focus.
   * @param datePicker Date picker to open
   * @returns void
   */
  openPickerOnFocus(datePicker: MatDatepicker<Date>): void {
    datePicker.open();
  }

  /**
   * Updates the min end date.
   * @param event Date picker input event
   * @returns void
   */
  updateMinEndDate(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.minEndDate = new Date(event.value);
    }
  }

  /**
   * Submits the form.
   * @returns void
   */
  onSubmit(): void {
    
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      const startDateTime = this.combineDateAndTime(
        formValue.startDate,
        formValue.startTime
      );
      const finishDateTime = this.combineDateAndTime(
        formValue.finishDate,
        formValue.finishTime
      );

      const payload = {
        id: formValue.id,
        name: formValue.name,
        sport: formValue.sport,
        status: formValue.status,
        startTime: startDateTime.toISOString(),
        finishTime: finishDateTime.toISOString(),
      };

      try {
        const storedEventsString = localStorage.getItem('sportsEvents');
        if (storedEventsString) {
          console.log(this.eventForm);
          const events = JSON.parse(storedEventsString);
          const identicalEventExists = events.some((event: SportsEvent) => {
            // Here, compare all fields of the payload and the event to see if they are identical.
            // This is a basic comparison. Modify as needed for your use case.            
            return (
              event.name === payload.name &&
              event.sport === payload.sport &&
              event.status === payload.status &&
              event.startTime === payload.startTime &&
              event.finishTime === payload.finishTime
            );
          });

          if (identicalEventExists) {
            this.toastService.show('error', 'Event already exists');
          } else {
            this.eventsService.createEvent(payload).subscribe((res) => {
              this.eventForm.reset();
              this.router.navigate(['/event-list']);
            });
          }
        }
      } catch (error) {
        this.toastService.show('error', 'Event could not be created');
      }
    }
  }

  /**
   * Combines the date and time.
   * @param date The date to combine
   * @param time The time to combine
   * @returns The combined date and time as a Date object
   */
  combineDateAndTime(date: string, time: string): Date {
    const timeParts = time.split(':');
    const dateInstance = new Date(date);

    dateInstance.setHours(Number(timeParts[0]));
    dateInstance.setMinutes(Number(timeParts[1]));

    return dateInstance;
  }

  /**
   * Reset the form and navigates back to the event list.
   */
  cancelCreate(): void {
    this.eventForm.reset();
    this.router.navigate(['/event-list']);
    localStorage.removeItem('sportsEvents');
    this.toastService.show('info', 'Event creation cancelled');
  }
}
