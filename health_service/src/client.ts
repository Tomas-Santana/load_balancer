import RPCClient from "../../rpcHelper/RPCClient";
import * as grpc from "@grpc/grpc-js";
import { HealthService } from "../../protos/types/health";



const config = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const addresses = [
  "127.0.0.1:5002",
]
const PROTO_PATH = "../protos/health.proto";


const client = new RPCClient<HealthService>(PROTO_PATH, "health", config);

const healthService = client.getService("HealthService", addresses[0], grpc.credentials.createInsecure());

client.call(healthService, "Check", {}, (err, response) => {
  if (err) {
    console.error(err);
  } else {
    console.log(response);
  }
})