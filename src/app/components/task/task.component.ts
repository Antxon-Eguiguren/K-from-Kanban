import { Component, Input, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { TaskService } from '../../services/task.service';
import { EditTaskModalComponent } from '../modals/edit-task-modal/edit-task-modal.component';

import { Task } from '../../interfaces/task.model';
import { User } from '../../interfaces/user.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() task!: Task;
  @Input() users: User[] = [];
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
    this.dialog.open(EditTaskModalComponent, {
      data: { 
        users: this.users,
        task
      }
    });
  }

  onClickDeleteTask(task: Task) {
    this.taskService.deleteTask(task.id);
  }

}
