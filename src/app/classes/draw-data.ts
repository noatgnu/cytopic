import {ElementDefinition, ElementsDefinition, Stylesheet} from "cytoscape";

export class DrawData {
  data: | ElementsDefinition
    | ElementDefinition[]
    | Promise<ElementsDefinition>
    | Promise<ElementDefinition[]>
    | undefined = [];
  stylesheet: Stylesheet[] | Promise<Stylesheet[]> | undefined = [];
}
