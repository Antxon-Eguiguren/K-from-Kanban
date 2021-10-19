import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from '../../../interfaces/user.model';
import { Task } from 'src/app/interfaces/task.model';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-new-task-modal',
  templateUrl: './new-task-modal.component.html',
  styleUrls: ['./new-task-modal.component.scss']
})
export class NewTaskModalComponent {

  tasks: Task[] = [];
  availableUsers: User[] = [];
  taskPriorities = ['Low', 'Medium', 'High'];
  tagCategories = ['UX', 'UI', 'DEV', 'OTHER'];
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
    private dialogRef: MatDialogRef<NewTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.availableUsers = data?.users;
    this.tasks = data?.tasks;
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
    this.newTaskForm.controls['createdOn'].setValue(new Date());
    this.newTaskForm.controls['status'].setValue('New');
    const index = this.getNewTaskIndex();
    this.newTaskForm.controls['index'].setValue(index + 1);
    this.taskService.createTask(this.newTaskForm.value);
    this.dialogRef.close();
  }

  onClickAddTag(event: Event): void {
    event.preventDefault();
    this.tags.push(this.initTagsForm());
  }

  onClickRemoveTag(index: number): void {
    this.tags.removeAt(index);
  }

}
