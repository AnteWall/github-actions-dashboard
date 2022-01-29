import React, { useContext } from "react";

import { Box } from "@mantine/core";
import { GlobalState } from "../context/GlobalState";
import RepositoryWorkflows from "../components/RepositoryWorkflows";
import { Flipper, Flipped } from "react-flip-toolkit";

const DashboardPage = () => {
  const { repositories } = useContext(GlobalState);
  return (
    <div>
      <Box
        sx={() => ({
          paddingLeft: "2rem",
          paddingRight: "2rem",
        })}
      >
        <Flipper flipKey={repositories.map((d) => d.id).join(".")} stagger>
          {repositories.map((repo) => {
            return (
              <Flipped key={repo.id} flipId={repo.id}>
                <RepositoryWorkflows repo={repo} />
              </Flipped>
            );
          })}
        </Flipper>
      </Box>
    </div>
  );
};

export default DashboardPage;
