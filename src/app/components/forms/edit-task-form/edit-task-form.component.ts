import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormArray, Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserService } from '../../../services/user.service';
import { TagService } from '../../../services/tag.service';
import { TaskService } from '../../../services/task.service';

import { Tag } from '../../../interfaces/tag.model';
import { Task } from '../../../interfaces/task.model';
import { User } from '../../../interfaces/user.model';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-task-form',
  templateUrl: './edit-task-form.component.html',
  styleUrls: ['./edit-task-form.component.scss']
})
export class EditTaskFormComponent implements OnInit, OnDestroy {

  task!: Task;
  availableUsers: User[] = [];
  serverTags: Tag[] = [];
  taskPriorities: Task['priority'][] = ['Low', 'Medium', 'High'];
  tagCategories: Tag['category'][] = ['UX', 'UI', 'DEV', 'OTHER'];
  usersSubscription: Subscription = new Subscription();
  tagsSubscription: Subscription = new Subscription();

  editTaskForm = this.formBuilder.group({
    id: [],
    createdOn: [],
    status: [],
    index: [],
    priority: [, Validators.required],
    description: [, Validators.required],
    dueDate: [, Validators.required],
    users: [, Validators.required],
    tags: this.formBuilder.array([])
  });

  get tags(): FormArray {
    return this.editTaskForm.get('tags') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private tagService: TagService,
    private dialogRef: MatDialogRef<EditTaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.task = data.task;

    this.editTaskForm.patchValue({
      ...this.task,
      dueDate: this.task.dueDate.toDate(),
      createdOn: this.task.createdOn.toDate(),
    });

    for (let i = 0; i < this.task.tags.length; i++) {
      this.tags.push(this.initTagsForm());
      this.tags.controls[i].patchValue({
        name: this.task.tags[i].name,
        category: this.task.tags[i].category
      });
    }
  }

  ngOnInit(): void {
    this.usersSubscription = this.userService.users$.subscribe(users => this.availableUsers = users);
    this.tagsSubscription = this.tagService.tags$.subscribe(tags => this.serverTags = tags);
  }

  initTagsForm(): FormGroup {
    return this.formBuilder.group({
      name: [, Validators.required],
      category: [, Validators.required]
    });
  }

  receiveUserSelection(event: any): void {
    this.editTaskForm.controls['users'].setValue(event.data);
  }

  onSubmitEditTask(): void {
    this.taskService.updateTask(this.editTaskForm.value, this.serverTags);
    this.dialogRef.close();
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
    this.usersSubscription.unsubscribe();
    this.tagsSubscription.unsubscribe();
  }

}
