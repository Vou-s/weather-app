import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  city = '';

  constructor(private router: Router) { }

  searchWeather() {
    if (this.city.trim()) {
      this.router.navigate(['/weather', this.city]);
    }
  }
}
