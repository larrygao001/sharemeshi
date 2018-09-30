import { Component, OnInit } from '@angular/core';
import { ClFoodService } from '../../../services/client/cl-food.service';

@Component({
  selector: 'app-cl-aboutus',
  templateUrl: './cl-aboutus.component.html',
  styleUrls: ['./cl-aboutus.component.css']
})
export class ClAboutusComponent implements OnInit {

  constructor(private foodService: ClFoodService) { }

  ngOnInit() {
    this.foodService.setMenuItemActive('#nitem3');
  }

}
