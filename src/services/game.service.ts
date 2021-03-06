import { Injectable } from '@angular/core';
import { GameData } from '../model/gameData';
import { Observable, Subject } from 'rxjs';
import { RoleData } from '../model/roleData';
import { Werewolf } from '../model/werewolf';
import { Villager } from '../model/villager';

// this is only for offline service

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameData: GameData;
  private roleData: RoleData;
  private currentPageSubject: Subject<string>;

  getGameData() {
    return this.gameData;
  }
  getRoleData() {
    return this.roleData;
  }
  constructor() {
    this.currentPageSubject = new Subject<string>();
    if (sessionStorage.getItem('gameData')) {
      this.gameData = JSON.parse(sessionStorage.getItem('gameData'));
      this.currentPageSubject.next(this.gameData.currentPage);
    } else {
      this.initGameData();
    }
    if (sessionStorage.getItem('roleData')) {
      this.roleData = JSON.parse(sessionStorage.getItem('roleData'));
    }
  }

  public getPageObservable(): Observable<string> {
    return this.currentPageSubject;
  }
  private initGameData() {
    this.gameData = {
      players: [],
      roles: [],
      currentIndex: 0,
      currentPage: 'welcome',
      currentNight: 0
    };
    this.currentPageSubject.next(this.gameData.currentPage);
    this.saveGameData();
  }

  private saveGameData() {
    sessionStorage.setItem('gameData', JSON.stringify(this.gameData));
  }
  private saveRoleData() {
    sessionStorage.setItem('roleData', JSON.stringify(this.roleData));
  }

  updatePage(page) {
    this.gameData.currentPage = page;
    this.currentPageSubject.next(this.gameData.currentPage);
    this.saveGameData();
  }

  updateGameData(
    players?: string[],
    roles?: string[],
    currentIndex?: number,
    currentPage?: string,
    currentNight?: number
  ) {
    this.gameData = {
      players: players ? players : this.gameData.players,
      roles: roles ? roles : this.gameData.roles,
      currentIndex: currentIndex ? currentIndex : this.gameData.currentIndex,
      currentPage: currentPage ? currentPage : this.gameData.currentPage,
      currentNight: currentNight ? currentNight : this.gameData.currentNight
    };
    this.saveGameData();
    this.currentPageSubject.next(this.gameData.currentPage);
  }

  reset() {
    this.initGameData();
    this.roleData = {};
  }

  restart() {
    this.gameData.currentIndex = 0;
    this.gameData.currentNight = 0;
    this.gameData.currentPage = 'gameSetup';
    this.gameData.roles = [];
    this.roleData = {};
    this.currentPageSubject.next(this.gameData.currentPage);
  }

  addPlayer(name: string, role: string) {
    if (
      this.gameData.players.length < this.gameData.roles.length
      && this.gameData.currentIndex >= this.gameData.players.length
    ) {
      this.gameData.players.push(name);
    }
    this.gameData.currentIndex++;
    this.addRoleData(name, role);
    this.saveGameData();
    this.saveRoleData();
  }

  addRoleData(name: string, role: string) {
    if (!this.roleData) {
      this.roleData = {};
    }
    if (role === 'werewolf') {
      if (!this.roleData.werewolves) {
        this.roleData.werewolves = [];
      }
      const werewolfData: Werewolf = {
        name,
        Killed: []
      };
      this.roleData.werewolves.push(werewolfData);
    }
    if (role === 'villager') {
      if (!this.roleData.villagers) {
        this.roleData.villagers = [];
      }
      const villagerData: Villager = {
        name
      };
      this.roleData.villagers.push(villagerData);
    }
    switch (role) {
      case 'witch':
        this.roleData[role] = {
          name,
          poison: '',
          potion: '',
          killedBy: ''
        };
        break;
      case 'seer':
        this.roleData[role] = {
          name,
          killedBy: ''
        };
        break;
      case 'hunter':
        this.roleData[role] = {
          name,
          retaliated: '',
          killedBy: ''
        };
        break;
      case 'guardian':
        this.roleData[role] = {
          name,
          protecting: '',
          killedBy: ''
        };
        break;
    }
  }

}
