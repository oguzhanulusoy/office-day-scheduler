import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import OutOfOfficeDayService from 'services/out-of-office-day/OutOfOfficeDayService'; 
import { Button } from '@mui/material';
import ScheduleService from 'services/schedule/ScheduleService';
import ServiceCaller from 'services/ServiceCaller';
import CalendarService from 'services/calendar/CalendarService';
import JWTUtil from 'utils/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

class MyCalendarPageHelper {
  constructor() {
    this.serviceCaller = new ServiceCaller();
    this.currentTime = new Date();
    this.month = this.currentTime.getMonth() + 1
    this.day = this.currentTime.getDate()
    this.year = this.currentTime.getFullYear()

    this.vacation = 0;
  }

  refreshPage() {
    window.location.reload(false);
  }

  initSetterFunctions({ navigate, setSelectedDaysList, setWfhList, 
    setOfficeList, setFullMonthDates, setDates, 
    setOutOfOfficeDayList, setIsLoaded, setError }) {

    this.navigate = navigate;
    this.setSelectedDaysList = setSelectedDaysList;
    this.setWfhList = setWfhList;
    this.setOfficeList = setOfficeList;
    this.setFullMonthDates = setFullMonthDates;
    this.setDates = setDates;
    this.setOutOfOfficeDayList = setOutOfOfficeDayList;
    this.setIsLoaded = setIsLoaded;
    this.setError = setError;
  }

  initParameters(parameters) {
    this.selectedDaysList = parameters.selectedDaysList;
    this.wfhList = parameters.wfhList;
    this.officeList = parameters.officeList;
    this.fullMonthDates = parameters.fullMonthDates;
    this.dates = parameters.dates;
    this.outOfOfficeDayList = parameters.outOfOfficeDayList;
    this.isLoaded = parameters.isLoaded;
    this.error = parameters.error;
  }

  effectHelper() {
    JWTUtil.validateStorage(this.serviceCaller)
    .then((res) => {
      if (!res) {
        this.navigate('/', { replace: true });
        return
      }

      this.getOutOfOfficeDayData();
      this.setFullMonthDates(this.getDaysInMonth(this.month, this.year));
      this.fullMonthDates = this.getDaysInMonth(this.month, this.year);
      

      setTimeout(() => {
        this.getActiveCalendar();
      }, 100)
    })
    .catch((error) => {
      console.log(error)
      this.setError(error);
      this.setIsLoaded(true);
    })
  }
  
  init(res) {
    let days = [];
    let officeDays = [];
    for (let i = 0; i < res.length; i++) {
      days.push(
        {
          id: res[i].id,
          title: res[i].displayName,
          date: res[i].date,
          color:'#4BB492'
        }
      );
      officeDays.push(res[i].date);
    }

    this.dates = days;
    this.setDates(days);
    this.setOutOfOfficeDayList(officeDays);
  }

