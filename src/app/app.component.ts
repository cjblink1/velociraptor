import { Component, OnInit, NgZone } from '@angular/core';
import * as d3 from 'd3';
import { World } from './model/world';
import { EntityFactory } from './model/entity-factory';
import { NoOp, MoveLeft, MoveUp, MoveRight, MoveDown, Circle400,
  FollowEvader, FigureEight, MouseMove } from './model/strategies/dumb-update-strategies';
import { FollowEvaderSpeed, EscapePredator } from './model/strategies/dynamic-update-stratigies'
import { NgClass } from '@angular/common';
import { ClassStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  protected strategies = [
    {value: FollowEvaderSpeed, viewValue: 'FollowEvaderSpeed'},
    {value: EscapePredator, viewValue: 'EscapePredator'},
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

  protected pursuerStrategy = FollowEvader;
  protected evaderStrategy = MoveLeft;
  private timer: d3.Timer;
  private currentTime: number;
  private world: World;
  protected started: boolean;

  private svg;
  private entities;
  private traces;

  constructor(private zone: NgZone) { }

  ngOnInit(): void {
    this.svg = d3.select('svg');
    this.entities = d3.select('#entities');
    this.traces = d3.select('#traces');
    this.reset();
  }

  start() {
    this.started = true;
    this.currentTime = d3.now();
    this.timer = d3.timer((elapsed) => {
      const previousTime = this.currentTime;
      this.currentTime = d3.now();
      const delta = this.currentTime - previousTime;
      if (!this.world.update(elapsed, delta)) {
       this.timer.stop();
      }
      this.world.render();

      if (elapsed > 15000) {
        this.started = false;
        this.timer.stop();
      }

    }, 15);
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

    this.world = new World(this.svg, 2);
    const entityFactory = new EntityFactory(this.entities, this.traces, this.world);
    const bounds = this.svg.node().getBoundingClientRect();
    this.world.addEntity(entityFactory
      .createEvader(50,
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
