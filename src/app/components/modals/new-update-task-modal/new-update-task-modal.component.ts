import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from '../../../interfaces/user.model';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-new-update-task-modal',
  templateUrl: './new-update-task-modal.component.html',
  styleUrls: ['./new-update-task-modal.component.scss']
})
export class NewUpdateTaskModalComponent {

  availableUsers: User[] = [];
  taskPriorities = ['Low', 'Medium', 'High'];
  tagCategories = [
    {
      value: 'ux',
      display: 'UX'
    },
    {
      value: 'ui',
      display: 'UI'
    },
    {
      value: 'dev',
      display: 'DEV'
    },
    {
      value: 'other',
      display: 'OTHER'
    }
  ];

  newTaskForm = this.formBuilder.group({
    createdOn: [],
    status: [],
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
    @Inject(MAT_DIALOG_DATA) data: User[],
    public dialogRef: MatDialogRef<NewUpdateTaskModalComponent>
  ) {
    this.availableUsers = data;
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

  onSubmitCreateTask(): void {
    this.newTaskForm.controls['createdOn'].setValue(new Date());
    this.newTaskForm.controls['status'].setValue('New');
    console.log(this.newTaskForm.value);
    this.taskService.storeTask(this.newTaskForm.value);
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
