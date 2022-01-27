import React, { createContext, useCallback, useMemo, useState } from "react";

import { WorkflowJobEvent } from "../github/workflows/types";
import { applyWorkflowJobEvent } from "../utils/jobs";

export interface GlobalContextState {
  repositories: RepoState[];
  updateJob: (job: WorkflowJobEvent) => void;
}

function createOrUpdate<T extends { id: string }>(arr: T[], data: T) {
  if (arr.find((x) => (x.id = data.id))) {
    return arr.map((x) => (x.id === data.id ? { ...x, ...data } : x));
  }
  return [...arr, { ...data }];
}

export interface WorkflowRun {
  id: string;
  status: string;
}

export interface RepoWorkflow {
  id: string;
  runs: WorkflowRun[];
  name: string;
}

export interface RepoState {
  id: string;
  name: string;
  workflows: RepoWorkflow[];
}

export interface WorkflowJobUpdate {
  workflow_id: string;
  run_id: string;
  repo_id: string;
  name: string;
  status: string;
}

export const GlobalState = createContext<GlobalContextState>({
  repositories: [],
  updateJob: () => console.error("create <GlobalStateProvider />"),
});

export const GlobalStateProvider: React.FC = ({ children }) => {
  const [repositories, setRepositories] = useState<RepoState[]>([]);

  const updateJob = useCallback(
    (job: WorkflowJobEvent) => {
      setRepositories(applyWorkflowJobEvent(repositories, job));
    },
    [repositories]
  );
  console.log(repositories);
  const value = useMemo<GlobalContextState>(() => {
    return {
      repositories,
      updateJob,
    };
  }, [repositories, updateJob]);

  console.log(value);
  return <GlobalState.Provider value={value}>{children}</GlobalState.Provider>;
};
