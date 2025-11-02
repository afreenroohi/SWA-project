import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { FilterSet, FilterValue } from '../../dashboard.model';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'dashboard-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {

  @Input('lineChartHeading') heading : string = 'Spent Analysis by the department'
  @Input('lineChartData') data :  ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  }
  @Input('lineChartOptions') options: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'bottom', 
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        bounds: "ticks"
      }
    }
  };
  @Input() filterSet: FilterSet[] = []
  @Output() selectedFilters = new EventEmitter<{ [key: string]: FilterValue }>();
  selectedFilterValues: { [key: string]: FilterValue } = {};
  isLablesPresent: boolean = false
  disabledFilter: { [key: string]: boolean } = {};



  constructor(public cs: CommonService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      const prev = changes['data'].previousValue;
      const curr = changes['data'].currentValue;
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
//* for Monthly Tender Trends 
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
  
    // Re-enable Tender Type if user selects 'RFP Tendering'
    if (labelName === purchaseTypeKey && value !== 'D') {
      this.disabledFilter[tenderTypeKey] = false;
      this.disabledFilter[purchaseMethodKey] = false;

    }
  }
  

}
