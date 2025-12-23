import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../service/common.service';

@Component({
  selector: 'app-initiatives',
  templateUrl: './initiatives.component.html',
  styleUrls: ['./initiatives.component.scss']
})
export class InitiativesComponent implements OnInit {
  initiatives: any[] = [];
  totalInitiatives = 0;
  highPriorityInitiatives = 0;
  openInitiatives = 0;
  loading = false;
  showActionModal = false;
  selectedInitiative: any = null;
  currentAction = '';
  actionText = '';
  transferId = '';
  actionModalTitle = '';
  staticInitiativesLoaded = false;

  // RFP KPI values
  totalRfp = Math.floor(Math.random() * 100) + 50;
  totalContracts = Math.floor(Math.random() * 80) + 30;
  totalBidsOpen = Math.floor(Math.random() * 60) + 20;
  totalBidsEvaluated = Math.floor(Math.random() * 40) + 15;

  constructor(private fb: FormBuilder, public cs: CommonService, private router: Router) {}

  ngOnInit(): void {
    this.loadInitiatives();
  }

  loadInitiatives(): void {
    if (!this.staticInitiativesLoaded) {
      this.initiatives = [
        {
          id: 'INI-001',
          title: 'Digital Transformation Initiative',
          description: 'Modernize legacy systems and implement digital solutions',
          priority: 'High',
          status: 'Open',
          assignedTo: 's1',
          benefitedDepartments: 'IT, Operations',
          adminMessage: 'Approved for implementation',
        },
        {
          id: 'INI-002',
          title: 'Employee Training Program',
          description: 'Comprehensive training program for skill development',
          priority: 'Medium',
          status: 'In Progress',
          assignedTo: 's2',
          benefitedDepartments: 'HR, All Departments',
          adminMessage: 'Budget allocation pending',
        },
        {
          id: 'INI-003',
          title: 'Green Energy Project',
          description: 'Implement renewable energy solutions',
          priority: 'Low',
          status: 'Open',
          assignedTo: 'admin',
          benefitedDepartments: 'Facilities, Finance',
          adminMessage: '',
        },
        {
          id: 'INI-004',
          title: 'Customer Service Enhancement',
          description: 'Improve customer service processes and tools',
          priority: 'High',
          status: 'Open',
          assignedTo: 's1',
          benefitedDepartments: 'Customer Service, IT',
          adminMessage: 'High priority - fast track approval',
        },
        {
          id: 'INI-005',
          title: 'Cost Optimization Initiative',
          description: 'Identify and implement cost-saving measures',
          priority: 'Medium',
          status: 'Closed',
          assignedTo: 's2',
          benefitedDepartments: 'Finance, Operations',
          adminMessage: 'Successfully completed with 15% cost reduction',
        }
      ];
      this.staticInitiativesLoaded = true;
    }
    
    this.calculateKPIs();
  }

  calculateKPIs(): void {
    this.totalInitiatives = this.initiatives.length;
    this.highPriorityInitiatives = this.initiatives.filter(i => i.priority === 'High').length;
    this.openInitiatives = this.initiatives.filter(i => i.status === 'Open').length;
  }

  openActionModal(action: string, initiative: any): void {
    this.selectedInitiative = initiative;
    this.currentAction = action;
    this.actionText = '';
    this.transferId = '';
    
    switch(action) {
      case 'approve':
        this.actionModalTitle = 'Approve Initiative';
        break;
      case 'reject':
        this.actionModalTitle = 'Reject Initiative';
        break;
      case 'transfer':
        this.actionModalTitle = 'Transfer Initiative';
        break;
      case 'moreInfo':
        this.actionModalTitle = 'More Information';
        break;
    }
    
    this.showActionModal = true;
  }

  submitAction(): void {
    if (this.actionText.trim() && (this.currentAction !== 'transfer' || this.transferId.trim())) {
      console.log(`${this.currentAction} action for initiative ${this.selectedInitiative.id}:`, {
        message: this.actionText,
        transferId: this.currentAction === 'transfer' ? this.transferId : undefined
      });
      
      this.cancelAction();
    }
  }

  cancelAction(): void {
    this.showActionModal = false;
    this.currentAction = '';
    this.actionText = '';
    this.transferId = '';
    this.selectedInitiative = null;
  }

  isUserRoute(): boolean {
    return this.router.url.includes('/suser/');
  }

  analyseInitiative(initiative: any): void {
    console.log('Analysing initiative:', initiative.id);
    // Add analysis logic here
  }
}