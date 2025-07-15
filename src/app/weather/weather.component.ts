import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WeatherService } from '../weather.service';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]

})
export class WeatherComponent implements OnInit {
  route = inject(ActivatedRoute);
  weatherService = inject(WeatherService);

  city = '';
  weather: any;
  error = '';
  loading = false;
  forecast: any[] = [];

  ngOnInit(): void {
    this.city = this.route.snapshot.paramMap.get('city') || '';
    if (!this.city) {
      this.error = 'City not specified.';
      return;
    }

    this.loading = true;

    this.weatherService.getWeather(this.city).subscribe({
      next: (data) => this.weather = data,
      error: () => this.error = 'Failed to fetch weather.'
    });

    this.weatherService.getForecast(this.city).subscribe({
      next: (data: any) => {
        // Ambil 1 data per hari (jam 12:00)
        this.forecast = data.list.filter((item: any) => item.dt_txt.includes('12:00:00'));
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to fetch forecast.';
        this.loading = false;
      }
    });
  }

}


