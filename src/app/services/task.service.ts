import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import firebase from 'firebase/compat/app';

import { Task } from '../interfaces/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private db: AngularFirestore) { }

  getTasks(): Observable<Task[]> {
    return this.db.collection<Task>('tasks', ref => ref.orderBy('index', 'asc')).valueChanges({ idField: 'id' });
  }

  createTask(task: Task): void {
    this.db.collection<Task>('tasks').add(task);
  }

  sortTasks(tasks: Task[], newStatus?: string): void {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = tasks.map(task => db.collection('tasks').doc(task.id));
    refs.forEach((ref, idx) => {
      if (newStatus) {
        batch.update(ref, { index: idx, status: newStatus });
      } else {
        batch.update(ref, { index: idx });
      }
    });
    batch.commit();
  }

  deleteTask(taskId: string): void {
    this.db.collection<Task>('tasks').doc(taskId).delete();
  }

  updateTask(task: Task): void {
    this.db.collection<Task>('tasks').doc(task.id).update({ ...task });
  }
}
