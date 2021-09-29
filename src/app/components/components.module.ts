import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { TaskComponent } from './task/task.component';

@NgModule({
    imports: [
      MatCardModule,
      MatChipsModule,
      MatIconModule,
      MatButtonModule,
      MatFormFieldModule,
      MatSelectModule,
      CommonModule
    ],
    exports: [TaskComponent, MatButtonModule, MatIcon],
    declarations: [TaskComponent]
})
export class ComponentsModule { }