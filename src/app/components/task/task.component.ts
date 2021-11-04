import { Component, Input, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskService } from '../../services/task.service';

import { EditTaskFormComponent } from '../forms/edit-task-form/edit-task-form.component';

import { Task } from '../../interfaces/task.model';
import { User } from '../../interfaces/user.model';
import { Tag } from '../../interfaces/tag.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() task!: Task;
  users: User[] = [];
  tags: Tag[] = [];
  isDelayed = false;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.calculateIfTaskIsDelayed();
  }

  calculateIfTaskIsDelayed(): void {
    if (new Date > this.task?.dueDate.toDate()!) {
      this.isDelayed = true;
    }
  }

  onClickEditTask(task: Task) {
    this.dialog.open(EditTaskFormComponent, { data: { task } });
  }

  onClickDeleteTask(task: Task) {
    this.taskService.deleteTask(task.id);
    this.snackBar.open('Task deleted successfully! 🍺', 'Close');
  }

}
