import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Task } from '../interfaces/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private db: AngularFirestore) { }

  getTasks(): Observable<Task[]> {
    return this.db.collection<Task>('tasks', ref => ref.orderBy('createdOn', 'desc')).valueChanges({ idField: 'id' });
  }

  storeTask(task: Task): void {
    this.db.collection<Task>('tasks').add(task);
  }
}
