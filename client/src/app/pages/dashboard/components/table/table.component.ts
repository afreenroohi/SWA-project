import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { debounce } from 'lodash';
import { MultiLang, TableColumn, TableItem, TableItemKeys, PAGE_SIZE, TableSort, TableFilterSort } from '../../dashboard.model';
import { CommonService } from 'src/app/service/common.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'dashboard-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {

  @Input() title: string = 'Table';
  @Input('columns') listOfColumn: TableColumn[] = [];
  @Input('data') listOfData: TableItem[] = [];
  @Input() isLoading: boolean = false;
  @Input() total: number = 0;
  @Input('searchPlaceholder') placeholder: string = 'Search';
  @Input() pageIndex: number = 1;
  @Output() currentPage = new EventEmitter<number>();
  @Output() download = new EventEmitter<boolean>();
  @Output() search = new EventEmitter<string>();
  @Output() filterAndSort = new EventEmitter<TableFilterSort>();

  searchValue: string = '';

  readonly pageSize: number = PAGE_SIZE;

  debounceSearch = debounce((value: string) => {
    this.search.emit(value);
  }, 500);

  constructor(public cs: CommonService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['title'] && changes['title'].currentValue !== changes['title'].previousValue) {
      this.searchValue = '';
    }
  }

  ngOnInit(): void {
  }

  pageChange(currentPage: number): void {
    this.currentPage.emit(currentPage);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex, pageSize, sort, filter } = params;
    const currentSort = sort.filter(item => item.value !== null)?.map((item): TableSort => {
      return {
        key: item.key,
        value: item.value === 'ascend' ? 'A' : 'D'
      }
    });
    const currentFilter = filter.filter(item => item.value !== null && item.value.length);
    this.filterAndSort.emit({ filter: currentFilter, sort: currentSort });
  }

  getData(data: TableItem, key: TableItemKeys): string {
    if (key in data) {
      const value = data[key as keyof TableItem];
  
      if (typeof value === 'object' && value !== null && 'en' in value && 'ar' in value) {
        // Assuming it's a MultiLang object
        const multiLangValue = value as MultiLang;
        return this.cs.userLanguage === 'en' ? multiLangValue.en : multiLangValue.ar;
      }

      return value as string;
    }
    return '';
  }

  downloadExcel(): void {
    this.download.emit(true);
  }

  onSearch(value: string): void {
    this.debounceSearch(value);
  }

}
