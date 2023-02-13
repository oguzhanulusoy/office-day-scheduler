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
import SchedulePageConfig  from 'configs/schedulePageConfig.js';

class SchedulePageHelper {
  constructor() {
    this.serviceCaller = new ServiceCaller();

    this.config = SchedulePageConfig.schedulePageColumns;
  }

  effectHelper({ navigate, setIsLoaded, setRows, setError, setRefresh }) {
    JWTUtil.validateStorage(this.serviceCaller)
    .then(res => {
      if(!res) {
        navigate('/', { replace: true });
        return
      }

      if(!hasPermission(navigate)) return

      this.getScheduleData(setIsLoaded, setRows, setError, setRefresh);
    })
    .catch(error => {
      console.log(error)
      setIsLoaded(true);
      setError(error);
    })
  }

  getMuiTheme() {
    return createTheme({
      overrides: {
        MuiChip: {
          root: {
            backgroundColor: "pink"
          }
        }
      }
    });
  }

  getScheduleColumns() {
    return this.config;
  }

  getScheduleData(setIsLoaded, setRows, setError, setRefresh) {
    ScheduleService.getSchedules(this.serviceCaller, '')
    .then(res => {
      setIsLoaded(true);
      setRows(res);
    })
    .catch(error => {
      console.log(error)
      setIsLoaded(true);
      setError(error);
    })

    setRefresh(false);
  }

  handleDelete({ selectedIdList, setRefresh, setError }) {
    ScheduleService.deleteSchedule(this.serviceCaller, {ids: selectedIdList})
    .then(res => {
      setRefresh(true);
    })
    .catch(error => {
      console.log(error)
      setError(error);
    })
  }

  getComponent({ error, isLoaded, rows, options }) {
    if(error) {
      return <div> Error !!!</div>;
    } else if(!isLoaded) {
      return <div> Loading... </div>;
    } else {
      return (
        <ThemeProvider theme={this.getMuiTheme()}>
          <h2>Schedule List</h2>
        <Divider/>
          <MUIDataTable columns={this.getScheduleColumns()} data={rows} options={options} />
        </ThemeProvider>
      );
    }
  }
}

function SchedulePage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded]= useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedIdList, setSelectedIdList] = useState([]);

  const ScheduleHelper = new SchedulePageHelper();

  const options = {
    filterType: 'dropdown',
    onRowSelectionChange: (currentSelect, allSelected) => {           
      const result = allSelected.map(item => { return rows.at(item.index) });
      const selectedIds = result.map(item => {
           return item.id;
      });
      setSelectedIdList(selectedIds);
    },
    onRowsDelete:()=>{ScheduleHelper.handleDelete({ selectedIdList, setRefresh, setError })},
  }

  useEffect(() => {
    ScheduleHelper.effectHelper({ navigate, setIsLoaded, setRows, setError, setRefresh });
  }, [refresh])

  return ScheduleHelper.getComponent({ error, isLoaded, rows, options });
}
export default SchedulePage;