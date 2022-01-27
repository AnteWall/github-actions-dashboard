import React, { useContext, useEffect } from "react";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

import { GlobalState } from "./GlobalState";
import { WorkflowJobEvent } from "../github/workflows/types";

const WebhookListener = () => {
  const { updateJob } = useContext(GlobalState);
  const { socket, error } = useSocket({ path: "/api/socket" });
  const { lastMessage } = useSocketEvent<WorkflowJobEvent>(
    socket,
    "workflow_job"
  );
  const { lastMessage: runMessage } = useSocketEvent<WorkflowJobEvent>(
    socket,
    "workflow_run"
  );

  if (error) {
    console.error(error);
  }

  useEffect(() => {
    if (lastMessage) {
      console.log("JOB", lastMessage);

      updateJob(lastMessage);
    }
  }, [lastMessage]);
  console.log("RUN", runMessage);
  return <></>;
};

export default WebhookListener;
