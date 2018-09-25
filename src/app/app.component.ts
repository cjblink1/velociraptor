import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { World } from './model/world';
import { EntityFactory } from './model/entity-factory';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  protected foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  constructor() {

  }

  ngOnInit(): void {
    const svg = d3.select('svg');
    const entities = d3.select('#entities');
    const traces = d3.select('#traces');
    const world = new World(svg);
    const entityFactory = new EntityFactory(entities, traces, world);

    world.addEntity(entityFactory.createEvader(550, 550));
    world.addEntity(entityFactory.createPursuer(100, 100));

    let currentTime = d3.now();
    const timer = d3.timer((elapsed) => {

      const previousTime = currentTime;
      currentTime = d3.now();
      const delta = currentTime - previousTime;
      world.update(elapsed, delta);
      world.render();

      if (elapsed > 15000) {
        timer.stop();
      }

    }, 15);
  }
}
