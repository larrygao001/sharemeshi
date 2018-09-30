import { Router } from '@angular/router';
import { HttpService } from './http.interceptor';
import { XHRBackend, RequestOptions } from '@angular/http';
import { environment } from '../../../environments/environment';

export function httpServiceFactory(router: Router , backend: XHRBackend, options: RequestOptions) {
    return new HttpService(backend, options, router);
}
