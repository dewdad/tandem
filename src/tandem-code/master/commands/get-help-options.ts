import { IHelpOption } from "tandem-code/master/stores";
import { BaseStudioMasterCommand } from "./base";
import { SyntheticWindow, SyntheticDOMElement } from "@tandem/synthetic-browser";

import glob =  require("glob");
import fs =  require("fs");

export class GetHelpOptionsCommand extends  BaseStudioMasterCommand {
  execute() {
    return  glob.sync(this.config.help.directory + "/**/*.tandem").map((filePath) => {
      const { document } = new SyntheticWindow();
      document.body.innerHTML = fs.readFileSync(filePath, "utf8");
      const root =  document.body.firstChild as SyntheticDOMElement;
      const uri =  `file://${filePath}`;
      root.$source = {
        uri: uri
      };
      return {
        id: root.uid,
        page: root.getAttribute("page"),
        label: root.getAttribute("label"),
        uri: uri
      }
    });
  }
} 