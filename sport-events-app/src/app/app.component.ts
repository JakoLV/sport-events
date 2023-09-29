import { Component } from '@angular/core';
import { ToastService } from './shared/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(
    protected toastService: ToastService,
    private router: Router,
  ) {
  }

  /**
   * Reloads the current component or the component specified in the targetRoute parameter
   * @param targetRoute The route to navigate to after reloading the component
   * @returns void
   */
  reloadComponent(targetRoute: string = '/event-list') {
    this.router.navigateByUrl('/').then(() => {
      this.router.navigate([targetRoute, { reload: Date.now() }]);
    });
  }
}
