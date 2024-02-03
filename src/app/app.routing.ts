import { Routes } from '@angular/router';

// Import Components
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
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { InDashboardComponent } from './pages/institutional/in-dashboard/in-dashboard.component';
import { InAddOfferingComponent } from './pages/institutional/in-add-offering/in-add-offering.component';
import { InOfferingsComponent } from './pages/institutional/in-offerings/in-offerings.component';
import { InViewOfferingComponent } from './pages/institutional/in-view-offering/in-view-offering.component';
import { InTransactionHistoryComponent } from './pages/institutional/in-transaction-history/in-transaction-history.component';
import { InFundTransferComponent } from './pages/institutional/in-fund-transfer/in-fund-transfer.component';
import { InViewFundTransferComponent } from './pages/institutional/in-view-fund-transfer/in-view-fund-transfer.component';
import { InViewOrderComponent } from './pages/institutional/in-view-order/in-view-order.component';
import { InProjectsComponent } from './pages/institutional/in-projects/in-projects.component';
import { InAddProjectComponent } from './pages/institutional/in-add-project/in-add-project.component';
import { InViewProjectComponent } from './pages/institutional/in-view-project/in-view-project.component';
import { InProfileComponent } from './pages/institutional/profile/in-profile/in-profile.component';
import { InProfileEthComponent } from './pages/institutional/profile/in-profile-eth/in-profile-eth.component';
import { InProfileStakeComponent } from './pages/institutional/profile/in-profile-stake/in-profile-stake.component';


import { InstitutionalGuard } from './providers/institutional.guard';
import { ActivateEmailComponent } from './pages/activate-email/activate-email.component';
import { InUnauthorizedComponent } from './pages/in-unauthorized/in-unauthorized.component';
import { ApplySellingComponent } from './pages/apply-selling/apply-selling.component';
import { InUpgradeTierComponent } from './pages/institutional/in-upgrade-tier/in-upgrade-tier.component';
import { NotificationDetailsComponent } from './pages/notification-details/notification-details.component';
import { InNotificationDetailsComponent } from './pages/institutional/in-notification-details/in-notification-details.component';
import { InProfileBtcComponent } from './pages/institutional/profile/in-profile-btc/in-profile-btc.component';
import { WhitepaperComponent } from './pages/whitepaper/whitepaper.component';
import { UpgradeB3Component } from './pages/upgrade-b3/upgrade-b3.component';
import { InWithdrawTransferComponent } from './pages/institutional/in-withdraw-transfer/in-withdraw-transfer.component';
import { InViewWithdrawTransferComponent } from './pages/institutional/in-view-withdraw-transfer/in-view-withdraw-transfer.component';
import { InReportingComponent } from './pages/institutional/in-reporting/in-reporting.component';
import { InInviteFriendComponent } from './pages/institutional/profile/in-invite-friend/in-invite-friend.component';
import { InRankingComponent } from './pages/institutional/profile/in-ranking/in-ranking.component';
import { InProfileStellarComponent } from './pages/institutional/profile/in-profile-stellar/in-profile-stellar.component';
import { DigitalAssetsComponent } from './pages/digital-assets/digital-assets.component';
import { NewsComponent } from './pages/news/news.component';
import { ReportingComponent } from './pages/institutional/reporting/reporting.component';
import { MybankingComponent } from './pages/institutional/profile/mybanking/mybanking.component';
import { CryptoTokenComponent } from './pages/crypto-token/crypto-token.component';

