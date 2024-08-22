import { Component, OnInit } from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout'
import { fromEvent, map } from 'rxjs';
import { menuItems } from './shared/models/menu';
import { MenuItem } from './shared/models/menuItem';



export const SCROOL_CONTAINER = 'mat-sidenav-content ';
export const TEXT_LIMIT = 50;
export const SHADOW_LIMIT = 100;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  public isSmallScreen = false;
  public popText = false;
  public applyShadow = false;
  public items_menu: MenuItem[] = menuItems;


  constructor(private  breakpointObserver: BreakpointObserver) {}

ngOnInit(): void {
    const content = document.getElementsByClassName(SCROOL_CONTAINER) [0];

    fromEvent(content, 'scroll')
    .pipe(
      map(() => content.scrollTop)
    )
    .subscribe({
      next: (value: number) => this.determineHeader(value)
    })
}

determineHeader(scrollTop: number) {
  this.popText = scrollTop >= TEXT_LIMIT;
  this.applyShadow = scrollTop >= SHADOW_LIMIT;
}

  ngAfterContentInit(): void {
    this.breakpointObserver
    .observe(['(max-width: 800px)'])
    .subscribe((res) => this.isSmallScreen = res.matches);
  }

  get sidenavMode() {
    return this.isSmallScreen ? 'over' : 'side';
  }


}
