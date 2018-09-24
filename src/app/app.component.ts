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

  constructor() {

  }

  ngOnInit(): void {
    const entities = d3.select('#entities');
    const traces = d3.select('#traces');
    const world = new World();
    const entityFactory = new EntityFactory(entities, traces, world);

    world.addEntity(entityFactory.createEvader(550, 550));
    world.addEntity(entityFactory.createPursuer(100, 100));

    const timer = d3.timer((elapsed) => {

      world.update(elapsed);
      world.render();

      if (elapsed > 15000) {
        timer.stop();
      }

    }, 15);
  }
}
