import React, { useContext, useEffect } from "react";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

import { GlobalState } from "./GlobalState";
import { WorkflowJobEvent, WorkflowRunEvent } from "../github/workflows/types";

const WebhookListener = () => {
  const { updateJob, updateRun } = useContext(GlobalState);
  const { socket, error } = useSocket({ path: "/api/socket" });
  const { lastMessage } = useSocketEvent<WorkflowJobEvent>(
    socket,
    "workflow_job"
  );
  const { lastMessage: runMessage } = useSocketEvent<WorkflowRunEvent>(
    socket,
    "workflow_run"
  );

  if (error) {
    console.error(error);
  }

  useEffect(() => {
    if (lastMessage) {
      updateJob(lastMessage);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (runMessage) {
      updateRun(runMessage);
    }
  }, [runMessage]);

  return <></>;
};

export default WebhookListener;
