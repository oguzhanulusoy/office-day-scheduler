import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider, Button, TextField, Modal, Box, Divider } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import RoleService from 'services/role/RoleService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from 'utils/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from 'utils/generalUtils';
import { toast } from "react-toastify";
function RolePage() {
  const navigate = useNavigate();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [createOpen, setCreateOpen]=useState(false);
  const [isLoaded, setIsLoaded]= useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState([]);
  const [toUpdate, setToUpdate] = useState(null);
  const [selectedIdList, setSelectedIdList] = useState([]);
  const [role, setRole] = useState({
    roleName: "",
  });
  const { roleName } = role;

  const onInputChange = (e) => {
    setRole({ ...role, [e.target.name]: e.target.value });
  };

  const handleUpdateOpen = () => {
    setUpdateOpen(true);
  }
  const handleCreateOpen = () => {
    setCreateOpen(true);
  }
  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setRole({roleName: "",});
  }
  const handleCreateClose = () => {
    setCreateOpen(false);
    setRole({roleName: "",});
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
      name: "roleName",
      label: "Role Name",
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
              <Button aria-label="edit" onClick={()=>{handleUpdateOpen();loadRole(rows[dataIndex].id);setToUpdate(rows[dataIndex].id);}}><EditIcon style={{color:"#9e9e9e"}}></EditIcon></Button>
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
    onRowsDelete:()=>{handleDelete()},
  }

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
  const getRoleData = () => {
    let serviceCaller = new ServiceCaller();
    RoleService.getRoles(serviceCaller, '')
    .then(res => {
      if (res.status === 401) {
        toast.error("You are not authorized to access this page.", { autoClose: 1000 });
        navigate('/', { replace: true });
        return
      }

      if (res.status === 200) {
        setIsLoaded(true);
        setRows(res.data);
      } else {
        toast.error("Error occurred while fetching roles.", { autoClose: 1000 });
      }
      
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
    .then(res => {
      if(!res) {
        navigate('/', { replace: true });
        return
      }

      if(!hasPermission(navigate)) return

      getRoleData();
    })
    .catch(error => {
      console.log(error)
      setError(error);
    })
  }, [refresh])

  const saveRole = () => {
    let serviceCaller = new ServiceCaller();
    RoleService.addRole(serviceCaller, { roleName })
    .then(res => {
      if (res.status === 401) {
        toast.error("You are not authorized to access this page.", { autoClose: 1000 });
        navigate('/', { replace: true });
        return
      }
      
      if (res.status === 200) {
        toast.success("Role added successfully.", { autoClose: 1000 });
      } else {
        toast.error("Error occurred while adding role.", { autoClose: 1000 });
      }
    
      setRefresh(true);
    })
    .catch(error => {
      setIsLoaded(true);
      setError(error);
    })
  }  
const updateRole = () => {
  let serviceCaller = new ServiceCaller();
  RoleService.updateRole(serviceCaller, {id: toUpdate, roleName: roleName})
  .then(res => {
    if (res.status === 401) {
      toast.error("You are not authorized to access this page.", { autoClose: 1000 });
      navigate('/', { replace: true });
      return
    }

    if (res.status === 200) {
      toast.success("Role updated successfully.", { autoClose: 1000 });
    } else {
      toast.error("Error occurred while updating role.", { autoClose: 1000 });
    }

    setRefresh(true);
  })
  .catch(error => {
    setIsLoaded(true);
    setError(error);
  })
}
const deleteRole = () => {
  let serviceCaller = new ServiceCaller();
  RoleService.deleteRole(serviceCaller, { ids: selectedIdList })
  .then(res => {
    if (res.status === 401) {
      toast.error("You are not authorized to access this page.", { autoClose: 1000 });
      navigate('/', { replace: true });
      return
    }

    if (res.status === 200) {
      toast.success("Role deleted successfully.", { autoClose: 1000 });
    } else {
      toast.error("Error occurred while deleting role.", { autoClose: 1000 });
    }

    setRefresh(true);
  })
  .catch(error => {
    setError(error);
  })
}
const handleDelete = () => {
  deleteRole();
}
const handleCreate=()=>{
  saveRole();
  setRole({roleName: "",});
  handleCreateClose();
}

const handleUpdate = () => {
  updateRole();
  setRole({roleName: "",});
  handleUpdateClose();
}
const loadRole = (id) => {
  const arr=rows.filter(item => item.id === id)
  setRole({roleName: arr[0].roleName});
}

  if(error) {
    return <div> Error !!!</div>;
} else if(!isLoaded) {
    return <div> Loading... </div>;} 
  else {
    return (
      <ThemeProvider theme={getMuiTheme()}>
        <h2>Role List</h2>
        <div>
        <Modal
          open={createOpen}
          onClose={handleCreateClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
          <Card sx={{margin:2, maxWidth: 500 }}>
        <CardHeader align="left"
        /> 
        <CardContent align="center">
        <h3>Add Role</h3>
          <TextField id="outlined-basic" name="roleName" label="Role Name" variant="outlined"  value={roleName} 
          onChange={(e) => onInputChange(e)}/>
          <div>
          <Button variant="outlined" style={{marginLeft:30, marginTop:10}} onClick={()=> handleCreate()}>Add</Button>
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
          <Card sx={{margin:2, maxWidth: 500 }}>
        <CardHeader align="left"
        /> 
        <CardContent>
        <h3>Edit Role</h3>
          <TextField id="outlined-basic" name="roleName" label="Role Name" variant="outlined"  value={roleName} 
          onChange={(e) => onInputChange(e)}/>
          <Button variant="outlined" style={{marginLeft:30, marginTop:10}} onClick={()=> handleUpdate()}>Save</Button> 
          <Typography variant="body2" color="text.secondary" align="left">
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
        </CardActions>
      </Card>
          </Box>
        </Modal>
      </div>
      <Divider/>
        <Button onClick={handleCreateOpen} variant="outlined" style={{margin:8, backgroundColor:"white", color:"black", borderColor:"white", textTransform: 'none'}}><AddCircleOutlineIcon></AddCircleOutlineIcon></Button>
        <MUIDataTable columns={columns} data={rows} options={options} />
      </ThemeProvider>
  );
  }
}
export default RolePage;