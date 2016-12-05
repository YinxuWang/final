"use strict";

export default class AdminCompanyListController {
  // Config Pagination Grid
  gridConfig = {
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    useExternalPagination: true,
    useExternalSorting: true,
    columnDefs: [
      {name: '序号', field: 'seq', width: '10%'},
      {name: '公司名称', field: "name", width: '30%'},
      {name: '公司简称', field: "nickname"},
      {name: '审核状态', field: 'status'},
      {name: '申请人', field: 'manager'},
      {name: '申请时间', field: "created_at"},
    ],
    totalItems: 1
  };

  // Config date picker
  datePickerConfig = {
    start: {
      options: {},
      opened: false,
      open: function () {
        this.opened = true
      }
    },
    end: {
      options: {},
      opened: false,
      open: function () {
        this.opened = true
      }
    }
  };

  // Default Search Params
  searchParams = {
    companyName: "",
    auditStatus: "",
    applyDateStart: "",
    applyDateEnd: "",
    pageNumber: 1,
    pageSize: 25
  };

  constructor($scope, CompanyAudit, i18nService) {
    'ngInject';

    let vm = this;
    i18nService.setCurrentLang('zh-cn');
    vm.gridConfig.onRegisterApi = function (gridApi) {
      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
        vm.searchParams.pageNumber = newPage;
        vm.searchParams.pageSize = pageSize;
        vm.getPage();
      });
    };

    this.CompanyAudit = CompanyAudit;
    vm.getPage();
  }

  getPage() {
    var companyList = this.CompanyAudit.query(this.searchParams);
    this.gridConfig.data = companyList;
    this.gridConfig.totalItems = companyList.length;

  }
}
