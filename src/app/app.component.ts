import { Component, OnInit, OnDestroy } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Task } from './interfaces/task.model';
import { User } from './interfaces/user.model';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';
import { NewUpdateTaskModalComponent } from './components/modals/new-update-task-modal/new-update-task-modal.component';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  titleCols: string[] = ['New', 'In Progress', 'Finished'];
  isLoading = true;
  tasksSubscription: Subscription = new Subscription;
  usersSubscription: Subscription = new Subscription;
  users!: User[];
  tasks!: Task[];
  newTasks!: Task[];
  inProgressTasks!: Task[];
  finishedTasks!: Task[];

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.tasksSubscription = this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.newTasks = tasks.filter(task => task.status === 'New');
      this.inProgressTasks = tasks.filter(task => task.status === 'In Progress');
      this.finishedTasks = tasks.filter(task => task.status === 'Finished');
      this.isLoading = false;
    });
    this.usersSubscription = this.userService.getUsers().subscribe(users => this.users = users);
  }

  onClickNewTask(): void {
    this.dialog.open(NewUpdateTaskModalComponent, { data: this.users });
  }

  dropped(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      switch (event.container.id) {
        case 'new':
          moveItemInArray(this.newTasks, event.previousIndex, event.currentIndex);
          break;

        case 'inProgress':
          moveItemInArray(this.inProgressTasks, event.previousIndex, event.currentIndex);
          break;

        case 'finished':
          moveItemInArray(this.finishedTasks, event.previousIndex, event.currentIndex);
          break;
      
        default:
          break;
      }
    } else {
      if ((event.previousContainer.id === 'new') && (event.container.id === 'inProgress') || 
          (event.previousContainer.id === 'new') && (event.container.id === 'inProgress-empty')) {
        transferArrayItem(this.newTasks, this.inProgressTasks, event.previousIndex, event.currentIndex);
      } else if ((event.previousContainer.id === 'inProgress') && (event.container.id === 'new') ||
                 (event.previousContainer.id === 'inProgress') && (event.container.id === 'new-empty')) {
        transferArrayItem(this.inProgressTasks, this.newTasks, event.previousIndex, event.currentIndex);
      } else if ((event.previousContainer.id === 'inProgress') && (event.container.id === 'finished') ||
                 (event.previousContainer.id === 'inProgress') && (event.container.id === 'finished-empty')) {
        transferArrayItem(this.inProgressTasks, this.finishedTasks, event.previousIndex, event.currentIndex);
      } else if ((event.previousContainer.id === 'finished') && (event.container.id === 'inProgress') ||
                 (event.previousContainer.id === 'finished') && (event.container.id === 'inProgress-empty')) {
        transferArrayItem(this.finishedTasks, this.inProgressTasks, event.previousIndex, event.currentIndex);
      } else if ((event.previousContainer.id === 'new') && (event.container.id === 'finished') ||
                 (event.previousContainer.id === 'new') && (event.container.id === 'finished-empty')) {
        transferArrayItem(this.newTasks, this.finishedTasks, event.previousIndex, event.currentIndex);
      } else if ((event.previousContainer.id === 'finished') && (event.container.id === 'new') ||
                 (event.previousContainer.id === 'finished') && (event.container.id === 'new-empty')) {
        transferArrayItem(this.finishedTasks, this.newTasks, event.previousIndex, event.currentIndex);
      }
    }
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }

} 
