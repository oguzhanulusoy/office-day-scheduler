import MUIDataTable from "mui-datatables";
import { createTheme, Divider, ThemeProvider, Button, Modal, Box, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import Visibility from "@mui/icons-material/Visibility";
import DatePicker from "react-multi-date-picker"

import { DataGrid } from "@mui/x-data-grid";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ScheduleService from 'services/schedule/ScheduleService';
import CalendarService from "services/calendar/CalendarService";
import OutOfOfficeDayService from "services/out-of-office-day/OutOfOfficeDayService";
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from 'utils/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from 'utils/generalUtils';
import SchedulePageConfig from 'configs/schedulePageConfig.js';
import { toast } from "react-toastify";


function SchedulePage() {
  const columns = SchedulePageConfig.schedulePageColumns;
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedIdList, setSelectedIdList] = useState([]);
  const [outOfficeDayList, setOutOfficeDayList] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [schedule, setSchedule] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    user_status: '',
    office_day: '',
    vacation_day: '',
    wfh_day: '',
    total_day: '',
    report: '',
    month: '',
    year: '',
  });
  const [calendar, setCalendar] = useState({
    id: '',
    days: [],
    dates: [],
  });

  const { id, first_name, last_name, email, user_status, office_day, vacation_day, wfh_day, total_day, report, month, year } = schedule;


  columns[columns.length - 1].options.customBodyRenderLite = (dataIndex) => {
    return (
      <Button aria-label="edit" onClick={() => { handleDetailsOpen(); loadSchedule(rows[dataIndex].id); loadCalendar(rows[dataIndex].id) }}><Visibility style={{ color: "#9e9e9e" }}></Visibility></Button>
    );
  }
  columns[columns.length - 2].options.customBodyRenderLite = (dataIndex) => {
    return (
      <Button aria-label="edit" onClick={() => { handleUpdateOpen(); loadCalendar(rows[dataIndex].id); loadSchedule(rows[dataIndex].id); loadOutOfOfficeDay(); }}><EditIcon style={{ color: "#9e9e9e" }}></EditIcon></Button>
    );
  }

  const loadSchedule = (id) => {
    const arr = rows.filter(item => item.id === id);
    setSchedule({
      id: arr[0].id,
      first_name: arr[0].userFirstName,
      last_name: arr[0].userLastName,
      email: arr[0].userEmail,
      user_status: arr[0].userStatus,
      office_day: arr[0].officeDay,
      vacation_day: arr[0].vacation,
      wfh_day: arr[0].workFromHome,
      total_day: arr[0].totalDay,
      report: arr[0].report,
      month: arr[0].dateMonth,
      year: arr[0].dateYear,
    });
  }

  const loadCalendar = (id) => {
    const arr = rows.filter(item => item.id === id);
    const serviceCaller = new ServiceCaller();
    CalendarService.getActiveCalendar(serviceCaller, { userId: arr[0].userId, dateMonth: arr[0].dateMonth, dateYear: arr[0].dateYear })
      .then(res => {
        if (res.status === 401) {
          toast.error("You are not authorized to see this page", { autoClose: 1000 });
          navigate('/', { replace: true });
          return;
        }

        if (res.status === 200) {
          const splittedDays = res.data.days.split(',');
          let days = [];
          let dates = [];
          for (let i = 0; i < splittedDays.length; i++) {
            days.push({ id: i + 1, officeDay: splittedDays[i], day: getDateName(splittedDays[i]) });
            dates.push(splittedDays[i])
          }

          setCalendar({
            id: res.data.id,
            days: days,
            dates: dates,
          });

        } else {
          toast.error("An error occurred while fetching data", { autoClose: 1000 });
        }
      })
      .catch(error => {
        console.log(error)
        setError(error);
      })
  }

  const loadOutOfOfficeDay = () => {
    const serviceCaller = new ServiceCaller();
    OutOfOfficeDayService.getOutOfOfficeDays(serviceCaller, '')
    .then(res => {
      if (res.status === 401) {
        toast.error("You are not authorized to see this page", { autoClose: 1000 });
        navigate('/', { replace: true });
        return;
      }

      if (res.status === 200) {
        const outDates = []
        for(const day of res.data) {
          outDates.push(day.date)
        }
        setOutOfficeDayList(outDates);
      } else {
        toast.error("An error occurred while fetching data", { autoClose: 1000 });
      }
    })
  }

  const handleUpdateOpen = () => {
    setUpdateOpen(true);
  };

  const clearData = () => {
    setCalendar({
      id: '',
      days: [],
      dates: []
    });

    setSchedule({
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      user_status: '',
      office_day: '',
      vacation_day: '',
      wfh_day: '',
      total_day: '',
      report: '',
      month: '',
      year: '',
    });
  }


  const handleUpdateClose = () => {
    setUpdateOpen(false);
    clearData();
  }

  const handleDetailsOpen = () => {
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    clearData();
  }

  const getMuiTheme = () => {
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

  const getDateName = (date) => {
    const dateName = new Date(date).toLocaleString('default', { weekday: 'long' });
    return dateName;
  }

  let options = {};

  if (sessionStorage.getItem('userRole') !== 'SUPER_USER') {
    options = {
      filterType: 'dropdown',
      selectableRows: 'none',
    }
  } else {
    options = {
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
  }

  const getMonthNumberFromName = (monthName) => {
    return new Date(`${monthName} 1, 2023`).getMonth();
  }

  const handleDelete = () => {
    const serviceCaller = new ServiceCaller();
    ScheduleService.deleteSchedule(serviceCaller, { ids: selectedIdList })
      .then(res => {
        if (res.status === 401) {
          toast.error("You are not authorized to see this page", { autoClose: 1000 });
          navigate('/', { replace: true });
          return;
        }

        if (res.status === 200) {
          toast.success("Data deleted successfully", { autoClose: 1000 });
        } else {
          toast.error("An error occurred while deleting data", { autoClose: 1000 });
        }

        setRefresh(true);
      })
      .catch(error => {
        console.log(error)
        setError(error);
      })
  }

  const getScheduleData = () => {
    const serviceCaller = new ServiceCaller();
    ScheduleService.getSchedules(serviceCaller, '')
      .then(res => {
        if (res.status === 401) {
          toast.error("You are not authorized to see this page", { autoClose: 1000 });
          navigate('/', { replace: true });
          return;
        }

        if (res.status === 200) {
          setIsLoaded(true);
          setRows(res.data);
        } else {
          toast.error("An error occurred while fetching data", { autoClose: 1000 });
        }
      })
      .catch(error => {
        console.log(error)
        setIsLoaded(true);
        setError(error);
      })

    setRefresh(false);
  }

  const updateSchedule = async() => {
    const serviceCaller = new ServiceCaller();
    const wfhCount = parseInt(schedule.total_day) - calendar.dates.length;

    const data = {
      id: parseInt(schedule.id),
      officeDay: calendar.dates.length,
      vacation: parseInt(schedule.vacation_day),
      workFromHome: wfhCount,
      totalDay: parseInt(schedule.total_day),
      report: parseInt(schedule.report),
      dateMonth: schedule.month,
      dateYear: schedule.year,
    }

    return await ScheduleService.updateSchedule(serviceCaller, data)
  }

  const updateCalendar = async() => {
    const serviceCaller = new ServiceCaller();
    
    const data = {
      id: parseInt(calendar.id),
      days: calendar.dates.length === 0 ? null : calendar.dates.toString(),
      dateMonth: schedule.month,
      dateYear: schedule.year,
    }

    return await CalendarService.updateCalendar(serviceCaller, data)
  }

  const handleUpdate = () => {
    new Promise(async (resolve, reject) => {
      const updateScheduleResult = await updateSchedule();
      const updateCalendarResult = await updateCalendar();

      if (updateScheduleResult.status === 200 && updateCalendarResult.status === 200) {
        toast.success("Data updated successfully", { autoClose: 1000 });
        getScheduleData();
        setIsLoaded(true);
        handleUpdateClose();
        return
      }

      toast.error("Something went wrong...", { autoClose: 1000 });
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

        if (!hasPermission(navigate)) return

        getScheduleData();
      })
      .catch(error => {
        console.log(error)
        setIsLoaded(true);
        setError(error);
      })
  }, [refresh])

  if (error) {
    return <div> Error !!!</div>;
  } else if (!isLoaded) {
    return <div> Loading... </div>;
  } else {
    return (
      <ThemeProvider theme={getMuiTheme()}>
        <h2>Schedule List</h2>
        <Divider />
        <MUIDataTable columns={columns} data={rows} options={options} />

        <div>
          <Modal
            open={detailsOpen}
            onClose={handleDetailsClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={SchedulePageConfig.detailsStyle}>
              <Card sx={{ margin: 2, maxWidth: 700 }}>
                <CardHeader align="center" title="Schedule Details" />
                <CardContent align="left">
                  <Box sx={{ fontSize: 15 }}>
                    <p><strong>First Name: </strong> {first_name} </p>
                    <p><strong>Last Name: </strong> {last_name} </p>
                    <p><strong>Email: </strong> {email} </p>
                    <p><strong>User Status: </strong> {user_status} </p>
                    <p><strong>Office Day Count: </strong> {office_day} </p>
                    <p><strong>Vacation Day Count: </strong> {vacation_day} </p>
                    <p><strong>WFH Day Count: </strong> {wfh_day} </p>
                    <p><strong>Total Day: </strong> {total_day} </p>
                    <p><strong>Report: </strong> {report} </p>
                    <p><strong>Month: </strong> {month} </p>
                    <p><strong>Year: </strong> {year} </p>
                  </Box>
                  <Box sx={{ height: 300, width: '100%' }}>
                    <DataGrid
                      rows={calendar.days}
                      columns={SchedulePageConfig.scheduleDetailsColumns}
                      pageSize={10}
                    />
                  </Box>
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
            <Box sx={SchedulePageConfig.editStyle}>
              <Card sx={{ margin: 2, maxWidth: 500 }}>
                <CardHeader align="center" title="Edit User" />
                <CardContent align="center">
                  <Box>
                    <div>
                      <DatePicker
                        multiple
                        onlyShowInRangeDates
                        value={calendar.dates} 
                        onChange={ (dates) => {
                          const dateList = dates.map(date => date.toString())
                          setCalendar({
                            ...calendar,
                            dates: dateList
                          })
                        }}
                        format="YYYY-MM-DD"
                        mapDays={({ date, currentMonth }) => {
                          let isCurrentMonth = getMonthNumberFromName(schedule.month) === currentMonth.index
                          if (!isCurrentMonth) return {
                            disabled: true,
                            style: { color: "#ccc" },
                          }

                          let isWeekend = [0, 6].includes(date.weekDay.index)
                          if (isWeekend) return {
                            disabled: true,
                            style: { color: "#ccc" },
                          }

                          let isOutOfficeDay = outOfficeDayList.includes(date.toString())
                          if (isOutOfficeDay) return {
                            disabled: true,
                            style: { color: "#ccc" },
                          }
                        }}
                      />

                    </div>
                  </Box>

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
      </ThemeProvider>
    );
  }
}
export default SchedulePage;