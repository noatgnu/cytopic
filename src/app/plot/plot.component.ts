// @ts-nocheck
import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import * as cytoscape from "cytoscape";
import * as svg from "cytoscape-svg";
import * as cola from "cytoscape-cola";
import * as popper from "cytoscape-popper";
import tippy from "tippy.js";
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
    cytoscape.use(popper)
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
    for (const n of this.cy.nodes()) {
      let ref = n.popperRef()
      let de = document.createElement('div');

      n.tippy = tippy(de, {
        getReferenceClientRect: ref.getBoundingClientRect,
        trigger: 'manual',
        theme: 'light',
        arrow: true,
        allowHTML: true,
        animation: 'fade',
        content: () => {
          let div = document.createElement('div');
          let content = ""
          if (n.data().count) {
            content = "Count:" + n.data().count
          } else {
            content = "Label:" + n.data().label
          }
          div.innerHTML = `<div>${content}</div>`
          document.body.append(div)
          return div
        }
      })
      n.unbind("mouseover");
      n.bind("mouseover", function (event) {
        console.log(event.target)
        event.target.tippy.show()
      })
      n.unbind("mouseout");
      n.bind("mouseout", event => event.target.tippy.hide())
    }
  }

  download() {
    const content = this.cy.svg({cale: 1, full: true})
    const blob = new Blob([content], {type:"image/svg+xml;charset=utf-8"});
    this.fileSaver.save(blob, "demo.svg");
  }
}
