import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Observable, Subject, Subscription } from 'rxjs';
import ColumnDefinition from '../../models/table/column-definition';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Pageable } from '../../api-models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import TableAction from '../../models/table/table-action';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
  ],
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input({ required: true })
  public columns!: ColumnDefinition[];

  @Input({ required: true })
  public fetchFunction!: (pageable: Pageable) => Observable<any>;

  @Input()
  public actions: TableAction[] = [];

  @Input()
  public refreshTable!: Subject<boolean>;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayColumns!: string[];
  isLoading: boolean = false;
  length: number = 0;
  private subscriptionManager: Subscription = new Subscription();
  private pageable: Pageable = {
    page: 0,
    size: 5,
    sort: [],
  };
  private elements!: any[];

  ngOnInit(): void {
    this.displayColumns = this.columns.map((column) => column.fieldName);

    if (this.actions.length != 0) {
      this.displayColumns = [...this.displayColumns, 'actions'];
    }
  }

  ngOnDestroy(): void {
    this.subscriptionManager.unsubscribe();
  }

  sortChange(sort: Sort) {
    if (sort.direction === '') {
      this.pageable.sort = [];
    }
    this.pageable.sort = [`${sort.active},${sort.direction}`];
    this.fetchElements();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.processPageChange();
    this.fetchElements();

    this.refreshTable.subscribe((value) => {
      if (value) this.fetchElements();
    });
  }

  getValueOfFieldFormElement(element: any, fieldName: string) {
    if (!fieldName.includes('.')) return element[fieldName];
    else {
      const fields = fieldName.split('.');
      let currentObject: any = element;
      fields.forEach((field) => (currentObject = currentObject[field]));
      return currentObject;
    }
  }

  private fetchElements() {
    this.isLoading = true;
    const sub = this.fetchFunction(this.pageable).subscribe((elements) => {
      this.elements = elements.content;
      this.dataSource.data = this.elements;
      this.length = elements.totalElements;
      this.isLoading = false;
    });

    this.subscriptionManager.add(sub);
  }

  private processPageChange() {
    this.paginator.page.subscribe(() => {
      this.pageable.page = this.paginator.pageIndex;
      this.pageable.size = this.paginator.pageSize;
      this.fetchElements();
    });
  }
}
