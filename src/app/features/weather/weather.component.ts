import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, MapComponent],
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
export class WeatherComponent {
  @Input() data: any;
  @Input() forecast: any[] = [];
  @Input() coordinates: [number, number] | null = null;
  @Input() temperature: number | null = null;

  get hasData(): boolean {
    return !!this.data?.main && !!this.data?.weather;
  }
}
