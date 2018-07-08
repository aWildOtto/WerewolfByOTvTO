import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-pass-to-next',
  templateUrl: './pass-to-next.component.html',
  styleUrls: ['./pass-to-next.component.scss']
})
export class PassToNextComponent implements OnInit {
  @Output() roleReveal = new EventEmitter<string>();

  passTo: string; 
  toRoleReveal(event){
    this.roleReveal.emit("roleReveal");
  }
  constructor(private gs: GameService) {
    if(this.gs.getGameData().players[this.gs.getGameData().currentIndex]){
      this.passTo = this.gs.getGameData().players[this.gs.getGameData().currentIndex]; 
    } else {
      this.passTo = "the next player";
    }
    
  }

  ngOnInit() {
  }

}
