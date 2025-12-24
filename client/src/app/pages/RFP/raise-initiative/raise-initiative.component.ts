import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { InitiativeFormComponent } from '../../../components/initiative-form/initiative-form.component';
import { CommonService } from '../../../service/common.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-raise-initiative',
  templateUrl: './raise-initiative.component.html',
  styleUrls: ['./raise-initiative.component.scss']
})
export class RaiseInitiativeComponent implements OnInit {
  showInitialBoxes = true;
  selectedAction = '';

  // KPI Data
  totalInitiatives = 0;
  submittedInitiatives = 0;
  inReviewInitiatives = 0;
  approvedInitiatives = 0;

  // Sample initiative data
  initiatives = [
    {
      id: 'INI-001',
      title: 'ProcessAutomationInitiative',
      description: 'AutomateManualProcesses',
      priority: 'High',
      category: 'Process Improvement',
      status: 'Submitted',
      createdDate: new Date('2024-01-15'),
      lastUpdated: new Date('2024-01-16'),
      adminMessage: null
    },
    {
      id: 'INI-002',
      title: 'CostReductionProgram',
      description: 'IdentifyCostOptimization',
      priority: 'Medium',
      category: 'Cost Reduction',
      status: 'In-Review',
      createdDate: new Date('2024-01-10'),
      lastUpdated: new Date('2024-01-14'),
      adminMessage: null
    },
    {
      id: 'INI-003',
      title: 'DigitalInnovationProject',
      description: 'ImplementDigitalSolutions',
      priority: 'High',
      category: 'Innovation',
      status: 'Approved',
      createdDate: new Date('2024-01-05'),
      lastUpdated: new Date('2024-01-12'),
      adminMessage: 'InitiativeApprovedMsg'
    }
  ];

  constructor(private modal: NzModalService, public cs: CommonService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.calculateKPIs();
  }

  onBoxClick(action: string): void {
    if (action === 'create') {
      this.openInitiativeForm();
    } else if (action === 'view') {
      this.selectedAction = action;
      this.showInitialBoxes = false;
    }
  }

  openInitiativeForm(): void {
    this.modal.create({
      nzTitle: 'Submit New Initiative',
      nzContent: InitiativeFormComponent,
      nzFooter: null,
      nzWidth: 600
    });
  }

  calculateKPIs(): void {
    this.totalInitiatives = this.initiatives.length;
    this.submittedInitiatives = this.initiatives.filter(i => i.status === 'Submitted').length;
    this.inReviewInitiatives = this.initiatives.filter(i => i.status === 'In-Review').length;
    this.approvedInitiatives = this.initiatives.filter(i => i.status === 'Approved').length;
  }

  goBack(): void {
    this.showInitialBoxes = true;
    this.selectedAction = '';
  }
}