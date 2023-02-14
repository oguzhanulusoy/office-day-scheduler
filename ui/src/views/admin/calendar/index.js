import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider} from "@mui/material";
import { useState, useEffect } from "react";
import CalendarService from 'services/calendar/CalendarService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from 'utils/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from 'utils/generalUtils';
import CalendarPageConfig from 'configs/calendarPageConfig.js';
import { toast } from "react-toastify";

class CalendarPageHelper {
  constructor() {
    this.serviceCaller = new ServiceCaller();

    this.config = CalendarPageConfig.calendarPageColumns;
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

      this.getCalendarData();
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

  getCalendarColumns() {
    return this.config;
  }

  getCalendarData() {
    CalendarService.getCalendars(this.serviceCaller, '')
    .then(res => {
      if (res.status === 401) {
        toast.error("You are not authorized to access this page.", { autoClose: 1000 });
        this.navigate('/', { replace: true });
        return;
      }

      this.setIsLoaded(true);
      this.setRows(res.data);
    })
    .catch(error => {
      this.setError(error);
      this.setIsLoaded(true);
      console.log(error)
    })

    this.setRefresh(false);
  }

  handleDelete() {    
    CalendarService.deleteCalendar(this.serviceCaller, {ids: this.selectedIdList})
    .then(res => {
      if (res.status === 401) {
        toast.error("You are not authorized to access this page.", { autoClose: 1000 });
        this.navigate('/', { replace: true });
        return;
      }

      toast.success("Calendar deleted successfully.", { autoClose: 1000 });
      this.setRefresh(true);
    })
    .catch(error => {
      this.setError(error);
    })
  }

  getComponent() {
    if(this.error) {
      return <div> Error !!!</div>;
    } else if(!this.isLoaded) {
      return <div> Loading... </div>;} 
    else {
      return (
        <ThemeProvider theme={this.getMuiTheme()}>
          <h2>Calendar List</h2>
          <MUIDataTable columns={this.getCalendarColumns()} data={this.rows} options={this.options} />
        </ThemeProvider>
      );
    }
  }
}

function CalendarPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded]= useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedIdList, setSelectedIdList] = useState([]);

  const CalendarHelper = new CalendarPageHelper();
  CalendarHelper.initSetterFunctions({ navigate, setIsLoaded, setRows, setError, setRefresh, setSelectedIdList });

  const parameters = { isLoaded, error, rows, refresh, selectedIdList };
  CalendarHelper.initParameters(parameters);

  useEffect(() => {
    CalendarHelper.effectHelper();
  }, [refresh])


  return CalendarHelper.getComponent();
}

export default CalendarPage;