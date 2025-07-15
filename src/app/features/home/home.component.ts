import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { WeatherComponent } from "../weather/weather.component";
import { MapComponent } from "../map/map.component";
import { WeatherService } from '../../core/weather.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, WeatherComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  city: string = '';
  weatherData: any = null;
  forecastData: any[] = [];
  coordinates: [number, number] | null = null;
  showError: any;

  constructor(
    private weatherService: WeatherService
  ) { }

  searchWeather() {
    if (!this.city.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Tolong isi terlebih dahulu nama kota!'
      });
      return;
    }

    // Ambil cuaca sekarang
    this.weatherService.getWeather(this.city).subscribe(data => {
      this.weatherData = data;
    });

    // Ambil data forecast
    this.weatherService.getForecast(this.city).subscribe((data: any) => {
      this.forecastData = data.list.filter((_: any, i: number) => i % 8 === 0);
    });

    // Ambil koordinat lokasi
    this.weatherService.getCoordinates(this.city).subscribe(loc => {
      if (loc.length > 0) {
        const { lon, lat } = loc[0];
        this.coordinates = [lon, lat];
      }
    });
  }
}
