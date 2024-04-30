import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/session/auth.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter, Subscription } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { GeneralService } from '../../services/general.service';
import { Feature } from '../../models/features';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
    NgIf,
    RouterLink,
  ],
})
export class NavigationComponent implements OnDestroy, OnInit {
  // TODO: Fix buttons hover effect being weird (corners don't mark the whole button as hovered)
  // TODO: Make nav menu be responsive and automatically close on small screens

  subscriptionManager: Subscription = new Subscription();

  username: string;

  sidenav: boolean = true;
  isAdmin: boolean = false;
  getPathPoint: boolean = false;
  getExplorationRole: boolean = false;
  adminPanel: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private generalService: GeneralService,
  ) {
    this.username = authService.getCurrentUser()!.username;

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => {
          return event instanceof NavigationEnd;
        }),
      )
      .subscribe((event: NavigationEnd) => {
        this.adminPanel = event.url.startsWith('/admin');
      });
  }

  ngOnInit(): void {
    this.isAdmin = this.generalService.hasFeature(Feature.ADMIN);
    this.getPathPoint = this.generalService.hasFeature(Feature.GET_PATH_POINT);
    this.getExplorationRole = this.generalService.hasFeature(Feature.GET_EXPLORATION_ROLE);
  }

  ngOnDestroy(): void {
    this.subscriptionManager.unsubscribe();
  }

  logout() {
    this.authService.signOut();
  }

  toggleSidenav() {
    this.sidenav = !this.sidenav;
  }

  navigateTo(location: string) {
    this.router.navigate([location]);
  }
}
