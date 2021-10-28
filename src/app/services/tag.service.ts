import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Tag } from '../interfaces/tag.model';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  tags$: BehaviorSubject<Tag[]> = new BehaviorSubject([] as Tag[]);

  constructor(
    private db: AngularFirestore
  ) {}

  getTags(): void {
    this.db.collection<Tag>('tags')
    .valueChanges({ idField: 'id' })
    .subscribe(tags => this.tags$.next(tags));
  }

  createTags(tags: Tag[], serverTags: Tag[]): Promise<Tag[]> {
    let result: Tag[] = [];

    // Get new tags comparing tags from task and current tags from Firebase
    for (const tag of tags) {
      if (!serverTags?.some(item => item.name.toLowerCase().trim() === tag.name.toLowerCase().trim())) {
        result.push(tag);
      }
    }

    // Delete repeated new tags
    result = [...new Map(result.map(item => [item.name.toLowerCase().trim(), item])).values()];

    // Save new tags in Firebase
    if (result.length > 0) {
      result.map(tag => this.db.collection<Tag>('tags').add(tag));
    }

    // Return tags from task (but deleted the repeated ones)
    tags = [...new Map(tags.map(item => [item.name.toLowerCase().trim(), item])).values()];
    return new Promise<Tag[]>((resolve, reject) => {
      resolve(tags);
      reject('Error when getting tags...');
    });
  }
}
