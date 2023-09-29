import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sports, Status } from 'src/app/shared/enums/sports-event.enum';
import { SportsEvent } from 'src/app/shared/models/sports-event.model';
import eventsData from 'src/assets/sample-data.json';
import { ToastService } from 'src/app/shared/services/toast.service';
import { EventsService } from 'src/app/shared/services/events.service';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit, AfterViewInit, OnDestroy {
  
  defaultPageSize = 10;
  totalEvents: number = 0;
  pageIndex: number = 0; 

  displayedColumns: string[] = [ 'name', 'sport', 'status', 'startTime', 'finishTime', 'actions',];
  dataSource = new MatTableDataSource<SportsEvent>([]);
  sportsFilter: string[] = [];
  statusFilter: string[] = [];
  nameFilter: string = '';
  sportsList = Object.values(Sports);
  statusList = Object.values(Status);
  Sports = Sports;
  Status = Status;

  private subscriptions: Subscription[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    const savedOptions = JSON.parse(localStorage.getItem('viewOptions') || '{}');
  
    if (savedOptions.perPage) {
      this.defaultPageSize = savedOptions.perPage;
    }
    
    if (savedOptions.pageIndex !== undefined) {
      this.pageIndex = savedOptions.pageIndex;
    }
  }
  
  ngAfterViewInit(): void {
    this.getSportEventsData();
    this.dataSource.sort = this.sort;
    this.sort.active = 'startTime';
    this.sort.direction = 'desc';
    this.cdr.detectChanges();
  
    if (this.defaultPageSize) {
      this.paginator.pageSize = this.defaultPageSize;
    }
    
    if (this.pageIndex !== undefined) {
      this.paginator.pageIndex = this.pageIndex;
    }
  
    this.dataSource.paginator = this.paginator;
    this.applyFilter();
  }  

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Gets the events data from the API or the sample data file
   * @returns void
   */
  private getSportEventsData(): void {
    const subscription = this.eventsService.getEvents().subscribe(
      (response: any) => {
        if (
          response.type === 'success' &&
          response.data &&
          response.data.length > 0
        ) {          
          this.dataSource.data = response.data.flat();;
          localStorage.setItem('sportsEvents', JSON.stringify(this.dataSource.data));
        } else {
          this.dataSource.data = eventsData;
          eventsData.forEach((event) => {
            this.eventsService.createEvent(event).pipe(take(1)).subscribe();
          });
        }
        this.cdr.detectChanges();
        this.totalEvents = this.dataSource.data.length;
        this.paginator.length = this.dataSource.data.length;

      },
      (error: Error) => {
        console.error('Error fetching events:', error);
        this.toastService.show('error', 'Failed to load events');
        this.cdr.detectChanges();
      }
    );

    this.subscriptions.push(subscription);
  }

  /**
   * Applies the filters to the data source and triggers the filter
   * @param void
   * @returns void
   */
  applyFilter(): void {
    this.dataSource.filterPredicate = (data: SportsEvent, filter: string) => {
      const nameMatch = data.name
        .toLowerCase()
        .includes(this.nameFilter.toLowerCase());
      const sportMatch =
        this.sportsFilter.length === 0 ||
        this.sportsFilter.includes(data.sport);
      const statusMatch =
        this.statusFilter.length === 0 ||
        this.statusFilter.includes(data.status);

      return nameMatch && sportMatch && statusMatch;
    };
    this.dataSource.filter = 'apply';
  }

  /**
   * Resets the events data to the default values and reloads the component
   * @param event The event to be changed
   * @param newStatus The new status to be set
   * @returns void
   */
  changeStatus(event: SportsEvent, newStatus: Status): void {
    if (newStatus === Status.Finished || event.status !== Status.Finished) {
      const updatedEvent = { ...event, status: newStatus };
      const subscription = this.eventsService.updateEvent(event.id, updatedEvent).subscribe(
        () => { event.status = newStatus; },
        (error) => {
          this.toastService.show('error', 'Failed to update event status');
          console.error('Error updating event status:', error);
        }
      );

      this.subscriptions.push(subscription);
    }
  }

  /**
   * Converts a date string to a human readable format
   * @param inputDate The date string to be converted
   * @returns The human readable date string
   */
  humanReadableDate(inputDate: string): string {
    const date = new Date(inputDate);

    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();

    const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

    return `${monthNames[month]} ${day}, ${year}, ${hour
      .toString()
      .padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  /**
   * Copies the event's ID to the clipboard and shows a toast message
   * @param id The ID to be copied
   * @returns void
   */
  copyIdToClipboard(id: string): void {
    const targetElement = this.getCopyTargetElement('.name-id-cell');

    if (targetElement) {
      this.toggleElementClass(targetElement, 'copied', true);
    }

    navigator.clipboard
      .writeText(id)
      .then(() => {
        this.handleClipboardSuccess(targetElement);
      })
      .catch((err) => {
        this.handleClipboardError(targetElement, err);
      });
  }

  /**
   * Gets the element to be copied to the clipboard
   * @param selector The selector to be used to get the element
   * @returns The element to be copied
   */
  private getCopyTargetElement(selector: string): Element | null {
    return document.querySelector(selector);
  }

  /**
   * Toggles a class on an element
   * @param element The element to be toggled
   * @param className The class to be toggled
   * @param add Whether to add or remove the class
   * @returns void
   */
  private toggleElementClass(element: Element | null, className: string, add: boolean): void {
    if (element) {
      if (add) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    }
  }

  /**
   * Handles the success of copying an element to the clipboard
   * @param element The element to be copied
   * @returns void
   */
  private handleClipboardSuccess(element: Element | null): void {
    this.removeCopiedClassAfterDelay(element);
    this.toastService.show('info', 'ID copied to clipboard');
  }

  /**
   * Handles the error of copying an element to the clipboard
   * @param element The element to be copied
   * @param err The error object
   * @returns void
   */
  private handleClipboardError(element: Element | null, err: Error): void {
    this.toggleElementClass(element, 'copied', false);
    this.toastService.show('error', 'Failed to copy ID to clipboard');
    console.error('Could not copy text: ', err);
  }

  /**
   * Removes the copied class from an element after a delay
   * @param element The element to be copied
   * @param delay The delay in milliseconds
   * @returns void
   */
  private removeCopiedClassAfterDelay(element: Element | null, delay: number = 1000): void {
    setTimeout(() => {
      if (element) {
        this.toggleElementClass(element, 'copied', false);
      }
    }, delay);
  }

  /**
   * Saves the view options to the local storage
   * @param optionName  The name of the option to be saved
   * @param event  The page event
   * @returns void
   */
  saveViewOptions(optionName: string, event: PageEvent): void {
    let options: { [key: string]: any } = {};
    const existingOptions = localStorage.getItem('viewOptions');
    if (existingOptions) {
       options = JSON.parse(existingOptions);
    }
    options[optionName] = event.pageSize;
    localStorage.setItem('viewOptions', JSON.stringify(options));
    this.pageIndex = event.pageIndex;
  }
}
