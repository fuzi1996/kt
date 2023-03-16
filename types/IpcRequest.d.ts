export interface IpcRequest {
  responseChannel?: string;

  responseErrorChannel?: string;

  params?: string[];
}
