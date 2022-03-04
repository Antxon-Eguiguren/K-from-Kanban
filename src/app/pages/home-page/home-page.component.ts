import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Task } from '../../interfaces/task.model';
import { Tag } from '../../interfaces/tag.model';
import { User } from '../../interfaces/user.model';
import { UserService } from '../../services/user.service';
import { TaskService } from '../../services/task.service';
import { LoadingService } from '../../services/loading.service';
import { NewTaskFormComponent } from '../../components/forms/new-task-form/new-task-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  titleCols: string[] = ['New', 'In Progress', 'Finished'];
  filtersApplied: boolean = false;
  newTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  finishedTasks: Task[] = [];
  tasksSubscription: Subscription = new Subscription();
  user!: User;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private userService: UserService,
    public loadingService: LoadingService,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.loadingService.show();

    this.userService.isLoggedIn().subscribe((user) => {
      this.user = user;
      console.log(user);
    });

    this.tasksSubscription = this.taskService.getTasks().subscribe((tasks) => {
      this.orderTasks(tasks);
      this.loadingService.hide();
    });
  }

  orderTasks(tasks: Task[]): void {
    this.newTasks = tasks.filter((task) => task.status === 'New');
    this.inProgressTasks = tasks.filter(
      (task) => task.status === 'In Progress'
    );
    this.finishedTasks = tasks.filter((task) => task.status === 'Finished');
  }

  receiveFilters(filters: any): void {
    this.tasksSubscription = this.taskService
      .getTasks()
      .subscribe((tasks) => this.orderTasks(this.filterTasks(filters, tasks)));
    this.sidenav.close();
  }

  filterTasks(filters: any, tasks: Task[]): Task[] {
    let filteredTasks: Task[] = [];
    const { tags, users, priorities } = filters;

    if (!tags && !users && !priorities) {
      this.filtersApplied = false;
      return (filteredTasks = tasks);
    }

    if (tags?.length > 0) {
      tags.forEach((tagFilter: Tag) => {
        tasks.forEach((task) => {
          task.tags.forEach((tag) => {
            if (tag.name === tagFilter.name) {
              filteredTasks.push(task);
            }
          });
        });
      });
    }

    if (users?.length > 0) {
      users.forEach((userFilter: User) => {
        tasks.forEach((task) => {
          task.users.forEach((user) => {
            if (user.id === userFilter.id) {
              filteredTasks.push(task);
            }
          });
        });
      });
    }

    if (priorities?.length > 0) {
      priorities.forEach((priorityFilter: string) => {
        tasks.forEach((task) => {
          if (task.priority === priorityFilter) {
            filteredTasks.push(task);
          }
        });
      });
    }

    // Return the filtered tasks but deleting duplicate values
    this.filtersApplied = true;
    return [...new Map(filteredTasks.map((item) => [item.id, item])).values()];
  }

  onClickNewTask(): void {
    this.dialog.open(NewTaskFormComponent);
  }

  dropped(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      switch (event.container.id) {
        case 'new':
          moveItemInArray(
            this.newTasks,
            event.previousIndex,
            event.currentIndex
          );
          this.taskService.sortTasks(this.newTasks);
          break;

        case 'inProgress':
          moveItemInArray(
            this.inProgressTasks,
            event.previousIndex,
            event.currentIndex
          );
          this.taskService.sortTasks(this.inProgressTasks);
          break;

        case 'finished':
          moveItemInArray(
            this.finishedTasks,
            event.previousIndex,
            event.currentIndex
          );
          this.taskService.sortTasks(this.finishedTasks);
          break;

        default:
          break;
      }
    } else {
      if (
        (event.previousContainer.id === 'new' &&
          event.container.id === 'inProgress') ||
        (event.previousContainer.id === 'new' &&
          event.container.id === 'inProgress-empty')
      ) {
        transferArrayItem(
          this.newTasks,
          this.inProgressTasks,
          event.previousIndex,
          event.currentIndex
        );
        this.taskService.sortTasks(this.inProgressTasks, 'In Progress');
      } else if (
        (event.previousContainer.id === 'inProgress' &&
          event.container.id === 'new') ||
        (event.previousContainer.id === 'inProgress' &&
          event.container.id === 'new-empty')
      ) {
        transferArrayItem(
          this.inProgressTasks,
          this.newTasks,
          event.previousIndex,
          event.currentIndex
        );
        this.taskService.sortTasks(this.newTasks, 'New');
      } else if (
        (event.previousContainer.id === 'inProgress' &&
          event.container.id === 'finished') ||
        (event.previousContainer.id === 'inProgress' &&
          event.container.id === 'finished-empty')
      ) {
        transferArrayItem(
          this.inProgressTasks,
          this.finishedTasks,
          event.previousIndex,
          event.currentIndex
        );
        this.taskService.sortTasks(this.finishedTasks, 'Finished');
      } else if (
        (event.previousContainer.id === 'finished' &&
          event.container.id === 'inProgress') ||
        (event.previousContainer.id === 'finished' &&
          event.container.id === 'inProgress-empty')
      ) {
        transferArrayItem(
          this.finishedTasks,
          this.inProgressTasks,
          event.previousIndex,
          event.currentIndex
        );
        this.taskService.sortTasks(this.inProgressTasks, 'In Progress');
      } else if (
        (event.previousContainer.id === 'new' &&
          event.container.id === 'finished') ||
        (event.previousContainer.id === 'new' &&
          event.container.id === 'finished-empty')
      ) {
        transferArrayItem(
          this.newTasks,
          this.finishedTasks,
          event.previousIndex,
          event.currentIndex
        );
        this.taskService.sortTasks(this.finishedTasks, 'Finished');
      } else if (
        (event.previousContainer.id === 'finished' &&
          event.container.id === 'new') ||
        (event.previousContainer.id === 'finished' &&
          event.container.id === 'new-empty')
      ) {
        transferArrayItem(
          this.finishedTasks,
          this.newTasks,
          event.previousIndex,
          event.currentIndex
        );
        this.taskService.sortTasks(this.newTasks, 'New');
      }
    }
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }
}
