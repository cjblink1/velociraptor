import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

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

    const th = svg.append('circle')
      .attr('id', 'th')
      .attr('r', 30)
      .attr('cx', 300)
      .attr('cy', 300);

    const raptor = svg.append('circle')
      .attr('id', 'raptor')
      .attr('r', 10)
      .attr('cx', 500)
      .attr('cy', 300);

    const timer = d3.timer((elapsed) => {
      const th_x = th.attr('cx');
      const th_y = th.attr('cy');

      th.attr('cx', parseFloat(th_x) + .5);
      th.attr('cy', parseFloat(th_y) + .5);

      if (elapsed > 15000) {
        timer.stop();
      }

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
