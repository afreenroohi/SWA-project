import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { FilterSet, FilterValue } from '../../dashboard.model';
import { CommonService } from 'src/app/service/common.service';



@Component({
  selector: 'dashboard-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input() pieChartHeading : string = 'Spend Analysis by the department'
  @Input() pieChartData :  ChartConfiguration<'pie'>['data'] = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [300, 500, 100],
      }
    ]
  }
  @Input() pieChartOptions: ChartConfiguration<'pie'>['options'] = { 
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom', 
        labels: {
          pointStyle: 'circle',
          usePointStyle: true,
          textAlign: 'left',
          font: {
            size: 10
          }
        }
      }
    },
  };
  @Input() filterSet: FilterSet[] = []
  @Output() selectedFilters = new EventEmitter<{ [key: string]: FilterValue }>();
  selectedFilterValues: { [key: string]: FilterValue } = {};
  isLablesPresent: boolean = false
  disabledFilter: { [key: string]: boolean } = {};



  constructor(public cs: CommonService) { }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['pieChartData']) {
      const prev = changes['pieChartData'].previousValue;
      const curr = changes['pieChartData'].currentValue;
      this.isLablesPresent = curr.labels.length ? true : false
    }
  }

  ngOnInit(): void {
    this.filterSet.forEach((filter: FilterSet) => {
      this.selectedFilterValues[filter.lableName] = ''
    })
  }

  onReset() {
    this.filterSet.forEach((filter: FilterSet) => {
      this.selectedFilterValues[filter.lableName] = ''
    })
    this.selectedFilters.emit(undefined)
  }

  onApplyFilters(){
    this.selectedFilters.emit(this.selectedFilterValues)
  }

  onFilterChange(labelName: string, value: any): void {
    this.selectedFilterValues[labelName] = value;
  
    const purchaseTypeKey = 'Dashboard.Purchase Type';
    const tenderTypeKey = 'Dashboard.Tender Type';
    const purchaseMethodKey = 'Dashboard.Purchase Method'
  
    if (labelName === purchaseTypeKey && value === 'D') {
      // Force 'One Envelope' selection
      const oneEnv = this.filterSet
        .find(f => f.lableName === tenderTypeKey)
        ?.dropDown.find(opt => opt.value === '01');
  
      this.selectedFilterValues[tenderTypeKey] = oneEnv?.value || '';
      this.disabledFilter[tenderTypeKey] = true;
      this.disabledFilter[purchaseMethodKey] = true;
    }
    
    // Re-enable Tender Type and purchase method if user selects 'RFP Tendering'
    if (labelName === purchaseTypeKey && value !== 'D') {
      this.disabledFilter[tenderTypeKey] = false;
      this.disabledFilter[purchaseMethodKey] = false;
    }
  }


}
