import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../data.service";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-create-edge',
  templateUrl: './create-edge.component.html',
  styleUrls: ['./create-edge.component.css']
})
export class CreateEdgeComponent implements OnInit {
  @ViewChild('table') table: MatTable<any>|undefined;
  edges: any[] = []
  source: number = 0
  target: number[] = []
  colorCtr: any = null
  constructor(public data: DataService) {
  }

  addEdge() {
    for (const e of this.target) {
      this.edges.push({id: this.edges.length, source: this.source, target: e, color: this.colorCtr})
    }
    if (this.table) {
      this.table.renderRows()
    }
    console.log(this.edges)
  }

  deleteEdge(index: number) {
    this.edges.splice(index, 1)
  }

  ngOnInit(): void {
  }

}
