import { parseISO } from "date-fns";
import { RepoState, RepoWorkflow, WorkflowRun } from "./../context/GlobalState";

import {
  WorkflowJobEvent,
  WorkflowRunEvent,
} from "./../github/workflows/types";

function editById<T extends { id: string }>(
  arr: T[],
  data: T,
  overrideId = null
) {
  const id = overrideId || data.id;
  if (arr.find((x) => x.id === id)) {
    return arr.map((x) => (x.id === id ? { ...x, ...data } : x));
  }
  return [...arr, { ...data }];
}

function sortByDate(a: WorkflowRun, b: WorkflowRun) {
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return b.started_at.getTime() - a.started_at.getTime();
}

function sortByDateWorkflow(a: RepoWorkflow, b: RepoWorkflow) {
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return b.runs[0].started_at.getTime() - a.runs[0].started_at.getTime();
}

function sortByDateRepo(a: RepoState, b: RepoState) {
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return (
    b.workflows[0].runs[0].started_at.getTime() -
    a.workflows[0].runs[0].started_at.getTime()
  );
}

const applyJobUpdate = (
  arr: WorkflowRun[],
  job: WorkflowJobEvent
): WorkflowRun[] => {
  const jobRun = arr.find((r) => r.id === job.workflow_job.run_id.toString());
  const editObj: WorkflowRun = {
    id: job.workflow_job.run_id.toString(),
    status: job.workflow_job.status,
    conclusion: job.workflow_job.conclusion,
    started_at: parseISO(job.workflow_job.started_at),
    steps: job.workflow_job.steps,
  };
  if (!jobRun) {
    return [...arr, editObj];
  }
  return editById(arr, {
    ...jobRun,
    ...editObj,
  });
};

const applyWorkflowUpdate = (
  arr: RepoWorkflow[],
  job: WorkflowJobEvent
): RepoWorkflow[] => {
  const workflow = arr.find((r) =>
    r.runs.some((run) => run.id === job.workflow_job.run_id.toString())
  );
  const editObj: RepoWorkflow = {
    id: workflow.id || job.workflow_job.run_id.toString(),
    name: workflow.name || job.workflow_job.name,
    runs: applyJobUpdate(workflow.runs || [], job).sort(sortByDate),
  };
  if (!workflow) {
    return [...arr, editObj].sort(sortByDateWorkflow);
  }
  return editById(arr, editObj).sort(sortByDateWorkflow);
};

export const applyWorkflowJobEvent = (
  arr: RepoState[],
  job: WorkflowJobEvent
): RepoState[] => {
  const repo = arr.find((r) => r.id === job.repository.id.toString());
  if (!repo) {
    return [
      ...arr,
      {
        id: job.repository.id.toString(),
        name: job.repository.name,
        workflows: applyWorkflowUpdate([], job),
      },
    ].sort(sortByDateRepo);
  }
  return editById(arr, {
    ...repo,
    workflows: applyWorkflowUpdate(repo.workflows, job),
  }).sort(sortByDateRepo);
};

const applyJobRunUpdate = (
  arr: WorkflowRun[],
  run: WorkflowRunEvent
): WorkflowRun[] => {
  const jobRun = arr.find((r) => r.id === run.workflow_run.id.toString());

  const editObj: WorkflowRun = {
    id: run.workflow_run.id.toString(),
    status: run.workflow_run.status,
    conclusion: run.workflow_run.conclusion,
    started_at: parseISO(run.workflow_run.run_started_at),
    steps: jobRun?.steps || [],
  };

  if (!jobRun) {
    return [...arr, editObj].sort(sortByDate);
  }
  return editById(arr, {
    ...jobRun,
    ...editObj,
  }).sort(sortByDate);
};

const applyWorkflowRunUpdate = (
  arr: RepoWorkflow[],
  run: WorkflowRunEvent
): RepoWorkflow[] => {
  const workflow = arr.find((r) => r.id === run.workflow.id.toString());
  if (!workflow) {
    return [
      ...arr,
      {
        id: run.workflow.id.toString(),
        name: run.workflow.name,
        runs: applyJobRunUpdate([], run),
      },
    ].sort(sortByDateWorkflow);
  }
  return editById(arr, {
    ...workflow,
    runs: applyJobRunUpdate(workflow.runs, run),
  }).sort(sortByDateWorkflow);
};

export const applyWorkflowRunEvent = (
  arr: RepoState[],
  run: WorkflowRunEvent
): RepoState[] => {
  const repo = arr.find((r) => r.id === run.repository.id.toString());
  if (!repo) {
    return [
      ...arr,
      {
        id: run.repository.id.toString(),
        name: run.repository.name,
        workflows: applyWorkflowRunUpdate([], run),
      },
    ].sort(sortByDateRepo);
  }
  return editById(arr, {
    ...repo,
    workflows: applyWorkflowRunUpdate(repo.workflows, run),
  }).sort(sortByDateRepo);
};
