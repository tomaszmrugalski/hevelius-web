import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class Hevelius {
    title = 'Hevelius';
    version = '0.0.2';

    apiUrl = 'http://127.0.0.1/api/';
}
