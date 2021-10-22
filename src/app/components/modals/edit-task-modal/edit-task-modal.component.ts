import { Component, Inject } from '@angular/core';
import { FormArray, Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Tag } from '../../../interfaces/tag.model';
import { Task } from 'src/app/interfaces/task.model';
import { User } from '../../../interfaces/user.model';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss']
})
export class EditTaskModalComponent {

  task!: Task;
  availableUsers: User[] = [];
  taskPriorities: Task['priority'][] = ['Low', 'Medium', 'High'];
  tagCategories: Tag['category'][] = ['UX', 'UI', 'DEV', 'OTHER'];

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
    private dialogRef: MatDialogRef<EditTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.task = data?.task;
    this.availableUsers = data?.users;

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
    this.taskService.updateTask(this.editTaskForm.value);
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

}
