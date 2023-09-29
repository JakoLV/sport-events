import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventCreateComponent } from './event-create.component';

const routes: Routes = [
  { path: '', component: EventCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventCreateRoutingModule { }
