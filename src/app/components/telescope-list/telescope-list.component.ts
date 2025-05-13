import { Component, OnInit } from '@angular/core';
import { TelescopeService, Telescope } from '../../services/telescope.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-telescope-list',
    templateUrl: './telescope-list.component.html',
    styleUrls: ['./telescope-list.component.css'],
    standalone: false
})
export class TelescopeListComponent implements OnInit {
  dataSource = new MatTableDataSource<Telescope>();
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
        this.dataSource.data = telescopes;
      },
      error => {
        console.error('Error loading telescopes:', error);
      }
    );
  }
}