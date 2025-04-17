import { Component, OnInit } from '@angular/core';
import { TelescopeService, Telescope } from '../../services/telescope.service';

@Component({
  selector: 'app-telescope-list',
  templateUrl: './telescope-list.component.html',
  styleUrls: ['./telescope-list.component.css']
})
export class TelescopeListComponent implements OnInit {
  telescopes: Telescope[] = [];
  displayedColumns: string[] = [
    'name',
    'descr',
    'focal',
    'aperture',
    'min_dec',
    'max_dec',
    'sensor',
    'active'
  ];

  constructor(private telescopeService: TelescopeService) { }

  ngOnInit(): void {
    this.loadTelescopes();
  }

  private loadTelescopes(): void {
    this.telescopeService.getTelescopes().subscribe(
      telescopes => {
        this.telescopes = telescopes;
      },
      error => {
        console.error('Error loading telescopes:', error);
      }
    );
  }
}