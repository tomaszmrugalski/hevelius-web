import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class Hevelius {
    static title = 'Hevelius';
    static version = '0.0.4';

    // Make sure there is no trailing slash
    static apiUrl = 'http://localhost:5000/api';
}