export const routes: Routes = [
	
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'vertex/:val', component: LoginComponent, data: {
		title: 'Login'
	} },
	{ path: 'home', component: HomeComponent, data: {
		title: 'Digital Assets for everyone'
	} },
	{ path: 'about-us', component: AboutUsComponent, data: {
		title: 'About Us'
	} },
	{ path: 'terms', component: TermsComponent, data: {
		title: 'About Us'
	} },
	{ path: 'privacy-policy', component: PrivacyPolicyComponent, data: {
		title: 'Privacy Policy'
	} },
	{ path: 'faq', component: FaqComponent, data: {
		title: 'FAQ'
	} },
	{ path: 'how-works', component: HowWorksComponent, data: {
		title: 'How Works'
	} },
	{ path: 'white-paper', component: WhitepaperComponent, data: {
		title: 'White Paper'
	} },
	{ path: 'news', component: NewsComponent, data: {
		title: 'News'
	} },
	{ path: 'forgot-password', component: ForgotPasswordComponent, data: {
		title: 'Forgot Password'
	} },
	{ path: 'reset-password/:id', component: ResetPasswordComponent, data: {
		title: 'Reset Password'
	} },
	{ path: 'token-sale/:tab', component: TokenSaleComponent, data: {
		title: 'Token Sale'
	} },
	{ path: 'token-information/:id', component: TokenDetailComponent, data: {
		title: 'Token Information'
	} },
	{ path: 'transaction-history', component: TransactionHistoryComponent, data: {
		title: 'Transaction History'
	} },
	{ path: 'kyc', component: KycComponent, data: {
		title: 'KYC'
	} },
	{ path: 'buy-token/:id/:status/:type', component: BuyTokenComponent, data: {
		title: 'Buy Token'
	} },
	{ path: 'profile', component: ProfileComponent, data: {
		title: 'Profile'
	} },
	{ path: 'change-password', component: ChangePasswordComponent, data: {
		title: 'Change Password'
	} },
	{ path: 'activate-email/:id/:token', component: ActivateEmailComponent, data: {
		title: 'Activate Email'
	} },
	{ path: 'in-unauthorized', component: InUnauthorizedComponent, data: {
		title: 'Unauthorized'
	} },
	{ path: 'apply-selling', component: ApplySellingComponent, data: {
		title: 'Apply For Selling'
	} },
	{ path: 'notification-details', component: NotificationDetailsComponent, data: {
		title: 'Notification Details'
	} },
	{ path: 'contact-us', component: ContactUsComponent, data: {
		title: 'Contact Us'
	} },
	{ path: 'upgrade-b3', component: UpgradeB3Component, data: {
		title: 'Upgrade To B3'
	} },
	{ path: 'digital-assets/:route', component: DigitalAssetsComponent, data: {
		title: 'Digital Assets'
	} },
	{ path: 'institutional', canActivateChild: [InstitutionalGuard], children: [
		{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
		{ path: 'dashboard', component: InDashboardComponent, data: {
			title: 'Dashboard'
		} },
		{ path: 'reporting', component: InReportingComponent, data: {
			title: 'Reporting'
		} },
		{ path: 'offerings', component: InOfferingsComponent, data: {
			title: 'Offerings'
		} },
		{ path: 'add-offering/:id', component: InAddOfferingComponent, data: {
			title: 'Add Offering'
		} },
		{ path: 'view-offering/:id', component: InViewOfferingComponent, data: {
			title: 'View Offering'
		} },
		{ path: 'transaction-history', component: InTransactionHistoryComponent, data: {
			title: 'Transaction History'
		} },
		{ path: 'fund-transfer', component: InFundTransferComponent, data: {
			title: 'Deposit Transfer'
		} },
		{ path: 'view-fund-transfer/:id', component: InViewFundTransferComponent, data: {
			title: 'View Fund Transfer'
		}  },
		{ path: 'view-order/:id/:status/:backPage', component: InViewOrderComponent, data: {
			title: 'View Order'
		} },
		{ path: 'projects', component: InProjectsComponent, data: {
			title: 'Projects'
		} },
		{ path: 'add-project/:id', component: InAddProjectComponent, data: {
			title: 'Add Project'
		} },
		{ path: 'view-project/:id', component: InViewProjectComponent, data: {
			title: 'View Project'
		} },
		{ path: 'profile', component: InProfileComponent, data: {
			title: 'Profile'
		} },
		{ path: 'profile-eth', component: InProfileEthComponent, data: {
			title: 'My Ethereum'
		} },
		{ path: 'profile-stake', component: InProfileStakeComponent, data: {
			title: 'My Staking'
		} },
		{ path: 'upgrade-tier', component: InUpgradeTierComponent, data: {
			title: 'Upgrade Tier'
		} },
		{ path: 'in-notification-details', component: InNotificationDetailsComponent, data: {
			title: 'Notification Details'
		} },
		{ path: 'profile-btc', component: InProfileBtcComponent, data: {
			title: 'My Bitcoin'
		} },
		{ path: 'withdraw-transfer', component: InWithdrawTransferComponent, data: {
			title: 'Withdraw Transfer'
		} },
		{ path: 'view-withdraw-transfer/:id', component: InViewWithdrawTransferComponent, data: {
			title: 'View Withdraw Transfer'
		} },
		{ path: 'invite-friend', component: InInviteFriendComponent, data: {
			title: 'Invite A Friend'
		} },
		{ path: 'my-ranking', component: InRankingComponent, data: {
			title: 'My Ranking'
		} },
		{ path: 'profile-stellar', component: InProfileStellarComponent, data : {
			title: 'My Stellar'
		} },
		{ path: 'report', component: ReportingComponent, data : {
			title: 'Report'
		} },
		{ path: 'profile-bank', component: MybankingComponent, data : {
			title: 'My Banking'
		} }
		// { path: 'report', component: ReportingComponent, data : {
		// 	title: 'Report'
		// } },
		// { path: 'profile-bank', component: MybankingComponent, data : {
		// 	title: 'My Banking'
		// } }
	]},
	{ path: '**', component: HomeComponent },
	
]