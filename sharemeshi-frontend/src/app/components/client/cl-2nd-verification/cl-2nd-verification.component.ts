import { Component, OnInit } from '@angular/core';
import { ClFoodService } from '../../../services/client/cl-food.service';

@Component({
  selector: 'app-cl-2nd-verification',
  templateUrl: './cl-2nd-verification.component.html',
  styleUrls: ['./cl-2nd-verification.component.css']
})
export class Cl2ndVerificationComponent implements OnInit {

  model: any = {};

  constructor(private foodService: ClFoodService) { }

  ngOnInit() {
    this.foodService.setMenuItemActive('');
  }

  doReverification() {
    console.log('model : ' + JSON.stringify(this.model));
  }

}
