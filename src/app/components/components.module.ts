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

import { TaskComponent } from './task/task.component';
import { MultiselectAutocompleteComponent } from './shared/multiselect-autocomplete/multiselect-autocomplete.component';
import { NewTaskModalComponent } from './modals/new-task-modal/new-task-modal.component';
import { EditTaskModalComponent } from './modals/edit-task-modal/edit-task-modal.component';

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
      FormsModule,
      ReactiveFormsModule,
      CommonModule
    ],
    exports: [TaskComponent, MatIconModule, MatButtonModule],
    declarations: [TaskComponent, NewTaskModalComponent, EditTaskModalComponent, MultiselectAutocompleteComponent ]
})
export class ComponentsModule { }