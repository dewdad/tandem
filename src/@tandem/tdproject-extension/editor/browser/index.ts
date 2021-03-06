import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { createTDProjectCoreProviders } from "../../core";
import { 
  PostDSMessage, 
  MimeTypeProvider, 
  MimeTypeAliasProvider, 
  CommandFactoryProvider,
  ApplicationReadyMessage, 
} from "@tandem/common";

import { LoadUnsavedFileCommand } from "./commands";
import { TDProjectExtensionStore } from "./stores";
import { TandemExtensionStoreProvider } from "./providers";

import { 
  RemoteBrowserPaneComponent, 
  NavigatorPaneComponent, 
  RemoteBrowserLoaderComponent, 
  UnsavedFilesPaneComponent,
  RemoteBrowserLayerLabelComponent,
  RemoteBrowserStageToolComponent, 
  MeasurementStageToolComponent,
} from "./components";

import { ElementLayerLabelProvider } from "@tandem/html-extension/editor/browser";
import { MarkupMimeTypeXMLNSProvider, SyntheticDOMElementClassProvider, LoadableElementProvider } from "@tandem/synthetic-browser";
import { 
  ReactComponentFactoryProvider, 
  FooterComponentFactoryProvider, 
  StageToolComponentFactoryProvider, 
  EntityPaneComponentFactoryProvider,
  DocumentPaneComponentFactoryProvider, 
} from "@tandem/editor/browser";



export function createTDProjectEditorBrowserProviders() {
  return [
    ...createTDProjectCoreProviders(),
    // new DocumentPaneComponentFactoryProvider("navigator", NavigatorPaneComponent),
    new ElementLayerLabelProvider("remote-browser", RemoteBrowserLayerLabelComponent),
    new TandemExtensionStoreProvider(TDProjectExtensionStore),
    new StageToolComponentFactoryProvider("remote-browser", "pointer", RemoteBrowserStageToolComponent),
    new DocumentPaneComponentFactoryProvider("unsavedFiles", UnsavedFilesPaneComponent, 999),
    new StageToolComponentFactoryProvider("altDistances", "pointer", MeasurementStageToolComponent),
    new FooterComponentFactoryProvider("artboardLoader", RemoteBrowserLoaderComponent),
    new EntityPaneComponentFactoryProvider("remote-browser", RemoteBrowserPaneComponent, 0),
    new CommandFactoryProvider(ApplicationReadyMessage.READY, LoadUnsavedFileCommand),
    new CommandFactoryProvider(PostDSMessage.DS_DID_UPDATE, LoadUnsavedFileCommand),
    new CommandFactoryProvider(PostDSMessage.DS_DID_INSERT, LoadUnsavedFileCommand),
    new CommandFactoryProvider(PostDSMessage.DS_DID_REMOVE, LoadUnsavedFileCommand)
  ];
}

export * from "../../core";