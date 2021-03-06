import { StartTunnelCommand } from "./commands";
import { CommandFactoryProvider } from "@tandem/common";
import { StartWorkspaceTunnelRequest, createCommonCollaboratorProviders, RootCollaboratorStoreProvider } from "../common";

export const createCollaborateMasterExtensionProviders = () => {
  return [
    createCommonCollaboratorProviders(),
    new CommandFactoryProvider(StartWorkspaceTunnelRequest.START_WORKSPACE_TUNNEL, StartTunnelCommand)
  ];
}