import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  show(): void {
    this.loading$.next(true);
  }

  hide(): void {
    this.loading$.next(false);
  }
}
