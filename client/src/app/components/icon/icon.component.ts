import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  @Input() icon: IconList = IconList.truefolder;

  readonly IconList = IconList;

  constructor() { }

  ngOnInit(): void {
  }

}

export enum IconList {
  truefolder = "true-folder",
  percentagehand = "percentage-hand",
  listnote = "list-note",
  listtrue = "list-true",
  listaward = "list-award",
  truecheck = "true-check",
  upload = "upload",
  download = "download",
  delete = "delete",
  iconcollapse = "icon-collapse",
  iconexpand = "icon-expand",
  addplus = "add-plus",
  search = "search",
  edit = "edit",
  create = "create",
  piechart = "pie-chart-$",
  hand = "hand-$",
  listwithtrue = "list-with-true",
  inbox = "inbox",
  myRequest = "myRequest",
  listcheck = 'list-check',
  folderopen = 'folder-open',
  starcheck = 'star-check',
  formpending = 'form-pending',
  viewEye = 'view-eye',
  open = 'open',
  deleteIcon = 'deleteIcon',
  dashboard = 'dashboard',
  approve = 'approve',
  failure = 'failure',
  tool = `tool`,
  questionMark = `questionMark`,
  dottedQuestionBoundary = `dottedQuestionBoundary`,
  close = `close`,
  ContractApprove = 'ContractApprove',
  ContractList = 'ContractList',
  ContractPrep = 'ContractPrep',
  ContractCreation = 'ContractCreation',
  ContractRmi = 'ContractRmi',
  RMIReturn = 'RMIReturn',
  AddItem = 'AddItem',
  DeleteItem = 'DeleteItem',
  RefreshItem = 'RefreshItem',
  attachment = 'attachment',
  file = 'file',
  fileCopy = 'file-copy',
  contract = 'contract',
  contractSAP = 'contract-sap',
  trackLine = 'track-line',
}
