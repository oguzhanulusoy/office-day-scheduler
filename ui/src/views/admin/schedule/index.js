import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider, Button, TextField, Modal, Box, Divider } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ScheduleService from 'services/schedule/ScheduleService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from 'utils/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from 'utils/generalUtils';
function SchedulePage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded]= useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedIdList, setSelectedIdList] = useState([]);
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
      name: "userFirstName",
      label: "First Name",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "userLastName",
      label: "Last Name",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "userEmail",
      label: "Email",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "userStatus",
      label: "User Status",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "officeDay",
      label: "Office Day",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "vacation",
      label: "Vacation",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "workFromHome",
      label: "Work From Home",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "totalDay",
      label: "Total Day",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "report",
      label: "Report",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "dateMonth",
      label: "Month",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "dateYear",
      label: "Year",
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
              <Button aria-label="edit"><EditIcon style={{color:"#9e9e9e"}}></EditIcon></Button>
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
  const getScheduleData = () => {
    let serviceCaller = new ServiceCaller();
    ScheduleService.getSchedules(serviceCaller, '')
    .then(res => {
      setIsLoaded(true);
      setRows(res);
    })
    .catch(error => {
      console.log(error)
      setIsLoaded(true);
      setError(error);
    })

    setRefresh(false); //???
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
      
      getScheduleData();
    })
    .catch(error => {
      console.log(error)
      setIsLoaded(true);
      setError(error);
    })
  }, [refresh])

  if(error) {
    return <div> Error !!!</div>;
} else if(!isLoaded) {
    return <div> Loading... </div>;} 
  else {
    return (
      <ThemeProvider theme={getMuiTheme()}>
        <h2>Schedule List</h2>
      <Divider/>
        <Button variant="outlined" style={{margin:8, backgroundColor:"white", color:"black", borderColor:"white", textTransform: 'none'}}><AddCircleOutlineIcon></AddCircleOutlineIcon></Button>
        <MUIDataTable columns={columns} data={rows} options={options} />
      </ThemeProvider>
  );
  }
}
export default SchedulePage;