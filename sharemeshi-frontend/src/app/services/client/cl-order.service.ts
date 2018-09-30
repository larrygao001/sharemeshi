import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpService } from './http.interceptor';
import 'rxjs/add/operator/map';

import { ClAuthenticationService } from './cl-authentication.service';
import { ClUser } from '../../models/client/index';
import { cl_configs } from '../../config/cl-config';

import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class ClOrderService {

    @Output() unreadDatas: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: Http,
        private httpService: HttpService,
        private authenticationService: ClAuthenticationService,
        private notification: NotificationService,
        private router: Router) {
    }

    getUpcomingOrders(model: any): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });


        return this.httpService.post(environment.base_url + '/api/order/upcoming-orders', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getPreviousOrders(model: any): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });


        return this.httpService.post(environment.base_url + '/api/order/previous-orders', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getPurchasedList(model: any): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });


        return this.httpService.post(environment.base_url + '/api/user/purchased-list', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    checkOrderAvailability(model: any): Observable<any> {
        let clientData = JSON.parse(localStorage.getItem('clientUser'));
        
        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/order/check-food-availability', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    give3stepReview(model: any): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });


        return this.httpService.post(environment.base_url + '/api/review/eater-review', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    give1stepReview(model: any): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });


        return this.httpService.post(environment.base_url + '/api/review/creator-review', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getChathistory(model: any): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));
        
        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/chat/list-message', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });

    }

    sendMessage(model: any): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/chat/save-message', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });

    }

    updateMessage(model: any): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/chat/update-message-status', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });

    }

    getTotalUnreadsNum(model: any): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/chat/unread-message', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });

    }

    setHeaderUnreadNum()
    {
        let clientData = JSON.parse(localStorage.getItem('clientUser'));
        
        let purchasedNum = 0;
        let upcomingNum = 0;

        if(clientData)
        {
            //purchased
            this.getTotalUnreadsNum({ message_category: 0 }).subscribe( data1 => {
                //console.log('data1 : ' + JSON.stringify(data1));
                if(data1.result === true)
                {
                    purchasedNum = data1.data;
                    if (clientData.user.type === 0) //creator
                    {
                        this.getTotalUnreadsNum({ message_category: 1 }).subscribe(data2 => {
                            //console.log('data2 : ' + JSON.stringify(data2));
                            if (data2.result === true)
                            {
                                upcomingNum = data2.data;
                                this.unreadDatas.emit({purchased_num : purchasedNum, upcoming_num : upcomingNum});
                            }
                            else {
                                if (data2.flag === '3') {
                                    localStorage.removeItem('clientUser');
                                    this.router.navigate(['/']);
                                }
                                this.notification.showNotification('Failed', data2.message, 'error');
                            }
                        }, err2 => {
                            console.log(err2);
                        });
                    }
                    else if (clientData.user.type !== 0) //eater
                    {
                        this.unreadDatas.emit({ purchased_num: purchasedNum, upcoming_num: 0 });
                    }
                }
                else
                {
                    if(data1.flag === '3')
                    {
                        localStorage.removeItem('clientUser');
                        this.router.navigate(['/']);
                    }
                    this.notification.showNotification('Failed', data1.message, 'error');
                }

            }, err1 => {
                console.log(err1);
            });
        }
    }
}
