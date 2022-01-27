import { RepoState, RepoWorkflow, WorkflowRun } from './../context/GlobalState';

import { WorkflowJobEvent } from './../github/workflows/types';

function editById<T extends { id: string }>(arr: T[], data: T) {
    if (arr.find((x) => (x.id = data.id))) {
        return arr.map((x) => (x.id === data.id ? { ...x, ...data } : x));
    }
    return [...arr, { ...data }];
}

const applyJobUpdate = (arr: WorkflowRun[], job: WorkflowJobEvent): WorkflowRun[] => {
    const jobRun = arr.find((r) => r.id === job.workflow_job.run_id.toString())
    if (!jobRun) {
        return [...arr, {
            id: job.workflow_job.run_id.toString(),
            status: job.workflow_job.status,
        }]
    }
    return editById(arr, {
        ...jobRun, ...{
            id: job.workflow_job.run_id.toString(),
            status: job.workflow_job.status,
        }
    })
}

const applyWorkflowUpdate = (arr: RepoWorkflow[], job: WorkflowJobEvent): RepoWorkflow[] => {
    const workflow = arr.find((r) => r.id === job.workflow_job.id.toString())
    if (!workflow) {
        return [...arr, {
            id: job.workflow_job.id.toString(),
            name: job.workflow_job.name,
            runs: applyJobUpdate([], job)
        }]
    }
    return editById(arr, { ...workflow, runs: applyJobUpdate(workflow.runs, job) })
}

export const applyWorkflowJobEvent = (arr: RepoState[], job: WorkflowJobEvent): RepoState[] => {

    const repo = arr.find((r) => r.id === job.repository.id.toString())
    if (!repo) {
        return [...arr, {
            id: job.repository.id.toString(),
            name: job.repository.name,
            workflows: applyWorkflowUpdate([], job)
        }]
    }
    return editById(arr, { ...repo, workflows: applyWorkflowUpdate(repo.workflows, job) })
}