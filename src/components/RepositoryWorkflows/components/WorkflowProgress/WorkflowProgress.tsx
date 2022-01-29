import {
  Center,
  Text,
  RingProgress,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import React, { useMemo } from "react";
import { UilCheck, UilTimes } from "@iconscout/react-unicons";
import { Step } from "../../../../github/workflows/types";
import { statusToColor } from "../RunStatus/RunStatus";

interface WorkflowProgressProps {
  steps: Step[];
  conclusion?: string;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  steps,
  conclusion,
}) => {
  const theme = useMantineTheme();

  const currentStep = useMemo(() => {
    if (steps.length === 0) {
      return 0;
    }
    const index = steps.findIndex((s) => s.conclusion !== "success");
    return index + 1;
  }, [steps]);

  return (
    <>
      <RingProgress
        size={60}
        sections={steps.map((s) => ({
          value: 100 / steps.length,
          color: statusToColor(s.conclusion || s.status, theme),
        }))}
        label={
          <Center>
            <ThemeIcon color="teal" variant="light" radius="xl" size="xl">
              {conclusion ? (
                conclusion === "success" ? (
                  <UilCheck style={{ height: 22, width: 22 }} />
                ) : (
                  <UilTimes style={{ height: 22, width: 22 }} />
                )
              ) : (
                <>
                  <Text>
                    {currentStep}/{steps.length}
                  </Text>
                </>
              )}
            </ThemeIcon>
          </Center>
        }
      />
    </>
  );
};

export default WorkflowProgress;
