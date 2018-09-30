import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ClAuthenticationService } from '../../services/client/cl-authentication.service';
import { ClOrderService } from '../../services/client/cl-order.service';

@Injectable()
export class ClAuthGuard implements CanActivate {

    constructor(public router: Router, public authService: ClAuthenticationService,
                private orderService: ClOrderService) { }

    canActivate() {
        let userData = null;

        userData = JSON.parse(localStorage.getItem('clientUser'));
        console.log('userData : ' + userData);

        if (userData) {
            console.log("yes logined...");
            this.orderService.setHeaderUnreadNum();
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
    /*canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('uuu');
        return true;
        // else navigate to login
    }*/
}
