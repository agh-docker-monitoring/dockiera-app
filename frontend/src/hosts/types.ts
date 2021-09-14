export interface HostSummary {
  id: number;
  timestamp: string;
  memoryUsage: BasicMetric;
  diskUsage: BasicMetric;
  cpuUsage: BasicMetric;
  containers: ContainerSummary[];
}

export interface FullHostSummary {
  hostName: string;
  ip: string;
  id: number;
  hostSummary: HostSummary;
}

export interface ContainerSummary {
  id: string;
  name: string;
  image: string;
  status: string; //TODO DEFINE STATUS AFTER IT GETS CHANGED ON BACKEND
  cpuUsage: BasicMetric;
  memoryUsage: BasicMetric;
}

export interface BasicMetric {
  value: string;
  total: string;
  percent: string;
  alertType: AlertType;
  alert: boolean;
}

export enum AlertType {
  OK,
  WARN,
  CRITICAL,
}