  getActiveSchedule() {
    ScheduleService.getActiveSchedule(this.serviceCaller, {
      userId: parseInt(sessionStorage.getItem('userId')),
      dateMonth: this.getMonthName(this.month),
      dateYear: this.year.toString()
    })
    .then((res) => {
      if (res.status === 401) {
        toast.error("You are not authorized to access this page", { autoClose: 1000 });
        this.navigate('/', { replace: true });
        return
      }

      if (res.status === 404) {
        toast.error("You have not created a schedule yet", { autoClose: 1000 });
        return
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }

  getActiveCalendar() {
    CalendarService.getActiveCalendar(this.serviceCaller, {
      userId: parseInt(sessionStorage.getItem('userId')),
      dateMonth: this.getMonthName(this.month),
      dateYear: this.year.toString()
    })
    .then((res) => {
      if (res.status === 401) {
        toast.error("You are not authorized to access this page", { autoClose: 1000 });
        this.navigate('/', { replace: true });
        return
      }

      if (res.status === 404) {
        toast.error("You have not created a calendar yet", { autoClose: 1000 });
        return
      }

      if (res.status === 200) {
        if (res.data.days != null) {
          const days = res.data.days.split(',');
          this.fillCalendar(days);
        }
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }

  fillCalendar(officeDayList) {
    for (let day of officeDayList) {
      this.dates.push({
        title: 'Office',
        date: day,
        color: '#50AEE0'
      })
    }

    this.setDates(this.dates);
    this.setOfficeList(officeDayList);
    this.handleAllDay("WFH")
  }

  getOutOfOfficeDayData() {
    OutOfOfficeDayService.getOutOfOfficeDays(this.serviceCaller, '')
    .then((res) => {
      if (res.status === 200) {
        this.init(res.data);
        this.setIsLoaded(true);
      } else {
        toast.error("Error occurred while fetching data", { autoClose: 1000 });
      }
    })
    .catch((error) => {
      toast.error("Error occurred while fetching data", { autoClose: 1000 });
      this.setError(error);
      this.setIsLoaded(true);
      console.log(error)
    })
  }

  getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', { month: 'long' });  
  }

  isDateValid(date) {  
    if(this.outOfOfficeDayList.includes(date)){
      toast.warning("Day cannot be selected", { autoClose: 1000 });
      return false;
    }
    return true;
  }

  isDateSelected(date) {
    if(this.selectedDaysList.includes(date)){
      toast.warning("Day has already selected", { autoClose: 1000 });
      return true;
    } else if (this.wfhList.includes(date)) {
      toast.warning("Day has already selected as WFH", { autoClose: 1000 });
      return true;
    } else if (this.officeList.includes(date)) {
      toast.warning("Day has already selected as Office", { autoClose: 1000 });
      return true;
    }

    return false;
  } 

  addedAsEventBefore(date) {
    for (let item of this.dates) {
      if (item.date === date && item.title !== 'Pending') {
        return true;
      }
    }

    return false;
  }

  handlePendingDate(date) {
    if (this.addedAsEventBefore(date)) {
      return;
    }

    this.setDates([...this.dates, {
      title: 'Pending',
      date: date,
      color:'#A593B4'
    }]);
  }

  handleDateClick(arg) { 
    if(this.isDateValid(arg.dateStr) && !this.isDateSelected(arg.dateStr) && this.fullMonthDates.includes(arg.dateStr)){
      this.selectedDaysList.push(arg.dateStr);
      this.handlePendingDate(arg.dateStr);
    }
  }

  deleteOODEvent(eventId) {
    OutOfOfficeDayService.deleteOutOfOfficeDay(this.serviceCaller, {ids: [eventId]})
    .then((res) => {
      if (res.status === 200) {
        this.getOutOfOfficeDayData();

        setTimeout(() => {
          this.getActiveCalendar();
        }, 100)

        toast.success("Event deleted successfully", { autoClose: 1000 });
        return true
      } else if (res.status === 403) {
        toast.error("You don't have permission for delete event", { autoClose: 1000 });
        return false
      } else {
        toast.error("Error occured while deleting", { autoClose: 1000 });
        return false
      }
    })
    .catch((error) => {
      toast.error("Error occured while deleting", { autoClose: 1000 });
      this.setError(error);
      this.setIsLoaded(true);
      console.log(error)
    })
  }

  handleEventClick(clickInfo) {
    const date = new Date(String((clickInfo.event.start)).slice(0,15))
    var dateNew = new Date(String((clickInfo.event.start)))
    dateNew.setDate(dateNew.getDate() + 1);
    const resultDate = dateNew.toISOString().split('T')[0];
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      if (clickInfo.event.id === "") {
        if (clickInfo.event.title === 'Pending') {
          this.setSelectedDaysList(this.selectedDaysList.filter(item => item !== resultDate));
        } else if (clickInfo.event.title === 'WFH') {
          this.setWfhList(this.wfhList.filter(item => item !== resultDate));
        } else if (clickInfo.event.title === 'Office') {
          this.setOfficeList(this.officeList.filter(item => item !== resultDate));
        }

        this.setDates(this.dates.filter(item => item.date !== resultDate));

      } else {
        if (!this.deleteOODEvent(clickInfo.event.id)) return;
      }

      clickInfo.event.remove()
    } 
  }

  handleOfficeDay(){
    let days=[];

    for (let i = 0; i < this.selectedDaysList.length; i++) {
      if(!this.addedAsEventBefore(this.selectedDaysList[i])){
        days.push(
          {
            title: 'Office',
            date: this.selectedDaysList[i], 
            color:'#50AEE0'
          }
        );

        this.officeList.push(this.selectedDaysList[i]);
    }}

    this.dates = this.dates.filter(item => item.title != 'Pending')
    this.setDates([...this.dates, ...days]);
    this.setSelectedDaysList([]);
  }

  handleWFHDay() {
    let days=[];

    for (let i = 0; i < this.selectedDaysList.length; i++) {
      if(!this.addedAsEventBefore(this.selectedDaysList[i])){
        days.push(
          {
            title: 'WFH',
            date: this.selectedDaysList[i], 
            color:'#FE795C'
          }
        );

        this.wfhList.push(this.selectedDaysList[i]);
    }}

    this.dates = this.dates.filter(item => item.title != 'Pending')
    this.setDates([...this.dates, ...days]);
    this.setSelectedDaysList([]);
  }

  handleAllDay(option) {
    let days=[];

    for (let day of this.fullMonthDates) {
      if (!this.addedAsEventBefore(day)) {
        days.push(
          {
            title:  option === 'Office' ? 'Office' : 'WFH',
            date: day, 
            color: option === 'Office' ? '#50AEE0' : '#FE795C'
          }
        );

        option === 'Office' ? this.officeList.push(day) : this.wfhList.push(day);
      }
    }

    this.dates = this.dates.filter(item => item.title != 'Pending')
    this.setDates([...this.dates, ...days]);
    this.setSelectedDaysList([]);
  }

  handleClearAll() {
    this.setDates([]);
    this.setOfficeList([]);
    this.setWfhList([]);
    this.setSelectedDaysList([]);
    this.getOutOfOfficeDayData();
  }

  getDaysInMonth(month, year) {
    let monthValue=month
    month--; 
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      var tmpDate = new Date(date);            
      var weekDay = tmpDate.getDay();
      var day = tmpDate.getDate();
      if (weekDay%6) {
        if(monthValue<10){
          if(day<10){
            days.push(year + "-" + "0" + monthValue + "-" + "0" + day);
          }else{
            days.push(year + "-" + "0" + monthValue + "-" + day);
          }
        }
        else{
          if(day<10){
            days.push(year + "-" + monthValue + "-" + "0" + day);
          }else{
            days.push(year + "-" + monthValue + "-" + day);
          }
        }
      }

      date.setDate(date.getDate() + 1);

    }

    return days;
  }

  async saveSchedule() {
    const whfLength = this.fullMonthDates.length - (this.officeList.length + this.outOfOfficeDayList.length)
    const totalDay = this.fullMonthDates.length - (this.outOfOfficeDayList.length + this.vacation)

    return await ScheduleService.addSchedule(this.serviceCaller, {
      userId: sessionStorage.getItem("userId"),
      officeDay: this.officeList.length,
      workFromHome: whfLength === 0 ? null : whfLength,
      vacation: this.vacation,
      report: 100,
      totalDay: totalDay, // - out of office day count - vacation
      dateMonth: this.getMonthName(this.month),
      dateYear: this.year
    })
  }

  async saveCalendar() {
    return await CalendarService.addCalendar(this.serviceCaller, {
      userId: sessionStorage.getItem("userId"),
      dateMonth: this.getMonthName(this.month),
      dateYear: this.year,
      days: this.officeList.length === 0 ? null : this.officeList.toString()
    })
  }

  renderEventContent(eventInfo) {
    return (
      <div style={{ backgroundColor: eventInfo.event.customColor}}>
        <b>{eventInfo.timeText}</b>
        <i> {eventInfo.event.title}</i>
      </div>
    )
  }

  async save() {
    const saveScheduleResponse = await this.saveSchedule();
    const saveCalendarResponse = await this.saveCalendar();

    if (saveScheduleResponse.status === 200 && saveCalendarResponse.status === 200) {
      this.setIsLoaded(true)
      this.handleAllDay('WFH');
      toast.success("Successfully saved", { autoClose: 1000 });
      return
    }

    toast.error("Something went wrong...", { autoClose: 1000 });
  }

  render() {
    if (this.error) {
      return <div> Error !!!</div>;
    } else if (!this.isLoaded) {
      return <div> Loading... </div>;
    }

    return (
      <div className="card card-calendar" style={{width:1000, marginLeft:120}}>
        <Button variant="contained" onClick={()=> this.handleOfficeDay()} style={{margin:10, backgroundColor:"#9E9E9E"}}>Set as Office</Button>
        <Button variant="contained" onClick={()=> this.handleWFHDay()} style={{margin:10, backgroundColor:"#9E9E9E"}}>Set as WFH</Button>
        <Button variant="contained" onClick={()=> this.handleAllDay('Office')} style={{margin:10, backgroundColor:"#9E9E9E"}}>Set all as Office</Button>
        <Button variant="contained" onClick={()=> this.handleAllDay('WFH')} style={{margin:10, backgroundColor:"#9E9E9E"}}>Set all as WFH</Button>
        <Button variant="contained" onClick={()=> this.handleClearAll()} style={{margin:10, backgroundColor:"#9E9E9E"}}>Clear All</Button>
        <Button variant="contained" onClick={()=> {this.save()}} style={{marginLeft:260, backgroundColor:"#9E9E9E"}}>Save</Button>
        <div className="card-body p-3" style={{backgroundColor:"white", padding:25}}>
          <FullCalendar
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: ''
            }}
            eventContent={this.renderEventContent}
            allDayClassNames="calendar"
            dateClick={this.handleDateClick.bind(this)}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            weekends={false}
            events={this.dates}
            eventClick={this.handleEventClick.bind(this)}
            selectable={true}
            contentHeight={700}
          />
        </div>
      </div>
    );
  }
} 

function Calendar () {
  const navigate = useNavigate();
  const [selectedDaysList, setSelectedDaysList] = useState([])
  const [wfhList, setWfhList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [fullMonthDates, setFullMonthDates] = useState([])
  const [dates, setDates] = useState([]);
  const [outOfOfficeDayList, setOutOfOfficeDayList] = useState([]);

  const [isLoaded, setIsLoaded]= useState(false);
  const [error, setError] = useState(null);

  const MyCalendarHelper = new MyCalendarPageHelper();
  const setterFunctions = { 
    navigate, setSelectedDaysList, 
    setWfhList, setOfficeList, 
    setFullMonthDates, setDates, 
    setOutOfOfficeDayList,
    setIsLoaded, setError 
  }

  const parameters = { selectedDaysList, wfhList, 
    officeList, fullMonthDates, 
    dates, outOfOfficeDayList,
    isLoaded, error
  }

  MyCalendarHelper.initSetterFunctions(setterFunctions);
  MyCalendarHelper.initParameters(parameters);

  useEffect(() => {
    MyCalendarHelper.effectHelper()
  }, [])


  return MyCalendarHelper.render()
}
export default Calendar;