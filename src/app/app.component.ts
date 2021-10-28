import { Component, OnInit, OnDestroy } from '@angular/core';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { Task } from './interfaces/task.model';

import { TaskService } from './services/task.service';
import { LoadingService } from './services/loading.service';

import { NewTaskFormComponent } from './components/forms/new-task-form/new-task-form.component';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  titleCols: string[] = ['New', 'In Progress', 'Finished'];
  tasks: Task[] = [];
  newTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  finishedTasks: Task[] = [];
  tasksSubscription: Subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    public loadingService: LoadingService
  ) {}
  
  ngOnInit(): void {
    this.loadingService.show();

    this.tasksSubscription = this.taskService.getTasks().subscribe(tasks => {
      this.newTasks = tasks.filter(task => task.status === 'New');
      this.inProgressTasks = tasks.filter(task => task.status === 'In Progress');
      this.finishedTasks = tasks.filter(task => task.status === 'Finished');

      // TODO: investigar cómo hacer para ocultar el loading cuando hayamos leido TODOS los datos
      if (tasks.length > 0) {
        this.loadingService.hide();
      }
    });
  }

  receiveFilters(event: any): void {
    console.log(event);
  }

  onClickNewTask(): void {
    this.dialog.open(NewTaskFormComponent);
  }

  dropped(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      switch (event.container.id) {
        case 'new':
          moveItemInArray(this.newTasks, event.previousIndex, event.currentIndex);
          this.taskService.sortTasks(this.newTasks);
          break;

        case 'inProgress':
          moveItemInArray(this.inProgressTasks, event.previousIndex, event.currentIndex);
          this.taskService.sortTasks(this.inProgressTasks);
          break;

        case 'finished':
          moveItemInArray(this.finishedTasks, event.previousIndex, event.currentIndex);
          this.taskService.sortTasks(this.finishedTasks);
          break;
      
        default:
          break;
      }
    } else {
      if ((event.previousContainer.id === 'new') && (event.container.id === 'inProgress') || 
          (event.previousContainer.id === 'new') && (event.container.id === 'inProgress-empty')) {
        transferArrayItem(this.newTasks, this.inProgressTasks, event.previousIndex, event.currentIndex);
        this.taskService.sortTasks(this.inProgressTasks, 'In Progress');
      } else if ((event.previousContainer.id === 'inProgress') && (event.container.id === 'new') ||
                 (event.previousContainer.id === 'inProgress') && (event.container.id === 'new-empty')) {
        transferArrayItem(this.inProgressTasks, this.newTasks, event.previousIndex, event.currentIndex);
        this.taskService.sortTasks(this.newTasks, 'New');
      } else if ((event.previousContainer.id === 'inProgress') && (event.container.id === 'finished') ||
                 (event.previousContainer.id === 'inProgress') && (event.container.id === 'finished-empty')) {
        transferArrayItem(this.inProgressTasks, this.finishedTasks, event.previousIndex, event.currentIndex);
        this.taskService.sortTasks(this.finishedTasks, 'Finished');
      } else if ((event.previousContainer.id === 'finished') && (event.container.id === 'inProgress') ||
                 (event.previousContainer.id === 'finished') && (event.container.id === 'inProgress-empty')) {
        transferArrayItem(this.finishedTasks, this.inProgressTasks, event.previousIndex, event.currentIndex);
        this.taskService.sortTasks(this.inProgressTasks, 'In Progress');
      } else if ((event.previousContainer.id === 'new') && (event.container.id === 'finished') ||
                 (event.previousContainer.id === 'new') && (event.container.id === 'finished-empty')) {
        transferArrayItem(this.newTasks, this.finishedTasks, event.previousIndex, event.currentIndex);
        this.taskService.sortTasks(this.finishedTasks, 'Finished');
      } else if ((event.previousContainer.id === 'finished') && (event.container.id === 'new') ||
                 (event.previousContainer.id === 'finished') && (event.container.id === 'new-empty')) {
        transferArrayItem(this.finishedTasks, this.newTasks, event.previousIndex, event.currentIndex);
        this.taskService.sortTasks(this.newTasks, 'New');
      }
    }
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }

} 
