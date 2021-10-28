import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { User } from '../../../interfaces/user.model';
import { Tag } from '../../../interfaces/tag.model';

import { UserService } from '../../../services/user.service';
import { TagService } from '../../../services/tag.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit, OnDestroy {

  filterForm = this.formBuilder.group({
    users: [''],
    tags: ['']
  });

  @Output() filters = new EventEmitter<any>();
  users: User[] = [];
  tags: Tag[] = [];
  usersSubscription: Subscription = new Subscription();
  tagsSubscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private tagsService: TagService
  ) {}

  ngOnInit(): void {
    this.usersSubscription = this.userService.getUsers().subscribe(users => this.users = users);
    this.tagsSubscription = this.tagsService.getTags().subscribe(tags => this.tags = tags);
  }

  receiveUserSelection(event: any): void {
    this.filterForm.controls['users'].setValue(event.data);
  }

  receiveTagsSelection(event: any): void {
    this.filterForm.controls['tags'].setValue(event.data);
  }

  onSubmitFilterForm(): void {
    this.filters.emit(this.filterForm.value);
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.tagsSubscription.unsubscribe();
  }

}
