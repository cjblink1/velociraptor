import { Component, OnInit, NgZone } from '@angular/core';
import * as d3 from 'd3';
import { World } from './model/world';
import { EntityFactory } from './model/entity-factory';
import { NoOp, MoveLeft, MoveUp, MoveRight, MoveDown, Circle400,
  FollowEvader, FigureEight, MouseMove } from './model/strategies/dumb-update-strategies';
import { FollowEvaderSpeed, EscapePredator, Turn, EscapePredatorTurn,GoDirectionOfEvader } from './model/strategies/dynamic-update-stratigies'
import { PreyStratgey1, PredatorStratgey1 } from './model/strategies/stragey1';
import { PreyStratgey2, PredatorStratgey2 } from './model/strategies/stratgey2';

import { NgClass } from '@angular/common';
import { ClassStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  protected strategies = [
    {value: PreyStratgey1, viewValue: 'PreyStratgey1'},  
    {value: PredatorStratgey1, viewValue: 'PredatorStratgey1'},
    {value: PreyStratgey2, viewValue: 'PreyStratgey2'},  
    {value: PredatorStratgey2, viewValue: 'PredatorStratgey2'},
    {value: FollowEvaderSpeed, viewValue: 'FollowEvaderSpeed'},
    {value: GoDirectionOfEvader, viewValue: 'GoDirectionOfEvader'},
    {value: Turn, viewValue: 'TurnLeft'},
    {value: MouseMove, viewValue: 'Mouse Move'},
    {value: EscapePredatorTurn, viewValue: 'EscapePredatorTurn'},
    {value: NoOp, viewValue: 'No Op'},
    {value: MoveLeft, viewValue: 'Move Left'},
    {value: MoveUp, viewValue: 'Move Up'},
    {value: MoveRight, viewValue: 'Move Right'},
    {value: MoveDown, viewValue: 'Move Down'},
    {value: Circle400, viewValue: 'Circle 400'},
    {value: FigureEight, viewValue: 'Figure Eight'},
    {value: FollowEvader, viewValue: 'Follow Evader'},
    {value: MouseMove, viewValue: 'Mouse Move'},
  ];

  protected pursuerStrategy = PredatorStratgey1;
  protected evaderStrategy = PreyStratgey1;
  private timer: d3.Timer;
  private currentTime: number;
  private world: World;
  protected started: boolean;

  private svg;
  private entities;
  private traces;
  private eaten;

  constructor(private zone: NgZone) { }

  ngOnInit(): void {
    this.svg = d3.select('svg');
    this.entities = d3.select('#entities');
    this.traces = d3.select('#traces');
    this.reset();
  }

  start() {
    this.eaten = false;
    this.started = true;
    this.currentTime = d3.now();
    this.timer = d3.timer((elapsed) => {
      const previousTime = this.currentTime;
      this.currentTime = d3.now();
      const delta = this.currentTime - previousTime;
      if (!this.world.update(elapsed, delta)) {
       this.timer.stop();
       this.eaten = true;
       this.svg.append("svg:text")
       .attr('id', 'txt')
       .attr("text-anchor", "middle")
       .attr('x', 500)
       .attr('y', 300)
       .attr('font-size', '200px')
       .attr('fill', 'red')
       .text("yummy");
      }
      this.world.render();

      if (elapsed > 15000) {
        this.started = false;
        if (! this.eaten) {
          this.svg.append("svg:text")
          .attr('id', 'txt')
          .attr("text-anchor", "middle")
          .attr('x', 500)
          .attr('y', 300)
          .attr('font-size', '100px')
          .attr('fill', 'blue')
          .text("thx obama :/");
        }
       
        this.timer.stop();
      }

    }, 1);
  }

  stop() {
    this.started = false;
    this.timer.stop();
  }

  resume() {

  }

  reset() {
    this.started = false;

    if (this.timer) {
      this.timer.stop();
    }

    if (this.world) {
      this.world.clear();
    }


    d3.select("#txt").remove();

    const startingDistance = Math.floor(Math.random() * 35) + 15;

    this.world = new World(this.svg, .5);
    const entityFactory = new EntityFactory(this.entities, this.traces, this.world);
    const bounds = this.svg.node().getBoundingClientRect();
    this.world.addEntity(entityFactory
      .createEvader(startingDistance,
                    0,
                    this.evaderStrategy));
    this.world.addEntity(entityFactory.createPursuer(0, 0, this.pursuerStrategy));
  }

  changePursuerStrategy() {
    this.world.changeStrategyForType('pursuer', this.pursuerStrategy);
  }

  changeEvaderStrategy() {
    this.world.changeStrategyForType('evader', this.evaderStrategy);
  }
}
