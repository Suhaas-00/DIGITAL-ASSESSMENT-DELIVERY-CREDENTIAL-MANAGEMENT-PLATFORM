import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <app-navbar></app-navbar>
    <div class="container-fluid p-0 overflow-hidden">
      <div class="d-flex">
        <nav class="sidebar-container d-none d-md-block shadow-sm" id="sidebarMenu">
          <app-sidebar></app-sidebar>
        </nav>
        <main class="content-area flex-grow-1 animate-fade-in p-4 p-md-5">
           <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-container {
      width: 280px;
      height: calc(100vh - 72px);
      position: sticky;
      top: 72px;
      background: white;
      border-right: 1px solid #f1f5f9;
      overflow-y: auto;
    }
    .content-area {
      height: calc(100vh - 72px);
      overflow-y: auto;
      background: #fbfcfe;
    }
  `]
})
export class LayoutComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}
