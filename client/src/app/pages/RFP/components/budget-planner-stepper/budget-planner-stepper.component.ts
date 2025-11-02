import { Component, OnInit } from '@angular/core';
import { stepperStatesDetails, stepperStatus } from '../../rfp/rfp.model';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-budget-planner-stepper',
  templateUrl: './budget-planner-stepper.component.html',
  styleUrls: ['./budget-planner-stepper.component.scss']
})
export class BudgetPlannerStepperComponent implements OnInit {

  constructor(public cs: CommonService) { }
  stepperList: stepperStatesDetails[] = [
    {
      sNo: 1,
      titleEN: "Budget Year Definition",
      titleAR: "تعريف سنة الميزانية",
      state: stepperStatus.Pending
    },
    {
      sNo: 2,
      titleEN: "Bill of Quantity",
      titleAR: "جدول الكميات",
      state: stepperStatus.Pending
    }
  ];
  
  ngOnInit(): void {

  }

}
