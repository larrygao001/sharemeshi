import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpService } from './http.interceptor';
import 'rxjs/add/operator/map';

import { ClAuthenticationService } from './cl-authentication.service';
import { ClUser } from '../../models/client/index';
import { cl_configs } from '../../config/cl-config';
import { environment } from '../../../environments/environment';

@Injectable()
export class ClPaymentService {

    constructor(
        private http: Http,
        private httpService: HttpService,
        private authenticationService: ClAuthenticationService) {
    }

    postPaymentData(model: FormData): Observable<any> {
        console.log("ruru : " + JSON.stringify(model));


        let clienData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clienData.token});
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/payment/checkout', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }
}
