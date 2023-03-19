import { IpcChannelInterface } from "types/IpcChannelInterface";
import { IpcMainEvent,app } from 'electron';
import { IpcRequest } from "types/IpcRequest";
import { getChannelResponse } from 'shared/Response'
import os from 'os';
import { ISystemInfo } from 'types/ISystemInfo'
import { SYSTEM_EVENT } from 'shared/Events'
import { getStorePath } from 'backend/store'

export class SystemInfoChannel implements IpcChannelInterface {
  getName(): string {
    return SYSTEM_EVENT.SYSTEM_INFO;
  }

  handle(event: IpcMainEvent, request: IpcRequest): void {
    if (!request.responseChannel) {
      request.responseChannel = getChannelResponse(this.getName());
    }

    const systemInfo: ISystemInfo = {
      // 系统中的默认存放临时文件的目录
      tmpdir: os.tmpdir(),

      // 获取计算机名称
      hostname: os.hostname(),

      // 获取操作系统类型 
      type: os.type(),

      // 获取操作系统平台
      platform: os.platform(),

      // 获取CPU架构 
      arch: os.arch(),
      
      // 获取操作系统版本号
      release: os.release(),

      // 获取系统当前运行的时间
      uptime: os.uptime(),

      // 系统总内存量
      totalmem: os.totalmem(),

      // 用户数据存储路径
      userDataPath: app.getPath('userData'),
      
      // elctron-store文件存储路径
      storePath: getStorePath()
    }
    
    event.sender.send(request.responseChannel, systemInfo);
  }
}
