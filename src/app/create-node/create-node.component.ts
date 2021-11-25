import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";

@Component({
  selector: 'app-create-node',
  templateUrl: './create-node.component.html',
  styleUrls: ['./create-node.component.css']
})
export class CreateNodeComponent implements OnInit {
  dataSource: string = "root"
  columnNames: string[] = []
  filterList: any[] = []
  operator: string[] = [">=", ">", "=", "<=", "<"]
  colorCtr: any = null
  nodeName: string = ""
  extant: boolean = false
  dfList: string[] = []
  cloneNodeParameters: number = 0
  printColor() {

  }

  cloneParameters() {
    this.colorCtr = this.data.nodes[this.cloneNodeParameters].color
    this.dataSource = this.data.nodes[this.cloneNodeParameters].parent
  }

  constructor(public data: DataService) {
    for (const m in data.dataMap) {
      this.dfList.push(m)
    }
  }

  ngOnInit(): void {
  }

  createFilterForm() {
    this.filterList.push({
      columnNames: "",
      value: "",
      operator: "",
      exact: true,
      keep: true
    })
  }

  deleteFilter(ind: number) {
    this.filterList.splice(ind, 1)
  }

  convertToNumber(data: string) {
    return parseInt(data)
  }
}
