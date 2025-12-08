import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './service/common.service';
import { SessionService } from './service/session.service';
import { ar_EG, en_US, NzI18nService } from 'ng-zorro-antd/i18n';
import { ApiService } from './service/RFP/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { registerLocaleData } from '@angular/common';
import ar from '@angular/common/locales/ar';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import jwt_decode from "jwt-decode";
import { IconList } from './components/icon/icon.component';
import { HostListener } from '@angular/core';
import { PROCESS_TYPES } from './shared/shared';
import { FormControl, FormGroup } from '@angular/forms';
import { RFPService } from './service/RFP/rfp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'committee';
  collapsedWidth = 80;                     // final width of collapsed sidebar (px)
  expandedSiderWidth = 250;               // normal sidebar width (px)
  expandedLogo = 'assets/logo/swa-logo-dark.svg';
  // collapsedLogo = 'assets/logo/swa-header-logo.svg';
  isCollapsed = false;
  isMobile = false;
  expandedWidth = 250;
  layoutContentMarginLeft: number = 250;
  layoutContentMarginRight: number = 0;

  // headerLeftWidth is used for inline width and stays a string with "px"
  headerLeftWidth: string = this.expandedWidth + 'px';

  public navItems: any[] = [];

  readonly IconList = IconList;

  private readonly _destroy = new Subject<void>();

  currentYear = 2026

  isUserLoggedIn = false;
  enableproxy = false;
  openMdl = false;

  isAdmin = false;
  isAdminFullAccess = false;

  role: any;

  rfpRoles: any;
  committeeRoles: any;
  contractRoles: any;
  cocRoles: any;

  // activeMenu = 'create';
  norole = false;
  noRFC = false;
  noCMT = false;
  noCOC = false;
  noCON = false;



  rqter: any;
  appr: any;
  budalltr: any;
  manager: any;
  apprmanager: any;

  roleForm: FormGroup = new FormGroup({
    rfpRole: new FormControl(''),
    committeeRole: new FormControl(''),
    contractRole: new FormControl(''),
    cocRole: new FormControl('')
  });

  profile: any;

  ProxyUserId = '';
  committeeId: any;

  bidsToBeApprovedCount = 0;
  bidsListCount = 0;
  bidsToBeOpenedCount = 0;
  bidsFinancialOfferCount = 0;
  bidsToBeEvaluated = 0;
  bidsToBeEvaluatedData = 0;
  bidsfromQualCount = 0;
  bidsfinalApprovalCount = 0;
  pendingReviewCount = 0;
  openingMemberCount = 0;
  bidsFromTechMem = 0;
  bidsFromTechnicalEvalCount = 0;
  bidsFromfinancialControllerApprovalCount = 0;
  vendorListCount = 0;

  dispname = ''
  email = ''
  department = ''

  applicationVersion = '1.0.0';

  // logoSrc = "assets/logo/mwan_logo.png";
  logoSrc = "assets/logo/swa-logo-dark.svg";

  isDarkMode = false;
  showDropdown = false;


  login() {
    this.oauthService.initLoginFlow();

  }

  logout() {
    // Use session service to clear session
    this.sessionService.clearSession();
    
    // Reset user state
    this.resetUserState();
    
    // Navigate to login or home page
    this.router.navigate(['/']);
  }
  
  /**
   * Handle session expiration
   */
  handleSessionExpired(): void {
    // Show notification to user
    this.cs.createMessage('warning', 'Your session has expired. Please login again.');
    
    // Reset user state
    this.resetUserState();
    
    // Navigate to login
    this.router.navigate(['/']);
  }
  
  /**
   * Reset all user-related state
   */
  private resetUserState(): void {
    this.isUserLoggedIn = false;
    this.dispname = '';
    this.department = '';
    this.ProxyUserId = '';
    this.navItems = [];
    
    // Reset role flags
    this.rqter = false;
    this.appr = false;
    this.budalltr = false;
    this.manager = false;
    this.apprmanager = false;
    this.isAdmin = false;
    this.isAdminFullAccess = false;
    this.enableproxy = false;
    
    // Hide dropdown
    this.showDropdown = false;
  }
  toggleLang() {
    if (this.cs.userLanguage === 'en') {
      this.onChangeLang('ar');
    } else {
      this.onChangeLang('en');
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.headerLeftWidth = this.isCollapsed ? this.collapsedWidth + 'px' : this.expandedWidth + 'px';
    this.layoutContentMarginLeft = this.isCollapsed ? this.collapsedWidth : this.expandedWidth;
  }
  //   public openParentsForActive(): void {
  //   try {
  //     if (!this.navItems || !Array.isArray(this.navItems)) return;
  //     for (const nav of this.navItems) {
  //       if (nav?.navItem && Array.isArray(nav.navItem)) {
  //         const childActive = nav.navItem.some((si: any) => si.name === this.cs.activeMenu);
  //         // Keep already-open menus open; open the parent if childActive
  //         if (childActive) {
  //           nav.isOpen = true;
  //         }
  //       }
  //       // Also mark top-level menu as selected if there is no child and name matches
  //       if (!nav.navItem && nav.Module === this.cs.activeMenu) {
  //         nav.isOpen = true;
  //       }
  //     }
  //   } catch (e) {
  //     // fail silently
  //     // console.warn('openParentsForActive error', e);
  //   }
  // }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    if (!event.target.closest('.user-dropdown')) {
      this.showDropdown = false;
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    let isAccess = false;
    this.navItems.forEach((nav: any) => {
      if (nav.navItem.find((elem: any) => window.location.pathname.indexOf(elem.link) > -1)) {
        isAccess = true;
      }
    })

    if (!isAccess) {
      setTimeout(() => {
        this.router.navigate(['rfp/home']);
      }, 300);

    }
  }

  constructor(
    private spinner: NgxSpinnerService,
    private oauthService: OAuthService,
    private router: Router,
    private i18n: NzI18nService,
    private api: ApiService,
    private translate: TranslateService,
    public cs: CommonService,
    private rfp: RFPService,
    private sessionService: SessionService
  ) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.use('en');
    this.i18n.setLocale(en_US);

    // this.configure();  // afreen commented

    this.spinner.show();

    const claims = this.oauthService.getIdentityClaims() as any;
    if (claims) {
      this.ProxyUserId = claims.upn.split("@")[0].toUpperCase()
      if (this.ProxyUserId) {
        // console.log(this.ProxyUserId)
        this.isUserLoggedIn = true;
        this.dispname = claims.upn
        this.spinner.hide()
      }
    }

    else {
      this.spinner.hide()
    }
  }

  ngOnDestroy(): void {
    this._destroy.next(undefined);
    this._destroy.complete();
    
    // Stop session monitoring
    this.sessionService.stopSessionCheck();
  }

  ngOnInit(): void {
    this.cs.activeMenu = 'home';
    // this.setActiveMenuFromUrl();
    this.isUserLoggedIn = true;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      // Default to light theme
      this.isDarkMode = false;
      document.documentElement.removeAttribute('data-theme');
    }
    
    // Monitor session expiration
    this.sessionService.sessionExpired$.pipe(takeUntil(this._destroy)).subscribe(expired => {
      if (expired) {
        this.handleSessionExpired();
      }
    });
    // if (!environment.testlogin) {  // afreen commented
    //   const token = this.oauthService.getAccessToken() as any;
    //   const decode: any = jwt_decode(token);
    //   if (decode) {
    //     this.ProxyUserId = decode.upn.split("@")[0].toUpperCase()
    //     this.dispname = decode.unique_name
    //     this.email = decode.email
    //     this.isUserLoggedIn = true;

    //     // * Gets the menu items - Login logic
    //     this.getNavItem(this.ProxyUserId);

    //   }
    // }
    //* Subscription to get count */
    this.cs.getBidsCount().pipe(takeUntil(this._destroy)).subscribe(resFromComp => {
      if (resFromComp.committeeAction == 'BOPN') {
        this.bidsToBeOpenedCount = resFromComp.count;
      } else if (resFromComp.committeeAction == 'BLST') {
        this.bidsListCount = resFromComp.count;
      } else if (resFromComp.committeeAction == 'BAPR'
        || resFromComp.committeeAction === 'QAPR'
      ) {
        this.bidsToBeApprovedCount = resFromComp.count;
      } else if (resFromComp.committeeAction == 'BFNC'
        || resFromComp.committeeAction == 'BOFR'
        || resFromComp.committeeAction === 'BEFM') {
        this.bidsFinancialOfferCount = resFromComp.count;
      } else if (resFromComp.committeeAction == 'BOPN'
        || resFromComp.CommitteeAction === 'BEMR'
        || resFromComp.CommitteeAction === 'BTEV'
        || resFromComp.CommitteeAction === 'BFEM'
        || resFromComp.committeeAction === 'BTTE'
      ) {
        this.bidsToBeEvaluated = resFromComp.count;
      } else if (resFromComp.committeeAction === 'BFTM') {
        this.bidsFromTechMem = resFromComp.count;

      } else if (resFromComp.committeeAction === 'BFTC') {
        this.bidsFromTechnicalEvalCount = resFromComp.count;
      } else if (resFromComp.committeeAction === 'BFQC') {
        this.bidsfromQualCount = resFromComp.count;
      } else if (resFromComp.CommitteeAction === 'BFAP') {
        this.bidsfinalApprovalCount = resFromComp.count;
      } else if (resFromComp.CommitteeAction === 'BPRV') {
        this.pendingReviewCount = resFromComp.count;
      } else if (resFromComp.CommitteeAction === 'BOMR') {
        this.openingMemberCount = resFromComp.count;
      } else if (resFromComp.CommitteeAction === 'BEMR') {
        this.bidsToBeEvaluatedData = resFromComp.count;
      } else if (resFromComp.CommitteeAction === 'BPFC') {
        this.bidsFromfinancialControllerApprovalCount = resFromComp.count;
      } else if (resFromComp.CommitteeAction === 'VNDT') {
        this.vendorListCount = resFromComp.count;
      }

      for (let navItm of this.navItems) {
        for (let nav of navItm?.navItem) {
          if (nav?.name == "bidtobeapproved") {
            nav.text = "Bids to be approved (" + this.bidsToBeApprovedCount + ")";
          } else if (nav?.name == "bidstobeopen") {
            nav.text = "Bids to be Opened (" + this.bidsToBeOpenedCount + ")";
          } else if (nav?.name == "bidsforfinancialoffer") {
            nav.text = "Bids for financial offer (" + this.bidsFinancialOfferCount + ")";
          } else if (nav?.name == "bidsfromfinancialmember") {
            nav.text = "Bids from financial member (" + this.bidsFinancialOfferCount + ")";
          } else if (nav?.name == "bidlist") {
            nav.text = "Bids List (" + this.bidsListCount + ")";
          } else if (nav?.name == "bidstobeevaluated") {
            nav.text = "Bids to be Evaluated (" + this.bidsToBeEvaluated + ")";
          } else if (nav?.name === 'techbidstobeevaluated') {
            nav.text = "Bids to be Evaluated (" + this.bidsToBeEvaluated + ")";
            nav.textAr = ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للتحليل الفني';
          } else if (nav?.name == "fromqualificationCommittee") {
            nav.text = "From Qualification (" + this.bidsfromQualCount + ")";
          } else if (nav?.name == "finalapproval") {
            nav.text = 'Final Approval (' + this.bidsfinalApprovalCount + ')';
          } else if (nav?.name == "pendingreview") {
            nav.text = 'Pending review (' + this.pendingReviewCount + ')';
          } else if (nav?.name == "bidswithbidopeningmember") {
            nav.text = 'Opening member (' + this.openingMemberCount + ')';
          } else if (nav?.name === 'bidsfromtechmem') {
            nav.text = 'Bids From Technical Members (' + this.bidsFromTechMem + ')';
            nav.textAr = ' (' + this.bidsFromTechMem + ') ' + 'نتائج التحليل الفني المرسله من الأعضاء';
          } else if (nav?.name === 'vendorlist') {
            nav.text = 'Vendor List (' + this.vendorListCount + ')';
            nav.textAr = '(' + this.vendorListCount + ') قائمة البائعين';
          }
        }
      }
    });
  }

  /**
   * Navigate to defined route.
   * 
   * @param item type any : Menu item with navigation link
   * 
   * @returns void
   * 
   */

  navigate(item: any): void {
    if (item.name === 'logout') {
      this.logout();
    } else {
      if (item.Module) {
        this.navItems.forEach((nav: any) => {
          if (nav.isOpen) {
            nav.isOpen = false;
          }
        })
      }
      this.cs.activeMenu = item.name ?? item.Module;
      this.router.navigate([`/${item.link}`], { queryParams: { fullAccess: item?.adminFullAccess } });

      // Auto-close the sidebar on mobile so the content is visible
      if (this.isMobile) {
        this.isCollapsed = true;
      }
    }
  }


  /**
   * Login API and Menu construction method.
   * 
   * @param userName Username of the current logged in user
   * 
   * @returns void
   * @todo Make the changes according to the Process deployment. 
   * 
   */
  private _enableTestLogon: boolean = true;
  private hasUsedTestLogin: boolean = false;

  get enableTestLogon(): boolean {
    return !this.hasUsedTestLogin;
  }

  set enableTestLogon(value: boolean) {
    this._enableTestLogon = value;
  }
  async getNavItem(userName: string) {
    this.api.getLoginUserDetails(userName).subscribe(
      (response:any) => {
        console.log(response, '=========RFPLoginApi=======');
        console.log(response?.d?.Uname, '=========username=======');
        
        if(!response?.d?.Uname){
            this.cs.createMessage("error", 'User Not Found');
            console.log('Error message triggered: User Not Found');
            return;
        }
        
        this.isUserLoggedIn = true;
        this.dispname = response?.d?.Uname ? response?.d?.Uname.toUpperCase() : 'undefined'
        this.department = response?.d?.Planstxt ? response?.d?.Planstxt : 'undefined'
        this.ProxyUserId = userName.toUpperCase();
        this.hasUsedTestLogin = true;
        this.isCollapsed = true;


        // console.log(userName,'userName==')
        this.navItems = [];
        this.navItems.push(
          {
            Module: 'Dashboard',
            ModuleAr: 'إدارة طلب المنافسات',
            ModuleIcon: 'line-chart',
            link: 'rfp/dashboard'
          },
        )
        // if(userName === 'OALMAGHRABI'){  'KAAR-758'
        if (userName === 'KAAR-758') {
          this.roleTest('Requestor');

          // ensure Dashboard is the active/selected menu key
          this.cs.activeMenu = 'Dashboard';

          // close any open submenus so the Dashboard top-level looks highlighted
          this.navItems.forEach(nav => nav.isOpen = false);

          // navigate to dashboard
          this.router.navigate(['rfp/dashboard']);
        }
        else if (userName === 'SALSUBKI') {
          this.roleTest('Approver')
          this.router.navigate(['rfp/myinbox']);
        }
        else if (userName === 'AALSALEM') {

          this.constructCOCmenu({ RoleId: 'FI' })

          this.navItems.push({
            ModuleIcon: 'dashboard',
            Module: 'Bid Opening Committee',
            ModuleId: '01',
            ModuleAr: 'لجنة فتح العروض ',
            navItem: [
              {
                name: 'bidopeningform',
                iconName: IconList.listcheck,
                text: 'Bid opening Form',
                textAr: 'نموذج فتح العروض',
                link: 'committee/Bid_Create',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: '(' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
            ],
          });
          // Budallocator Manager Approver&Manager
          this.router.navigate(['rfp/myinbox']);
        }
      },
      error => {
        console.error(error)
      }
    );
   

    //     this.cs.activeMenu = 'Dashboard';
    // this.navItems.forEach(n => n.isOpen = false);
    // // call helper if exists (keeps same behavior as the forkJoin branch)
    // if (typeof this.openParentsForActive === 'function') { this.openParentsForActive(); }
    // this.router.navigate(['rfp/dashboard']);

    return
    // * Setting the Initial State for Login
    localStorage.clear()
    this.noRFC = false;
    this.noCOC = false;
    this.noCMT = false;
    this.noCON = false;
    this.rqter = false;
    this.appr = false;
    this.manager = false;
    this.apprmanager = false;
    this.budalltr = false;
    this.enableproxy = false;
    this.isAdmin = false;
    this.isAdminFullAccess = false;

    // * Username
    localStorage.setItem('ID', btoa(userName.toUpperCase()))
    const UsernameObj = {
      UserName: this.ProxyUserId.toUpperCase(),
    };

    this.navItems = [];

    // * Reset roles
    this.committeeRoles = [];
    this.contractRoles = [];
    this.cocRoles = [];

    // * Admin Module Enable
    // ? to disable admin module comment the below code
    const AdminRole = await this.api.post('getAdminRole', UsernameObj);
    AdminRole.pipe(takeUntil(this._destroy)).subscribe((AdminRoleRes) => {
      if (AdminRoleRes.d.results[0]) {
        this.isAdmin = true;
        this.isAdminFullAccess = AdminRoleRes.d.results[0].IsAllAccess
      }
    });
    // ? ....


    // * Login API's List - All process
    const RFPLogin = this.api.post('F4DeptSet', UsernameObj);
    const CommitteeLogin = this.api.post('GET_LOGGED_USER_INFO', UsernameObj);
    // * Contract Login V1
    // const ContractLogin = this.api.post('ContractLogin', UsernameObj);
    // * Contract Login V2
    const ContractLogin = this.api.get(`/v2/contract-login?username=${this.ProxyUserId.toUpperCase()}`);
    // *Coc Login V1
    // const COCLogin = this.api.post('COCLogin',UsernameObj);
    // *Coc Login V2
    const COCLoginRole = this.api.get(`/v2/COCLogin?username=${this.ProxyUserId.toUpperCase()}`);

    forkJoin([RFPLogin, CommitteeLogin,
      ContractLogin, COCLoginRole
    ]).pipe(takeUntil(this._destroy)).subscribe(([RFPLoginRes, CommitteeLoginRes,
      ContractLoginRes, COCLoginRoleRes
    ]) => {
      this.navItems.push(
        {
          Module: 'Dashboard',
          ModuleAr: 'إدارة طلب المنافسات',
          ModuleIcon: 'dashboard',
          link: 'rfp/dashboard'
        },
      )
      if (RFPLoginRes) {
        if (RFPLoginRes.d.results[0].MessageId != 'E') {
          this.setRFPmenu(RFPLoginRes);
          this.rfp.setRFPUserDetails(RFPLoginRes.d.results[0])
        } else {
          this.noRFC = true;
        }
      }

      if (CommitteeLoginRes.d.results.length > 0) {
        this.committeeRoles = CommitteeLoginRes.d.results;
        this.roleForm.get('committeeRole')?.setValue(CommitteeLoginRes.d.results[0]);
        this.getCountData(CommitteeLoginRes, this.ProxyUserId.toUpperCase());
      } else {
        this.noCMT = true;
      }

      // if (COCLoginRes.d.RoleId) {
      //   localStorage.setItem('RoleCOC', COCLoginRes.d.RoleId);
      //   this.setCOCmenu(COCLoginRes.d.RoleId)
      // } else {
      //   this.noCOC = true;
      // }

      if (ContractLoginRes.length > 0) {
        this.contractRoles = ContractLoginRes;
        localStorage.setItem('ContractDep', btoa(ContractLoginRes[0].RoleId));
        this.roleForm.get('contractRole')?.setValue(ContractLoginRes[0]);
        this.setContractMenu(ContractLoginRes[0].RoleId);
      } else {
        this.noCON = true;
      }
      if (COCLoginRoleRes.length > 0) {
        this.cocRoles = COCLoginRoleRes;
        localStorage.setItem('CocDep', btoa(COCLoginRoleRes[0].RoleId));
        this.roleForm.get('cocRole')?.setValue(COCLoginRoleRes[0]);

        // Only first role for initial load
        this.setCOCmenu(COCLoginRoleRes, true);
      } else {
        this.noCOC = true;
      }

      if (this.noRFC && this.noCMT && this.noCOC && this.noCON) {
        this.norole = true;
        this.router.navigate(['noaccess']);
      }
      //   this.cs.activeMenu = 'Dashboard';
      // if (typeof this.openParentsForActive === 'function') { this.openParentsForActive(); }
      // this.navItems.forEach(n => n.isOpen = false);
      // this.router.navigate(['/dashboard']);
    },
      (error) => {
        this.spinner.hide()
        this.cs.createMessage("error", error.statusText);
      });
  }


  async roleTest(RoleIdf: string) {
    if (RoleIdf === 'Requestor') {
      localStorage.setItem('ROLERFP', btoa(RoleIdf));
      this.rqter = true;
      // this.router.navigate(['rfp/myrfp'])
    }
    else if (RoleIdf === 'Approver') {
      this.appr = true;
    }
    else if (RoleIdf === 'Budallocator') {
      localStorage.setItem('ROLEBUD', btoa(RoleIdf));
      this.budalltr = true;
    }
    else if (RoleIdf == 'Manager') {
      this.manager = true;
    }
    else if (RoleIdf == 'Approver&Manager') {
      this.apprmanager = true;
    }


    if (this.rqter) {
      this.navItems.push(
        {
          Module: 'RFP - Requester',
          ModuleAr: 'إدارة طلب المنافسات',
          ModuleIcon: 'file-text',
          isOpen: false,
          navItem: [
            {
              name: 'create',
              iconName: IconList.create,
              text: 'Create RFP',
              textAr: 'انشاء منافسة',
              link: 'rfp/create',
            },
            {
              name: 'myrfp',
              iconName: IconList.myRequest,
              text: 'My RFP Requests',
              textAr: 'منافساتي',
              link: 'rfp/myrfp',
            }
          ],
        },
      )
    }

    if (this.appr) {
      this.navItems.push(
        {
          Module: 'RFP - Approver',
          ModuleAr: 'الموافقة على المنافسات',
          ModuleIcon: 'mail',
          isOpen: false,
          navItem: [

            {
              name: 'list',
              iconName: IconList.search,
              text: 'Search RFP',
              textAr: 'منافساتي',
              link: 'rfp/list',
            },

            // {
            //   name: 'dashboard',
            //   iconName: IconList.dashboard,
            //   text: 'Dashboard',
            //   textAr: 'لوحة القيادة',
            //   link: 'rfp/dashboard',
            // },
            {
              name: 'myinbox',
              iconName: IconList.inbox,
              text: 'My Inbox',
              textAr: 'الطلبات الواردة',
              link: 'rfp/myinbox',
            },
          ],
        },
      )
    }

    if (this.budalltr) {
      this.navItems.push(
        {
          Module: 'RFP - Budget Allocation',
          ModuleAr: 'الميزانية',
          ModuleIcon: 'mail',
          navItem: [

            {
              name: 'budgetrequest',
              iconName: IconList.hand,
              text: 'Budget Requests',
              textAr: 'طلبات الميزانية',
              link: 'rfp/budgetrequest',
            },

            // {
            //   name: 'list',
            //   iconName: 'mail',
            //   text: 'Search RFP',
            //   textAr: 'منافساتي',
            //   link: 'rfp/list',
            // },

            // {
            //   name: 'myinbox',
            //   iconName: 'mail',
            //   text: 'My Inbox',
            //   textAr: 'الطلبات الواردة',
            //   link: 'rfp/myinbox',
            // },

          ],
        },
      )
    }

    if (this.manager) {
      this.navItems.push(
        {
          Module: 'RFP - Dashboard',
          ModuleAr: 'حالة المنافسات',
          ModuleIcon: 'mail',
          navItem: [

            {
              name: 'dashboard',
              iconName: IconList.dashboard,
              text: 'Dashboard',
              textAr: 'لوحة القيادة',
              link: 'rfp/dashboard',
            },
          ],
        },
      )
    }

    if (this.apprmanager) {
      this.navItems.push(
        {
          Module: 'RFP - Approver',
          ModuleAr: 'الموافقة على المنافسات',
          ModuleIcon: 'mail',
          navItem: [

            {
              name: 'dashboard',
              iconName: IconList.dashboard,
              text: 'Dashboard',
              textAr: 'لوحة القيادة',
              link: 'rfp/dashboard',
            },

            {
              name: 'myinbox',
              iconName: IconList.inbox,
              text: 'My Inbox',
              textAr: 'الطلبات الواردة',
              link: 'rfp/myinbox',
            },
          ],
        },
      )
    }

    if (this.isAdmin) {
      this.addRFPAdminNavItem(this.isAdminFullAccess);
    }
  }

  /**
   * Sets the RFP menu based on the Login API.
   * 
   * @param res Response from RFP login API
   * 
   * @returns void
   * 
   */
  async setRFPmenu(res: any) {

    if (res.d.results[0].MessageId != 'E') {

      this.role = res.d.RoleIdf;
      res.d.results.forEach((element: any) => {
        localStorage.setItem('Dep', btoa(element.DeptId));
        localStorage.setItem("DepTxt", element.DeptText);
        localStorage.setItem("CC", element.CostCenter);
        localStorage.setItem("CA", element.ControllingArea);

        // // navITems with role
        if (element.RoleIdf === 'Requestor') {
          localStorage.setItem('ROLERFP', btoa(element.RoleIdf));
          this.rqter = true;
          // this.router.navigate(['rfp/myrfp'])
        }
        else if (element.RoleIdf === 'Approver') {
          this.appr = true;
        }
        else if (element.RoleIdf === 'Budallocator') {
          localStorage.setItem('ROLEBUD', btoa(element.RoleIdf));
          this.budalltr = true;
        }
        else if (element.RoleIdf == 'Manager') {
          this.manager = true;
        }
        else if (element.RoleIdf == 'Approver&Manager') {
          this.apprmanager = true;
        }
      });

      if (this.rqter) {
        this.navItems.push(
          {
            Module: 'RFP - Requester',
            ModuleAr: 'إدارة طلب المنافسات',
            ModuleIcon: 'mail',
            isOpen: true,
            navItem: [
              {
                name: 'create',
                iconName: IconList.create,
                text: 'Create RFP',
                textAr: 'انشاء منافسة',
                link: 'rfp/create',
              },
              {
                name: 'myrfp',
                iconName: IconList.myRequest,
                text: 'My RFP Requests',
                textAr: 'منافساتي',
                link: 'rfp/myrfp',
              }
            ],
          },
        )
      }

      if (this.appr) {
        this.navItems.push(
          {
            Module: 'RFP - Approver',
            ModuleAr: 'الموافقة على المنافسات',
            ModuleIcon: 'mail',
            isOpen: false,
            navItem: [

              {
                name: 'list',
                iconName: IconList.search,
                text: 'Search RFP',
                textAr: 'منافساتي',
                link: 'rfp/list',
              },

              // {
              //   name: 'dashboard',
              //   iconName: IconList.dashboard,
              //   text: 'Dashboard',
              //   textAr: 'لوحة القيادة',
              //   link: 'rfp/dashboard',
              // },
              {
                name: 'myinbox',
                iconName: IconList.inbox,
                text: 'My Inbox',
                textAr: 'الطلبات الواردة',
                link: 'rfp/myinbox',
              },
            ],
          },
        )
      }

      if (this.budalltr) {
        this.navItems.push(
          {
            Module: 'RFP - Budget Allocation',
            ModuleAr: 'الميزانية',
            ModuleIcon: 'mail',
            navItem: [

              {
                name: 'budgetrequest',
                iconName: IconList.hand,
                text: 'Budget Requests',
                textAr: 'طلبات الميزانية',
                link: 'rfp/budgetrequest',
              },

              // {
              //   name: 'list',
              //   iconName: 'mail',
              //   text: 'Search RFP',
              //   textAr: 'منافساتي',
              //   link: 'rfp/list',
              // },

              // {
              //   name: 'myinbox',
              //   iconName: 'mail',
              //   text: 'My Inbox',
              //   textAr: 'الطلبات الواردة',
              //   link: 'rfp/myinbox',
              // },

            ],
          },
        )
      }

      if (this.manager) {
        this.navItems.push(
          {
            Module: 'RFP - Dashboard',
            ModuleAr: 'حالة المنافسات',
            ModuleIcon: 'mail',
            navItem: [

              {
                name: 'dashboard',
                iconName: IconList.dashboard,
                text: 'Dashboard',
                textAr: 'لوحة القيادة',
                link: 'rfp/dashboard',
              },
            ],
          },
        )
      }

      if (this.apprmanager) {
        this.navItems.push(
          {
            Module: 'RFP - Approver',
            ModuleAr: 'الموافقة على المنافسات',
            ModuleIcon: 'mail',
            navItem: [

              {
                name: 'dashboard',
                iconName: IconList.dashboard,
                text: 'Dashboard',
                textAr: 'لوحة القيادة',
                link: 'rfp/dashboard',
              },

              {
                name: 'myinbox',
                iconName: IconList.inbox,
                text: 'My Inbox',
                textAr: 'الطلبات الواردة',
                link: 'rfp/myinbox',
              },
            ],
          },
        )
      }

      if (this.isAdmin) {
        this.addRFPAdminNavItem(this.isAdminFullAccess);
      }
    }
  }

  /**
 * Adds the Admin Nav Item to Chairman Screens
 */
  addRFPAdminNavItem(adminFullAccess?: boolean): void {

    const RFPAdminNavItem = {
      name: `RFPMaintenance`,
      iconName: IconList.tool,
      text: `RFP Maintenance`,
      textAr: `صيانة طلب تقديم العروض`,
      link: `admin/rfpMaintenance`,
      adminFullAccess: adminFullAccess
    };

    if (this.navItems[0]?.Module !== 'Admin') {
      this.navItems.splice(0, 0, {
        ModuleIcon: 'user',
        ModuleId: '03',
        Module: 'Admin',
        ModuleAr: 'مسؤل',
        navItem: [RFPAdminNavItem]
      });
    } else {
      this.navItems[0].navItem.splice(0, 0, RFPAdminNavItem);
    }
  }

  /**
   * Sets the COC menu based on the Login API.
   * 
   * @param res Response from COC login API
   * 
   * @returns void
   * 
   */
  setCOCmenu(res: any, initialLoad = false): void {
    // Remove previous COC menus
    this.navItems = this.navItems.filter(item => item.Module !== 'Certificate Of Completion');

    const roleInfo = res?.d?.results ?? res;
    const roles = Array.isArray(roleInfo) ? roleInfo : roleInfo ? [roleInfo] : [];

    // Only set true when more than one role; don’t reset it to false
    if (roles.length > 1) {
      this.enableproxy = true;
    }

    if (initialLoad) {
      // On initial API load, only use the first role
      if (roles.length > 0) this.constructCOCmenu(roles[0]);
    } else {
      // On role-change, use all roles
      roles.forEach((role: any) => this.constructCOCmenu(role));
    }
  }

  constructCOCmenu(role: any): void {
    const roleId = role.RoleId

    // TODO : Get the admin users and assign the admin nav items only to them
    // this.addAdminNavItem('COC');
    switch (roleId) {
      case 'FO': {
        this.navItems.push({
          ModuleIcon: 'dashboard',
          Module: 'Certificate Of Completion',
          ModuleAr: 'إدارة العقود',
          navItem: [{
            name: 'listofdepartment',
            iconName: 'user',
            text: 'Create',
            textAr: 'يخلق',
            link: 'coc/listofdept',
          },
          {
            name: 'projectowner',
            iconName: 'user',
            text: 'COC Action',
            textAr: 'عقودي',
            link: 'coc/OwnerDashboard',
          },
          {
            name: 'mycoc',
            iconName: 'folder',
            text: 'Certificate of Completion List',
            textAr: 'قائمة شهادات الإنجاز',
            link: 'coc/coclist',
          }]
        });
        break;
      }
      case 'SC': {
        this.navItems.push({
          ModuleIcon: 'dashboard',
          Module: 'Certificate Of Completion',
          ModuleAr: 'إدارة العقود',
          navItem: [
            {
              name: 'createses',
              iconName: 'user',
              text: 'Create SES',
              textAr: 'انشاء صحيفة ادخال الخدمة',
              external: true,
              linkAr: environment.sapCreateSesArUrl,
              linkEn: environment.sapCreateSesUrl
            }]
        });
        break;
      }

      case 'PM':
      case 'HU':
        {
          this.navItems.push({
            ModuleIcon: 'dashboard',
            Module: 'Certificate Of Completion',
            ModuleAr: 'إدارة العقود',
            navItem: [
              {
                name: 'projectowner',
                iconName: 'user',
                text: 'COC Action',
                textAr: 'عقودي',
                link: 'coc/OwnerDashboard',
              },
              {
                name: 'mycoc',
                iconName: 'folder',
                text: 'Certificate of Completion List',
                textAr: 'قائمة شهادات الإنجاز',
                link: 'coc/coclist',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'coc/signature_upload',
              }]
          });
          break;
        }
      case 'CE':
      case 'DI':
      case 'DM':
      case 'DP':
      case 'MP':
      case 'VP':
      case 'MN':
      case 'OF':
      case 'FI':
        {
          this.navItems.push({
            ModuleIcon: 'dashboard',
            Module: 'Certificate Of Completion',
            ModuleAr: 'إدارة العقود',
            navItem: [
              {
                name: 'projectowner',
                iconName: 'user',
                text: 'COC Action',
                textAr: 'عقودي',
                link: 'coc/OwnerDashboard',
              },
              {
                name: 'mycoc',
                iconName: 'folder',
                text: 'Certificate of Completion List',
                textAr: 'قائمة شهادات الإنجاز',
                link: 'coc/coclist',
              }]
          });
          break;
        }
    }
  }


  /**
   * Make an API to fetch Item count of each committee menu.
   * 
   * @param res Response of Committee Login API
   * @param username Current Logged In Username
   * 
   * @returns void
   * 
   */
  getCountData(res: any, username: any): void {
    let role = res?.d?.results.length > 0 ? res?.d?.results[0] : res;
    if (role.CommitteeId == '05') {
      let reqcomtobeapproved = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'bidstobeapproved');
      let reqcombidlist = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'bidslist');
      const reqVendorList = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'vendorlist')
      this.spinner.show();
      forkJoin([this.api.post('OCOM_BID_TO_Dash_CNT', reqcomtobeapproved),
      this.api.post("OCOM_BID_TO_Dash_CNT", reqcombidlist),
      this.api.post("OCOM_BID_TO_Dash_CNT", reqVendorList)
      ]).subscribe(([restobeappr, resplist, reqVendorListCount]) => {
        this.spinner.hide();
        this.bidsToBeApprovedCount = restobeappr;
        this.bidsListCount = resplist;
        this.vendorListCount = reqVendorListCount;
        this.setCMTmenu(res);
      });
    } else {
      let reqToBeApprovedData = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'bidstobeapproved');
      let reqFinancialData = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'bidsforfinancialoffer');
      let reqbidOpenData = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'bidstobeopen');
      let reqbidEvalData = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'bidstobeeval');
      let reqListData = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'bidslist');
      let reqfromQualData = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'bidsfromqual');
      let reqfinalApprovalData = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'bidsfinalapproval');
      let reqPendingReview = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'pendingreview');
      let reqOpeningMember = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'openingmember');
      let reqbidEvaluatedData = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'bidstobeevaluated');
      const reqBidsFromTechMem = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'bidsfromtechmem');
      const reqBidsFromTechnicalEvaluationCommittee = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'bidsFromTechnicalEvaluationCommittee');
      const reqBidsFromfinancialControllerApproval = this.getreqData(username, role.CommitteeId, role.CommitteeRole, 'financialControllerApproval');

      this.spinner.show();
      forkJoin([this.api.post("OCOM_BID_TO_ACT_COUNT", reqToBeApprovedData),
      this.api.post("OCOM_BID_LIST_GET_COUNT", reqListData),
      this.api.post("OCOM_BID_TO_ACT_COUNT", reqFinancialData),
      this.api.post("OCOM_BID_TO_ACT_COUNT", reqbidOpenData),
      this.api.post("OCOM_BID_TO_ACT_COUNT", reqbidEvalData),
      this.api.post("OCOM_BID_TO_ACT_COUNT", reqfromQualData),
      this.api.post("OCOM_BID_TO_ACT_COUNT", reqfinalApprovalData),
      this.api.post("OCOM_BID_TO_ACT_COUNT", reqPendingReview),
      this.api.post("OCOM_BID_TO_ACT_COUNT", reqOpeningMember),
      this.api.post("OCOM_BID_TO_ACT_COUNT", reqbidEvaluatedData),
      this.api.post("OCOM_BID_TO_ACT_COUNT", reqBidsFromTechMem),
      this.api.post("OCOM_BID_TO_ACT_COUNT", reqBidsFromTechnicalEvaluationCommittee),
      this.api.post("OCOM_BID_TO_ACT_COUNT", reqBidsFromfinancialControllerApproval)
      ])
        .subscribe(([restobBeApproved, resList, resFinancial, resBidOpen,
          resBidEval, resfromQual, resfinalApproval, respendingReview,
          resOpeningMember, resEvaluated, resBidsFromTechMem, reqBidsFromTechnicalEvaluationCommitteeCount,
          reqBidsFromfinancialControllerApprovalCount]) => {
          this.spinner.hide();
          this.bidsToBeApprovedCount = restobBeApproved;
          this.bidsListCount = resList;
          this.bidsFinancialOfferCount = resFinancial;
          this.bidsToBeOpenedCount = resBidOpen;
          this.bidsToBeEvaluated = resBidEval;
          this.bidsfromQualCount = resfromQual;
          this.bidsfinalApprovalCount = resfinalApproval;
          this.pendingReviewCount = respendingReview;
          this.openingMemberCount = resOpeningMember;
          this.bidsToBeEvaluatedData = resEvaluated;
          this.bidsFromTechMem = resBidsFromTechMem;
          this.bidsFromTechnicalEvalCount = reqBidsFromTechnicalEvaluationCommitteeCount;
          this.bidsFromfinancialControllerApprovalCount = reqBidsFromfinancialControllerApprovalCount;
          this.setCMTmenu(res);
          // make your last http request here.
        });
    }
  }

  /**
   * Open and close Multiple Role Model.
   * 
   * ```ts
   * this.openMdl = !this.openMdl;
   * ```
   * 
   * @returns void
   */
  openUsrMdl(): void {
    this.openMdl = !this.openMdl;
  }

  /**
   * On OK clicked on Model
   * @returns void
   */
  okOnbehalf(): void {
    this.navItems = this.navItems.filter(function (item) {
      if (item.ModuleId !== "01" && item.ModuleId !== "02" && item.ModuleId !== "03"
        && item.ModuleId !== "04" && item.ModuleId !== "05" && item.ModuleId !== "06" && item.Module !== 'CONTRACT' && item.Module !== 'Certificate Of Completion') {
        return item
      }
    });
    this.openMdl = false;
    this.getCountData(this.roleForm.get('committeeRole')?.value, this.ProxyUserId.toUpperCase());
    localStorage.setItem('ContractDep', btoa(this.roleForm.get('contractRole')?.value.RoleId));
    this.setContractMenu(this.roleForm.get('contractRole')?.value.RoleId);

    const cocRole = this.roleForm.get('cocRole')?.value;
    localStorage.setItem('CocDep', btoa(cocRole.RoleId));

    // Use all roles for role-change
    this.setCOCmenu(cocRole, false);
  }

  /**
   * Sets the Committee menu based on the API response 
   * 
   * @param {any} res Response of Committee Login API response
   * 
   * @returns void
   * 
   * @beta API Response structure `res?.d?.results`
   * 
   * Multi role selection structure `res`
   * 
   * Below Logic determains the Committe Menu :
   * ```ts
   * const roleInfo = res?.d?.results ?? res;
   * ```
   * 
   */
  setCMTmenu(res: any): void {
    this.spinner.hide();
    const roleInfo = res?.d?.results ?? res;

    if (roleInfo.length > 1) {
      this.enableproxy = true;
      roleInfo.forEach((role: any) => {
        this.constructCommitteeMenu(role);
      });
    } else if (roleInfo.length === 1) {
      this.constructCommitteeMenu(roleInfo[0]);
    }
    else {
      this.constructCommitteeMenu(roleInfo);
    }
  }

  /**
   * Constructs Committee menu based on Committee ID and Role
   * 
   * @param role : Role of the current user
   * 
   * @returns void
   */
  constructCommitteeMenu(role: any): void {
    // global if
    if (
      role.CommitteeId === this.roleForm.get('committeeRole')?.value.CommitteeId &&
      role.CommitteeRole === this.roleForm.get('committeeRole')?.value.CommitteeRole
    ) {
      localStorage.setItem('CommitteeName', role.CommitteeName);
      localStorage.setItem('LogdInUsrID', role.LogdInUsrID);
      localStorage.setItem('CMTID', role.CommitteeId);

      this.role = role.CommitteeRole
      if (role.CommitteeId === '01') {
        localStorage.setItem('ROLEOP', role.CommitteeRole);

        if (this.role === 'PO') {
          this.navItems.push({
            ModuleIcon: 'dashboard',
            Module: 'Bid Opening Committee',
            ModuleId: '01',
            ModuleAr: 'لجنة فتح العروض ',
            navItem: [
              {
                name: 'bidopeningform',
                iconName: IconList.listcheck,
                text: 'Bid opening Form',
                textAr: 'نموذج فتح العروض',
                link: 'committee/Bid_Create',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: '(' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
            ],
          });
        }
        if (this.role === 'CH') {
          this.addAdminNavItem('COMM'); // ? Admin access for Chairman
          this.navItems.push({
            ModuleIcon: 'dashboard',
            Module: 'Bid Opening Committee',
            ModuleId: '01',
            ModuleAr: 'لجنة فتح العروض ',
            navItem: [
              {
                name: 'bidstobeopen',
                iconName: IconList.folderopen,
                text: 'Bids to be Opened (' + this.bidsToBeOpenedCount + ')',
                textAr: ' (' + this.bidsToBeOpenedCount + ') ' + 'منافسات للفتح',
                link: 'committee/bo_chair_dashboard',
              },
              {
                name: 'bidsforfinancialoffer',
                iconName: IconList.percentagehand,
                text: 'Bids for financial offer (' + this.bidsFinancialOfferCount + ')',
                textAr: ' (' + this.bidsFinancialOfferCount + ') ' + 'منافسات لفتح العرض المالي',
                link: 'committee/bids_financial_offer',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
              {
                name: 'bidtobeapproved',
                iconName: IconList.starcheck,
                text: 'Bids to be approved (' + this.bidsToBeApprovedCount + ')',
                textAr: ' (' + this.bidsToBeApprovedCount + ') ' + 'منافسات للاعتماد و الاحالة للجنة الفحص',
                link: 'committee/bids_to_be_approved',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              }
            ],
          });

        } else if (this.role === 'OF') {

          this.navItems.push({
            ModuleIcon: 'dashboard',
            ModuleId: '01',
            Module: 'Bid Opening Committee',
            ModuleAr: 'لجنة فتح العروض ',
            navItem: [
              {
                name: 'bidstobeopen',
                iconName: IconList.folderopen,
                text: 'Bids to be Opened (' + this.bidsToBeOpenedCount + ')',
                textAr: ' (' + this.bidsToBeOpenedCount + ') ' + 'منافسات للفتح',
                link: 'committee/bo_officer_dashboard',
              },
              {
                name: 'bidsforfinancialoffer',
                iconName: 'money-collect',
                text: 'Bids for financial officer (' + this.bidsFinancialOfferCount + ')',
                textAr: ' (' + this.bidsFinancialOfferCount + ') ' + 'منافسات لفتح العرض المالي',
                link: 'committee/Bid_tobe_Financial_Offer',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
              // {
              //   name: 'pendingreview',
              //   iconName: IconList.formpending,
              //   text: 'Pending review (' + this.pendingReviewCount + ')',
              //   textAr: ' (' + this.pendingReviewCount + ') ' + 'في انتظار المراجعة',
              //   link: 'committee/Bid_Pending_Review',
              // },
            ],
          });
        } else if (this.role === 'MR') {
          this.navItems.push({
            ModuleIcon: 'dashboard',
            ModuleId: '01',
            Module: 'Bid Opening Committee',
            ModuleAr: 'لجنة فتح العروض ',
            navItem: [
              {
                name: 'bidswithbidopeningmember',
                iconName: 'form',
                text: 'Opening member (' + this.openingMemberCount + ')',
                textAr: ' (' + this.openingMemberCount + ') ' + 'منافسات للفتح',
                link: 'committee/bo_member_dashboard',
              },
              {
                name: 'bidsforfinancialoffer',
                iconName: IconList.percentagehand,
                text: 'Bids for financial offer (' + this.bidsFinancialOfferCount + ')',
                textAr: ' (' + this.bidsFinancialOfferCount + ') ' + 'منافسات لفتح العرض المالي',
                link: 'committee/bids_financial_offer_member',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              },
            ],
          });
        }
      }
      // * Bid evaluation committee Nav Items
      else if (role.CommitteeId === '02') {
        localStorage.setItem('ROLEEV', role.CommitteeRole);
        if (this.role === "CH") {
          this.addAdminNavItem('COMM'); // ? Admin access for Chairman
          this.navItems.push({
            ModuleIcon: 'dashboard',
            ModuleId: '02',
            Module: 'Bid Evaluation Committee',
            ModuleAr: 'لجنة فحص العروض',
            navItem: [
              {
                name: 'bidstobeevaluated',
                iconName: 'folder-open',
                text: 'Bids to be Evaluated (' + this.bidsToBeEvaluated + ')',
                textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للفحص',
                link: 'committee/be_chair_dashboard/bids_to_be_open',
              },

              {
                name: 'bidsforfinancialoffer',
                iconName: 'money-collect',
                text: 'Bids for financial offer (' + this.bidsFinancialOfferCount + ')',
                textAr: ' (' + this.bidsFinancialOfferCount + ') ' + 'منافسات لوضع العروض المالية ',
                link: 'committee/be_chair_dashboard/bids_financial_offer',
              },
              {
                name: 'bidsFromTechnicalEvaluationCommittee',
                iconName: IconList.starcheck,
                text: 'Bids From Technical Evaluation (' + this.bidsFromTechnicalEvalCount + ')',
                textAr: ' (' + this.bidsFromTechnicalEvalCount + ') ' + 'موافقة المراقب المالي',
                link: 'committee/be_chair_dashboard/bids_from_technical_evaluation',
              },
              {
                name: 'bidtobeapproved',
                iconName: IconList.starcheck,
                text: 'Bids to be approved (' + this.bidsToBeApprovedCount + ')',
                textAr: ' (' + this.bidsToBeApprovedCount + ') ' + 'منافسات للاعتماد و الاحاله للجنه الفتح او التأهيل',
                link: 'committee/be_chair_dashboard/bids_to_be_approved',
              },
              {
                name: 'financialControllerApproval',
                iconName: IconList.starcheck,
                text: 'External Signature Pending (' + this.bidsFromfinancialControllerApprovalCount + ')',
                textAr: ' (' + this.bidsFromfinancialControllerApprovalCount + ') ' + 'معتمد من رئيس اللجنة و ارسل الي العضوين الخارجيين',
                link: 'committee/be_chair_dashboard/financial_controller_approval',
              },
              {
                name: 'fromqualificationCommittee',
                iconName: 'container',
                text: 'From Qualification (' + this.bidsfromQualCount + ')',
                textAr: ' (' + this.bidsfromQualCount + ') ' + 'من لجنة التأهيل',
                link: 'committee/be_chair_dashboard/from_qualification_committee',
              },
              {
                name: 'finalapproval',
                iconName: 'check-square',
                text: 'Final Approval (' + this.bidsfinalApprovalCount + ')',
                textAr: ' (' + this.bidsfinalApprovalCount + ') ' + 'اعتماد محضر لجنة الفحص',
                link: 'committee/be_chair_dashboard/bids_final_approval',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              }

            ],
          });

        }
        else if (this.role === "OF") {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '02',
            Module: 'Bid Evaluation Committee',
            ModuleAr: 'لجنة فحص العروض',
            navItem: [
              {
                name: 'bidstobeevaluated',
                iconName: 'folder-open',
                text: 'Bids to be Evaluated (' + this.bidsToBeEvaluated + ')',
                textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للفحص',
                link: 'committee/be_chair_dashboard/bids_to_be_open',
              },
              {
                name: 'bidsforfinancialoffer',
                iconName: IconList.percentagehand,
                text: 'Bids for financial offer (' + this.bidsFinancialOfferCount + ')',
                textAr: ' (' + this.bidsFinancialOfferCount + ') ' + 'منافسات لوضع العروض المالية ',
                link: 'committee/be_chair_dashboard/bids_financial_offer',
              },

              // {
              //   name: 'Bids with Members',
              //   iconName: 'bars',
              //   text: 'Bids with Members',
              //   textAr: 'من عضو التقييم',
              //   link: 'committee/be_chair_dashboard/bids_with_eval_committee',
              // },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
              {
                name: 'bidsFromTechnicalEvaluationCommittee',
                iconName: IconList.starcheck,
                text: 'Bids From Technical Evaluation (' + this.bidsFromTechnicalEvalCount + ')',
                textAr: ' (' + this.bidsFromTechnicalEvalCount + ') ' + 'موافقة المراقب المالي',
                link: 'committee/be_chair_dashboard/bids_from_technical_evaluation',
              },
              {
                name: 'fromqualificationCommittee',
                iconName: 'container',
                text: 'From Qualification (' + this.bidsfromQualCount + ')',
                textAr: ' (' + this.bidsfromQualCount + ') ' + 'من لجنة التأهيل',
                link: 'committee/be_chair_dashboard/from_qualification_committee',
              },
              // {
              //   name: 'finalapproval',
              //   iconName: 'check',
              //   text: 'Final Approval (' + this.bidsfinalApprovalCount + ')',
              //   textAr: ' (' + this.bidsfinalApprovalCount + ') ' + 'الاعتماد النهائي',
              //   link: 'committee/be_chair_dashboard/bids_final_approval',
              // },
              // {
              //   name: 'bidstobeapproved',
              //   iconName: 'check',
              //   text: 'Bids to be approved',
              //   textAr: 'منافسات للاعتماد',
              //   link: 'committee/be_chair_dashboard/bids_to_be_approved',
              // }
            ],
          });
        }
        else if (this.role === "LM") {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '02',
            Module: 'Bid Evaluation Committee',
            ModuleAr: 'لجنة فحص العروض',
            navItem: [
              {
                name: 'bidstobeevaluated',
                iconName: 'bars',
                text: 'Bids to be Evaluated (' + this.bidsToBeEvaluated + ')',
                textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للفحص',
                link: 'committee/be_chair_dashboard/bids_with_eval_committee',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              },
            ],
          });
        }
        else if (this.role === 'PM') {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '02',
            Module: 'Bid Evaluation Committee',
            ModuleAr: 'لجنة فحص العروض',
            navItem: [
              {
                name: 'bidsfromfinancialmember',
                iconName: 'money-collect',
                text: 'Bids from financial member (' + this.bidsFinancialOfferCount + ')',
                textAr: ' (' + this.bidsFinancialOfferCount + ') ' + 'منافسات مرسلة من العضو المالي',
                link: 'committee/be_chair_dashboard/bids_from_financial',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              },
            ],
          });
        }
        else if (this.role === "FM") {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '02',
            Module: 'Bid Evaluation Committee',
            ModuleAr: 'لجنة فحص العروض',
            navItem: [
              {
                name: 'bidstobeeval',
                iconName: 'bars',
                text: 'Bids to be Evaluated (' + this.bidsToBeEvaluated + ')',
                textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للفحص',
                link: 'committee/be_chair_dashboard/bids_with_eval_committee',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              }
            ],
          });
        }
        else if (this.role === "MM") {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '02',
            Module: 'Bid Evaluation Committee',
            ModuleAr: 'لجنة فحص العروض',
            navItem: [
              {
                name: 'bidstobeeval',
                iconName: 'bars',
                text: 'Bids to be Evaluated (' + this.bidsToBeEvaluated + ')',
                textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للفحص',
                link: 'committee/be_chair_dashboard/bids_to_eval_MEAW',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              },
            ],
          });
        }
      }
      // * Qualification committee Nav Items
      else if (role.CommitteeId === '03') {
        localStorage.setItem('ROLEQP', role.CommitteeRole);
        if (this.role === "CH") {
          this.addAdminNavItem('COMM'); // ? Admin access for Chairman
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '03',
            Module: 'Qualification Committee',
            ModuleAr: 'لجنة التأهيل',
            navItem: [
              {
                name: 'bidstobeevaluated',
                iconName: 'bars',
                text: 'Bids to be Qualified (' + this.bidsToBeEvaluated + ')',
                textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للتأهيل',
                link: 'committee/bq_chair_dashboard/bid_to_evaluate',
              },
              {
                name: 'bidtobeapproved',
                iconName: 'check',
                text: 'Pending for Approval (' + this.bidsToBeApprovedCount + ')',
                textAr: ' (' + this.bidsToBeApprovedCount + ') ' + 'بانتظار الاعتماد',
                link: 'committee/bq_chair_dashboard/pending_approval',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bid List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              }
            ],
          });

        } else if (this.role === "OF") {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '03',
            Module: 'Qualification Committee',
            ModuleAr: 'لجنة التأهيل',
            navItem: [
              {
                name: 'bidstobeevaluated',
                iconName: 'bars',
                text: 'Bids to be Qualified (' + this.bidsToBeEvaluated + ')',
                textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للتأهيل',
                link: 'committee/bq_chair_dashboard/bid_to_evaluate',
              },
              // {
              //   name: 'bidtobeapproved',
              //   iconName: 'check',
              //   text: 'Pending for Approval (' + this.bidsToBeApprovedCount + ')',
              //   textAr: ' (' + this.bidsToBeApprovedCount + ') ' + 'بانتظار الاعتماد',
              //   link: 'committee/bq_chair_dashboard/pending_approval',
              // },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bid List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
            ],
          });
        } else if (this.role === "PM" || this.role === "FM" || this.role === "MR") {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '03',
            Module: 'Qualification Committee',
            ModuleAr: 'لجنة التأهيل',
            navItem: [
              {
                name: 'bidtobeapproved',
                iconName: 'check',
                text: 'Pending for Approval (' + this.bidsToBeApprovedCount + ')',
                textAr: ' (' + this.bidsToBeApprovedCount + ') ' + 'بانتظار الاعتماد',
                link: 'committee/bq_chair_dashboard/pending_approval',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bid List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              },
            ],
          });
        }
      }
      // * DP evaluation committee Nav Items
      else if (role.CommitteeId === '04') {
        localStorage.setItem('ROLEDP', role.CommitteeRole);
        if (this.role === "CH") {
          this.addAdminNavItem('COMM'); // ? Admin access for Chairman
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '04',
            Module: 'Direct Purchase Evaluation',
            ModuleAr: 'لجنة تقييم الشراء المباشر',
            navItem: [
              {
                name: 'bidstobeopen',
                iconName: IconList.folderopen,
                text: 'Bids to be Opened (' + this.bidsToBeOpenedCount + ')',
                textAr: ' (' + this.bidsToBeOpenedCount + ') ' + 'منافسات للفتح',
                link: 'committee/dp-evaluation/bids-to-be-opened',
              },
              {
                name: 'bidstobeeval',
                iconName: 'bars',
                text: 'Bids to be Evaluated(' + this.bidsToBeEvaluated + ')',
                textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للفحص',
                link: 'committee/dp-evaluation/bids-to-be-evaluated',
              },
              {
                name: 'bidtobeapproved',
                iconName: 'check',
                text: 'Bids for Approval (' + this.bidsToBeApprovedCount + ')',
                textAr: ' (' + this.bidsToBeApprovedCount + ') ' + 'منافسات للاعتماد',
                link: 'committee/dp-evaluation/bids-to-be-approved',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bid List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات ',
                link: 'committee/dp_dashboard/bid_list',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              },
            ],
          });
        } else if (this.role === "OF") {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '04',
            Module: 'Direct Purchase Evaluation',
            ModuleAr: 'لجنة تقييم الشراء المباشر',
            navItem: [
              {
                name: 'bidstobeopen',
                iconName: IconList.folderopen,
                text: 'Bids to be Opened (' + this.bidsToBeOpenedCount + ')',
                textAr: ' (' + this.bidsToBeOpenedCount + ') ' + 'منافسات للفتح',
                link: 'committee/dp-evaluation/bids-to-be-opened',
              },
              {
                name: 'bidstobeeval',
                iconName: 'bars',
                text: 'Bids to be Evaluated (' + this.bidsToBeEvaluated + ')',
                textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للفحص',
                link: 'committee/dp-evaluation/bids-to-be-evaluated',
              },
              {
                name: 'bidtobeapproved',
                iconName: 'check',
                text: 'Bids for Approval (' + this.bidsToBeApprovedCount + ')',
                textAr: ' (' + this.bidsToBeApprovedCount + ') ' + 'منافسات للاعتماد',
                link: 'committee/dp-evaluation/bids-to-be-approved',
              },
              {
                name: 'finalapproval',
                iconName: 'check-square',
                text: 'Final Approval (' + this.bidsfinalApprovalCount + ')',
                textAr: ' (' + this.bidsfinalApprovalCount + ') ' + 'اعتماد محضر لجنة الفحص',
                link: 'committee/dp-evaluation/final-approval',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bid List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات ',
                link: 'committee/dp_dashboard/bid_list',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              },
            ],
          });
        } else if (this.role === "MR") {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '04',
            Module: 'Direct Purchase Evaluation',
            ModuleAr: 'لجنة تقييم الشراء المباشر',
            navItem: [
              {
                name: 'bidstobeeval',
                iconName: 'bars',
                text: 'Bids to be Evaluated (' + this.bidsToBeEvaluated + ')',
                textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للفحص',
                link: 'committee/dp-evaluation/bids-to-be-evaluated',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bid List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات ',
                link: 'committee/dp_dashboard/bid_list',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              },
            ],
          });
        } else if (this.role === "LM" || this.role === "TM" || this.role === "FM" || this.role === "PM") {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '04',
            Module: 'Direct Purchase Evaluation',
            ModuleAr: 'لجنة تقييم الشراء المباشر',
            navItem: [
              {
                name: 'bidstobeeval',
                iconName: 'bars',
                text: 'Bids to be Evaluated (' + this.bidsToBeEvaluated + ')',
                textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للفحص',
                link: 'committee/dp-evaluation/bids-to-be-opened',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },

              {
                name: 'bidtobeapproved',
                iconName: 'check',
                text: 'Bids for Approval (' + this.bidsToBeApprovedCount + ')',
                textAr: ' (' + this.bidsToBeApprovedCount + ') ' + 'منافسات للاعتماد',
                link: 'committee/dp-evaluation/bids-to-be-approved',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              },
            ],
          });
        }
      }
      // ceo dashboards
      else if (role.CommitteeId === '05') {
        localStorage.setItem('ROLEMG', role.CommitteeRole);
        if (this.role === "CO" || this.role === "PR" || this.role === "PU") {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '05',
            Module: 'COMMITTEE',
            ModuleAr: 'الموافقة علي المنافسات',
            navItem: [
              {
                name: 'bidstobeapproved',
                iconName: 'user',
                text: 'Bids for Approval (' + this.bidsToBeApprovedCount + ')',
                textAr: ' (' + this.bidsToBeApprovedCount + ') ' + 'منافسات للاعتماد',
                link: 'committee/finalapproval',
              },
              {
                name: 'bidslist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },
              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              },
            ],
          });
        }
        else if (this.role === "VP") {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '05',
            Module: 'COMMITTEE',
            ModuleAr: 'نائب الرئيس التنفيذي',
            navItem: [
              {
                name: 'bidtobeapproved',
                iconName: 'user',
                text: 'Bids for Approval (' + this.bidsToBeApprovedCount + ')',
                textAr: ' (' + this.bidsToBeApprovedCount + ') ' + 'منافسات للاعتماد',
                link: 'committee/finalapproval',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },

              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              },
            ],
          });
        }
        else if (this.role === "SS") {

          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '05',
            Module: 'COMMITTEE',
            ModuleAr: 'مدير الإدارة',
            navItem: [
              {
                name: 'bidtobeapproved',
                iconName: 'user',
                text: 'Bids for Approval (' + this.bidsToBeApprovedCount + ')',
                textAr: ' (' + this.bidsToBeApprovedCount + ') ' + 'منافسات للاعتماد',
                link: 'committee/finalapproval',
              },
              {
                name: 'bidlist',
                iconName: IconList.listnote,
                text: 'Bids List (' + this.bidsListCount + ')',
                textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
                link: 'committee/BidList',
              },

              {
                name: 'SignatureUpload',
                iconName: 'upload',
                text: 'Signature Upload',
                textAr: 'تحميل التوقيع',
                link: 'committee/signature_upload',
              },
            ],
          });
        }
        else if (this.role === 'FO') {
          this.navItems.push({
            ModuleIcon: 'user',
            ModuleId: '05',
            Module: 'COMMITTEE',
            ModuleAr: 'الرئيس التنفيذي',
            navItem: [
              {
                name: 'vendorlist',
                iconName: 'user',
                text: 'Vendor List (' + this.vendorListCount + ')',
                textAr: ' (' + this.vendorListCount + ') ' + 'قائمة البائعين',
                link: 'committee/vendor/vendor-list',
              },
            ]
          })
        }
      }
      // * Technical Evaluation Committee
      else if (role.CommitteeId === '06') {
        localStorage.setItem('ROLETE', role.CommitteeRole);
        let navItem: any[] = [];
        if (this.role === 'CH') {
          this.addAdminNavItem('COMM'); // ? Admin access for Chairman
          navItem.push(
            {
              name: 'techbidstobeevaluated',
              iconName: 'bars',
              text: 'Bids to be Evaluated (' + this.bidsToBeEvaluated + ')',
              textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للتحليل الفني',
              link: 'committee/technical-evaluation/bids-to-be-evaluated',
            },
            {
              name: 'bidsfromtechmem',
              iconName: 'laptop',
              text: 'Bids From Technical Members (' + this.bidsFromTechMem + ')',
              textAr: ' (' + this.bidsFromTechMem + ') ' + 'نتائج التحليل الفني المرسله من الأعضاء',
              link: 'committee/technical-evaluation/bids-from-tech-members',
            }
          )
        } else if (this.role === 'TM') {
          navItem.push(
            {
              name: 'techbidstobeevaluated',
              iconName: 'bars',
              text: 'Bids to be Evaluated (' + this.bidsToBeEvaluated + ')',
              textAr: ' (' + this.bidsToBeEvaluated + ') ' + 'منافسات للتحليل الفني',
              link: 'committee/technical-evaluation/bids-to-be-evaluated',
            }
          )
        }
        navItem.push(
          {
            name: 'bidlist',
            iconName: IconList.listnote,
            text: 'Bids List (' + this.bidsListCount + ')',
            textAr: ' (' + this.bidsListCount + ') ' + 'قائمة المنافسات',
            link: 'committee/BidList',
          },
          {
            name: 'SignatureUpload',
            iconName: 'upload',
            text: 'Signature Upload',
            textAr: 'تحميل التوقيع',
            link: 'committee/signature_upload',
          }
        );

        this.navItems.push({
          ModuleIcon: 'user',
          ModuleId: '06',
          Module: 'Technical Evaluation Committee',
          ModuleAr: 'لجنة التقييم الفني',
          navItem: navItem
        })
      }

    }
  }

  /**
   * Adds the Admin Nav Item to Chairman Screens
   */
  addCommitteeAdminNavItem(): void {

    const committeeAdminNavItems = [
      {
        name: 'Delgation',
        iconName: 'user',
        text: 'Delegation',
        textAr: 'وفد',
        link: 'admin/delegation',
      },
      {
        name: 'MemberMaintenance',
        iconName: IconList.tool,
        text: 'Committee Member Maintenance',
        textAr: 'Committee Member Maintenance',
        link: 'admin/committeeMemberMaintenance',
        adminFullAccess: this.isAdminFullAccess
      },
      {
        name: 'SLA',
        iconName: 'audit',
        text: 'SLA',
        textAr: 'وفد',
        link: 'admin/sla',
      }
    ];

    if (this.navItems[0]?.Module !== 'Admin') {
      this.navItems.splice(0, 0, {
        ModuleIcon: 'user',
        ModuleId: '03',
        Module: 'Admin',
        ModuleAr: 'مسؤل',
        navItem: committeeAdminNavItems
      });
    } else {
      this.navItems[0]?.navItem.push(...committeeAdminNavItems);
    }
  }


  /**
   * Constructs and returns payload for Count API
   * 
   * Check the above methode for its usage {@linkcode AppComponent.getCountData}
   * 
   * @param username 
   * @param committeeId
   * @param committeeRole 
   * @param navItemId Menu Item Code
   * 
   * @returns {Object} Payload Object for Committe Count API
   */
  getreqData(username: string, committeeId: string, committeeRole: string, navItemId: string): any | null {
    let reqData = {
      "UserName": username,
      "CommitteeId": committeeId,
      "CommitteeRole": committeeRole,
      "CommitteeAction": ""
    };
    if (navItemId == 'bidslist') {
      return { "UserName": username, CommitteeAction: 'BLST' };
    }
    if (committeeId == '01') {
      if (navItemId == 'bidstobeopen') {
        reqData.CommitteeAction = "BOPN";
      } else if (navItemId == 'bidstobeeval') {
        reqData.CommitteeAction = "BOPN";
      } else if (navItemId == 'bidstobeapproved') {
        reqData.CommitteeAction = "BAPR";
      } else if (navItemId == 'bidsforfinancialoffer') {
        reqData.CommitteeAction = "BFNC";
      } else if (navItemId == 'pendingreview') {
        reqData.CommitteeAction = "BPRV";
      } else if (navItemId == 'openingmember') {
        reqData.CommitteeAction = "BOMR";
      }
    } else if (committeeId == '02') {
      if (committeeRole == 'FM') {
        if (navItemId == 'bidstobeeval') {
          reqData.CommitteeAction = "BEMR";
        } else if (navItemId == 'bidsforfinancialoffer') {
          reqData.CommitteeAction = "BOFR";
        } else if (navItemId == 'bidstobeapproved') {
          reqData.CommitteeAction = "BFAP";
        }
      }
      if (committeeRole == 'CH' || committeeRole == 'OF' || committeeRole === 'PM') {
        if (navItemId == 'bidstobeopen') {
          reqData.CommitteeAction = "BOPN";
        } else if (navItemId == 'bidstobeeval') {
          reqData.CommitteeAction = "BOPN";
        } else if (navItemId == 'bidstobeapproved') {
          if (committeeRole === 'PM') {
            reqData.CommitteeAction = "BFAP";
          } else {
            reqData.CommitteeAction = "BAPR";
          }

        } else if (navItemId == 'bidsforfinancialoffer' && committeeRole != 'PM') {
          reqData.CommitteeAction = "BOFR";
        } else if (navItemId == 'bidsfromqual') {
          reqData.CommitteeAction = "BFQC";
        } else if (navItemId == 'bidsfinalapproval') {
          reqData.CommitteeAction = "BFAP";
        } else if (navItemId == 'bidstobeevaluated') {
          reqData.CommitteeAction = "BEMR";
        }
        else if (navItemId == 'bidsforfinancialoffer') {
          reqData.CommitteeAction = "BEFM";
        } else if (navItemId == 'bidsFromTechnicalEvaluationCommittee') {
          reqData.CommitteeAction = 'BFTC';
        }
        else if (navItemId == 'financialControllerApproval') {
          reqData.CommitteeAction = 'BPFC';
        }
      } else if (committeeRole == 'LM' || committeeRole == 'TM' || committeeRole == 'PM' || committeeRole == 'RM') {
        if (navItemId == 'bidstobeeval') {
          reqData.CommitteeAction = "BEMR";
        } else if (navItemId == 'bidstobeapproved') {
          reqData.CommitteeAction = "BFAP";
        } else if (navItemId == 'bidsforfinancialoffer') {
          reqData.CommitteeAction = "BOFR";
        }
      }
    } else if (committeeId == '03') {
      if (committeeRole == 'CH' || committeeRole == 'OF' || committeeRole == 'PM' || committeeRole == 'FM' || committeeRole == 'MR') {
        if (navItemId == 'bidstobeopen') {
          reqData.CommitteeAction = "BOPN";
        } else if (navItemId == 'bidstobeeval') {
          reqData.CommitteeAction = "BTEV";
        } else if (navItemId == 'bidstobeapproved') {
          reqData.CommitteeAction = "QAPR";
        } else if (navItemId == 'bidsforfinancialoffer') {
          reqData.CommitteeAction = "BFNC";
        }
      }
    } else if (committeeId == '04') {
      if (committeeRole == 'CH' || committeeRole == 'PM' || committeeRole == 'FM') {
        if (navItemId == 'bidstobeopen') {
          reqData.CommitteeAction = "BOPN";
        } else if (navItemId == 'bidstobeeval') {
          reqData.CommitteeAction = "BEMR";
        } else if (navItemId == 'bidstobeapproved') {
          reqData.CommitteeAction = "BAPR";
        } else if (navItemId == 'bidsforfinancialoffer') {
          reqData.CommitteeAction = "BFNC";
        } else if (navItemId == 'bidsfinalapproval') {
          reqData.CommitteeAction = "BFAP";
        } else if (navItemId === `bidsfromqual`) {
          reqData.CommitteeAction = "BFQC";
        }
      } else if (committeeRole == 'LM' || committeeRole == 'TM') {
        if (navItemId == 'bidstobeeval') {
          reqData.CommitteeAction = "BEMR";
        } else if (navItemId == 'bidstobeapproved') {
          reqData.CommitteeAction = "BFAP";
        }
      } else if (committeeRole == 'OF' || committeeRole === 'MR') {
        if (navItemId == 'bidstobeopen') {
          reqData.CommitteeAction = "BOPN";
        } else if (navItemId == 'bidstobeeval') {
          reqData.CommitteeAction = "BEMR";
        } else if (navItemId == 'bidstobeapproved') {
          reqData.CommitteeAction = "BFAP";
        } else if (navItemId === `bidsfromqual`) {
          reqData.CommitteeAction = "BFQC";
        } else if (navItemId === 'bidsfinalapproval') {
          reqData.CommitteeAction = "BFAP"
        }
      }
    } else if (committeeId == '05') {
      if (committeeRole == 'CO' || committeeRole == 'VP' || committeeRole == 'SS' || committeeRole == 'PR' || committeeRole == 'PU') {
        if (navItemId == 'bidstobeapproved') {
          reqData.CommitteeAction = "BFAP";
        }
      } else if (committeeRole === 'FO') {
        if (navItemId === 'vendorlist') {
          reqData.CommitteeAction = 'VNDT';
        }
      }
    }
    // * Technical Evaluation Committee
    else if (committeeId === '06') {
      if (navItemId === 'bidstobeeval') {
        reqData.CommitteeAction = 'BTTE'
      } else if (navItemId === 'bidsfromtechmem') {
        reqData.CommitteeAction = 'BFTM'
      }
    }
    return reqData;
  }

  /**
   * Consturcts the Contract Menu based on the Login API response
   * 
   * @param role Role of the current User
   * 
   * @returns void
   */
  setContractMenu(role: string): void {

    if (role === 'CH') {
      this.navItems.push({
        ModuleIcon: 'dashboard',
        Module: 'CONTRACT',
        ModuleAr: 'عقد',
        navItem: [
          {
            name: 'request for contract preparation',
            iconName: IconList.ContractPrep,
            text: 'Request for Contract Preparation',
            textAr: 'طلب إعداد العقد',
            link: '/contract/dashboard/prep',
          },
          {
            name: 'contract for approval',
            iconName: IconList.ContractApprove,
            text: 'Contract for Approval',
            textAr: 'عقود للموافقة',
            link: '/contract/dashboard/approve',
          },
          {
            name: 'contract list',
            iconName: IconList.ContractList,
            text: 'Contract List',
            textAr: 'قائمة العقود',
            link: '/contract/ContractList',
          },
          {
            name: 'SignatureUpload',
            iconName: 'upload',
            text: 'Signature Upload',
            textAr: 'تحميل التوقيع',
            link: '/contract/signature_upload',
          },
        ],
      });
    } else if (role === 'CO') {
      this.navItems.push({
        ModuleIcon: 'dashboard',
        Module: 'CONTRACT',
        ModuleAr: 'عقد',
        navItem: [
          {
            name: 'list of contract to be created',
            iconName: IconList.ContractCreation,
            text: 'List of Contract to be Created',
            textAr: 'قائمة العقود المراد إنشاؤها',
            link: '/contract/officerDashboard/ContCrt',
          },
          // {
          //   name: 'rmi',
          //   iconName: 'file-add',
          //   text: 'RMI',
          //   textAr: 'طلب مزيد من المعلومات',
          //   link: '/contract/officerDashboard/rmi',
          // },
          {
            name: 'retrun from rmi',
            iconName: IconList.RMIReturn,
            text: 'Return from RMI',
            textAr: 'العودة من طلب الحصول على مزيد من المعلومات',
            link: '/contract/officerDashboard/rmi',
          },
          {
            name: 'return from approval',
            iconName: IconList.ContractList,
            text: 'Return from Approval',
            textAr: 'العودة من الموافقة',
            link: '/contract/officerDashboard/returnFromApproval',
          },
          {
            name: 'contract list',
            iconName: IconList.ContractList,
            text: 'Contract List',
            textAr: 'قائمة العقود',
            link: '/contract/ContractList',
          }
        ],
      });
    } else if (role === 'LM') {
      this.navItems.push({
        ModuleIcon: 'dashboard',
        Module: 'CONTRACT',
        ModuleAr: 'عقد',
        navItem: [
          {
            name: 'contract for assignment',
            iconName: 'user-add',
            text: 'Contract for Assignment',
            textAr: 'عقود للتعيين',
            link: '/contract/legalManagerDashboard/Assign',
          },
          {
            name: 'contract for apporval',
            iconName: 'file-done',
            text: 'Contract for Apporval',
            textAr: 'عقود للموافقة',
            link: '/contract/legalManagerDashboard/Approve',
          },
          {
            name: 'contract list',
            iconName: 'unordered-list',
            text: 'Contract List',
            textAr: 'قائمة العقود',
            link: '/contract/ContractList',
          }
        ],
      });
    } else if (role === 'LH') {
      this.navItems.push({
        ModuleIcon: 'dashboard',
        Module: 'CONTRACT',
        ModuleAr: 'عقد',
        navItem: [
          {
            name: 'contract for assignment',
            iconName: 'user-add',
            text: 'Contract for Assignment',
            textAr: 'عقود للتعيين',
            link: '/contract/legalHeadDashboard/assign',
          },
          {
            name: 'contract for apporval',
            iconName: 'file-done',
            text: 'Contract for Apporval',
            textAr: 'عقود للموافقة',
            link: '/contract/legalHeadDashboard/approve',
          },
          {
            name: 'contract list',
            iconName: 'unordered-list',
            text: 'Contract List',
            textAr: 'قائمة العقود',
            link: '/contract/ContractList',
          }
        ],
      });
    } else if (role === 'LO') {
      this.navItems.push({
        ModuleIcon: 'dashboard',
        Module: 'CONTRACT',
        ModuleAr: 'عقد',
        navItem: [
          {
            name: 'request for contract preparation',
            iconName: 'form',
            text: 'Request for Contract Preparation',
            textAr: 'طلب إعداد العقد',
            link: '/contract/legalOfficerDashboard/ContPrep',
          },
          {
            name: 'retrun from rmi',
            iconName: 'file-add',
            text: 'Return from RMI',
            textAr: 'العودة من طلب الحصول على مزيد من المعلومات',
            link: '/contract/legalOfficerDashboard/RetFrRmi',
          },
          {
            name: 'return from approval',
            iconName: 'file-done',
            text: 'Return from Approval',
            textAr: 'العودة من الموافقة',
            link: '/contract/legalOfficerDashboard/RetFrAppr',
          },
          {
            name: 'contract list',
            iconName: 'unordered-list',
            text: 'Contract List',
            textAr: 'قائمة العقود',
            link: '/contract/ContractList',
          },
        ],
      });
    } else if (role === 'RM') {
      this.navItems.push({
        ModuleIcon: 'dashboard',
        Module: 'CONTRACT',
        ModuleAr: 'عقد',
        navItem: [
          {
            name: 'rmi',
            iconName: IconList.ContractRmi,
            text: 'RMI',
            textAr: 'طلب مزيد من المعلومات',
            link: '/contract/RfpManagerDashboard/Rmi',
          },
          {
            name: 'contract for apporval',
            iconName: IconList.ContractApprove,
            text: 'Contract for Approval',
            textAr: 'عقود للموافقة',
            link: '/contract/RfpManagerDashboard/ContAppr',
          },
          {
            name: 'contract list',
            iconName: IconList.ContractList,
            text: 'Contract List',
            textAr: 'قائمة العقود',
            link: '/contract/ContractList',
          }
        ],
      });
    } else if (role === 'PM') {
      this.navItems.push({
        ModuleIcon: 'dashboard',
        Module: 'CONTRACT',
        ModuleAr: 'عقد',
        navItem: [
          {
            name: 'contract for apporval',
            iconName: IconList.ContractApprove,
            text: 'Contract for Approval',
            textAr: 'عقود للموافقة',
            link: '/contract/ContractManagerDashboard',
          },
          {
            name: 'contract list',
            iconName: IconList.ContractList,
            text: 'Contract List',
            textAr: 'قائمة العقود',
            link: '/contract/ContractList',
          },
          {
            name: 'SignatureUpload',
            iconName: 'upload',
            text: 'Signature Upload',
            textAr: 'تحميل التوقيع',
            link: '/contract/signature_upload',
          },
        ],
      });
    } else if (role === 'SD') {
      this.navItems.push({
        ModuleIcon: 'dashboard',
        Module: 'CONTRACT',
        ModuleAr: 'عقد',
        navItem: [
          {
            name: 'contract for apporval',
            iconName: IconList.ContractApprove,
            text: 'Contract for Approval',
            textAr: 'عقود للموافقة',
            link: '/contract/SsDirectorDashboard',
          },
          {
            name: 'contract list',
            iconName: IconList.ContractList,
            text: 'Contract List',
            textAr: 'قائمة العقود',
            link: '/contract/ContractList',
          },
          {
            name: 'SignatureUpload',
            iconName: 'upload',
            text: 'Signature Upload',
            textAr: 'تحميل التوقيع',
            link: '/contract/signature_upload',
          },
        ],
      });
    } else if (role === 'VP') {
      this.navItems.push({
        ModuleIcon: 'dashboard',
        Module: 'CONTRACT',
        ModuleAr: 'عقد',
        navItem: [
          {
            name: 'contract for apporval',
            iconName: 'file-done',
            text: 'Contract for Approval',
            textAr: 'عقود للموافقة',
            link: '/contract/VpCorServDashboard',
          },
          {
            name: 'contract list',
            iconName: 'unordered-list',
            text: 'Contract List',
            textAr: 'قائمة العقود',
            link: '/contract/ContractList',
          },
        ],
      });
    } else if (role === 'CC') {
      this.navItems.push({
        ModuleIcon: 'dashboard',
        Module: 'CONTRACT',
        ModuleAr: 'عقد',
        navItem: [
          {
            name: 'Create Contract',
            iconName: 'create',
            text: 'Create Contract',
            textAr: 'عقود للموافقة',
            link: '/contract/create-contract',
          }
        ],
      });
    }
  }

  // TODO : Remove when all the icons has been integrated
  /**
   * Methods to find the existence of new Icon
   * @param iconName 
   * @returns
   *  
   */
  getIsNewIcon(iconName: IconList): boolean {
    if (Object.values(IconList).includes(iconName)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Changes the application to user selected language and Direction of the application
   * 
   * @param lang Selected Language
   * 
   * @returns void
   */
  onChangeLang(lang: string): void {
    if (lang == 'ar') {
      //console.log(lang)
      registerLocaleData(ar);
      this.i18n.setLocale(ar_EG);
    } else {
      this.i18n.setLocale(en_US);
    }

    this.cs.userLanguage = lang;
    this.cs.setCurrentUserLanguage(lang);
    this.translate.use(lang);
    const htmlElement = document.getElementsByTagName('html')[0];
    const bodyElement = document.getElementsByTagName('body')[0];
    
    if (
      lang !== 'ar' &&
      htmlElement.hasAttribute('dir')
    ) {
      htmlElement.removeAttribute('dir');
      bodyElement.removeAttribute('dir');
    } else if (
      lang === 'ar' &&
      !htmlElement.hasAttribute('dir')
    ) {
      htmlElement.setAttribute('dir', 'rtl');
      bodyElement.setAttribute('dir', 'rtl');
    }

    if (
      lang !== 'ar' &&
      htmlElement.hasAttribute('lang')
    ) {
      htmlElement.removeAttribute('lang');
    } else if (
      lang === 'ar' &&
      !htmlElement.hasAttribute('lang')
    ) {
      htmlElement.setAttribute('lang', lang);
    }

    // Force sidebar repositioning after language change
    setTimeout(() => {
      const siderElement = document.querySelector('.ant-layout-sider');
      if (siderElement) {
        if (lang === 'ar') {
          (siderElement as HTMLElement).style.left = 'auto';
          (siderElement as HTMLElement).style.right = '0';
        } else {
          (siderElement as HTMLElement).style.left = '0';
          (siderElement as HTMLElement).style.right = 'auto';
        }
      }
    }, 100);
  }

  /**
   * Adds Auth configuration and tries to Login
   * 
   * @returns void 
   */
  private configure(): void {
    this.oauthService.configure(authConfig);
    // this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    // this.oauthService.tryLogin();
    // this.oauthService.setupAutomaticSilentRefresh();
    // this.oauthService.silentRefresh()
    // this.oauthService.silentRefreshTimeout(20000000)
  }

  /**
   * Gets the Proxy User Id for OAuthService and returns the user display name.
   * 
   * @returns Logged in user's display name
   */
  name() {
    const claims = this.oauthService.getIdentityClaims() as any;
    if (!claims) {
      return null;
    }
    if (claims) {
      this.ProxyUserId = claims.upn.split("@")[0].toUpperCase()
      if (this.ProxyUserId) {
        // console.log(this.ProxyUserId)
        this.isUserLoggedIn = true;
        this.dispname = claims.upn
      }
    }

    return claims.unique_name;
  }

  openHandler(item: any) {
    for (const navItem of this.navItems) {
      if (navItem.Module !== item.Module) {
        navItem.isOpen = false
      }
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  toggleTheme(): void {
    const htmlElement = document.documentElement;
    console.log('Toggling theme to:', this.isDarkMode ? 'dark' : 'light');
    if (this.isDarkMode) {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
    console.log('HTML element data-theme:', htmlElement.getAttribute('data-theme'));
  }

  addAdminNavItem(processId: 'RFP' | 'COMM' | 'COC' | 'CONT', isRfpAdminFullAcces = false): void {
    if (processId === 'RFP') {
      const RFPAdminNavItem = {
        name: `RFPMaintenance`,
        iconName: IconList.tool,
        text: `RFP Maintenance`,
        textAr: `صيانة طلب تقديم العروض`,
        link: `admin/rfpMaintenance`,
        rfpAdminFullAccess: isRfpAdminFullAcces
      };

      if (this.navItems[0]?.Module !== 'Admin') {
        this.navItems.splice(0, 0, {
          ModuleIcon: 'user',
          ModuleId: '03',
          Module: 'Admin',
          ModuleAr: 'مسؤل',
          navItem: [RFPAdminNavItem]
        });
      } else {
        this.navItems[0].navItem.splice(0, 0, RFPAdminNavItem);
      }
    }

    if (processId === 'COMM') {
      const committeeAdminNavItems = [
        {
          name: 'Delgation',
          iconName: 'user',
          text: 'Delegation',
          textAr: 'وفد',
          link: 'admin/delegation',
        },
        {
          name: 'MemberMaintenance',
          iconName: IconList.tool,
          text: 'Committee Member Maintenance',
          textAr: 'Committee Member Maintenance',
          link: 'admin/committeeMemberMaintenance',
          adminFullAccess: this.isAdminFullAccess
        },
        {
          name: 'SLA',
          iconName: 'audit',
          text: 'SLA',
          textAr: 'وفد',
          link: 'admin/sla',
        }
      ];

      if (this.navItems[0]?.Module !== 'Admin') {
        this.navItems.splice(0, 0, {
          ModuleIcon: 'user',
          ModuleId: '03',
          Module: 'Admin',
          ModuleAr: 'مسؤل',
          navItem: committeeAdminNavItems
        });
      } else {
        if (this.navItems[0]?.navItem.find((item: any) => item.name === 'SLA')) {
          const itemsToBePushed = committeeAdminNavItems.filter((committeeAdminNavItem) => committeeAdminNavItem.name != 'SLA');
          itemsToBePushed?.forEach((item) => {
            this.navItems[0]?.navItem.push(item);
          });
        } else {
          this.navItems[0]?.navItem.push(...committeeAdminNavItems);
        }
      }
      this.cs.updateSLAOption([
        PROCESS_TYPES.RFP,
        PROCESS_TYPES.COMMITTEE,
        // PROCESS_TYPES.CONTRACT  // ? Uncomment to get Contract in SLA list
      ]);
    }

    if (processId === 'COC') {
      const COCAdminNavItems = [
        {
          name: 'SLA',
          iconName: 'audit',
          text: 'SLA',
          textAr: 'وفد',
          link: 'admin/sla',
        }
      ];

      if (this.navItems[0]?.Module !== 'Admin') {
        this.navItems.splice(0, 0, {
          ModuleIcon: 'user',
          ModuleId: '03',
          Module: 'Admin',
          ModuleAr: 'مسؤل',
          navItem: COCAdminNavItems
        });
      } else {
        this.cs.updateSLAOption(PROCESS_TYPES.COC);
        if (this.navItems[0]?.navItem.find((item: any) => item.name !== 'SLA')) {
          this.navItems[0]?.navItem.push(...COCAdminNavItems);
        }
      }
    }
  }

  // get enableTestLogon(): boolean {
  //   return true
  //   // if (environment.testlogin) {   // afreen
  //   //   return true;
  //   // } else if (this.ProxyUserId === "ADUAYJI") {
  //   //   return true;
  //   // }
  //   // return false;
  // }

}

/**
 * @description Configuration of Auth Config
 * 
 * @interface AuthConfig
 * 
 */
export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: environment.adfsendpoint,

  // URL of the SPA to redirect the user to after login
  redirectUri: environment.postLogoutUrl,

  postLogoutRedirectUri: environment.postLogoutUrl,

  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: environment.clientId,

  // set the scope for the permissions the client should request
  //  scope: 'openid profile',
  scope: environment.scope,

  // Activate Session Checks:
  // sessionChecksEnabled: true,
  silentRefreshTimeout: 3600000,

  responseType: 'code',

  oidc: true,

  // login and logout keys
  loginUrl: environment.adfsendpoint + '/authorize',
  logoutUrl: environment.adfsendpoint + '/logout',

  // token url
  tokenEndpoint: environment.adfsendpoint + '/token',
  jwks: {
    keys: [
      environment.adfsendpoint + '/discovery/keys',
      environment.adfsendpoint + '/userinfo',
    ],
    token_endpoint_auth_methods_supported: [
      'client_secret_post',
      'client_secret_basic'
    ],
  },

}