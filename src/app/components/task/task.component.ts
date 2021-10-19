import { Component, Input, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Task } from '../../interfaces/task.model';
import { TaskService } from '../../services/task.service';
import { EditTaskModalComponent } from '../modals/edit-task-modal/edit-task-modal.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() task!: Task;
  isDelayed = false;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.calculateIfTaskIsDelayed();
  }

  calculateIfTaskIsDelayed(): void {
    if (new Date > this.task?.dueDate.toDate()!) {
      this.isDelayed = true;
    }
  }

  onClickEditTask(task: Task) {
    this.dialog.open(EditTaskModalComponent, { data: task });
  }

  onClickDeleteTask(task: Task) {
    this.taskService.deleteTask(task.id);
  }

}
