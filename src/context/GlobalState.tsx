import { parse } from "date-fns";
import React, { createContext, useCallback, useMemo, useState } from "react";

import { WorkflowJobEvent, WorkflowRunEvent } from "../github/workflows/types";
import { applyWorkflowJobEvent, applyWorkflowRunEvent } from "../utils/jobs";

export interface GlobalContextState {
  repositories: RepoState[];
  updateRun: (job: WorkflowRunEvent) => void;
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
  conclusion: string;
  started_at: Date;
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
  updateRun: () => console.error("create <GlobalStateProvider />"),
  updateJob: () => console.error("create <GlobalStateProvider />"),
});

const createDate = (str: string): Date => {
  return parse(str, "yyyy-MM-dd", new Date());
};

export const GlobalStateProvider: React.FC = ({ children }) => {
  const [repositories, setRepositories] = useState<RepoState[]>([
    /* {
      id: "452662195",
      name: "test-repo-1",
      workflows: [
        {
          id: "18757855",
          name: "CI",
          runs: [
            {
              id: "1761755792",
              status: "in_progress",
              started_at: createDate("2020-01-01"),
            },
            {
              id: "1761755791",
              status: "failed",
              started_at: createDate("2020-01-02"),
            },
            {
              id: "1761755790",
              status: "completed",
              started_at: createDate("2020-01-04"),
            },
            {
              id: "1761755795",
              status: "queued",
              started_at: createDate("2020-01-06"),
            },
          ],
        },
      ],
    },*/
  ]);

  const updateJob = useCallback(
    (job: WorkflowJobEvent) => {
      setRepositories(applyWorkflowJobEvent(repositories, job));
    },
    [repositories]
  );
  const updateRun = useCallback(
    (run: WorkflowRunEvent) => {
      setRepositories(applyWorkflowRunEvent(repositories, run));
    },
    [repositories]
  );
  const value = useMemo<GlobalContextState>(() => {
    return {
      repositories,
      updateJob,
      updateRun,
    };
  }, [repositories, updateJob, updateRun]);

  return <GlobalState.Provider value={value}>{children}</GlobalState.Provider>;
};
