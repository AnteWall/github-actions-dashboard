import { Card } from "@mantine/core";
import React from "react";
import { RepoState } from "../../context/GlobalState";

const RepositoryWorkflows: React.FC<{ repo: RepoState }> = ({ repo }) => {
  return (
    <div>
      Hello
      {repo.id}
      {repo.workflows.map((w) => {
        return (
          <Card key={w.id} shadow="sm" padding="lg">
            id: {w.id} <br />
            Workflow: {w.name}
            <br />
            {w.runs.map((r) => {
              return (
                <>
                  {r.id} - {r.status}
                </>
              );
            })}
          </Card>
        );
      })}
    </div>
  );
};

export default RepositoryWorkflows;
