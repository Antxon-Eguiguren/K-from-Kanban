import { Component, OnInit, OnDestroy } from '@angular/core';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
      this.newTasks = [];
      this.inProgressTasks = [];
      this.finishedTasks = [];
      tasks.forEach(task => {
        if (task.status === 'New') {
          this.newTasks.push(task);
        } else if (task.status === 'In Progress') {
          this.inProgressTasks.push(task);
        } else if (task.status === 'Finished') {
          this.finishedTasks.push(task);
        }
      });
      this.isLoading = false;
    });
  }

  onClickNewTask(): void {
    console.log('Clicked on new task...');
  }

  dropped(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }  
   //this.boardService.sortBoards(this.boards);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

} 
