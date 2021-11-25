import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataFrame, fromCSV, IDataFrame, Series} from 'data-forge';
import {MatDialog} from "@angular/material/dialog";
import {CreateNodeComponent} from "./create-node/create-node.component";
import {DataService} from "./data.service";
import {DrawData} from "./classes/draw-data";
import {MatTable} from "@angular/material/table";
import {CreateEdgeComponent} from "./create-edge/create-edge.component";
import {PlotComponent} from "./plot/plot.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  get proteinNodeSize(): number {
    return this._proteinNodeSize;
  }

  set proteinNodeSize(value: number) {
    this._data.settings.proteinNodeSize = value
    this._proteinNodeSize = value;
  }

  get edgeSize(): number {
    return this._edgeSize;
  }

  set edgeSize(value: number) {
    this._data.settings.edgeSize = value
    this._edgeSize = value;
  }

  get nodeScalingFactor(): number {
    return this._nodeScalingFactor;
  }

  set nodeScalingFactor(value: number) {
    this._data.settings.scaleFactor = value
    this._nodeScalingFactor = value;
  }
  get fcColumn(): string {
    return this._fcColumn;
  }

  set fcColumn(value: string) {
    this._data.settings.fcColumn = value;
    this._fcColumn = value;
  }
  get labelColumn(): string {
    return this._labelColumn;
  }

  set labelColumn(value: string) {
    this._data.settings.labelColumn = value;
    this._labelColumn = value;
  }
  @ViewChild('table') table: MatTable<any>|undefined;
  @ViewChild('edgeTable') edgeTable: MatTable<any>|undefined;
  @ViewChild('cyto') cyto: PlotComponent|undefined;
  get df(): IDataFrame {
    return this._df;
  }

  set df(value: IDataFrame) {
    if (value.count() > 0) {
      this._df = value;
      this.loadedFile = true
    }
  }

  private _df: IDataFrame = new DataFrame()

  private _labelColumn: string = this._data.settings.labelColumn
  private _fcColumn: string = this._data.settings.labelColumn
  private _proteinNodeSize: number = this._data.settings.proteinNodeSize
  private _edgeSize: number = this._data.settings.edgeSize
  private _nodeScalingFactor: number = this._data.settings.scaleFactor

  title = 'CYTOPIC';
  opened = true;
  drawData: DrawData = new DrawData()
  loadedFile: boolean = false;

  constructor(private dialog: MatDialog, public _data: DataService) {

  }

  ngOnInit() {
    this._data.getGraphExample().subscribe(result => {
      //this.drawData = result
    })
  }

  ngAfterViewInit() {

  }

  createNode() {
    const dialogRef = this.dialog.open(CreateNodeComponent)
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result.accept) {
        const nodeData: any[] = []
        for (const r of result.data.toArray()) {
          const pass = []
          for (const fi of result.filterList) {
            let filterPass = 0;
            for (const f of fi.columnNames) {
              let source: any
              if (!isNaN(r[f])) {
                source = parseFloat(r[f])
              } else {
                source = r[f]
              }
              let target: any
              if (!isNaN(fi.value)) {
                target = parseFloat(fi.value)
              } else {
                target = fi.value
              }
              switch (fi.operator) {
                case ">=":
                  if (source >= target) {
                    filterPass ++
                  }
                  break
                case ">":
                  if (source > target) {
                    filterPass ++
                  }
                  break
                case "=":
                  if (source === target) {
                    filterPass ++
                  }
                  break
                case "<":
                  if (source < target) {
                    filterPass ++
                  }
                  break
                case "=<":
                  if (source <= target) {
                    filterPass ++
                  }
                  break
              }
            }
            if (fi.keep) {
              if (fi.exact) {
                if (filterPass === fi.columnNames.length) {
                  pass.push(true)
                }
              } else {
                if (filterPass > 0) {
                  pass.push(true)
                }
              }
            } else {
              if (fi.exact) {
                if (filterPass !== fi.columnNames.length) {
                  pass.push(true)
                }
              } else {
                if (filterPass === 0) {
                  pass.push(true)
                }
              }
            }

          }
          if (pass.length === result.filterList.length) {
            nodeData.push(r)
          }
        }
        const nodeID = this._data.nodes.length.toString()
        this._data.dataMap[nodeID] = new DataFrame(nodeData)
        this._data.nodes.push({id: nodeID, name: result.nodeName, color: result.color, count: this._data.dataMap[nodeID].count(), extant: result.extant, parent: result.parent})
        if(this.table) {
          this.table.renderRows()
        }

        this.createNodesData()
      }
    })
  }

  createEdge() {
    const dialogRef = this.dialog.open(CreateEdgeComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result.accept) {
        for (const e of result.edges) {
          e.id = e.id +"_"+ e.source+"_" + e.target
          this._data.edges.push(e)
        }
        if (this.edgeTable) {
          this.edgeTable.renderRows()
        }
        this.createNodesData()
      }
    })
  }

  createNodesData() {
    const data: any = []
    const style: any = []
    for (const n of this._data.nodes) {
      data.push({data: {id: n.id, label: n.name, size: this._nodeScalingFactor * n.count}, classes: n.id+n.name})
      style.push({selector: "." + n.id+n.name, style: {label: "data(label)", "background-color": "#" +n.color.hex, height: "data(size)", width: "data(size)"}})
      if (n.extant) {
        const first = this._data.dataMap[n.id].first()
        let m: number
        console.log(this._data.dataMap[n.id].getSeries(this.fcColumn).bake())
        if (!(typeof first[this.fcColumn] === "number")) {
          const fc = this._data.dataMap[n.id].getSeries(this.fcColumn).bake().parseFloats()
          m = fc.max()
          this._data.dataMap[n.id] = this._data.dataMap[n.id].withSeries(this.fcColumn, new Series(fc.toArray())).bake()
        } else {
          m = this._data.dataMap[n.id].getSeries(this.fcColumn).bake().max()
        }

        const sorted = this._data.dataMap[n.id].orderByDescending((row: { [x: string]: any; }) => row[this.fcColumn]).bake()

        for (const i of sorted.head(15).bake().toArray()) {
          const opacity = i[this.fcColumn]/m
          data.push({data: {id: i[this.labelColumn], label: i[this.labelColumn], size: this._proteinNodeSize}, classes: i[this.labelColumn]})
          data.push({data: {source: n.id, target: i[this.labelColumn]}, classes: n.id+i[this.labelColumn]})
          style.push({selector: "." + i[this.labelColumn], style: {label: "data(label)", "background-color": "#" +n.color.hex, height: "data(size)", width: "data(size)", opacity: parseFloat(i[this.fcColumn])/m}})
          style.push({selector: "."+n.id+i[this.labelColumn], style: {"line-color": "#" + n.color.hex, opacity: opacity, width: this._edgeSize}})
        }
      }
    }
    for (const e of this._data.edges) {
      data.push({data: {source: e.source, target: e.target}, classes: e.id})
      style.push({selector: "."+e.id, style: {"line-color": "#" + e.color.hex, width: this._edgeSize}})
    }

    const a = new DrawData()
    a.data = data
    a.stylesheet = style
    this.drawData = a
    console.log(this.drawData)
  }

  deleteNode(id: number) {
    this._data.nodes.splice(id, 1)
    this.table?.renderRows()
    this.createNodesData()
  }

  toggleSideNav() {
    this.opened = !this.opened
  }

  uploadSettingsData(a: HTMLInputElement) {
    a.click()
  }

  loadExampleFile() {
    this._data.getDataExample().subscribe(result => {
      this.df = fromCSV(<string>result.body)
      this._data.df = this._df
    })
  }

  deleteEdge(index: any) {
    for (let i = 0; i < this._data.edges.length; i++) {
      if (this._data.edges[i].id === index) {
        this._data.edges.splice(i, 1)
        break
      }
    }
    this.createNodesData()
  }

  _uploadSettings(e: Event) {
    if (e.target) {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const reader = new FileReader()
        reader.onload = (e: any) => {
          this.df = fromCSV(<string>reader.result);
          this._data.df = this.df
        }
        reader.readAsText(target.files[0])
      }
    }
  }

  download() {
    this.cyto?.download()
  }
}
