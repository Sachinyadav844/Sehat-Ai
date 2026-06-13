import { Server as SocketIOServer } from "socket.io";
import { WORKFLOW_EVENT_MAP, WorkflowEventName } from "./dashboard-events";

export function createSocketPublisher(io: SocketIOServer) {
  return {
    publish(event: WorkflowEventName, payload: Record<string, unknown>) {
      io.emit(event, payload);
    },
  };
}
