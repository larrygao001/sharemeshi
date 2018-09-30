import { Routes, RouterModule } from '@angular/router';
import { ClAuthGuard } from '../guards/client/index';

import { ClContainerComponent } from '../components/client/cl-container/cl-container.component';
import { ClHomeComponent } from '../components/client/cl-home/cl-home.component';
import { ClLandingComponent } from '../components/client/cl-landing/cl-landing.component';
import { ClRegisterComponent } from '../components/client/cl-register/cl-register.component';
import { ClLoginComponent } from '../components/client/cl-login/cl-login.component';
import { ClProfileComponent } from '../components/client/cl-profile/cl-profile.component';
import { ClProfileEditComponent } from '../components/client/cl-profile-edit/cl-profile-edit.component';
import { ClFoodDetailComponent } from '../components/client/cl-food-detail/cl-food-detail.component';
import { ClVerificationComponent } from '../components/client/cl-verification/cl-verification.component';
import { ClResetPasswordComponent } from '../components/client/cl-reset-password/cl-reset-password.component';
import { ClForgotPasswordComponent } from '../components/client/cl-forgot-password/cl-forgot-password.component';
import { ClTermConditionComponent } from '../components/client/cl-term-condition/cl-term-condition.component';
import { ClFoodPostComponent } from '../components/client/cl-food-post/cl-food-post.component';
import { ClFoodListComponent } from '../components/client/cl-food-list/cl-food-list.component';
import { ClCartListComponent } from '../components/client/cl-cart-list/cl-cart-list.component';
import { ClOrderListComponent } from '../components/client/cl-order-list/cl-order-list.component';
import { ClPurchasedListComponent } from '../components/client/cl-purchased-list/cl-purchased-list.component';
import { ClFoodDaysComponent } from '../components/client/cl-food-days/cl-food-days.component';
import { ClProfileBylinkComponent } from '../components/client/cl-profile-bylink/cl-profile-bylink.component';
import { ClRegisterCompleteComponent } from '../components/client/cl-register-complete/cl-register-complete.component';
import { ClRegisterAdditionalComponent } from '../components/client/cl-register-additional/cl-register-additional.component';
import { ClFoodManagementComponent } from '../components/client/cl-food-management/cl-food-management.component';
import { ClFoodEditComponent } from '../components/client/cl-food-edit/cl-food-edit.component';

import { ClBeginnerTutorialComponent } from '../components/client/cl-beginner-tutorial/cl-beginner-tutorial.component';
import { ClAboutusComponent } from '../components/client/cl-aboutus/cl-aboutus.component';
import { ClContactUsComponent } from '../components/client/cl-contact-us/cl-contact-us.component';

import { ClChattingRoomComponent } from '../components/client/cl-chatting-room/cl-chatting-room.component';

import { ClNewsDetailComponent } from '../components/client/cl-news-detail/cl-news-detail.component';
import { Cl2ndVerificationComponent } from '../components/client/cl-2nd-verification/cl-2nd-verification.component';

const appRoutes: Routes = [
    { path: '', component: ClLandingComponent, data: { title: '#phome' } , pathMatch: 'full' },
            { path: 'singin', component: ClLoginComponent, data: { title: '#plogin' }},
            { path: 'register', component: ClRegisterComponent, data: { title: '#pregister' } },
            { path: 'home', component: ClHomeComponent, canActivate: [ClAuthGuard], data: { title: '#phome' } },
            { path: 'profile', component: ClProfileComponent, canActivate: [ClAuthGuard], data: { title: '#pprofile' }},
            { path: 'profile-edit', component: ClProfileEditComponent, canActivate: [ClAuthGuard], data: { title: '#pprofileedit' } },
            { path: 'food-detail/:id', component: ClFoodDetailComponent, data: { title: '#pfooddetail' } },
            { path: 'forgot-password', component: ClForgotPasswordComponent, data: { title: '#pforgotpw' } },
            { path: 'verification/:code', component: ClVerificationComponent, data: { title: '#pverification' } },
            { path: 'reset-password/:email/:code', component: ClResetPasswordComponent, data: { title: '#presetpw' } },
            { path: 'faq', component: ClTermConditionComponent, data: { title: '#pfaq' } },
            { path: 'food-post', component: ClFoodPostComponent, canActivate: [ClAuthGuard], data: { title: '#pfoodpost' } },
            { path: 'food-list/:category/:category_name/:country/:keyword', component: ClFoodListComponent, data: { title: '#pfoodlist' } },
            { path: 'food-list', component: ClFoodListComponent, data: { title: '#pfoodlist' } },
            { path: 'food-list/:ftype', component: ClFoodListComponent, data: { title: '#pfoodlist' } },
            { path: 'food-edit/:fid', component: ClFoodEditComponent, canActivate: [ClAuthGuard], data: { title: '#pfoodedit' } },
            { path: 'food-management', component: ClFoodManagementComponent, canActivate: [ClAuthGuard], data: { title: '#pfoodmanagement' } },
            { path: 'cart-list', component: ClCartListComponent, canActivate: [ClAuthGuard], data: { title: '#pcartlist' } },
            { path: 'order-list/:ordertype', component: ClOrderListComponent, canActivate: [ClAuthGuard], data: { title: '#porderlist' } },
            { path: 'purchased-list', component: ClPurchasedListComponent, canActivate: [ClAuthGuard], data: { title: '#ppurchasedlist' } },
            { path: 'food-days/:param', component: ClFoodDaysComponent },
            { path: 'profile/:nickname', component: ClProfileBylinkComponent, data: { title: '#pprofile' }},
            { path: 'register-complete/:uid', component: ClRegisterCompleteComponent, data: { title: '#pregister' } },
            { path: 'register-additional/:uid/:utype', component: ClRegisterAdditionalComponent, data: { title: '#pregister' }},
            { path: 'chatroom/:chatid/:ordernumber/:comefrom', component: ClChattingRoomComponent, canActivate: [ClAuthGuard], data: { title: '#pchatroom' } },

            { path: 'begineer-tutorial', component: ClBeginnerTutorialComponent, data: { title: '#pbtutorial' }},
            { path: 'about-us', component: ClAboutusComponent, data: { title: '#paboutus' } },
            { path: 'contact-us', component: ClContactUsComponent, data: { title: '#pcontactus' } },

            { path: 'news-detail/:newsid', component: ClNewsDetailComponent, data: { title: '#pnewsdetail' } },
            { path: '2nd-verification', component: Cl2ndVerificationComponent, data: { title: '#p2ndverify' } },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
