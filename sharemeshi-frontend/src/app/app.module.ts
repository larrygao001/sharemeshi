import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './routing/app.routing';

import { ClAuthGuard } from './guards/client/index';
import { ClAuthenticationService, ClUserService, ClFoodService, ClPaymentService, ClOrderService } from './services/client/index';
import { NotificationService } from './services/notification.service';
import { HttpService } from './services/client/http.interceptor';
import { httpServiceFactory } from './services/client/httpServiceFactory';
import { Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';

import { Ng2FileRequiredModule } from 'ng2-file-required';
import { AgmCoreModule } from '@agm/core';
import { NgxMaskModule } from 'ngx-mask';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RatingModule } from 'ngx-bootstrap/rating';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
// import { ImageCropperModule } from 'ngx-image-cropper';

import { ImageCropperModule } from 'ng2-img-cropper/index';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import * as Raven from 'raven-js';

import { TitleService } from './services/client/cl-title.service';

import { ClFooterComponent } from './components/client/cl-footer/cl-footer.component';
import { ClHeaderComponent } from './components/client/cl-header/cl-header.component';
import { ClHomeComponent } from './components/client/cl-home/cl-home.component';
import { ClLandingComponent } from './components/client/cl-landing/cl-landing.component';
import { ClRegisterComponent } from './components/client/cl-register/cl-register.component';
import { ClLoginComponent } from './components/client/cl-login/cl-login.component';
import { ClContainerComponent } from './components/client/cl-container/cl-container.component';
import { ClProfileComponent } from './components/client/cl-profile/cl-profile.component';
import { ClFoodDetailComponent } from './components/client/cl-food-detail/cl-food-detail.component';
import { ClVerificationComponent } from './components/client/cl-verification/cl-verification.component';
import { ClResetPasswordComponent } from './components/client/cl-reset-password/cl-reset-password.component';
import { ClForgotPasswordComponent } from './components/client/cl-forgot-password/cl-forgot-password.component';
import { ClProfileEditComponent } from './components/client/cl-profile-edit/cl-profile-edit.component';
import { ClTermConditionComponent } from './components/client/cl-term-condition/cl-term-condition.component';
import { ClFoodPostComponent } from './components/client/cl-food-post/cl-food-post.component';
import { SubDatePickerComponent } from './components/sub-date-picker/sub-date-picker.component';
import { ClFoodListComponent } from './components/client/cl-food-list/cl-food-list.component';
import { ClCartListComponent } from './components/client/cl-cart-list/cl-cart-list.component';
import { ClOrderListComponent } from './components/client/cl-order-list/cl-order-list.component';
import { ClPurchasedListComponent } from './components/client/cl-purchased-list/cl-purchased-list.component';
import { ClFoodDaysComponent } from './components/client/cl-food-days/cl-food-days.component';
import { ClProfileBylinkComponent } from './components/client/cl-profile-bylink/cl-profile-bylink.component';
import { ClRegisterCompleteComponent } from './components/client/cl-register-complete/cl-register-complete.component';
import { ClRegisterAdditionalComponent } from './components/client/cl-register-additional/cl-register-additional.component';
import { ClFoodManagementComponent } from './components/client/cl-food-management/cl-food-management.component';
import { ClFoodEditComponent } from './components/client/cl-food-edit/cl-food-edit.component';
import { ClBeginnerTutorialComponent } from './components/client/cl-beginner-tutorial/cl-beginner-tutorial.component';
import { ClAboutusComponent } from './components/client/cl-aboutus/cl-aboutus.component';
import { ClContactUsComponent } from './components/client/cl-contact-us/cl-contact-us.component';
import { ClChattingRoomComponent } from './components/client/cl-chatting-room/cl-chatting-room.component';
import { ClNewsDetailComponent } from './components/client/cl-news-detail/cl-news-detail.component';
import { Cl2ndVerificationComponent } from './components/client/cl-2nd-verification/cl-2nd-verification.component';


Raven
  .config('https://5d84943bc3d147d496389b7baee1cc00@sentry.io/1237863')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    Raven.captureException(err);
  }
}


@NgModule({
  declarations: [
    AppComponent,
    // ImageCropperComponent,

    ClFooterComponent,
    ClHeaderComponent,
    ClHomeComponent,
    ClLandingComponent,
    ClRegisterComponent,
    ClLoginComponent,
    ClContainerComponent,
    ClProfileComponent,
    ClFoodDetailComponent,
    ClVerificationComponent,
    ClResetPasswordComponent,
    ClForgotPasswordComponent,
    ClProfileEditComponent,
    ClTermConditionComponent,
    ClFoodPostComponent,
    SubDatePickerComponent,
    ClFoodListComponent,
    ClCartListComponent,
    ClOrderListComponent,
    ClPurchasedListComponent,
    ClFoodDaysComponent,
    ClProfileBylinkComponent,
    ClRegisterCompleteComponent,
    ClRegisterAdditionalComponent,
    ClFoodManagementComponent,
    ClFoodEditComponent,
    ClBeginnerTutorialComponent,
    ClAboutusComponent,
    ClContactUsComponent,
    ClChattingRoomComponent,
    ClNewsDetailComponent,
    Cl2ndVerificationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    Ng2FileRequiredModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCEk3pZz3v81F7Cr28OQOajy1jW05gdJV8',
      libraries: ['places']
    }),
    ImageCropperModule ,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxMaskModule.forRoot(),
    BrowserAnimationsModule,
    NoopAnimationsModule,
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  providers: [
    ClAuthGuard,
    ClAuthenticationService,
    ClUserService,
    HttpService,
    Store,
    NotificationService,
    ClFoodService,
    ClPaymentService,
    ClOrderService,
    TitleService,

    { provide: ErrorHandler, useClass: RavenErrorHandler }
    /*{
      provide: HttpService,
      useFactory: httpServiceFactory,
      deps: [XHRBackend, RequestOptions, Router, Store]
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
