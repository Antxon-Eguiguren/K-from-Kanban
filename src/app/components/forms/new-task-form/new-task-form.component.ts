import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Tag } from '../../../interfaces/tag.model';
import { User } from '../../../interfaces/user.model';
import { Task } from '../../../interfaces/task.model';

import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service';
import { TagService } from '../../../services/tag.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-task-form',
  templateUrl: './new-task-form.component.html',
  styleUrls: ['./new-task-form.component.scss']
})
export class NewTaskFormComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];
  users: User[] = [];
  serverTags: Tag[] = [];
  taskPriorities: Task['priority'][] = ['Low', 'Medium', 'High'];
  tagCategories: Tag['category'][] = ['UX', 'UI', 'DEV', 'OTHER'];
  tasksSubscription: Subscription = new Subscription();
  usersSubsription: Subscription = new Subscription();
  tagsSubscription: Subscription = new Subscription();

  newTaskForm = this.formBuilder.group({
    createdOn: [],
    status: [],
    index: [],
    priority: [, Validators.required],
    description: [, Validators.required],
    dueDate: [, Validators.required],
    users: [, Validators.required],
    tags: this.formBuilder.array([this.initTagsForm()])
  });

  get tags(): FormArray {
    return this.newTaskForm.get('tags') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private tagService: TagService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NewTaskFormComponent>
  ) {}

  ngOnInit(): void {
    this.tasksSubscription = this.taskService.getTasks().subscribe(tasks => this.tasks = tasks);
    this.usersSubsription = this.userService.getUsers().subscribe(users => this.users = users);
    this.tagsSubscription = this.tagService.getTags().subscribe(tags => this.serverTags = tags);
  }

  initTagsForm(): FormGroup {
    return this.formBuilder.group({
      name: [, Validators.required],
      category: [, Validators.required]
    });
  }

  receiveUserSelection(event: any): void {
    this.newTaskForm.controls['users'].setValue(event.data);
  }

  getNewTaskIndex(): number {
    const filteredTasks = this.tasks.filter(task => task.status === 'New');
    if (filteredTasks.length > 0) {
      return filteredTasks[filteredTasks.length - 1].index;
    } else {
      return -1;
    }
  }

  onSubmitCreateTask(): void {
    const index = this.getNewTaskIndex();
    this.newTaskForm.patchValue({
      createdOn: new Date(),
      status: 'New',
      index: index + 1
    });
    this.taskService.createTask(this.newTaskForm.value, this.serverTags);
    this.dialogRef.close();
    this.snackBar.open('Task created successfully! ✨', 'Close');
  }

  onClickAddTag(event: Event): void {
    event.preventDefault();
    this.tags.push(this.initTagsForm());
  }

  onClickRemoveTag(index: number): void {
    this.tags.removeAt(index);
  }

  onClickCloseModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
    this.usersSubsription.unsubscribe();
    this.tagsSubscription.unsubscribe();
  }

}
