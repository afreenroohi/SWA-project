import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IconsProviderModule } from './icons-provider.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './service/common.service';
import { antModule } from './shared/ant.module';
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HeaderInterceptor } from './header.interceptor';
import { CommaSeparatePipe } from './pipes/comma-separate.pipe';
import { NoroleComponent } from './pages/norole/norole.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SharedCustomModule } from './shared/shared-custom.module';
import { ComponentsModule } from './components/components.module';


const ngZorroConfig: NzConfig = {
  message: { nzTop: 120, nzDuration: 3000 },
  notification: { nzTop: 240 }
};

@NgModule({
  declarations: [
    AppComponent,
    CommaSeparatePipe,
    NoroleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    antModule,
    NzDatePickerModule,
    NgxSpinnerModule,
    FlexLayoutModule,
    ComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IconsProviderModule,
    OAuthModule.forRoot(),
    SharedCustomModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    TranslateService,
    CommonService,
    CommaSeparatePipe
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
