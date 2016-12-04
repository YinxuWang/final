"use strict";

export default class AdminCompanyController {
  gridApi = null;
  gridConfig = {
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    useExternalPagination: true,
    useExternalSorting: false,
    columnDefs: [
      {name: 'name', enableSorting: false},
      {name: 'gender', enableSorting: false},
      {name: 'company', enableSorting: false}
    ],
  };


  popup1 = {
    opened: false
  };
  popup2 = {
    opened: false
  };

  open1() {
    this.popup1.opened = true;
  };

  open2() {
    this.popup2.opened = true;
  }
  ;
}
