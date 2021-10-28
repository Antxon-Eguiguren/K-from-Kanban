import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { User } from '../interfaces/user.model';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore
  ) {}

  getUsers(): Observable<User[]> {
    return this.db.collection<User>('users').valueChanges({ idField: 'id' });
  }
}
