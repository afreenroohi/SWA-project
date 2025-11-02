import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/RFP/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/service/common.service';
import * as moment from 'moment';

// Component for the comment pop-up
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() award_number = 0;
  @Input() showComments: any;

  constructor(
    public cs: CommonService,
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef
  ) { }

  listOfCommentData: any[] = [];
  textDir = 'ltr';

  ngOnInit(): void {
    this.spinner.show()
    this.getComments(this.award_number);
    if (this.cs.userLanguage == 'en') {
      this.textDir = 'ltr'
    } else {
      this.textDir = 'rtl'
    }
  }

  ngDoCheck() {
    if (this.cs.userLanguage == 'en') {
      this.textDir = 'ltr'
    } else {
      this.textDir = 'rtl'
    }
  }

  // get call function for the comments starts
  getComments(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
    this.api.post("getComments", AwardNum).subscribe(
      (res) => {
        this.listOfCommentData = res.d.results;
        this.listOfCommentData.forEach((data: any)=>{
          let comment_date = data.comment_date ? moment(data.comment_date, 'YYYYMMDD').format('YYYY/MM/DD') : '';
          let comment_time = data.comment_time ? moment(data.comment_time, 'hhmmss').format('hh:mm:ss A') : '';
          data.comment_date = comment_date + " " + comment_time
        })
        this.cd.detectChanges();
        this.spinner.hide();
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      });
  }
  // get call function for the comments ends

  showHideComments(){
    this.showComments = false;
  }

}
