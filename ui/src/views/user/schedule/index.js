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

function Calendar () {
  const navigate = useNavigate();
  let vacation = 2;
  const [selectedDaysList, setSelectedDaysList] = useState([])
  const [wfhList, setWfhList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [fullMonthDates, setFullMonthDates] = useState([])
  const [dates, setDates] = useState([]);
  const [outOfOfficeDayList, setOutOfOfficeDayList] = useState([]);
  var currentTime = new Date()
  var month = currentTime.getMonth() + 1
  var day = currentTime.getDate()
  var year = currentTime.getFullYear()

  const saveSchedule = () => {
    let serviceCaller = new ServiceCaller();
    ScheduleService.addSchedule(serviceCaller, {
      userId: sessionStorage.getItem("userId"),
      officeDay: officeList.length,
      workFromHome: wfhList.length,
      vacation: vacation,
      report: 100,
      totalDay: fullMonthDates.length, // - out of office day count - vacation
      dateMonth: getMonthName(month),
      dateYear: year
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error)
    })
  }  

  const saveCalendar = () => {
    let serviceCaller = new ServiceCaller();
    CalendarService.addCalendar(serviceCaller, {
      userId: sessionStorage.getItem("userId"),
      dateMonth: getMonthName(month),
      dateYear: year,
      days: officeList.length === 0 ? null : officeList.toString()
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error)
    })
  }
  

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', { month: 'long' });
  }

  const getDaysInMonth = (month, year) => {
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
// isDateValid: created to check whether the selected date is one of the "out of office days" or not
  const isDateValid = (date) => {  
    if(outOfOfficeDayList.includes(date)){
      toast.warning("Day cannot be selected", { autoClose: 1000 });
      return false;
    }
    return true;
  }

  const isDateSelected = (date) => {
    if(selectedDaysList.includes(date)){
      toast.warning("Day has already selected", { autoClose: 1000 });
      return true;
    } 
    return false;
  } 

  const addedAsEventBefore = (date) => {
    for(let i=0;i<dates.length;i++){
      if(date===dates[i].date){
        return true;
      }
    }
    return false;
  }
  const getOutOfOfficeDayData = () => {
    let serviceCaller = new ServiceCaller();
    OutOfOfficeDayService.getOutOfOfficeDays(serviceCaller, '')
    .then((res) => {
      console.log(res)
      init(res);
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const handleDateClick = (arg) => { 
      if(isDateValid(arg.dateStr) && !isDateSelected(arg.dateStr) && fullMonthDates.includes(arg.dateStr)){
        selectedDaysList.push(arg.dateStr)}
    console.log("Selected Items: ", selectedDaysList);
  }

  const handleEventClick = (clickInfo) => {
    const date = new Date(String((clickInfo.event.start)).slice(0,15))
    var dateNew = new Date(String((clickInfo.event.start)))
    dateNew.setDate(dateNew.getDate() + 1);
    var resultDate = dateNew.toISOString().split('T')[0];
    console.log(resultDate);
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) { 
      clickInfo.event.remove() //just removes from calendar, not from the array
    } 
  }

  useEffect(() => {
    const serviceCaller = new ServiceCaller();
    JWTUtil.validateStorage(serviceCaller)
    .then((res) => {
      if (!res) {
        navigate('/', { replace: true });
        return
      }
      getOutOfOfficeDayData();
      setFullMonthDates(getDaysInMonth(month, year));
    })
    .catch((error) => {
      console.log(error)
    })
  }, [])

  const init = (res) => {
    let days = [];
    let officeDays = [];
      for (let i = 0; i < res.length; i++) {
        days.push(
              {
                  title: res[i].displayName,
                  date: res[i].date,
                  color:'#4BB492'
              }
          );
        officeDays.push(res[i].date);
      }
      setDates(days);
      setOutOfOfficeDayList(officeDays);
  }
  const handleOfficeDay = () => {
    let days=[];
    for (let i = 0; i < selectedDaysList.length; i++) {
      if(!addedAsEventBefore(selectedDaysList[i])){
      days.push(
            {
                title: 'Office',
                date: selectedDaysList[i], 
                color:'#50AEE0'
            }
        );
        officeList.push(selectedDaysList[i]);
    }}
    setDates([...dates, ...days]);
    console.log("Office: ", officeList);
  }

  const handleWFHDay = () => {
    let days=[];
    for (let i = 0; i < selectedDaysList.length; i++) {
      if(!addedAsEventBefore(selectedDaysList[i])){
      days.push(
            {
                title: 'WFH',
                date: selectedDaysList[i], 
                color:'#FE795C'
            }
        );
        wfhList.push(selectedDaysList[i]);
    }}
    setDates([...dates, ...days]);
    console.log("WFH: ", wfhList)
  }
  
  const handleAllDay = (option) => {
    let days=[];
    for (let i = 0; i < fullMonthDates.length; i++) {
      if(!addedAsEventBefore(fullMonthDates[i])){
      days.push(
          {
            title:  option === 'Office' ? 'Office' : 'WFH',
            date: fullMonthDates[i], 
            color: option === 'Office' ? '#50AEE0' : '#FE795C'
          }
        );
        option === 'Office' ? officeList.push(fullMonthDates[i]) : wfhList.push(fullMonthDates[i]);
    }}
    setDates([...dates, ...days]);
  }
  function renderEventContent(eventInfo) {
    return (
        <div style={{ backgroundColor: eventInfo.event.customColor}}>
            <b>{eventInfo.timeText}</b>
            <i> {eventInfo.event.title}</i>
        </div>
    )
  } 
    return (
        <div className="card card-calendar" style={{width:1000, marginLeft:120}}>
          <Button variant="contained" onClick={()=> handleOfficeDay()} style={{margin:10, backgroundColor:"#9E9E9E"}}>Set as Office</Button>
          <Button variant="contained" onClick={()=> handleWFHDay()} style={{margin:10, backgroundColor:"#9E9E9E"}}>Set as WFH</Button>
          <Button variant="contained" onClick={()=> handleAllDay('Office')} style={{margin:10, backgroundColor:"#9E9E9E"}}>Set all as Office</Button>
          <Button variant="contained" onClick={()=> handleAllDay('WFH')} style={{margin:10, backgroundColor:"#9E9E9E"}}>Set all as WFH</Button>
          <Button variant="contained" onClick={()=> {saveSchedule(); saveCalendar();}} style={{marginLeft:370, backgroundColor:"#9E9E9E"}}>Save</Button>
            <div className="card-body p-3" style={{backgroundColor:"white", padding:25}}>
                <FullCalendar
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: ''
                    }}
                    eventContent={renderEventContent}
                    allDayClassNames="calendar"
                    dateClick={handleDateClick}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    weekends={false}
                    events={dates}
                    eventClick={handleEventClick}
                    selectable={true}
                    contentHeight={700}
                />
            </div>
        </div>
    );
}
export default Calendar;