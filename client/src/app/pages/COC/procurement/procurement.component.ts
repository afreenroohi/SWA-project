import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { listOfColumnSLA, DataItem } from 'src/app/shared/shared';

@Component({
  selector: 'app-procurement',
  templateUrl: './procurement.component.html',
  styleUrls: ['./procurement.component.scss']
})
export class ProcurementComponent implements OnInit {

  listOfColumn = listOfColumnSLA;
  listOfDisplayData: any;
  listOfData: DataItem[] = [];
  
  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    public cs: CommonService,
    private spinner: NgxSpinnerService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.spinner.show()
    let data = {
      UserId: this.cs.getUserData().userid,
    };

    this.api.post('CocProjCordinatorSet', data).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.listOfData = res.d.results;
      this.listOfDisplayData = [...this.listOfData];
      this.spinner.hide();
    } ,(error) => {
      this.cs.createMessage("error",error.statusText)
      this.spinner.hide()
    });
  }

  navigate(CocNumber: any, PoNumber: any, PoItemNo: any, ContractNo?: any) {
    this.router.navigate(['coc/update'],
     {
      state: { Role: 'Procurement',
      CocNumber: CocNumber,
      PoNumber:' ',
      PoItemNo: ' ',
      ContractNo: ContractNo,},
    }

    
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
