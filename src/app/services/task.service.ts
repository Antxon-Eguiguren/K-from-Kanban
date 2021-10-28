import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { TagService } from './tag.service';

import { Task } from '../interfaces/task.model';
import { Tag } from '../interfaces/tag.model';

import { Observable } from 'rxjs';

import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private db: AngularFirestore,
    private tagsService: TagService
  ) {}

  getTasks(): Observable<Task[]> {
    return this.db.collection<Task>('tasks', ref => ref.orderBy('index', 'asc')).valueChanges({ idField: 'id' });
  }

  async createTask(task: Task, serverTags: Tag[]): Promise<void> {
    try {
      task.tags = await this.tagsService.createTags(task.tags, serverTags);
    }
    catch(error) {
      console.log(error);
    }
    this.db.collection<Task>('tasks').add(task);
  }

  async updateTask(task: Task, serverTags: Tag[]): Promise<void> {
    try {
      task.tags = await this.tagsService.createTags(task.tags, serverTags);
    }
    catch(error) {
      console.log(error);
    }
    this.db.collection<Task>('tasks').doc(task.id).update({ ...task });
  }

  deleteTask(taskId: string): void {
    this.db.collection<Task>('tasks').doc(taskId).delete();
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
}
