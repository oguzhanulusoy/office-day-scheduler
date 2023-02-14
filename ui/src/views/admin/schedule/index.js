import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import ScheduleService from 'services/schedule/ScheduleService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from 'utils/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from 'utils/generalUtils';
import SchedulePageConfig  from 'configs/schedulePageConfig.js';
import { toast } from "react-toastify";

class SchedulePageHelper {
  constructor() {
    this.serviceCaller = new ServiceCaller();

    this.config = SchedulePageConfig.schedulePageColumns;
  }

  initSetterFunctions({ navigate, setIsLoaded, setRows, setError, setRefresh, setSelectedIdList }) {
    this.navigate = navigate;
    this.setIsLoaded = setIsLoaded;
    this.setRows = setRows;
    this.setError = setError;
    this.setRefresh = setRefresh;
    this.setSelectedIdList = setSelectedIdList;
  }

  initParameters(parameters) {
    this.isLoaded = parameters.isLoaded;
    this.error = parameters.error;
    this.rows = parameters.rows;
    this.refresh = parameters.refresh;
    this.selectedIdList = parameters.selectedIdList;

    this.prepareOptions();
  }

  prepareOptions() {
    this.options = {
      filterType: 'dropdown',
      onRowSelectionChange: (currentSelect, allSelected) => {           
        const result = allSelected.map(item => { return this.rows.at(item.index) });
        const selectedIds = result.map(item => {
            return item.id;
        });
        this.setSelectedIdList(selectedIds);
      },
      onRowsDelete:()=>{this.handleDelete()},
    }
  }

  effectHelper() {
    JWTUtil.validateStorage(this.serviceCaller)
    .then(res => {
      if(!res) {
        this.navigate('/', { replace: true });
        return
      }

      if(!hasPermission(this.navigate)) return

      this.getScheduleData();
    })
    .catch(error => {
      console.log(error)
      this.setIsLoaded(true);
      this.setError(error);
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

  getScheduleData() {
    ScheduleService.getSchedules(this.serviceCaller, '')
    .then(res => {
      if (res.status === 401) {
        toast.error("You are not authorized to see this page", { autoClose: 1000 });
        this.navigate('/', { replace: true });
        return;
      }

      if (res.status === 200) {
        this.setIsLoaded(true);
        this.setRows(res.data);
      } else {
        toast.error("An error occurred while fetching data", { autoClose: 1000 });
      }
    })
    .catch(error => {
      console.log(error)
      this.setIsLoaded(true);
      this.setError(error);
    })

    this.setRefresh(false);
  }

  handleDelete() {
    ScheduleService.deleteSchedule(this.serviceCaller, { ids: this.selectedIdList })
    .then(res => {
      console.log(res)
      if (res.status === 401) {
        toast.error("You are not authorized to see this page", { autoClose: 1000 });
        this.navigate('/', { replace: true });
        return;
      }

      if (res.status === 200) {
        toast.success("Data deleted successfully", { autoClose: 1000 });
      } else {
        toast.error("An error occurred while deleting data", { autoClose: 1000 });
      }

      this.setRefresh(true);
    })
    .catch(error => {
      console.log(error)
      this.setError(error);
    })
  }

  getComponent() {
    if(this.error) {
      return <div> Error !!!</div>;
    } else if(!this.isLoaded) {
      return <div> Loading... </div>;
    } else {
      return (
        <ThemeProvider theme={this.getMuiTheme()}>
          <h2>Schedule List</h2>
        <Divider/>
          <MUIDataTable columns={this.getScheduleColumns()} data={this.rows} options={this.options} />
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
  ScheduleHelper.initSetterFunctions({ navigate, setIsLoaded, setRows, setError, setRefresh, setSelectedIdList });

  const parameters = { isLoaded, error, rows, refresh, selectedIdList };
  ScheduleHelper.initParameters(parameters);

  useEffect(() => {
    ScheduleHelper.effectHelper();
  }, [refresh])

  return ScheduleHelper.getComponent();
}
export default SchedulePage;