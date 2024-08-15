import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import MetisMenu from 'metismenujs';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'wlrd-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.5s ease-in-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('componentRef') scrollRef = null;
  @Input() isCondensed = false;
  menu: any;
  data: any;

  menuItems: any[] = [];

  @ViewChild('sideMenu') sideMenu: ElementRef | undefined;

  constructor(private router: Router, public sidebarservice: SidebarService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        //console.log('NavigationEnd::', event);
        this._activateMenuDropdown();
        this._scrollElement();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((!this.isCondensed && this.sideMenu) || this.isCondensed) {
      setTimeout(() => {
        if (this.sideMenu) {
          // Add null check
          this.menu = new MetisMenu(this.sideMenu.nativeElement);
        }
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }

  ngAfterViewInit(): void {
    if (this.sideMenu) {
      // Add null check
      this.menu = new MetisMenu(this.sideMenu.nativeElement);
      this._activateMenuDropdown();
      this.menuItems.forEach((item, index) => {
        item.nativeElement.style.animationDelay = `${index * 0.1}s`;
      });
    }
  }

  ngOnInit(): void {
    this.initialize();
    this._scrollElement();
  }

  openedModule: string | null = null;
  activeLink: string | null = null;

  toggleModule(moduleTitle: string): void {
    this.openedModule = this.openedModule === moduleTitle ? null : moduleTitle;
  }

  setActiveLink(link: string): void {
    this.activeLink = link;
  }

  isActiveLink(link: string): boolean {
    return this.activeLink === link;
  }


  hasItems(item: any) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  toggleMenu(event: any) {
    event.currentTarget.nextElementSibling.classList.toggle('mm-show');
  }

  _scrollElement() {
    setTimeout(() => {
      if (document.getElementsByClassName('mm-active').length > 0) {
        const currentPosition = (
          document.getElementsByClassName('mm-active')[0] as HTMLElement
        ).offsetTop;
        if (
          this.scrollRef !== null &&
          (this.scrollRef as any).SimpleBar !== null
        ) {
          // Add null check and type assertion
          (this.scrollRef as any).SimpleBar.getScrollElement().scrollTop =
            currentPosition + 300;
        }
      }
    }, 300);
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: string) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push((links[i] as HTMLAnchorElement).pathname);
    }
    var itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement?.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) {
              childAnchor.classList.add('mm-active');
            }
            if (childDropdown) {
              childDropdown.classList.add('mm-active');
            }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                parent5El.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') {
                  childanchor.classList.add('mm-active');
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Initialize
   */
  initialize(): void {
    this.menuItems = this.sidebarservice.menu;
  }
}
