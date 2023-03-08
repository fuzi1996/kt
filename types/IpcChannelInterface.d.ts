import {IpcMainEvent} from 'electron';
import {IpcRequest} from "types/IpcRequest";

export interface IpcChannelInterface {
  getName(): string;

  handle(event: IpcMainEvent, request: IpcRequest): void;
}
