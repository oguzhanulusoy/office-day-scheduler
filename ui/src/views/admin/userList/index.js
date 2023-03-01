import { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider, Button, Modal, Box, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import UserService from 'services/user/UserService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from "utils/jwtUtil";
import { useNavigate } from 'react-router-dom';
import { hasPermission } from 'utils/generalUtils';
import { toast } from 'react-toastify';
import UserPageConfig from 'configs/userListPageConfig.js';
import ZoneService from "services/zone/ZoneService";

function UserPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [user, setUser] = useState({
    userId: '',
    zoneId: '',
    transportChoice: '',
  });

  const { userId, zoneId, transportChoice } = user;

  const handleUserZone = (event) => {
    setUser({ ...user, zoneId: event.target.value });
  }

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const handleUpdateOpen = () => {
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setUser({ userId: '', zoneId: '', transportChoice: '' });
  }

  const getMuiTheme = () =>
    createTheme({
      overrides: {
        MuiChip: {
          root: {
            backgroundColor: "pink"
          }
        }
      }
    });

  const columns = UserPageConfig.userListPageColumns;
  if (sessionStorage.getItem('userRole') !== 'SUPER_USER') {
    columns[columns.length - 1].options.display = false;
  }

  columns[columns.length - 1].options.customBodyRenderLite = (dataIndex) => {
    return (
      <Button aria-label="edit" onClick={() => { handleUpdateOpen(); loadUser(rows[dataIndex].id) }}><EditIcon style={{ color: "#9e9e9e" }}></EditIcon></Button>
    );
  }

  const options = {
    filterType: 'dropdown',
    selectableRows: 'none',
  }

  const loadUser = (id) => {
    const arr = rows.filter((row) => row.id === id);
    setUser({
      userId: arr[0].id,
      zoneId: arr[0].zoneId,
      transportChoice: arr[0].transportChoice,
    })
  }

  const getZones = () => {
    let serviceCaller = new ServiceCaller();
    ZoneService.getZones(serviceCaller, '')
      .then(res => {
        if (res.status === 401) {
          toast.error("You are not authorized to access this page", { autoClose: 1000 });
          navigate('/', { replace: true });
          return
        }

        if (res.status === 200) {
          setZoneList(res.data);
        }
      })
      .catch(error => {
        setIsLoaded(true);
        setError(error);
      })
  }

  const getUserData = () => {
    let serviceCaller = new ServiceCaller();
    UserService.getUsers(serviceCaller, '')
      .then(res => {
        if (res.status === 401) {
          toast.error("You are not authorized to access this page", { autoClose: 1000 });
          navigate('/', { replace: true });
          return
        }

        if (res.status === 200) {
          setIsLoaded(true);
          setRows(res.data);
        }
      })
      .catch(error => {
        setIsLoaded(true);
        setError(error);
      })
  }

  const handleUpdate = () => {
    const serviceCaller = new ServiceCaller();
    const requestBody = {
      "id": parseInt(userId),
      "zoneId": parseInt(zoneId),
      "transportChoice": transportChoice,
    }

    UserService.updateUser(serviceCaller, requestBody)
    .then(res => {
      if (res.status === 200) {
        toast.success("User updated successfully", { autoClose: 1000 });
        handleUpdateClose();
        getUserData();
      } else if (res.status === 401) {
        toast.error("You are not authorized to access this page", { autoClose: 1000 });
        navigate('/', { replace: true });
        return
      } else {
        toast.error("Something went wrong", { autoClose: 1000 });
      }
    })
    .catch(error => {
      setIsLoaded(true);
      setError(error);
    })
  }

  useEffect(() => {
    const serviceCaller = new ServiceCaller();
    JWTUtil.validateStorage(serviceCaller)
      .then(res => {
        if (!res) {
          navigate('/', { replace: true });
          return
        }

        if (!hasPermission(navigate)) return

        getZones();
        getUserData();
      })
      .catch(error => {
        setIsLoaded(true);
        setError(error);
      })
  }, [])

  if (error) {
    return <div> Error !!!</div>;
  } else if (!isLoaded) {
    return <div> Loading... </div>;
  }
  else {
    return (
      <ThemeProvider theme={getMuiTheme()}>
        <div>
          <h2>User List</h2>
        </div>
        <MUIDataTable columns={columns} data={rows} options={options} />
        <div>
          <Modal
            open={updateOpen}
            onClose={handleUpdateClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={UserPageConfig.style}>
              <Card sx={{ margin: 2, maxWidth: 500 }}>
                <CardHeader align="center" title="Edit User" />
                <CardContent align="center">
                  <div>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-helper-label">Location</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={zoneId}
                        label="User Zone"
                        onChange={handleUserZone}
                        style={{ width: 210 }}
                      >
                        {zoneList.map(zone => (
                          <MenuItem key={zone.id} value={zone.id} > Name: {zone.zoneName} Price: {zone.price} </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <TextField id="outlined-basic" name="transportChoice" label="Transportation" variant="outlined"
                    value={transportChoice}
                    onChange={(e) => onInputChange(e)}
                    sx={{ mt: 1.5 }}
                  />
                  <div>
                    <Button variant="outlined" style={{ marginLeft: 30, marginTop: 10 }} onClick={() => handleUpdate()}>Save</Button>
                  </div>
                  <Typography variant="body2" color="text.secondary" align="left">
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                </CardActions>
              </Card>
            </Box>
          </Modal>
        </div>
      </ThemeProvider>
    )
  }
}

export default UserPage;
