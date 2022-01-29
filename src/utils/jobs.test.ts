import {
  WorkflowJobEvent,
  WorkflowRunEvent,
} from "./../github/workflows/types";
import { applyWorkflowJobEvent, applyWorkflowRunEvent } from "./jobs";
import mockedJob from "../tests/mocked_job.json";
import mockedRun from "../tests/mocked_run.json";
import mockedRun2 from "../tests/mocked_run2.json";

const mockedWorkflowJob = mockedJob as unknown as WorkflowJobEvent;
const mockedWorkflowRun = mockedRun as unknown as WorkflowRunEvent;
const mockedWorkflowRun2 = mockedRun2 as unknown as WorkflowRunEvent;

describe("applyWorkflowJobEvent", () => {
  it("creates a new repo with workflow and job if none is found", () => {
    const a = applyWorkflowJobEvent([], mockedWorkflowJob);

    expect(a.length).toBe(1);
    expect(a[0].id).toBe(mockedWorkflowJob.repository.id.toString());
    expect(a[0].name).toBe(mockedWorkflowJob.repository.name);
    expect(a[0].workflows.length).toBe(1);
    expect(a[0].workflows[0].id).toBe(
      mockedWorkflowJob.workflow_job.id.toString()
    );
    expect(a[0].workflows[0].runs.length).toBe(1);
    expect(a[0].workflows[0].runs[0].status).toBe("completed");
    expect(a[0].workflows[0].runs[0].id).toBe(
      mockedWorkflowJob.workflow_job.run_id.toString()
    );
  });

  it("append to run if workflow exists", () => {
    const a = applyWorkflowJobEvent(
      [...applyWorkflowRunEvent([], mockedWorkflowRun)],
      mockedWorkflowJob
    );

    expect(a.length).toBe(1);
    expect(a[0].id).toEqual(mockedWorkflowJob.repository.id.toString());
    expect(a[0].name).toEqual(mockedWorkflowJob.repository.name);
    expect(a[0].workflows.length).toBe(1);
    expect(a[0].workflows[0].id).toBe("18757855");
    expect(a[0].workflows[0].runs.length).toBe(1);
    expect(a[0].workflows[0].runs[0].status).toEqual("completed");
    expect(a[0].workflows[0].runs[0].id).toEqual(
      mockedWorkflowJob.workflow_job.run_id.toString()
    );
  });

  it("update run status", () => {
    const a = applyWorkflowJobEvent(
      [...applyWorkflowRunEvent([], mockedWorkflowRun)],
      {
        ...mockedWorkflowJob,
        workflow_job: { ...mockedWorkflowJob.workflow_job, status: "failed" },
      }
    );

    expect(a.length).toBe(1);
    expect(a[0].id).toEqual(mockedWorkflowJob.repository.id.toString());
    expect(a[0].name).toEqual(mockedWorkflowJob.repository.name);
    expect(a[0].workflows.length).toBe(1);
    expect(a[0].workflows[0].id).toBe("18757855");
    expect(a[0].workflows[0].runs.length).toBe(1);
    expect(a[0].workflows[0].runs[0].status).toEqual("failed");
    expect(a[0].workflows[0].runs[0].id).toEqual(
      mockedWorkflowJob.workflow_job.run_id.toString()
    );
  });

  it("update only same run status", () => {
    const a = applyWorkflowJobEvent(
      [
        ...applyWorkflowRunEvent(
          applyWorkflowRunEvent([], mockedWorkflowRun),
          mockedWorkflowRun2
        ),
      ],
      {
        ...mockedWorkflowJob,
        workflow_job: { ...mockedWorkflowJob.workflow_job, status: "failed" },
      }
    );

    expect(a.length).toBe(1);
    expect(a[0].id).toEqual(mockedWorkflowJob.repository.id.toString());
    expect(a[0].name).toEqual(mockedWorkflowJob.repository.name);
    expect(a[0].workflows.length).toBe(1);
    expect(a[0].workflows[0].id).toBe("18757855");
    expect(a[0].workflows[0].runs.length).toBe(2);
    expect(a[0].workflows[0].runs[0].status).toEqual("failed");
    expect(a[0].workflows[0].runs[1].status).toEqual("queued");
    expect(a[0].workflows[0].runs[0].id).toEqual(
      mockedWorkflowJob.workflow_job.run_id.toString()
    );
  });
});
