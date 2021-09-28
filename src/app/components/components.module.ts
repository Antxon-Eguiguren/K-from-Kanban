import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskComponent } from './task/task.component';

@NgModule({
    imports: [
      MatCardModule,
      MatChipsModule,
      CommonModule
    ],
    exports: [
        MatGridListModule,
        MatCardModule,
        MatChipsModule,
        TaskComponent,
        MatProgressSpinnerModule,
    ],
    declarations: [
      TaskComponent
    ]
})
export class ComponentsModule { }