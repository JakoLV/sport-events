import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  type: 'info' | 'error' | 'success';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  private _toasts = new BehaviorSubject<Toast[]>([]);
  readonly toasts$ = this._toasts.asObservable();
  private maxVisibleToasts = 8;  // Maximum number of visible toasts

  /**
   * Show a toast with the specified type and message
   * @param type 'info' | 'error' |'success'
   * @param message Message to be displayed
   * @returns void
   */
  show(type: Toast['type'], message: string): void {
    const toast: Toast = { type, message };
    const currentToasts = this._toasts.getValue();
    if (currentToasts.length >= this.maxVisibleToasts) {
      // Remove the oldest toast when the maximum limit is reached
      currentToasts.shift();
    }
    currentToasts.push(toast);
    this._toasts.next(currentToasts);
  }

  /**
   * Remove the specified toast from the list of toasts
   * @param toast The toast to remove
   * @returns void
   */
  remove(toast: Toast): void {
    this._toasts.next(
      this._toasts.getValue().filter(t => t !== toast)
    );
  }
}
