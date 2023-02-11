import { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, Divider, ThemeProvider, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ZoneService from 'services/zone/ZoneService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from "utils/jwtUtil";
import { hasPermission } from "utils/generalUtils";
import { useNavigate } from 'react-router-dom';
function ZonePage() {
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
          name: "zoneName",
          label: "Name",
          options: {
            filter: true,
            sort: true
          }
        },
        {
            name: "code",
            label: "Code",
            options: {
              filter: true,
              sort: true
            }
        },
        {
            name: "lowerBound",
            label: "Lower Bound",
            options: {
              filter: true,
              sort: true
            }
        },
        {
            name: "upperBound",
            label: "Upper Bound",
            options: {
              filter: true,
              sort: true
            }
        },
        {
            name: "price",
            label: "Price (₺)",
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

    const getZoneData = () => {
      let serviceCaller = new ServiceCaller();
      ZoneService.getZones(serviceCaller, '')
      .then((res) => {
        setIsLoaded(true);
        setRows(res);
      })
      .catch((error) => {
        console.log(error)
        setIsLoaded(true);
        setError(error);
      })
    }

    useEffect(() => {
      const serviceCaller = new ServiceCaller();
      JWTUtil.validateStorage(serviceCaller)
      .then((res) => {
        if (!res) {
          navigate('/', { replace: true });
          return
        }

        if(!hasPermission(navigate)) return

        getZoneData();
      })
      .catch((err) => {
        console.log(err);
      })
    }, [])

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

if(error) {
    return <div> Error !!!</div>;
} else if(!isLoaded) {
    return <div> Loading... </div>;} 
else {
    return (
    <ThemeProvider theme={getMuiTheme()}>
       <h2>Zone List</h2>
       <Divider/>
       <Button variant="outlined" style={{margin:8, backgroundColor:"white", color:"black", borderColor:"white", textTransform: 'none'}}><AddCircleOutlineIcon></AddCircleOutlineIcon></Button>
        <MUIDataTable columns={columns} data={rows} options={options} />
    </ThemeProvider>
)}
}

export default ZonePage;
