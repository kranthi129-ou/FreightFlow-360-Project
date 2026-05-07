import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PublicNavbar } from '../../shared/public-navbar/public-navbar';

@Component({
  selector: 'app-portal-sign-in',
  standalone: true,
  imports: [CommonModule, RouterLink, PublicNavbar],
  templateUrl: './portal-sign-in.html',
  styleUrl: './portal-sign-in.css'
})
export class PortalSignIn {
  comingSoonMessage = '';
  constructionGifUrl = 'https://media.tenor.com/vTHdSPiV13MAAAAM/clash-of-clans-build-air-coc.gif';

  showComingSoon(portalName: string): void {
    this.comingSoonMessage = `${portalName} portal is under construction.`;

    setTimeout(() => {
      this.comingSoonMessage = '';
    }, 2200);
  }
}