import { describe, it, expect, spyOn, mock, jest } from "bun:test";
import * as vscode from "vscode";

import { activate } from "./extension.ts";

spyOn(vscode.commands, "registerCommand");
spyOn(vscode.window, "showInformationMessage");

const extensionContext: vscode.ExtensionContext = {
  subscriptions: [],
} as any;

describe("extension", () => {
  describe("activation", () => {
    it("registers the hello world command", () => {
      activate(extensionContext);

      expect(vscode.commands.registerCommand).toHaveBeenCalled();
      const command = (vscode.commands.registerCommand as jest.Mock).mock
        .calls[0][0];
      const callback = (vscode.commands.registerCommand as jest.Mock).mock
        .calls[0][1] as any as Function;

      expect(command).toEqual("bun-vscode-extension.helloworld");

      expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
      callback();
      expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
        "Hello World!"
      );
    });
  });
});
