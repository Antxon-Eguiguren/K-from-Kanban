import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ItemData } from '../../../interfaces/multi-select-item-data';
import { User } from '../../../interfaces/user.model';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-multiselect-autocomplete',
  templateUrl: './multiselect-autocomplete.component.html',
  styleUrls: ['./multiselect-autocomplete.component.scss'],
})
export class MultiselectAutocompleteComponent implements OnInit {

  @Output() result = new EventEmitter<{ key: string, data: User[] }>();
  @Input() placeholder: string = 'Select Data';
  @Input() availableUsers: User[] = [];
  @Input() key: string = '';
  @Input() assignedUsers!: User[];
  selectControl = new FormControl();
  rawData: ItemData[] = [];
  selectedData: ItemData[] = [];
  filteredData!: Observable<ItemData[]>;
  filterString: string = '';

  constructor() {
    this.filteredData = this.selectControl.valueChanges.pipe(
      startWith<string>(''),
      map((value) => (typeof value === 'string' ? value : this.filterString)),
      map((inputText) => this.filter(inputText))
    );
  }

  ngOnInit(): void {
    this.availableUsers.forEach(user => {
      if (this.assignedUsers?.find(item => user.id === item.id) !== undefined) {
        this.rawData.push({ item: user, selected: true });
      } else {
        this.rawData.push({ item: user, selected: false });
      }
    });

    // In case of editing the task, add the assigned users to the chip list
    if (this.assignedUsers?.length > 0) {
      this.assignedUsers.forEach(user => this.selectedData.push({item: user, selected: true}));
    }
  }

  filter(inputText: string): Array<ItemData> {
    this.filterString = inputText;
    if (inputText.length > 0) {
      return this.rawData.filter((option) => {
        return (
          option.item.name.toLowerCase().includes(inputText.toLowerCase()) ||
          option.item.surname.toLowerCase().includes(inputText.toLowerCase())
        );
      });
    } else {
      return this.rawData;
    }
  }

  displayFn(): string {
    return '';
  }

  removeChip(user: ItemData): void {
    this.toggleSelection(user);
  }

  optionClicked = (event: Event, data: ItemData): void => {
    event.stopPropagation();
    this.toggleSelection(data);
  };

  toggleSelection(user: ItemData): void {
    user.selected = !user.selected;
    if (user.selected === true) {
      this.selectedData.push(user);
    } else {
      const i = this.selectedData.findIndex((element) => element.item.id === user.item.id);
      this.selectedData.splice(i, 1);
    }
    this.selectControl.setValue(this.selectedData);
    this.emitData();
  }

  emitData(): void {
    const results: User[] = [];
    this.selectedData.forEach((data: ItemData) => {
      results.push(data.item);
    });
    this.result.emit({key: this.key, data: results });
  }

}
