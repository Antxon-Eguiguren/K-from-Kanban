import { Component, OnInit, OnDestroy } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Task } from './interfaces/task.model';

import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';
import { TagService } from './services/tag.service';

import { NewTaskFormComponent } from './components/forms/new-task-form/new-task-form.component';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;
  titleCols: string[] = ['New', 'In Progress', 'Finished'];
  tasks: Task[] = [];
  newTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  finishedTasks: Task[] = [];
  tasksSubscription: Subscription = new Subscription;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private tagsService: TagService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    // Init BehaviourSubjects for each object when starting the app
    this.taskService.getTasks();
    this.userService.getUsers();
    this.tagsService.getTags();

    // Get Tasks from server
    this.tasksSubscription = this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.newTasks = tasks.filter(task => task.status === 'New');
      this.inProgressTasks = tasks.filter(task => task.status === 'In Progress');
      this.finishedTasks = tasks.filter(task => task.status === 'Finished');
    });

    // TODO: arreglar por qué no hace el loading
    this.isLoading = false;
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
