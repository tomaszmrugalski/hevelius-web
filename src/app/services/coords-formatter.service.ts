import { Injectable } from '@angular/core';

/// @brief Formats coordinates in RA and Dec
@Injectable({
  providedIn: 'root'
})
export class CoordsFormatterService {

  formatRA(ra: number): string {
    // Convert RA from degrees to hours (divide by 15 since 360° = 24h)
    // @param ra: number - RA in hours (0.0 to 24.0)
    // @return string - RA in sexagesimal format (HHh MMm SS.Ss)
    const totalHours = ra / 1;

    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    const seconds = ((totalHours - hours) * 60 - minutes) * 60;

    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toFixed(1).padStart(4, '0')}s`;
  }

  formatDec(dec: number): string {
    // Format Dec in sexagesimal format (DD° MM' SS.S")
    // @param dec: number - Dec in degrees (-90.0 to 90.0)
    // @return string - Dec in sexagesimal format (DD° MM' SS.S")
    const sign = dec >= 0 ? '+' : '-';
    dec = Math.abs(dec);

    const degrees = Math.floor(dec);
    const minutes = Math.floor((dec - degrees) * 60);
    const seconds = ((dec - degrees) * 60 - minutes) * 60;

    return `${sign}${degrees.toString().padStart(2, '0')}° ${minutes.toString().padStart(2, '0')}' ${seconds.toFixed(1).padStart(4, '0')}"`;
  }
}
