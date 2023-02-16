import { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider, Button, TextField, Divider, Modal, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import DepartmentService from 'services/department/DepartmentService';
import ServiceCaller from 'services/ServiceCaller';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import UserService from 'services/user/UserService';
import JWTUtil from 'utils/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from 'utils/generalUtils';
import { toast } from "react-toastify";
function DepartmentPage() {
  const navigate = useNavigate();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState([]);
  const [toUpdate, setToUpdate] = useState(null);
  const [selectedIdList, setSelectedIdList] = useState([]);
  const [departmentCode, setDepartmentCode] = useState('');
  const [departmentManager, setDepartmentManager] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [groupManager, setGroupManager] = useState('');
  const [userList, setUserList] = useState([]);
  const handleDepartmentManager = (event) => {
    setDepartmentManager(event.target.value);
  };
  const handleGroupManager = (event) => {
    setGroupManager(event.target.value);
  };
  const handleDepartmentCode = (value) => {
    setDepartmentCode(value);
  };
  const handleGroupCode = (value) => {
    setGroupCode(value);
  };
  const handleUpdateOpen = () => {
    setUpdateOpen(true);
  }
  const handleCreateOpen = () => {
    setCreateOpen(true);
  }
  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setDepartmentCode("");
    setGroupCode("");
    setDepartmentManager("");
    setGroupManager("");
  }
  const handleCreateClose = () => {
    setCreateOpen(false);
    setDepartmentCode("");
    setGroupCode("");
    setDepartmentManager("");
    setGroupManager("");
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

  const columns = [
    {
      name: "departmentCode",
      label: "Department Code",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "departmentManagerFirstName",
      label: "Department Manager Name",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "departmentManagerLastName",
      label: "Department Manager Surname",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "groupCode",
      label: "Group Code",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "groupManagerFirstName",
      label: "Group Manager Name",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "groupManagerLastName",
      label: "Group Manager Surname",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "edit",
      label: "Edit",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          return (
            <Button aria-label="edit" onClick={() => { handleUpdateOpen(); loadDepartment(rows[dataIndex].id); setToUpdate(rows[dataIndex].id); }}><EditIcon style={{ color: "#9e9e9e" }}></EditIcon></Button>
          );
        }
      }
    }
  ];

  const options = {
    filterType: 'dropdown',
    onRowSelectionChange: (currentSelect, allSelected) => {
      const result = allSelected.map(item => { return rows.at(item.index) });
      const selectedIds = result.map(item => {
        return item.id;
      });
      setSelectedIdList(selectedIds);
    },
    onRowsDelete: () => { handleDelete() },
  }
  const handleDelete = () => {
    let serviceCaller = new ServiceCaller();
    DepartmentService.deleteDepartment(serviceCaller, { ids: selectedIdList })
      .then((res) => {
        if (res.status === 401) {
          toast.error("You are not authorized to delete department", { autoClose: 1000 });
          navigate('/', { replace: true });
          return
        }

        if (res.status === 200) {
          toast.success("Department deleted successfully", { autoClose: 1000 });
        } else {
          toast.error("Department could not be deleted", { autoClose: 1000 });
        }
        setRefresh(true);
      })
      .catch((error) => {
        setError(error);
      })
  }
  //modal
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #FFFFFF',
    boxShadow: 24,
    p: 2,
  };

  const saveDepartment = () => {
    let serviceCaller = new ServiceCaller();
    DepartmentService.addDepartment(serviceCaller, {
      departmentCode: departmentCode,
      groupCode: groupCode,
      departmentManagerId: departmentManager,
      groupManagerId: groupManager,
    })
      .then((res) => {
        if (res.status === 401) {
          toast.error("You are not authorized to create department", { autoClose: 1000 });
          navigate('/', { replace: true });
          return
        }

        if (res.status === 200) {
          toast.success("Department created successfully", { autoClose: 1000 });
        } else {
          toast.error("Department could not be created", { autoClose: 1000 });
        }

        setRefresh(true);
      })
      .catch((error) => {
        console.log(error)
        setIsLoaded(true);
        setError(error);
      })
  }

  const handleCreate = () => {
    saveDepartment();
    setDepartmentCode("");
    setGroupCode("");
    setDepartmentManager("");
    setGroupManager("");
    handleCreateClose();
  }
  const updateDepartment = () => {
    let serviceCaller = new ServiceCaller();
    DepartmentService.updateDepartment(serviceCaller, {
      id: toUpdate,
      departmentCode: departmentCode,
      departmentManagerId: departmentManager,
      groupCode: groupCode,
      groupManagerId: groupManager
    })
      .then((res) => {
        if (res.status === 401) {
          toast.error("You are not authorized to update department", { autoClose: 1000 });
          navigate('/', { replace: true });
          return
        }

        if (res.status === 200) {
          toast.success("Department updated successfully", { autoClose: 1000 });
        } else {
          toast.error("Department could not be updated", { autoClose: 1000 });
        }

        setRefresh(true);
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
      })
  }
  const handleUpdate = () => {
    updateDepartment();
    setDepartmentCode("");
    setGroupCode("");
    setDepartmentManager("");
    setGroupManager("");
    handleUpdateClose();
  }

  const loadDepartment = (id) => {
    const arr = rows.filter(item => item.id === id)
    setDepartmentCode(arr[0].departmentCode);
    setDepartmentManager(arr[0].departmentManagerId);
    setGroupCode(arr[0].groupCode);
    setGroupManager(arr[0].groupManagerId);
  }

  const getDepartmentData = () => {
    let serviceCaller = new ServiceCaller();
    DepartmentService.getDepartments(serviceCaller, '')
      .then(res => {
        if (res.status === 401) {
          toast.error("You are not authorized to view departments", { autoClose: 1000 });
          navigate('/', { replace: true });
          return
        }

        if (res.status !== 200) {
          toast.error("Departments could not be loaded", { autoClose: 1000 });
        }

        setIsLoaded(true);
        setRows(res.data);
      })
      .catch(error => {
        setIsLoaded(true);
        setError(error);
      })
    setRefresh(false);
  }

  useEffect(() => {
    const serviceCaller = new ServiceCaller();
    JWTUtil.validateStorage(serviceCaller)
      .then((res) => {
        if (!res) {
          navigate('/', { replace: true });
          return
        }

        if (!hasPermission(navigate)) return

        getDepartmentData();
        getUserData();
      })
      .catch((error) => {
        console.log(error)
        setError(error);
      })
  }, [refresh])

  const getUserData = () => {
    let serviceCaller = new ServiceCaller();
    UserService.getUsers(serviceCaller, '')
      .then(res => {
        if (res.status === 401) {
          toast.error("You are not authorized to view users", { autoClose: 1000 });
          navigate('/', { replace: true });
          return
        }

        if (res.status !== 200) {
          toast.error("Users could not be loaded", { autoClose: 1000 });
        }

        setUserList(res.data);
      })
      .catch(error => {
        setError(error);
      })
  }

  if (error) {
    return <div> Error !!!</div>;
  } else if (!isLoaded) {
    return <div> Loading... </div>;
  }
  else {
    return (
      <ThemeProvider theme={getMuiTheme()}>
        <h2>Department List</h2>
        <div>
          <Modal
            open={createOpen}
            onClose={handleCreateClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Card sx={{ margin: 2, maxWidth: 500 }}>
                <CardHeader align="center" title="Add Department"
                />
                <CardContent align="center">
                  <TextField id="outlined-basic" label="Department Code" variant="outlined" value={departmentCode}
                    onChange={(i) => handleDepartmentCode(i.target.value)} />
                  <div>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-helper-label">Department Manager</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={departmentManager}
                        label="Department Manager"
                        onChange={handleDepartmentManager}
                        style={{ width: 210 }}
                      >
                        {userList.map(user => (
                          <MenuItem key={user.id} value={user.id} > {user.firstName} {user.lastName} ({user.email}) </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <TextField id="outlined-basic" label="Group Code" variant="outlined" value={groupCode}
                    onChange={(i) => handleGroupCode(i.target.value)} />
                  <div>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-helper-label">Group Manager</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={groupManager}
                        label="Group Manager"
                        onChange={handleGroupManager}
                        style={{ width: 210 }}
                      >
                        {userList.map(user => (
                          <MenuItem key={user.id} value={user.id}> {user.firstName} {user.lastName} ({user.email})</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <Button variant="outlined" style={{ marginLeft: 30, marginTop: 10 }} onClick={() => handleCreate()}>Add</Button>
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
        <div>
          <Modal
            open={updateOpen}
            onClose={handleUpdateClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Card sx={{ margin: 2, maxWidth: 500 }}>
                <CardHeader align="center" title="Edit Department"
                />
                <CardContent align="center">
                  <TextField id="outlined-basic" label="Department Code" variant="outlined" value={departmentCode}
                    onChange={(i) => handleDepartmentCode(i.target.value)} />
                  <div>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-helper-label">Department Manager </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={departmentManager}
                        label="departmentManager"
                        onChange={handleDepartmentManager}
                        style={{ width: 210 }}
                      >
                        {userList.map(user => (
                          <MenuItem key={user.id} value={user.id} > {user.firstName} {user.lastName} ({user.email}) </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <TextField id="outlined-basic" label="Group Code" variant="outlined" value={groupCode}
                    onChange={(i) => handleGroupCode(i.target.value)} />
                  <div>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-helper-label">Group Manager</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={groupManager}
                        label="Group Manager"
                        onChange={handleGroupManager}
                        style={{ width: 210 }}
                      >
                        {userList.map(user => (
                          <MenuItem key={user.id} value={user.id}> {user.firstName} {user.lastName} ({user.email}) </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
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
        <Divider />
        <Button onClick={handleCreateOpen} variant="outlined" style={{ margin: 8, backgroundColor: "white", color: "black", borderColor: "white", textTransform: 'none' }}><AddCircleOutlineIcon></AddCircleOutlineIcon></Button>
        <MUIDataTable columns={columns} data={rows} options={options} />
      </ThemeProvider>
    );
  }
}

export default DepartmentPage;
