// Import Modules
/// <reference path="../typings.d.ts" />

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { OrderModule } from 'ngx-order-pipe';
import { MomentModule } from 'ngx-moment';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { QRCodeModule } from 'angularx-qrcode';
import { PaginationModule } from 'ngx-bootstrap';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { DataTableModule } from 'angular5-data-table';
import { TooltipModule } from 'ng2-tooltip-directive';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UserIdleModule } from 'angular-user-idle';
import { ClipboardModule } from 'ngx-clipboard';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';
import { LightboxModule } from 'ngx-lightbox';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxGalleryModule } from 'ngx-gallery';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import {ngxZendeskWebwidgetModule, ngxZendeskWebwidgetConfig} from 'ngx-zendesk-webwidget';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AngularDraggableModule } from 'angular2-draggable';
import { UiSwitchModule } from 'ngx-toggle-switch';

import {NgxToggleModule} from "ngx-toggle";

// Import Service, Interceptor , Directive, Pipes
import { MainInterceptor } from './providers/mainInterceptor.interceptor';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { LetterCasePipe } from "./pipes/letterCase.pipe";
import { UtcTimePipe } from './pipes/utcTime.pipe';
import { SeparatorPipe } from './pipes/separator.pipe';
import { InstitutionalGuard } from './providers/institutional.guard';

// Import Components
import { AppComponent } from './app.component';
import { routes } from './app.routing';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { FaqComponent } from './pages/faq/faq.component';
import { HowWorksComponent } from './pages/how-works/how-works.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TokenSaleComponent } from './pages/token-sale/token-sale.component';
import { TokenDetailComponent } from './pages/token-detail/token-detail.component';
import { TransactionHistoryComponent } from './pages/transaction-history/transaction-history.component';
import { KycComponent } from './pages/kyc/kyc.component';
import { BuyTokenComponent } from './pages/buy-token/buy-token.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MainService } from './providers/mainService.service';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { InDashboardComponent } from './pages/institutional/in-dashboard/in-dashboard.component';
import { InOfferingsComponent } from './pages/institutional/in-offerings/in-offerings.component';
import { InSidebarComponent } from './pages/institutional/in-sidebar/in-sidebar.component';
import { InAddOfferingComponent } from './pages/institutional/in-add-offering/in-add-offering.component';
import { InViewOfferingComponent } from './pages/institutional/in-view-offering/in-view-offering.component';
import { InTransactionHistoryComponent } from './pages/institutional/in-transaction-history/in-transaction-history.component';
import { InHeaderComponent } from './pages/institutional/in-header/in-header.component';
import { InFooterComponent } from './pages/institutional/in-footer/in-footer.component';
import { InFundTransferComponent } from './pages/institutional/in-fund-transfer/in-fund-transfer.component';
import { InViewFundTransferComponent } from './pages/institutional/in-view-fund-transfer/in-view-fund-transfer.component';
import { InViewOrderComponent } from './pages/institutional/in-view-order/in-view-order.component';
import { InProjectsComponent } from './pages/institutional/in-projects/in-projects.component';
import { InAddProjectComponent } from './pages/institutional/in-add-project/in-add-project.component';
import { InViewProjectComponent } from './pages/institutional/in-view-project/in-view-project.component';
import { InProfileComponent } from './pages/institutional/profile/in-profile/in-profile.component';
import { InProfileEthComponent } from './pages/institutional/profile/in-profile-eth/in-profile-eth.component';
import { InProfileStakeComponent } from './pages/institutional/profile/in-profile-stake/in-profile-stake.component'
import { ActivateEmailComponent } from './pages/activate-email/activate-email.component';
import { InUnauthorizedComponent } from './pages/in-unauthorized/in-unauthorized.component';
import { InWithdrawTransferComponent } from './pages/institutional/in-withdraw-transfer/in-withdraw-transfer.component';
import { LoadingComponent } from './pages/loading/loading.component';
import { ApplySellingComponent } from './pages/apply-selling/apply-selling.component';
import { InUpgradeTierComponent } from './pages/institutional/in-upgrade-tier/in-upgrade-tier.component';
import { NotificationDetailsComponent } from './pages/notification-details/notification-details.component';
import { InNotificationDetailsComponent } from './pages/institutional/in-notification-details/in-notification-details.component';
import { InProfileBtcComponent } from './pages/institutional/profile/in-profile-btc/in-profile-btc.component';
import { WhitepaperComponent } from './pages/whitepaper/whitepaper.component';
import { UpgradeB3Component } from './pages/upgrade-b3/upgrade-b3.component';
import { InViewWithdrawTransferComponent } from './pages/institutional/in-view-withdraw-transfer/in-view-withdraw-transfer.component';
import { InReportingComponent } from './pages/institutional/in-reporting/in-reporting.component';
import { InRankingComponent } from './pages/institutional/profile/in-ranking/in-ranking.component';
import { InInviteFriendComponent } from './pages/institutional/profile/in-invite-friend/in-invite-friend.component';
import { InProfileStellarComponent } from './pages/institutional/profile/in-profile-stellar/in-profile-stellar.component';
import { DigitalAssetsComponent } from './pages/digital-assets/digital-assets.component';
import { NewsComponent } from './pages/news/news.component';
import { ReportingComponent } from './pages/institutional/reporting/reporting.component';
import { MybankingComponent } from './pages/institutional/profile/mybanking/mybanking.component';
import { ReadMoreDirective } from './directives/read-more.directive';
import { SeoService } from './providers/seo.service';
import { CryptoTokenComponent } from './pages/crypto-token/crypto-token.component';
import { BankTransferComponent } from './pages/bank-transfer/bank-transfer.component';
// import { SeoService } from './providers/seo.service';

