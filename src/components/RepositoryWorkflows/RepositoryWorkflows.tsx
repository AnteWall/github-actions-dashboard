import { Box, Card, Title, useMantineTheme } from "@mantine/core";
import React from "react";
import { RepoState } from "../../context/GlobalState";
import { Flipper, Flipped } from "react-flip-toolkit";
import { UilGithub } from "@iconscout/react-unicons";
import RunStatus, { statusToColor } from "./components/RunStatus/RunStatus";
import WorkflowProgress from "./components/WorkflowProgress";
const RepositoryWorkflows: React.FC<{ repo: RepoState }> = ({ repo }) => {
  const theme = useMantineTheme();

  return (
    <Card
      shadow="sm"
      padding="lg"
      sx={(theme) => ({
        margin: "1rem",
        backgroundColor: theme.colors.gray[8],
      })}
    >
      <Box
        sx={() => ({
          display: "flex",
          alignItems: "center",
        })}
      >
        <UilGithub />
        <Title
          sx={() => ({
            paddingLeft: "1rem",
          })}
          order={2}
        >
          {repo.name}
        </Title>
      </Box>
      <Flipper flipKey={repo.workflows.map((d) => d.id).join(".")}>
        {repo.workflows.map((w) => {
          return (
            <Flipped key={w.id} flipId={w.id}>
              <Card
                shadow="md"
                sx={() => ({
                  padding: "0.4rem 0.4rem",
                  marginTop: "1rem",
                  backgroundColor: statusToColor(
                    w.runs[0]?.conclusion || w.runs[0]?.status,
                    theme
                  ),
                })}
                padding="lg"
              >
                <Box
                  sx={() => ({
                    padding: "0.4rem 0 0.4rem 1rem",
                    alignItems: "center",
                    justifyContent: "space-between",
                    display: "flex",
                  })}
                >
                  <Title
                    sx={() => ({
                      textShadow: "0px 0px 6px #000000",
                      marginBottom: "2px",
                    })}
                    order={3}
                  >
                    {w.name}
                  </Title>
                </Box>
                <Card padding="sm">
                  <Box
                    sx={() => ({
                      alignItems: "center",
                      justifyContent: "space-between",
                      display: "flex",
                    })}
                  >
                    <Box
                      sx={() => ({
                        display: "flex",
                      })}
                    >
                      {w.runs.map((r) => {
                        return <RunStatus key={r.id} run={r} />;
                      })}
                    </Box>
                    <Box sx={() => ({})}>
                      <WorkflowProgress
                        conclusion={w.runs[0]?.conclusion}
                        steps={w.runs[0].steps}
                      />
                    </Box>
                  </Box>
                </Card>
              </Card>
            </Flipped>
          );
        })}
      </Flipper>
    </Card>
  );
};

export default RepositoryWorkflows;
