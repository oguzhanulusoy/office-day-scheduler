import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider} from "@mui/material";
import { useState, useEffect } from "react";
import CalendarService from 'services/calendar/CalendarService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from 'utils/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from 'utils/generalUtils';
import CalendarPageConfig from 'configs/calendarPageConfig.js';

class CalenderPageHelper {
  constructor() {
    this.serviceCaller = new ServiceCaller();

    this.config = CalendarPageConfig.calendarPageColumns;
  }

  effectHelper({ navigate, setIsLoaded, setRows, setError, setRefresh }) {
    JWTUtil.validateStorage(this.serviceCaller)
    .then(res => {
      if(!res) {
        navigate('/', { replace: true });
        return
      }

      if(!hasPermission(navigate)) return

      this.getCalendarData(setIsLoaded, setRows, setError, setRefresh);
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

  getCalenderColumns() {
    return this.config;
  }

  getCalendarData(setIsLoaded, setRows, setError, setRefresh) {
    CalendarService.getCalendars(this.serviceCaller, '')
    .then(res => {
      setIsLoaded(true);
      setRows(res);
    })
    .catch(error => {
      setError(error);
      setIsLoaded(true);
      console.log(error)
    })

    setRefresh(false);
  }

  handleDelete({ selectedIdList, setRefresh, setError }) {    
    CalendarService.deleteCalendar(this.serviceCaller, {ids: selectedIdList})
    .then(res => {
      setRefresh(true);
    })
    .catch(error => {
      setError(error);
    })
  }

  getComponent({ error, isLoaded, rows, options }) {
    if(error) {
      return <div> Error !!!</div>;
    } else if(!isLoaded) {
      return <div> Loading... </div>;} 
    else {
      return (
        <ThemeProvider theme={this.getMuiTheme()}>
          <h2>Calendar List</h2>
          <MUIDataTable columns={this.getCalenderColumns()} data={rows} options={options} />
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

  const CalenderHelper = new CalenderPageHelper();

  const options = {
    filterType: 'dropdown',
    onRowSelectionChange: (currentSelect, allSelected) => {           
      const result = allSelected.map(item => { return rows.at(item.index) });
      const selectedIds = result.map(item => {
           return item.id;
      });
      setSelectedIdList(selectedIds);
    },
    onRowsDelete:()=>{CalenderHelper.handleDelete({ selectedIdList, setRefresh, setError })},
  }

  useEffect(() => {
    CalenderHelper.effectHelper({ navigate, setIsLoaded, setRows, setError, setRefresh });
  }, [refresh])


  return CalenderHelper.getComponent({ error, isLoaded, rows, options });
}
export default CalendarPage;