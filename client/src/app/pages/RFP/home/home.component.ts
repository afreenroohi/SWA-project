import { Component, OnInit } from '@angular/core';
import { AzureAdAuthService } from 'src/app/service/azure-ad-auth.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isUserLoggedIn = false;

  prof: any;
  LoginTxt = false;

  private readonly destroy$ = new Subject<void>();

  constructor(private azauth: AzureAdAuthService, private api: ApiService) { }

  ngOnInit(): void {


    this.api.noRole.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      //   console.log(res)
    })
    this.azauth.isUserLoggedIn.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {


      this.LoginTxt = res;
    })

    // this.azauth.getUserProfile().pipe(takeUntil(this.destroy$)).subscribe((profileInfo) => {
    //   this.prof = profileInfo;

    //   console.log(this.prof);

    // });

  }

  redirect() {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
