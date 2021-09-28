import { Component, OnInit, OnDestroy } from '@angular/core';

import { Task } from './interfaces/task.model';
import { TaskService } from './services/task.service';
import { Subscription } from 'rxjs';

import firebase from 'firebase/compat/app';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  titleCols: string[] = ["💡 New", "🥁 In Progress", "🥇 Finished"];
  isLoading = true;
  subscription: Subscription = new Subscription;
  tasks: Task[] = [];
  newTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  finishedTasks: Task[] = [];

  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    //firebase.firestore.FieldValue.serverTimestamp();
    this.subscription = this.taskService.getTasks().subscribe(tasks => {
      this.newTasks = [];
      this.inProgressTasks = [];
      this.finishedTasks = [];
      tasks.forEach(task => {
        if (task.status === 'New') {
          this.newTasks.push(task);
        } else if (task.status === 'In Progress') {
          this.inProgressTasks.push(task);
        } else {
          this.finishedTasks.push(task);
        }
      });
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
} 
