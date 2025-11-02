import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { DataItem, listOfColumnPO } from 'src/app/shared/shared';

@Component({
  selector: 'app-potable',
  templateUrl: './potable.component.html',
  styleUrls: ['./potable.component.scss'],
})
export class POTableComponent implements OnInit {
  listOfColumn = listOfColumnPO;
  listArray: any;
  Action: any;

  detArray: any;
  showDetails = false;
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
    this.spinner.show();
    let data = {
     ContractNo: window.history.state.ContractNo,
      // ContractNo: '4600000013',
    };
    this.api.post('CocProjOwnerPOSet', data).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.listOfData = res.d.results;
      this.listOfDisplayData = [...this.listOfData];
      this.spinner.hide();
    } ,(error) => {
      this.cs.createMessage("error",error.statusText)
      this.spinner.hide()
    });
  }

  navigate(PoNumber: any, PoItemNo: any, ContractNo: any,PoAmount: any,CocNumber?: any,) {
    if(window.history.state.CocNo){
      this.router.navigate(['coc/create'], {
        state: {
          PoNumber: PoNumber,
          PoItemNo: PoItemNo,
          ContractNo: ContractNo,
          CocNumber: window.history.state.CocNo,
          PoAmt: PoAmount,

          Role: 'view',
        },
      });
    }
    else {
      this.router.navigate(['coc/create'], {
        state: {
        
          PoNumber: PoNumber,
          PoItemNo: PoItemNo,
          ContractNo: ContractNo,
          PoAmt: PoAmount,
          CocNumber: '',
      
          Role: 'edit',
        },
      });
    }
  
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