export class ZendeskConfig extends ngxZendeskWebwidgetConfig {
  // accountUrl = 'portal5534.zendesk.com';
  accountUrl = `vertexmarket.zendesk.com`;
  beforePageLoad(zE) {
    zE.setLocale('en');
    zE.hide();
  }
}



export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, '../../../assets/i18n/locales/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AboutUsComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    FaqComponent,
    HowWorksComponent,
    ContactUsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    TokenSaleComponent,
    TokenDetailComponent,
    TransactionHistoryComponent,
    KycComponent,
    InReportingComponent,
    BuyTokenComponent,
    ProfileComponent,
    ChangePasswordComponent,
    OnlyNumberDirective,
    ReadMoreDirective,
    InDashboardComponent,
    InOfferingsComponent,
    InSidebarComponent,
    InAddOfferingComponent,
    InViewOfferingComponent,
    InTransactionHistoryComponent,
    InHeaderComponent,
    LetterCasePipe,
    UtcTimePipe,
    SeparatorPipe,
    InFooterComponent,
    InFundTransferComponent,
    InViewFundTransferComponent,
    InViewOrderComponent,
    InProjectsComponent,
    InAddProjectComponent,
    InViewProjectComponent,
    InProfileComponent,
    InProfileEthComponent,
    InProfileStakeComponent,
    InFundTransferComponent,
    InViewFundTransferComponent,
    InViewOrderComponent,
    LoadingComponent,
    ActivateEmailComponent,
    InUnauthorizedComponent,
    ApplySellingComponent,
    InUpgradeTierComponent,
    NotificationDetailsComponent,
    InNotificationDetailsComponent,
    InProfileBtcComponent,
    WhitepaperComponent,
    UpgradeB3Component,
    InWithdrawTransferComponent,
    InViewWithdrawTransferComponent,
    InRankingComponent,
    InInviteFriendComponent,
    InProfileStellarComponent,
    DigitalAssetsComponent,
    NewsComponent,
    ReportingComponent,
    MybankingComponent,
    CryptoTokenComponent,
    BankTransferComponent
    
  ],
  imports: [
    NgxToggleModule,
    UiSwitchModule,
    BrowserModule,
    Ng2SearchPipeModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}),
    ngxZendeskWebwidgetModule.forRoot(ZendeskConfig),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DataTableModule.forRoot(),
    ClipboardModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    PaginationModule.forRoot(),
    HttpClientModule,
    ReCaptchaModule,
    NgxSpinnerModule,
    TruncateModule,
    OrderModule,
    MomentModule,
    NgxPaginationModule,
    QRCodeModule,
    NgxMyDatePickerModule.forRoot(),
    TooltipModule,
    NgxCarouselModule,
    LightboxModule,
    TranslateModule.forRoot({
      loader: {
           provide: TranslateLoader,
           useFactory: HttpLoaderFactory,
           deps: [HttpClient]
       }
   }),
   UserIdleModule.forRoot({ idle: 710, timeout: 10, ping: 120 }),
   NgSelectModule,
   NgbModule,
   NgxGalleryModule,
   AngularDraggableModule
  ],
  providers: [
    MainService, 
    SeoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true
    },
    InstitutionalGuard,
    NgbCarouselConfig
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
})
export class AppModule { }
