export interface ISystemInfo {
  // 系统中的默认存放临时文件的目录
  tmpdir: string;
  // 获取计算机名称
  hostname: string;
  // 获取操作系统类型 
  type: string;
  // 获取操作系统平台
  platform: string;
  // 获取CPU架构
  arch: string;
  // 获取操作系统版本号
  release: string;
  // 获取系统当前运行的时间
  uptime: number;
  // 系统总内存量
  totalmem: number;
}