import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { User } from '../interfaces/user.model';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users$: BehaviorSubject<User[]> = new BehaviorSubject([] as User[]);

  constructor(
    private db: AngularFirestore
  ) {}

  getUsers(): void {
    this.db.collection<User>('users')
    .valueChanges({ idField: 'id' })
    .subscribe(users => this.users$.next(users));
  }
}
