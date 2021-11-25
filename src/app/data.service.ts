import { Injectable } from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DrawData} from "./classes/draw-data";
import {Settings} from "./classes/settings";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  settings: Settings = new Settings()
  nodes: any[] = []
  edges: any[] = []
  get df(): IDataFrame {
    return this._df;
  }

  set df(value: IDataFrame) {
    this._df = value;
    this.dataMap["root"] = value
  }

  private _df: IDataFrame = new DataFrame()
  dataMap: any = {}
  constructor(private http: HttpClient) { }

  getGraphExample(): Observable<DrawData> {
    return this.http.get<DrawData>("/assets/example.json")
  }

  getDataExample() {
    return this.http.get("/assets/example.txt", {responseType: "text", observe: "response"})
  }
}
