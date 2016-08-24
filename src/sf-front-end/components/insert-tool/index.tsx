import "./index.scss";

import * as React from "react";
import { IActor } from "sf-core/actors";
import { Action } from "sf-core/actions";
import { startDrag } from "sf-front-end/utils/component";
import { BoundingRect } from "sf-core/geom";
import { FrontEndApplication } from "sf-front-end/application";
import { SelectablesComponent } from "sf-front-end/components/selectables";
import { SelectionSizeComponent } from "sf-front-end/components/selection-size";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";
import { IEntity, IContainerEntity, IVisibleEntity } from "sf-core/entities";
import { Workspace, Editor, DisplayEntitySelection, InsertTool } from "sf-front-end/models";
import { SetToolAction, SelectAction } from "sf-front-end/actions";

class InsertToolComponent extends React.Component<{ editor: Editor, bus: IActor, workspace: Workspace, app: FrontEndApplication }, any> {

  private _targetEntity: IEntity;

  componentDidMount() {
    this._targetEntity = this.props.editor.activeEntity;
  }

  private _insertNewItem = async (syntheticEvent) => {

    const event = syntheticEvent.nativeEvent as MouseEvent;

    const { editor, bus, workspace } = this.props;
    const tool: InsertTool = editor.currentTool as InsertTool;

    const activeEntity =  this._targetEntity as IContainerEntity;
    const entity: IVisibleEntity = (await activeEntity.appendSourceChildNode(tool.createSource()))[0] as IVisibleEntity
    await bus.execute(new SelectAction(entity));

    const capabilities = entity.display.capabilities;

    let left = 0;
    let top  = 0;


    if (capabilities.movable) {
      left = (event.pageX - editor.transform.left) / editor.transform.scale;
      top  = (event.pageY - editor.transform.top) / editor.transform.scale;
    }

    entity.display.position = { left, top };

    const complete = () => {
      // TODO - activeEntity.file.save() instead
      workspace.file.save();
      bus.execute(new SetToolAction(tool.displayEntityToolFactory));
    };

    if (capabilities.resizable && tool.resizable) {

      startDrag(event, (event, { delta }) => {

        const width  = (delta.x) / editor.transform.scale;
        const height = (delta.y) / editor.transform.scale;

        entity.display.bounds = new BoundingRect(left, top, left + width, top + height);

      }, complete);
    } else {
      complete();
    }
  }

  onEntityMouseDown = (entity: IEntity, event: MouseEvent) => {
    this._targetEntity = entity;
    this._insertNewItem(event);
  }

  render() {
    const { editor } = this.props;
    const selection = (this.props.editor.workspace.selection as DisplayEntitySelection<any>);
    const zoom = this.props.editor.transform.scale;
    const display = selection.display;
    const bounds = display ? display.bounds : undefined;
    const scale = 1 / editor.transform.scale;

    const bgstyle = {
      position: "fixed",
      background: "transparent",
      top: 0,
      left: 0,
      transform: `translate(${-editor.transform.left * scale}px, ${-editor.transform.top * scale}px) scale(${scale})`,
      transformOrigin: "top left",
      width: "100%",
      height: "100%"
    };

    return <div className="m-insert-tool">
      <div onMouseDown={this._insertNewItem} style={bgstyle} />
      <SelectablesComponent {...this.props} onEntityMouseDown={this.onEntityMouseDown} />
      { display && display.capabilities.resizable ? <SelectionSizeComponent left={bounds.left + bounds.width} top={bounds.top + bounds.height} bounds={bounds} zoom={zoom} /> : undefined }
    </div>;
  }
}

export const dependency = new ReactComponentFactoryDependency("components/tools/insert/size", InsertToolComponent);
