import React, { useState, useEffect } from 'react'
import ProfileCard from '../../../ui-component/cards/ProfileCard';
import { useNavigate } from 'react-router-dom'; 
import UserService from 'services/user/UserService';
import OutOfOfficeDayService from 'services/out-of-office-day/OutOfOfficeDayService';
import ScheduleService from 'services/schedule/ScheduleService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from 'utils/jwtUtil';
import { toast } from 'react-toastify';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [outOfOfficeDayList, setOutOfOfficeDayList] = useState([]);
  const [userScheduleList, setUserScheduleList] = useState([]);

  const getMonthName = () => {
    const date = new Date();
    const month = date.toLocaleString('en-US', { month: 'long' });

    return month;
  }

  const getYear = () => {
    const date = new Date();
    return date.getFullYear().toString();
  }

  const getUser = () => {
    const serviceCaller = new ServiceCaller();
    const userId = sessionStorage.getItem('userId');
    UserService.getOneUser(serviceCaller, `/user/${userId}`, '')
    .then((res) => {
      if (res.status === 200) {
        setUser(res.data);
        return
      }

      if (res.status === 401) {
        toast.error("You are not authorized to access this page", { autoClose: 1000 });
        this.navigate('/', { replace: true });
        return
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const getUserScheduleList = () => {
    const serviceCaller = new ServiceCaller();
    ScheduleService.getActiveSchedule(serviceCaller, { 
      userId: parseInt(sessionStorage.getItem('userId')),
      dateMonth: getMonthName(),
      dateYear: getYear()
    })
    .then((res) => {
      if (res.status === 200) {
        setUserScheduleList(res.data);
        return
      }

      if (res.status === 401) {
        toast.error("You are not authorized to access this page", { autoClose: 1000 });
        this.navigate('/', { replace: true });
        return
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const getOutOfOfficeDayList = () => {
    const serviceCaller = new ServiceCaller();
    OutOfOfficeDayService.getOutOfOfficeDays(serviceCaller, '')
    .then((res) => {
      if (res.status === 200) {
        setOutOfOfficeDayList(res.data);
        return
      }

      if (res.status === 401) {
        toast.error("You are not authorized to access this page", { autoClose: 1000 });
        this.navigate('/', { replace: true });
        return
      }
    })
    .catch((err) => {
      console.log(err);
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

      getUser();
      getOutOfOfficeDayList();
      getUserScheduleList();
    })
    .catch((err) => {
      console.log(err);
    })
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <ProfileCard user={user} outOfOfficeDayList={outOfOfficeDayList} userScheduleList={userScheduleList}/>
      </div>
  )
}

export default Profile;
