// @ts-nocheck
import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import * as cytoscape from "cytoscape";
import * as svg from "cytoscape-svg";
import * as cola from "cytoscape-cola";
import {FileSaverService} from "ngx-filesaver";
import {DrawData} from "../classes/draw-data";
import {conditionallyCreateMapObjectLiteral} from "@angular/compiler/src/render3/view/util";

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent implements OnInit, AfterViewInit {
  get drawData(): DrawData {
    return this._drawData;
  }

  @Input() set drawData(value: DrawData) {
    this._drawData = value;
    if (this._drawData.data.length > 0) {
      this.draw()
    }
  }
  cy: cytoscape
  private _drawData: DrawData = new DrawData()
  constructor(private fileSaver: FileSaverService) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    cytoscape.use(cola)
    cytoscape.use(svg)
    this.draw();
  }

  draw() {
    const s: cytoscape.Stylesheet[] = []
    this.cy = cytoscape(
      {
        container: document.getElementById("cy"),
        elements: this.drawData.data,
        style: this.drawData.stylesheet
      })
    this.cy.layout({name: "cola", maxSimulationTime: 20000}).run()
  }

  download() {
    const content = this.cy.svg({cale: 1, full: true})
    const blob = new Blob([content], {type:"image/svg+xml;charset=utf-8"});
    this.fileSaver.save(blob, "demo.svg");
  }
}
