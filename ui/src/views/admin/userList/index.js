import { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import UserService from 'services/user/UserService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from "utils/jwtUtil";
import { useNavigate } from 'react-router-dom';
import { hasPermission } from 'utils/generalUtils';
import { toast } from 'react-toastify';
function UserPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [isLoaded, setIsLoaded]= useState(false);
  const [error, setError] = useState(null);
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
      name: "registrationNumber",
      label: "Registration Number",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "firstName",
      label: "First Name",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "lastName",
      label: "Last Name",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "departmentCode",
      label: "Department",
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
      name: "zoneName",
      label: "Location",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "transportChoice",
      label: "Transportation",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "roleName",
      label: "Role",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "status",
      label: "Status",
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
            <Button aria-label="edit" onClick={()=>{}}><EditIcon style={{color:"#9e9e9e"}}></EditIcon></Button>
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
      console.log(selectedIds);
    },
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
      console.log(error)
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

      if(!hasPermission(navigate)) return
      
      getUserData()
    })
    .catch(error => {
      console.log(error)
      setIsLoaded(true);
      setError(error);
    })
  }, [])

  if(error) {
      return <div> Error !!!</div>;
  } else if(!isLoaded) {
      return <div> Loading... </div>;} 
  else {
    return (
      <ThemeProvider theme={getMuiTheme()}>
        <div>
        <h2>User List</h2>
        </div>
          <MUIDataTable columns={columns} data={rows} options={options} />
      </ThemeProvider>
    )
  }
}

export default UserPage;
  