import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <app-navbar></app-navbar>
    <div class="container-fluid">
      <div class="row">
        <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse shadow-sm position-fixed h-100 p-0" id="sidebarMenu">
          <app-sidebar></app-sidebar>
        </nav>
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4 pt-5">
           <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      top: 56px;
      z-index: 100;
    }
  `]
})
export class LayoutComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}
