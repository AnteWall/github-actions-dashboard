import { WorkflowJobEvent } from './../github/workflows/types';
import { applyWorkflowJobEvent } from "./jobs"

const mockedWorkflowJob: WorkflowJobEvent = {
    // @ts-ignore
    repository: {
        id: 12345678,
        name: "TestRepo1"
    },
    // @ts-ignore
    workflow_job: {
        name: "build",
        id: 87654321,
        status: "queued",
        run_id: 654789,
    }
}

describe("applyWorkflowJobEvent", () => {
    it('creates a new repo with workflow and job if none is found', () => {

        const a = applyWorkflowJobEvent([], mockedWorkflowJob)

        expect(a.length).toBe(1)
        expect(a[0].id).toBe(mockedWorkflowJob.repository.id.toString())
        expect(a[0].name).toBe(mockedWorkflowJob.repository.name)
        expect(a[0].workflows.length).toBe(1)
        expect(a[0].workflows[0].id).toBe(mockedWorkflowJob.workflow_job.id.toString())
        expect(a[0].workflows[0].runs.length).toBe(1)
        expect(a[0].workflows[0].runs[0].status).toBe("queued")
        expect(a[0].workflows[0].runs[0].id).toBe(mockedWorkflowJob.workflow_job.run_id.toString())
    })

    it('append to run if workflow exists', () => {

        const a = applyWorkflowJobEvent([{
            id: mockedWorkflowJob.repository.id.toString(),
            name: mockedWorkflowJob.repository.name,
            workflows: [{
                id: mockedWorkflowJob.workflow_job.id.toString(),
                name: mockedWorkflowJob.workflow_job.name,
                runs: []
            }]
        }], mockedWorkflowJob)

        expect(a.length).toBe(1)
        expect(a[0].id).toEqual(mockedWorkflowJob.repository.id.toString())
        expect(a[0].name).toEqual(mockedWorkflowJob.repository.name)
        expect(a[0].workflows.length).toBe(1)
        expect(a[0].workflows[0].id).toBe(mockedWorkflowJob.workflow_job.id.toString())
        expect(a[0].workflows[0].runs.length).toBe(1)
        expect(a[0].workflows[0].runs[0].status).toEqual("queued")
        expect(a[0].workflows[0].runs[0].id).toEqual(mockedWorkflowJob.workflow_job.run_id.toString())
    })

    it('append new runs if workflow exists', () => {

        const a = applyWorkflowJobEvent([{
            id: mockedWorkflowJob.repository.id.toString(),
            name: mockedWorkflowJob.repository.name,
            workflows: [{
                id: mockedWorkflowJob.workflow_job.id.toString(),
                name: mockedWorkflowJob.workflow_job.name,
                runs: [{
                    id: "other-id",
                    status: "completed"
                }]
            }]
        }], mockedWorkflowJob)

        expect(a.length).toBe(1)
        expect(a[0].id).toEqual(mockedWorkflowJob.repository.id.toString())
        expect(a[0].name).toEqual(mockedWorkflowJob.repository.name)
        expect(a[0].workflows.length).toBe(1)
        expect(a[0].workflows[0].id).toBe(mockedWorkflowJob.workflow_job.id.toString())
        expect(a[0].workflows[0].runs.length).toBe(2)
        expect(a[0].workflows[0].runs[1].status).toEqual("queued")
        expect(a[0].workflows[0].runs[1].id).toEqual(mockedWorkflowJob.workflow_job.run_id.toString())
    })
})