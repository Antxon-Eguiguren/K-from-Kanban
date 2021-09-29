import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() task: Task | undefined;
  isDelayed = false;

  constructor() { }

  ngOnInit(): void {
    this.calculateIfTaskIsDelayed();
  }

  calculateIfTaskIsDelayed(): void {
    if (new Date > this.task?.dueDate.toDate()!) {
      this.isDelayed = true;
    }
  }

}
