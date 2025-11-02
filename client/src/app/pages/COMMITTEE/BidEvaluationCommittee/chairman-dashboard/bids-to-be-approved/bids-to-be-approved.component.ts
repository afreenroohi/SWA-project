import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bids-to-be-approved',
  templateUrl: './bids-to-be-approved.component.html',
  styleUrls: ['./bids-to-be-approved.component.scss']
})
export class BidsToBeApprovedComponent implements OnInit {
  CommitteeAction : String = "BAPR";

  Status: String = "Final";
  OptionSelected = "BidAppr";
  constructor(    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe({
    next: (url=>{
      const currentRoute = this.router.url;
      if (currentRoute.includes('bids_to_be_approved')) {
        
        this.CommitteeAction = 'BAPR'
        
      }else if (currentRoute.includes('financial_controller_approval')){
        
        this.CommitteeAction = 'BPFC'
      }
      else if (currentRoute.includes('bids_from_technical_evaluation')){
        
        this.CommitteeAction = 'BFTC'
      }
      else if (currentRoute.includes('bids_to_eval_MEAW')){
        
        this.CommitteeAction = 'BEMR'
      }
    })
    })
  }

}
