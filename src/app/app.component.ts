import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Task } from './interfaces/task.model';
import { TaskService } from './services/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  titleCols: string[] = ['New', 'In Progress', 'Finished'];
  isLoading = true;
  subscription: Subscription = new Subscription;
  tasks: Task[] = [];
  newTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  finishedTasks: Task[] = [];

  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    this.subscription = this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.newTasks = tasks.filter(task => task.status === 'New');
      this.inProgressTasks = tasks.filter(task => task.status === 'In Progress');
      this.finishedTasks = tasks.filter(task => task.status === 'Finished');
      this.isLoading = false;
    });
  }

  onClickNewTask(): void {
    console.log('Clicked on new task...');
  }

  dropped(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      if (event.container.id === 'new') {
        moveItemInArray(this.newTasks, event.previousIndex, event.currentIndex);
      } else if (event.container.id === 'inProgress') {
        moveItemInArray(this.inProgressTasks, event.previousIndex, event.currentIndex);
      } else if (event.container.id === 'finished') {
        moveItemInArray(this.finishedTasks, event.previousIndex, event.currentIndex);
      }
    } else if (event.previousContainer !== event.container) {
      if ((event.previousContainer.id === 'new') && (event.container.id === 'inProgress') || 
          (event.previousContainer.id === 'new') && (event.container.id === 'inProgress-empty')) {
        transferArrayItem(
          this.newTasks,
          this.inProgressTasks,
          event.previousIndex,
          event.currentIndex
        );
      } else if ((event.previousContainer.id === 'inProgress') && (event.container.id === 'new') ||
                 (event.previousContainer.id === 'inProgress') && (event.container.id === 'new-empty')) {
        transferArrayItem(
          this.inProgressTasks,
          this.newTasks,
          event.previousIndex,
          event.currentIndex
        );
      } else if ((event.previousContainer.id === 'inProgress') && (event.container.id === 'finished') ||
                 (event.previousContainer.id === 'inProgress') && (event.container.id === 'finished-empty')) {
        transferArrayItem(
          this.inProgressTasks,
          this.finishedTasks,
          event.previousIndex,
          event.currentIndex
        );
      } else if ((event.previousContainer.id === 'finished') && (event.container.id === 'inProgress') ||
                 (event.previousContainer.id === 'finished') && (event.container.id === 'inProgress-empty')) {
        transferArrayItem(
          this.finishedTasks,
          this.inProgressTasks,
          event.previousIndex,
          event.currentIndex
        );
      } else if ((event.previousContainer.id === 'new') && (event.container.id === 'finished') ||
                 (event.previousContainer.id === 'new') && (event.container.id === 'finished-empty')) {
        transferArrayItem(
          this.newTasks,
          this.finishedTasks,
          event.previousIndex,
          event.currentIndex
        );
      } else if ((event.previousContainer.id === 'finished') && (event.container.id === 'new') ||
                 (event.previousContainer.id === 'finished') && (event.container.id === 'new-empty')) {
        transferArrayItem(
          this.finishedTasks,
          this.newTasks,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

} 
