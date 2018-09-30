import { Component, OnInit } from '@angular/core';
import { ClFoodService } from '../../../services/client/cl-food.service';

@Component({
  selector: 'app-cl-term-condition',
  templateUrl: './cl-term-condition.component.html',
  styleUrls: ['./cl-term-condition.component.css']
})
export class ClTermConditionComponent implements OnInit {

  constructor(private foodService: ClFoodService) { }

  ngOnInit() {
    this.foodService.setMenuItemActive('#nitem9');
  }

}
