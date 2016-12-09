export default class CompanyStructureController {
  structure = {
    level1: {
      name: "",
      position: ""
    },
    level2: {
      name: "",
      position: ""
    },
    level3: {
      name: "",
      position: ""
    }
  };

  loadTemplate(){
    this.structure = {
      level1: {
        name: "区域",
        position: "经理"
      },
      level2: {
        name: "分部",
        position: "部长"
      },
      level3: {
        name: "街道",
        position: "主任"
      }
    };
  }

  save() {

  }

  constructor() {
    'ngInject';
  }

}
