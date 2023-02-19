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
import { useLayoutEffect } from 'react';

class MyCalendarPageHelper {
  constructor() {}

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

  getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', { month: 'long' });  
  }
}

function Calendar () {
  const currentTime = new Date();
  const month = currentTime.getMonth() + 1
  const day = currentTime.getDate()
  const year = currentTime.getFullYear()
  const vacation = 0;

  const Helper = new MyCalendarPageHelper();
  const navigate = useNavigate();
  const [selectedDaysList, setSelectedDaysList] = useState([])
  const [wfhList, setWfhList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  let [dates, setDates] = useState([]);
  let [outOfOfficeDayList, setOutOfOfficeDayList] = useState([]);
  const [fullMonthDates, setFullMonthDates] = useState(Helper.getDaysInMonth(month, year));
  const [isLoaded, setIsLoaded]= useState(false);
  const [error, setError] = useState(null);

  const isDateValid = (date) => {  
    if(outOfOfficeDayList.includes(date)){
      toast.warning("Day cannot be selected", { autoClose: 1000 });
      return false;
    }
    return true;
  }

  const handleClearAll = () => {
    setDates([]);
    setOfficeList([]);
    setWfhList([]);
    setSelectedDaysList([]);
    getOutOfOfficeDayData();
  }

  const addedAsEventBefore = (date) => {
    for (let item of dates) {
      if (item.date === date && item.title !== 'Pending') {
        return true;
      }
    }

    return false;
  }

  const isDateSelected = (date) => {
    if(selectedDaysList.includes(date)){
      toast.warning("Day has already selected", { autoClose: 1000 });
      return true;
    } else if (wfhList.includes(date)) {
      toast.warning("Day has already selected as WFH", { autoClose: 1000 });
      return true;
    } else if (officeList.includes(date)) {
      toast.warning("Day has already selected as Office", { autoClose: 1000 });
      return true;
    }

    return false;
  } 

  const fillCalendar = (officeDayList) => {
    for (let day of officeDayList) {
      dates.push({
        title: 'Office',
        date: day,
        color: '#50AEE0'
      })

      officeList.push(day)
    }
    
    setDates(dates);
    setOfficeList(officeList);

    handleAllDay("WFH")
  }

  const handlePendingDate = (date) => {
    if (addedAsEventBefore(date)) {
      return;
    }

    setDates([...dates, {
      title: 'Pending',
      date: date,
      color:'#A593B4'
    }]);
  }

  const getActiveCalendar = async () => {
    const serviceCaller = new ServiceCaller();
    try {
      const result = await CalendarService.getActiveCalendar(serviceCaller, {
        userId: parseInt(sessionStorage.getItem('userId')),
        dateMonth: Helper.getMonthName(month),
        dateYear: year.toString()
      })
  
      if (result.status === 401) {
        toast.error("You are not authorized to access this page", { autoClose: 1000 });
        navigate('/', { replace: true });
        return
      }
  
      if (result.status === 404) {
        toast.error("You have not created a calendar yet", { autoClose: 1000 });
        return
      }
  
      if (result.status === 200) {
        if (result.data.days != null) {
          const days = result.data.days.split(',');
          fillCalendar(days);
        }
        setIsLoaded(true)
      }
    } catch (error) {
      setIsLoaded(true)
    }
    
  }

  const getOutOfOfficeDayData = async () => {
    const serviceCaller = new ServiceCaller();
    const result = await OutOfOfficeDayService.getOutOfOfficeDays(serviceCaller, '')

    if (result.status === 200) {
      init(result.data)
    } else {
      toast.error("Error occurred while fetching data", { autoClose: 1000 });
    }
  }

  const init = (res) => {
    let newDates = [];
    let newOutOfOfficeDayList = [];
    for (let i = 0; i < res.length; i++) {
      newDates.push({
        id: res[i].id,
        title: res[i].displayName,
        date: res[i].date,
        color:'#4BB492'
      })

      newOutOfOfficeDayList.push(res[i].date);
    }

    dates = newDates;
    outOfOfficeDayList = newOutOfOfficeDayList;
    setDates(dates);
    setOutOfOfficeDayList(outOfOfficeDayList);
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

    setDates([...dates.filter(item => item.title != 'Pending'), ...days]);
    setSelectedDaysList([]);
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

    setDates([...dates.filter(item => item.title != 'Pending'), ...days]);
    setSelectedDaysList([]);
  }

  const handleAllDay = (option) => {
    let days=[];

    for (let day of fullMonthDates) {
      if (!addedAsEventBefore(day)) {
        days.push(
          {
            title:  option === 'Office' ? 'Office' : 'WFH',
            date: day, 
            color: option === 'Office' ? '#50AEE0' : '#FE795C'
          }
        );

        option === 'Office' ? officeList.push(day) : wfhList.push(day);
      }
    }

    setDates([...dates.filter(item => item.title != 'Pending'), ...days]);
    setSelectedDaysList([]);
  }

  const deleteOODEvent = (eventId) => {
    const serviceCaller = new ServiceCaller();
    OutOfOfficeDayService.deleteOutOfOfficeDay(serviceCaller, {ids: [eventId]})
    .then(async (res) => {
      if (res.status === 200) {
        await getOutOfOfficeDayData();

        setTimeout(() => {
          getActiveCalendar();
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
      setError(error);
      setIsLoaded(true);
      console.log(error)
    })
  }

  const handleEventClick = (clickInfo) => {
    const date = new Date(String((clickInfo.event.start)).slice(0,15))
    var dateNew = new Date(String((clickInfo.event.start)))
    dateNew.setDate(dateNew.getDate() + 1);
    const resultDate = dateNew.toISOString().split('T')[0];
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      if (clickInfo.event.id === "") {
        if (clickInfo.event.title === 'Pending') {
          setSelectedDaysList(selectedDaysList.filter(item => item !== resultDate));
        } else if (clickInfo.event.title === 'WFH') {
          setWfhList(wfhList.filter(item => item !== resultDate));
        } else if (clickInfo.event.title === 'Office') {
          setOfficeList(officeList.filter(item => item !== resultDate));
        }

        setDates(dates.filter(item => item.date !== resultDate));

      } else {
        if (!deleteOODEvent(clickInfo.event.id)) return;
      }

      clickInfo.event.remove()
    }
  }

  const handleDateClick = (arg) => { 
    if(isDateValid(arg.dateStr) && !isDateSelected(arg.dateStr) && fullMonthDates.includes(arg.dateStr)){
      selectedDaysList.push(arg.dateStr);
      handlePendingDate(arg.dateStr);
    }
  }

  const renderEventContent = (eventInfo) => {
    return (
      <div style={{ backgroundColor: eventInfo.event.customColor}}>
        <b>{eventInfo.timeText}</b>
        <i> {eventInfo.event.title}</i>
      </div>
    )
  }

  const saveSchedule = async () => {
    const serviceCaller = new ServiceCaller();

    const whfLength = fullMonthDates.length - (officeList.length + outOfOfficeDayList.length)
    const totalDay = fullMonthDates.length - (outOfOfficeDayList.length + vacation)

    return await ScheduleService.addSchedule(serviceCaller, {
      userId: sessionStorage.getItem("userId"),
      officeDay: officeList.length,
      workFromHome: whfLength === 0 ? null : whfLength,
      vacation: vacation,
      report: 100,
      totalDay: totalDay, // - out of office day count - vacation
      dateMonth: Helper.getMonthName(month),
      dateYear: year
    })
  }

  const saveCalendar = async () => {
    const serviceCaller = new ServiceCaller();
    return await CalendarService.addCalendar(serviceCaller, {
      userId: sessionStorage.getItem("userId"),
      dateMonth: Helper.getMonthName(month),
      dateYear: year,
      days: officeList.length === 0 ? null : officeList.toString()
    })
  }

  const save = () => {
    new Promise(async () => {
      const saveScheduleResponse = await saveSchedule();
      const saveCalendarResponse = await saveCalendar();

      if (saveScheduleResponse.status === 200 && saveCalendarResponse.status === 200) {
        setIsLoaded(true)
        handleAllDay('WFH');
        toast.success("Successfully saved", { autoClose: 1000 });
        return
      }

      toast.error("Something went wrong...", { autoClose: 1000 });
    })
  }


  useEffect(() => {
    const serviceCaller = new ServiceCaller();
    
    JWTUtil.validateStorage(serviceCaller)
    .then(async (res) => {
      if (!res) {
        navigate('/', { replace: true });
        return
      }


      await getOutOfOfficeDayData();
      await getActiveCalendar();
    })
    .catch((error) => {
      console.log(error)
      setError(error);
      setIsLoaded(true);
    })
  }, [])

  if (error) {
    return <div> Error !!!</div>;
  } else if (!isLoaded) {
    return <div> Loading... </div>;
  }

  return (
    <div className="card card-calendar" style={{width:1000, marginLeft:120}}>
      <Button variant="contained" onClick={()=> handleOfficeDay()} style={{margin:10, backgroundColor:"#9E9E9E"}}>Set as Office</Button>
      <Button variant="contained" onClick={()=> handleWFHDay()} style={{margin:10, backgroundColor:"#9E9E9E"}}>Set as WFH</Button>
      <Button variant="contained" onClick={()=> handleAllDay('Office')} style={{margin:10, backgroundColor:"#9E9E9E"}}>Set all as Office</Button>
      <Button variant="contained" onClick={()=> handleAllDay('WFH')} style={{margin:10, backgroundColor:"#9E9E9E"}}>Set all as WFH</Button>
      <Button variant="contained" onClick={()=> handleClearAll()} style={{margin:10, backgroundColor:"#9E9E9E"}}>Clear All</Button>
      <Button variant="contained" onClick={()=> save()} style={{marginLeft:260, backgroundColor:"#9E9E9E"}}>Save</Button>
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