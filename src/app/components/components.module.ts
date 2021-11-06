import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { TaskComponent } from './task/task.component';
import { NewTaskFormComponent } from './forms/new-task-form/new-task-form.component';
import { EditTaskFormComponent } from './forms/edit-task-form/edit-task-form.component';
import { FilterFormComponent } from './forms/filter-form/filter-form.component';
import { MultiselectAutocompleteComponent } from './shared/multiselect-autocomplete/multiselect-autocomplete.component';

@NgModule({
    imports: [
      MatCardModule,
      MatChipsModule,
      MatFormFieldModule,
      MatButtonModule,
      MatDialogModule,
      MatSelectModule,
      MatIconModule,
      MatInputModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatAutocompleteModule,
      MatCheckboxModule,
      MatSnackBarModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule
    ],
    exports: [
      TaskComponent,
      MatIconModule,
      MatButtonModule,
      FilterFormComponent
    ],
    declarations: [
      TaskComponent,
      NewTaskFormComponent,
      EditTaskFormComponent,
      FilterFormComponent,
      MultiselectAutocompleteComponent
    ],
    providers: [
      { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000, panelClass: 'snackbar' } }
    ]
})
export class ComponentsModule { }