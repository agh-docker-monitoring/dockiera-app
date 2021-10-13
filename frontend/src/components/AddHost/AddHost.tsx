import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import { proxy } from "../../common/api";
import {
  PostHostResponse,
  StandardApiResponse,
  AddHostFormData,
} from "../../common/types";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectHost, updateHostsAsync } from "../../hosts/hostsSlice";
import { ContainerSummary } from "../../hosts/types";
import AddContainerRules from "./AddContainerRules";

interface Rule {
  ruleType: string;
  warnLevel: number;
  criticalLevel: number;
}

interface AddHostProps {
  defaultData?: AddHostFormData;
  method?: string;
  editHostId?: number | null;
}

export interface ContainersInfo {
  containersRules: any[]; //todo not any
  containers: ContainerSummary[];
}

const AddHost: React.FC<AddHostProps> = ({
  defaultData = {},
  method = "POST",
  editHostId = null,
}) => {
  const { register, errors, handleSubmit } = useForm<AddHostFormData>({
    defaultValues: defaultData,
  });
  const [error, setError] = useState<string>("");
  const [hostId, setHostId] = useState<string>("");
  const [containers, setContainers] = useState<ContainersInfo>();
  const dispatch = useAppDispatch();

  const hostsData = useAppSelector(selectHost).hosts;

  console.log(containers);

  useEffect(() => {
    const host = hostsData[Number.parseInt(hostId)];
    const containersRules = host?.containerRules;
    const containers = host?.hostSummary?.containers;
    setContainers({ containersRules, containers });
  }, [hostsData]);

  const handleAdd = async (data: AddHostFormData) => {
    setError("");
    const cpuWarn = parseInt(data.cpuWarn);
    const cpuCrit = parseInt(data.cpuCrit);
    const memWarn = parseInt(data.memWarn);
    const memCrit = parseInt(data.memCrit);
    const diskWarn = parseInt(data.diskWarn);
    const diskCrit = parseInt(data.diskCrit);

    const rules: Rule[] = [];

    if (cpuWarn >= cpuCrit) {
      setError(
        "CPU usage warn threshold should be smaller than CPU usage critical threshold"
      );
      return;
    }

    if (memWarn >= memCrit) {
      setError(
        "Memory usage warn threshold should be smaller than memory usage critical threshold"
      );
      return;
    }

    if (diskWarn >= diskCrit) {
      setError(
        "Disk usage warn threshold should be smaller than disk usage critical threshold"
      );
      return;
    }
    if (!isNaN(cpuWarn) && !isNaN(cpuCrit))
      rules.push({
        ruleType: "CpuUsage",
        warnLevel: cpuWarn,
        criticalLevel: cpuCrit,
      });

    if (!isNaN(memWarn) && !isNaN(memCrit))
      rules.push({
        ruleType: "MemoryUsage",
        warnLevel: memWarn,
        criticalLevel: memCrit,
      });

    if (!isNaN(diskWarn) && !isNaN(diskCrit))
      rules.push({
        ruleType: "DiskUsage",
        warnLevel: diskWarn,
        criticalLevel: diskCrit,
      });

    const json = {
      hostName: data.hostName,
      ip: data.ip,
      rules: rules,
    };

    const url =
      method === "POST" ? `${proxy}/hosts` : `${proxy}/hosts/${editHostId}`;
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });

    const result: StandardApiResponse = await response.json();

    if (response.ok) {
      const hostResponse: PostHostResponse = result.body;
      setHostId(hostResponse.id.toString());
      dispatch(updateHostsAsync());
    } else {
      setError(result.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" m={2}>
        <Typography variant="h4">
          {method === "PUT" ? "Edit" : "Add new"} host
        </Typography>
      </Box>
      <Box>
        <form onSubmit={handleSubmit(handleAdd)}>
          {hostId ? (
            <>
              <Alert severity="success">
                <AlertTitle>
                  Host {method === "PUT" ? "modified" : "added"}
                </AlertTitle>
                This is your unique host identifier: <strong>{hostId}</strong>
                <br />
                You will have to pass it in agent{"'"}s config
              </Alert>
              <Box textAlign="center" mt={3}>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Button variant="outlined" color="primary">
                    confirm
                  </Button>
                </Link>
              </Box>
            </>
          ) : (
            <Grid container item direction="column" spacing={4}>
              <Grid item>
                {error && <Alert severity="error">{error}</Alert>}
              </Grid>
              <Grid item>
                <TextField
                  name="ip"
                  label="IP Address"
                  variant="outlined"
                  fullWidth={true}
                  size="small"
                  inputRef={register({
                    required: "IP Address is required",
                    pattern: {
                      value:
                        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                      message: "Invalid IP Address",
                    },
                  })}
                  error={!!errors.ip}
                  helperText={errors.ip?.message}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="hostName"
                  label="Host Name"
                  variant="outlined"
                  fullWidth={true}
                  size="small"
                  inputRef={register({
                    required: "Host Name is required",
                  })}
                  error={!!errors.hostName}
                  helperText={errors.hostName?.message}
                />
              </Grid>
              <Grid item>
                <Typography variant="h6">CPU usage alerting</Typography>
                <TextField
                  name="cpuWarn"
                  label="Warn threshold"
                  size="small"
                  inputRef={register({
                    pattern: {
                      value: /^[1-9][0-9]?$|^100$/,
                      message: "Value should be in range from 0 to 100",
                    },
                  })}
                  error={!!errors.cpuWarn}
                  helperText={errors.cpuWarn?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  style={{ marginRight: "40px" }}
                />
                <TextField
                  name="cpuCrit"
                  label="Critical threshold"
                  size="small"
                  inputRef={register({
                    pattern: {
                      value: /^[1-9][0-9]?$|^100$/,
                      message: "Value should be in range from 0 to 100",
                    },
                  })}
                  error={!!errors.cpuCrit}
                  helperText={errors.cpuCrit?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <Typography variant="h6">Memory usage alerting</Typography>
                <TextField
                  name="memWarn"
                  label="Warn threshold"
                  size="small"
                  inputRef={register({
                    pattern: {
                      value: /^[1-9][0-9]?$|^100$/,
                      message: "Value should be in range from 0 to 100",
                    },
                  })}
                  error={!!errors.memWarn}
                  helperText={errors.memWarn?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  style={{ marginRight: "40px" }}
                />
                <TextField
                  name="memCrit"
                  label="Critical threshold"
                  size="small"
                  inputRef={register({
                    pattern: {
                      value: /^[1-9][0-9]?$|^100$/,
                      message: "Value should be in range from 0 to 100",
                    },
                  })}
                  error={!!errors.memCrit}
                  helperText={errors.memCrit?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <Typography variant="h6">Disk usage alerting</Typography>
                <TextField
                  name="diskWarn"
                  label="Warn threshold"
                  size="small"
                  inputRef={register({
                    pattern: {
                      value: /^[1-9][0-9]?$|^100$/,
                      message: "Value should be in range from 0 to 100",
                    },
                  })}
                  error={!!errors.diskWarn}
                  helperText={errors.diskWarn?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  style={{ marginRight: "40px" }}
                />
                <TextField
                  name="diskCrit"
                  label="Critical threshold"
                  size="small"
                  inputRef={register({
                    pattern: {
                      value: /^[1-9][0-9]?$|^100$/,
                      message: "Value should be in range from 0 to 100",
                    },
                  })}
                  error={!!errors.diskCrit}
                  helperText={errors.diskCrit?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disableElevation
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          )}
        </form>
      </Box>
      <AddContainerRules info={containers} hostId={hostId} />
    </Container>
  );
};

export default AddHost;
