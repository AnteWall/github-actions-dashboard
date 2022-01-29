import { Box, MantineTheme, useMantineTheme } from "@mantine/core";
import React from "react";
import { WorkflowRun } from "../../../../context/GlobalState";

interface RunStatusProps {
  run: WorkflowRun;
}

export const statusToColor = (status: string, theme: MantineTheme): string => {
  switch (status) {
    case "success":
    case "completed":
      return theme.colors.green[8];
    case "failed":
    case "failure":
      return theme.colors.red[8];
    case "in_progress":
      return theme.colors.yellow[3];
    default:
      console.warn("unknown state", status);
      return theme.colors.gray[5];
  }
};

const RunStatus: React.FC<RunStatusProps> = ({ run }) => {
  const theme = useMantineTheme();
  return (
    <Box
      sx={() => ({
        marginRight: "0.4rem",
        height: "40px",
        width: "8px",
        boxShadow: "0px 0px 2px #000",
        borderRadius: "12px",
        background: statusToColor(run.conclusion, theme),
      })}
    />
  );
};

export default RunStatus;
