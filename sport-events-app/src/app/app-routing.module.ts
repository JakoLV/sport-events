import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./views/event-list/event-list.module').then(m => m.EventListModule) },
  { path: 'event-create', loadChildren: () => import('./views/event-create/event-create.module').then(m => m.EventCreateModule) },
  { path: 'event-list', loadChildren: () => import('./views/event-list/event-list.module').then(m => m.EventListModule) },
  { path: 'event-list/:reload', loadChildren: () => import('./views/event-list/event-list.module').then(m => m.EventListModule) },
  { path: '**', redirectTo: '/event-list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
