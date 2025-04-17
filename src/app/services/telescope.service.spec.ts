import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TelescopeService } from './telescope.service';
import { Hevelius } from 'src/hevelius';

describe('TelescopeService', () => {
  let service: TelescopeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TelescopeService]
    });
    service = TestBed.inject(TelescopeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch telescopes and transform the response', () => {
    const mockResponse = {
      telescopes: [
        {
          scope_id: 1,
          name: 'Test Telescope',
          descr: 'Test Description',
          min_dec: -30,
          max_dec: 90,
          focal: 1000,
          aperture: 200,
          lon: 0,
          lat: 0,
          alt: 0,
          sensor: {
            sensor_id: 1,
            name: 'Test Sensor',
            resx: 1000,
            resy: 1000,
            pixel_x: 5,
            pixel_y: 5,
            bits: 16,
            width: 20,
            height: 20
          },
          active: true
        }
      ]
    };

    service.getTelescopes().subscribe(telescopes => {
      expect(telescopes.length).toBe(1);
      expect(telescopes[0].name).toBe('Test Telescope');
      expect(telescopes[0].sensor?.name).toBe('Test Sensor');
    });

    const req = httpMock.expectOne(`${Hevelius.apiUrl}/scopes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle null sensor data', () => {
    const mockResponse = {
      telescopes: [
        {
          scope_id: 1,
          name: 'Test Telescope',
          descr: 'Test Description',
          min_dec: -30,
          max_dec: 90,
          focal: null,
          aperture: null,
          lon: null,
          lat: null,
          alt: null,
          sensor: null,
          active: true
        }
      ]
    };

    service.getTelescopes().subscribe(telescopes => {
      expect(telescopes.length).toBe(1);
      expect(telescopes[0].name).toBe('Test Telescope');
      expect(telescopes[0].sensor).toBeNull();
      expect(telescopes[0].focal).toBeNull();
    });

    const req = httpMock.expectOne(`${Hevelius.apiUrl}/scopes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});