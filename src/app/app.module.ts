import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {FileSaverModule} from "ngx-filesaver";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import { PlotComponent } from './plot/plot.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CreateNodeComponent } from './create-node/create-node.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import {MatMenuModule} from "@angular/material/menu";
import {
  MAT_COLOR_FORMATS,
  NGX_MAT_COLOR_FORMATS,
  NgxMatColorPickerModule
} from "@angular-material-components/color-picker";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTableModule} from "@angular/material/table";
import { CreateEdgeComponent } from './create-edge/create-edge.component';

@NgModule({
  declarations: [
    AppComponent,
    PlotComponent,
    CreateNodeComponent,
    CreateEdgeComponent
  ],
  imports: [
    BrowserModule,
    FileSaverModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatInputModule,
    HttpClientModule,
    MatMenuModule,
    NgxMatColorPickerModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule
  ],
  providers: [{provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS}],
  bootstrap: [AppComponent]
})
export class AppModule { }
