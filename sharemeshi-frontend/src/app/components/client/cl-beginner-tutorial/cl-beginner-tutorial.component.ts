import { Component, OnInit } from '@angular/core';
import { ClFoodService } from '../../../services/client/cl-food.service';

@Component({
  selector: 'app-cl-beginner-tutorial',
  templateUrl: './cl-beginner-tutorial.component.html',
  styleUrls: ['./cl-beginner-tutorial.component.css']
})
export class ClBeginnerTutorialComponent implements OnInit {

  constructor(private foodService: ClFoodService) { }

  ngOnInit() {
    this.foodService.setMenuItemActive('#nitem2');
  }

  checkLogined() {
    let userData = JSON.parse(localStorage.getItem('clientUser'));

    // console.log('dddd : ' + this.myuserdata.result);

    if(userData == null) {
      return true;
    }
    else {
      return false;
    }
  }

}
