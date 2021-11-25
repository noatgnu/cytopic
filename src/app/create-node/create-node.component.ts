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
  dfList: any[] = []
  cloneNodeParameters: number = 0
  printColor() {

  }

  cloneParameters() {
    this.colorCtr = this.data.nodes[this.cloneNodeParameters].color
    this.dataSource = this.data.nodes[this.cloneNodeParameters].parent
  }

  constructor(public data: DataService) {
    this.dfList = this.getKeys()
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

  getKeys() {
    const result: any = []
    for (const s of Object.keys(this.data.dataMap)) {
      if (s !== "root") {
        const n = this.convertToNumber(s)
        if (this.data.nodes[n]) {
          result.push({id: s, name: s + ". " + this.data.nodes[n].name})
        }
      } else {
        result.push({id: "root", name: "root"})
      }

    }
    return result
  }
}
