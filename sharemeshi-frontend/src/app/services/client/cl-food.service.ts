import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpService } from './http.interceptor';
import 'rxjs/add/operator/map';

import { ClAuthenticationService } from './cl-authentication.service';
import { ClUser } from '../../models/client/index';
// import { cl_configs } from '../../config/cl-config';

import { environment } from '../../../environments/environment';

@Injectable()
export class ClFoodService {
    
    @Output() cartNum: EventEmitter<any> = new EventEmitter();
    @Output() chosenPageId: EventEmitter<any> = new EventEmitter();
    @Output() langChanged: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: Http,
        private httpService: HttpService,
        private authenticationService: ClAuthenticationService) {
    }

    createFood(model: FormData): Observable<any> {
        
        let clienData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clienData.token});
        let options = new RequestOptions({ headers: headers });

        console.log("createfood: " + clienData.token);

        return this.httpService.post(environment.base_url + '/api/food/create', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    updateFood(model: FormData): Observable<any> {

        let clienData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clienData.token });
        let options = new RequestOptions({ headers: headers });

        console.log("updatefood: " + clienData.token);

        return this.httpService.post(environment.base_url + '/api/food/update', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getFoodList(model: any): Observable<any> {

        //let clienData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ });
        let options = new RequestOptions({ headers: headers });


        return this.httpService.post(environment.base_url + '/api/food/list', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getFoodManagementList(model: any): Observable<any> {

        let clienData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({});
        let options = new RequestOptions({ headers: headers });


        return this.httpService.post(environment.base_url + '/api/food/single-user-list', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getFoodDetail(id: any): Observable<any> {

        let headers = new Headers({});
        let options = new RequestOptions({ headers: headers });

        let form_data = new FormData();
        form_data.append('food_item_id', id);


        return this.httpService.post(environment.base_url + '/api/food/details', form_data, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    deleteFood(model: FormData): Observable<any> {
        let clienData = JSON.parse(localStorage.getItem('clientUser'));
        let headers = new Headers({'Authorization': 'Bearer ' + clienData.token});
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/food/delete', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    addToCart(model: FormData): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({'Authorization': 'Bearer ' + clientData.token});
        let options = new RequestOptions({ headers: headers });

        console.log('addcart : ' + JSON.stringify(model));


        return this.httpService.post(environment.base_url + '/api/order/add-to-cart', model, options)
            .map((res: Response) => {
                let data =  res.json();

                if (data.result) {
                    this.setHeaderCartNum();
                }

                return res.json();
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });
        /*return this.httpService.post(environment.base_url + '/api/test', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });*/
    }

    getCart(): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });

        console.log('***********hgctoken : ' + JSON.stringify(headers));

        let form_data = new FormData();

        return this.httpService.post(environment.base_url + '/api/order/cart-list', form_data, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    updateCart(model: FormData): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });
        
        console.log('upcart : ' + JSON.stringify(model));

        return this.httpService.post(environment.base_url + '/api/order/update-cart', model, options)
            .map((res: Response) => {
                let data = res.json();

                if (data.result) {
                    this.setHeaderCartNum();
                }

                return res.json();
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });

        /*return this.httpService.post(environment.base_url + '/api/test', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });*/
    }

    getReviews(model: any): Observable<any> {

        // let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({});
        let options = new RequestOptions({ headers: headers });


        return this.httpService.post(environment.base_url + '/api/load/review', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getFoodCategories(): Observable<any> {
        let headers = new Headers({});
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/food/main-categories', options)
                .map((res: Response) => res.json())
                .catch((error: any) => {
                    return Observable.throw(error);
                })
    }

    getTomorrowFoods(model: any): Observable<any> {

        // let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({});
        let options = new RequestOptions({ headers: headers });


        return this.httpService.post(environment.base_url + '/api/tomorrow/food', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getDayafterTomorrowFoods(model: any): Observable<any> {

        // let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({});
        let options = new RequestOptions({ headers: headers });


        return this.httpService.post(environment.base_url + '/api/day-after-tomorrow/food', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    setHeaderCartNum()
    {
        
        let clientData = JSON.parse(localStorage.getItem('clientUser'));
        if(clientData) {
            // console.log('yayaya');
            this.getCart().subscribe(data2 => {
                if (data2.result === true) {
                    let sum = 0;
                    for (let i = 0; i < data2.data.length; i++)
                        sum += data2.data[i].quantity;
    
                    console.log('sum : ' + sum);
                    this.cartNum.emit(sum);
                }
            }, err2 => {
            });
        }
    }

    setMenuItemActive(id)
    {
        this.chosenPageId.emit(id);
    }

    sendLangChangedEvent()
    {
        this.langChanged.emit(1);
    }
}
