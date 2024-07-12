import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { GenericService, ServiceClient } from "./types/customTypes";
import { HealthService } from "../protos/types/health";
import { ExtractRequestType, ExtractResponseType } from "./types/customTypes";


class RPCClient<Service extends GenericService> implements ServiceClient<Service> {
  private path: string;
  private config: protoLoader.Options;
  private packageDefinition: any ;
  private packageName: string;
  constructor(path: string, packageName: Service['packageName'] ,config: protoLoader.Options) {
    this.path = path;
    this.config = config;
    this.packageName = packageName;
    this.setConfig();
  }
  setConfig() {
    const load = protoLoader.loadSync(this.path, this.config);
    this.packageDefinition = grpc.loadPackageDefinition(load)[this.packageName];
  }
  setPath(path: string) {
    this.path = path;
    this.setConfig();
  }
  setConfigVal<T extends keyof protoLoader.Options>(property: T, value: protoLoader.Options[T]) {
    this.config[property] = value;
    this.setConfig();
  }
  getService(name: Service['serviceName'], address: string, credentials: grpc.ChannelCredentials): any
   {
    return new this.packageDefinition[name](address, credentials);
  }
  call<K extends keyof Service>(
    service: any, 
    rpc: K, 
    request: ExtractRequestType<Service, K>,
    callback: grpc.requestCallback<ExtractResponseType<Service, K>>
  ) {
    service[rpc](request, callback);
  }
} 

export default RPCClient;