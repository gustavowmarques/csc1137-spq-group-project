import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllergyListComponent } from './components/allergy-list/allergy-list.component';
import { AllergyFormComponent } from './components/allergy-form/allergy-form.component';

const routes: Routes = [
  { path: '', component: AllergyListComponent },
  { path: 'new', component: AllergyFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllergiesRoutingModule { }
