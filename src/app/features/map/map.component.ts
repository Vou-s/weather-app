import { Component, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';

import Icon from 'ol/style/Icon';
import { CommonModule } from '@angular/common';
import { defaults as defaultControls } from 'ol/control';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';


@Component({
  selector: 'app-map',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() coordinates: [number, number] | null = null;

  private vectorLayer!: VectorLayer<VectorSource>;
  private vectorSource = new VectorSource; // hanya sekali buat

  private map!: Map;
  private markerLayer = new VectorLayer({ source: new VectorSource() });
  @Input() temperature: number | null = null;


  ngAfterViewInit(): void {
    const lonLat = this.coordinates || [110.3671, -7.7956];

    // ✅ Satu vectorSource untuk seluruh sesi
    this.vectorSource = new VectorSource();

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          }),
        }),
        this.vectorLayer, // ✅ Layer langsung dimasukkan sekali
      ],
      view: new View({
        center: fromLonLat(lonLat),
        zoom: 12,
      }),
      controls: defaultControls(),
    });

    if (this.coordinates) {
      this.addOrUpdateMarker();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coordinates'] && this.map) {
      this.addOrUpdateMarker();
    }
  }


addOrUpdateMarker() {
  if (!this.coordinates || !this.map) return;

  const lonLat = this.coordinates;
  const temp = this.temperature ?? 25;
  const color = this.getColorByTemp(temp);

  // ✅ Bersihkan semua fitur (hapus marker lama)
  this.vectorSource.clear();

  // ✅ Buat marker baru
  const marker = new Feature({
    geometry: new Point(fromLonLat(lonLat)),
  });

  marker.setStyle(
    new Style({
      image: new CircleStyle({
        radius: 12,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
      }),
    })
  );

  // ✅ Tambahkan marker ke vectorSource
  this.vectorSource.addFeature(marker);

  // Geser map ke lokasi
  this.map.getView().setCenter(fromLonLat(lonLat));
}




  getColorByTemp(temp: number): string {
    if (temp < 10) return '#00f'; // biru
    if (temp < 20) return '#0ff'; // cyan
    if (temp < 30) return '#0f0'; // hijau
    if (temp < 35) return '#ff0'; // kuning
    return '#f00'; // merah
  }

}
