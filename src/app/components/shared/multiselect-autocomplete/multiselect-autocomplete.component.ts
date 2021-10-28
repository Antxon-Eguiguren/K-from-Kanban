import { Component, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ItemData } from '../../../interfaces/multi-select-item-data';
import { User } from '../../../interfaces/user.model';
import { Tag } from '../../../interfaces/tag.model';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-multiselect-autocomplete',
  templateUrl: './multiselect-autocomplete.component.html',
  styleUrls: ['./multiselect-autocomplete.component.scss'],
})
export class MultiselectAutocompleteComponent implements OnChanges  {

  @Output() result = new EventEmitter<{ data: User[] | Tag[] }>();
  @Input() placeholder: string = 'Select Data';
  @Input() assignedUsers!: User[];
  @Input() data: User[] | Tag[] = [];
  @Input() type: string = 'users' || 'tags';
  selectControl = new FormControl();
  rawData: ItemData[] = [];
  selectedData: ItemData[] = [];
  filteredData!: Observable<ItemData[]>;
  filterString: string = '';

  constructor() {}

  ngOnChanges(): void {
    this.rawData = [];
    if (this.type === 'users') {
      this.data.forEach(item => {
        if (this.assignedUsers?.find(user => item.id === user.id) !== undefined) {
          this.rawData.push({ item, selected: true });
        } else {
          this.rawData.push({ item, selected: false });
        }
      });
    } else {
      this.data.forEach(item => this.rawData.push({ item, selected: false }));
    }

    // In case of editing the task, add the assigned users to the chip list
    if (this.assignedUsers?.length > 0) {
      this.assignedUsers.forEach(item => this.selectedData.push({ item, selected: true }));
    }
    
    this.filteredData = this.selectControl.valueChanges.pipe(
      startWith<string>(''),
      map(value => (typeof value === 'string' ? value : this.filterString)),
      map(inputText => this.filter(inputText))
    );
  }

  filter(inputText: string): Array<ItemData> {
    this.filterString = inputText;
    if (this.type === 'users') {
      if (inputText.length > 0) {
        return this.rawData.filter(option => 
            option.item.name.toLowerCase().includes(inputText.toLowerCase()) ||
            option.item.surname.toLowerCase().includes(inputText.toLowerCase()));
      } else {
        return this.rawData;
      }
    } else {
      if (inputText.length > 0) {
        return this.rawData.filter(option => 
            option.item.name.toLowerCase().includes(inputText.toLowerCase()) ||
            option.item.category.toLowerCase().includes(inputText.toLowerCase()));
      } else {
        return this.rawData;
      }
    }
  }

  displayFn(): string {
    return '';
  }

  removeChip(item: ItemData): void {
    this.toggleSelection(item);
  }

  optionClicked(event: Event, data: ItemData): void {
    event.stopPropagation();
    this.toggleSelection(data);
  };

  toggleSelection(item: ItemData): void {
    item.selected = !item.selected;
    if (item.selected === true) {
      this.selectedData.push(item);
    } else {
      const i = this.selectedData.findIndex(element => element.item.id === item.item.id);
      this.selectedData.splice(i, 1);
    }
    this.selectControl.setValue(this.selectedData);
    this.emitData();
  }

  emitData(): void {
    const results: User[] | Tag[] = [];
    this.selectedData.forEach((data: ItemData) => {
      results.push(data.item);
    });
    this.result.emit({ data: results });
  }

}
