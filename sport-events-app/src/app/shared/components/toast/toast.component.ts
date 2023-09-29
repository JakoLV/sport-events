import { Component, OnInit, OnDestroy } from '@angular/core';
import { Toast, ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  
  toasts: Toast[] = [];
  private toastsSubscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastsSubscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;

      toasts.forEach(toast => {
        this.scheduleToastRemoval(toast);
      });
    });
  }

  ngOnDestroy(): void {
    this.toastsSubscription.unsubscribe();
  }

  /**
   * Removes a toast after a specified delay.
   * @param toast The toast to remove 
   */
  private scheduleToastRemoval(toast: Toast): void {
    const delayMs = 3000; // Adjust the delay as needed
    setTimeout(() => {
      this.removeToast(toast);
    }, delayMs);
  }

  /**
   * Removes a toast from the toasts array and from the DOM
   * @param toast The toast to remove 
   */
  removeToast(toast: Toast): void {
    this.toastService.remove(toast);
  }
}
