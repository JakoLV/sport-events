import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';
import { SportsEvent } from '../models/sports-event.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) { }

  /**
   * Get all events 
   * @returns An observable of an array of events
   */
  getEvents(): Observable<SportsEvent[]> {
    return this.http.get<SportsEvent[]>(this.baseUrl);
  }

  /**
   * Get a single event by id
   * @param id The id of the event to get
   * @returns An observable of a single event
   */
  getEvent(id: number): Observable<SportsEvent> {
    return this.http.get<SportsEvent>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new event in the database
   * @param event The event to create
   * @returns An observable 
   */
  createEvent(event: SportsEvent): Observable<SportsEvent> {
    return this.http.post<SportsEvent>(this.baseUrl, event);
  }

  /**
   * Update an event in the database
   * @param id The id of the event to update
   * @param updatedEvent The event to update
   * @returns An observable of the updated event
   */
  updateEvent(id: string, updatedEvent: SportsEvent): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, updatedEvent);
  }

  /**
   * Delete an event from the database
   * @param id The id of the event to delete
   * @returns An observable of the deleted event
   */
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}