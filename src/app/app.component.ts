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
    const svg = d3.select('svg');
    const world = new World();
    const entityFactory = new EntityFactory(svg, world);

    world.addEntity(entityFactory.createEvader(500, 300));
    world.addEntity(entityFactory.createPursuer(600, 600));

    const timer = d3.timer((elapsed) => {

      world.update(elapsed);
      world.render();

    }, 15);

    // const node = svg.append('g')
    //   .attr('class', 'nodes')
    // .selectAll('circle')
    // .data([1])
    // .enter().append('circle')
    //   .attr('r', 5)
    //   .attr('fill', function(d) { return d; });

  }

}
