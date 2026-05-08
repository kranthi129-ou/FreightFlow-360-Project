import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { PublicNavbar } from '../../shared/public-navbar/public-navbar';

@Component({
  selector: 'app-portal-sign-in',
  standalone: true,
  imports: [CommonModule, RouterLink, PublicNavbar],
  templateUrl: './portal-sign-in.html',
  styleUrl: './portal-sign-in.css'
})
export class PortalSignIn implements AfterViewInit, OnDestroy {
  @ViewChildren('revealCard') revealCards!: QueryList<ElementRef<HTMLElement>>;

  comingSoonMessage = '';
  constructionGifUrl = 'https://media.tenor.com/vTHdSPiV13MAAAAM/clash-of-clans-build-air-coc.gif';

  private observer?: IntersectionObserver;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const isMobileOrTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    if (!isMobileOrTouchDevice) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'scroll-active');
          } else {
            this.renderer.removeClass(entry.target, 'scroll-active');
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: '-8% 0px -18% 0px'
      }
    );

    this.revealCards.forEach((card) => {
      this.observer?.observe(card.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  showComingSoon(portalName: string): void {
    this.comingSoonMessage = `${portalName} portal is under construction.`;

    setTimeout(() => {
      this.comingSoonMessage = '';
    }, 2200);
  }
}