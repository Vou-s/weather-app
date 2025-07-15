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

  private map!: Map;
  private markerLayer = new VectorLayer({ source: new VectorSource() });
  @Input() temperature: number | null = null;


  ngAfterViewInit(): void {
    const lonLat = this.coordinates || [110.3671, -7.7956];
    const pointFeature = new Feature({
      geometry: new Point(fromLonLat(lonLat))
    });

    // ✅ Pindahkan deklarasi color ke atas
    const temp = this.temperature ?? 25;
    const color = this.getColorByTemp(temp);

    // ✅ Baru digunakan setelah dideklarasikan
    pointFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 12,
          fill: new Fill({ color }),
          stroke: new Stroke({ color: '#fff', width: 2 })
        })
      })
    );

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [pointFeature]
      })
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          })
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat(lonLat),
        zoom: 12
      }),
      controls: defaultControls({ zoom: true, rotate: false })
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coordinates'] && this.coordinates && this.map) {
      this.addMarker();
    }
  }

  private addMarker() {
    const [lon, lat] = this.coordinates!;
    const point = new Point(fromLonLat([lon, lat]));
    const marker = new Feature(point);

    marker.setStyle(new Style({
      image: new Icon({
        src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        scale: 0.05
      })
    }));

    const vectorSource = new VectorSource({ features: [marker] });
    this.markerLayer.setSource(vectorSource);
    this.map.getView().animate({ center: fromLonLat([lon, lat]), zoom: 10 });
  }

  getColorByTemp(temp: number): string {
    if (temp < 10) return '#00f'; // biru
    if (temp < 20) return '#0ff'; // cyan
    if (temp < 30) return '#0f0'; // hijau
    if (temp < 35) return '#ff0'; // kuning
    return '#f00'; // merah
  }

}
