import React, { useContext } from "react";

import { Box } from "@mantine/core";
import { GlobalState } from "../context/GlobalState";
import RepositoryWorkflows from "../components/RepositoryWorkflows";

const DashboardPage = () => {
  const { repositories } = useContext(GlobalState);
  return (
    <div>
      Dashboard - 1123
      <Box
        sx={() => ({
          paddingLeft: "2rem",
          paddingRight: "2rem",
        })}
      >
        {repositories.map((repo) => {
          return <RepositoryWorkflows key={repo.id} repo={repo} />;
        })}
      </Box>
    </div>
  );
};

export default DashboardPage;
