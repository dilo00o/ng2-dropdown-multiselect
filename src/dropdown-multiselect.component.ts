import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { IDropdownOption } from './interfaces/dropdown-option.interface';
import { IMultiselectOptions } from './interfaces/multiselect-options.interface';

import { MultiselectConfig } from './models/multiselect-config.model';

@Component({
    selector: 'ng2-dropdown-multiselect',
    templateUrl: 'dropdown-multiselect.component.html',
    styleUrls: ['dropdown-multiselect.component.css']
})
export class DropdownMultiselectComponent implements OnInit {

  @Input('dropdown-options') opts: IMultiselectOptions;
  @Input('dropdown-model') model: IDropdownOption[];

  @Output() onChange: EventEmitter<any> = new EventEmitter();

  // -------------------------------------------------------------------------------------------------
  public config: MultiselectConfig;

  public selectedLength: number;

  // -------------------------------------------------------------------------------------------------
  constructor() {
    this.config = new MultiselectConfig();
    this.selectedLength = 0;
  }

  // -------------------------------------------------------------------------------------------------
  ngOnInit() {

    this._processOptions();

    this.model.forEach((row) => {
      if(row.selected == null) {
        row.selected = false;
      }
    });

    this._getSelectedLength();

  }

  // -------------------------------------------------------------------------------------------------
  public toggleRow = (row: IDropdownOption) => {
    row.selected = !row.selected;

    this._getSelectedLength();
    this._onChange();
  }

  public uncheckAll = () => {
    this._setSelectedTo(false);
  }

  public checkAll = () => {
    this._setSelectedTo(true);
  }

  // -------------------------------------------------------------------------------------------------
  private _getSelectedLength = () => {
    this.selectedLength = this.model.filter((row) => { return row.selected }).length;

    if (this.selectedLength <= this.config.maxInline && this.selectedLength > 0) {
      let value: string = '';

      this.model.forEach((row) => {
        if (row.selected) {
          value += row.label + ', ';
        }
      });

      this.config.buttonLabel = value.slice(0, value.length - 2);
    } else {
      this.config.buttonLabel = this.opts.defaultButtonText;
    }
  }

  private _processOptions = () => {
    // defaultButtonText
    if (this.opts.defaultButtonText) {
      this.config.buttonLabel = this.opts.defaultButtonText;
    }

    // allSelected
    if (typeof(this.opts.allSelected) === 'boolean') {
      this.config.allSelected = this.opts.allSelected;

      this.checkAll();
    }

    // showCheckAll
    if (typeof(this.opts.showCheckAll) === 'boolean') {
      this.config.showCheckAll = this.opts.showCheckAll;
    }

    // showUncheckAll
    if (typeof(this.opts.showUncheckAll) === 'boolean') {
      this.config.showUncheckAll = this.opts.showUncheckAll;
    }

    // maxInline
    if (this.opts.maxInline) {
      this.config.maxInline = this.opts.maxInline;
    }
  }

  private _setSelectedTo = (val: boolean) => {
    this.model.forEach((row) => {
      row.selected = val;
    });

    this._getSelectedLength();

    this._onChange();
  }

  private _onChange = () => {
    this.onChange.emit(this.model.filter((row) => { return row.selected }));
  }

}