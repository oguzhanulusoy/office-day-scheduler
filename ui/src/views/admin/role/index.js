import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import RoleService from 'services/role/RoleService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from 'utils/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from 'utils/generalUtils';
import { toast } from "react-toastify";
function RolePage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState([]);

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
    }
  ];

  const options = {
    filterType: 'dropdown',
    selectableRows: 'none',
  }

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
        if (!res) {
          navigate('/', { replace: true });
          return
        }

        if (!hasPermission(navigate)) return

        getRoleData();
      })
      .catch(error => {
        console.log(error)
        setError(error);
      })
  }, [refresh])

  if (error) {
    return <div> Error !!!</div>;
  } else if (!isLoaded) {
    return <div> Loading... </div>;
  }
  else {
    return (
      <ThemeProvider theme={getMuiTheme()}>
        <h2>Role List</h2>
        <Divider />
        <MUIDataTable columns={columns} data={rows} options={options} />
      </ThemeProvider>
    );
  }
}
export default RolePage;