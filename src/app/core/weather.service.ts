import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  apiKey = environment.weatherApiKey;
  apiUrl = environment.weatherapiUrl;

  constructor(private http: HttpClient) { }

  getWeather(city: string) {
    const url = `${this.apiUrl}?q=${city}&units=metric&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getForecast(city: string) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getCoordinates(city: string): Observable<any> {
  return this.http.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`
  );
}

}
