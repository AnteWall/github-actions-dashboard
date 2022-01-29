import React, { useContext, useState } from "react";

import { Box, Grid } from "@mantine/core";
import { GlobalState } from "../context/GlobalState";
import RepositoryWorkflows from "../components/RepositoryWorkflows";
import { Flipper, Flipped } from "react-flip-toolkit";
import { useHotkeys } from "@mantine/hooks";

const DashboardPage = () => {
  const { repositories } = useContext(GlobalState);

  const [span, setSpan] = useState(6);

  useHotkeys([["h", () => setSpan(span === 12 ? 6 : 12)]]);

  return (
    <div>
      <Flipper flipKey={repositories.map((d) => d.id).join(".")} stagger>
        <Grid
          grow
          gutter="sm"
          sx={() => ({
            paddingLeft: "1rem",
            paddingRight: "1rem",
          })}
        >
          {repositories.map((repo) => {
            return (
              <Grid.Col key={repo.id} span={span}>
                <Flipped flipId={repo.id}>
                  <RepositoryWorkflows repo={repo} />
                </Flipped>
              </Grid.Col>
            );
          })}
        </Grid>
      </Flipper>
    </div>
  );
};

export default DashboardPage;
