import React, { useState, useEffect } from 'react'
import ProfileCard from '../../../ui-component/cards/ProfileCard';
import { useNavigate } from 'react-router-dom'; 
import UserService from 'services/user/UserService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from 'utils/jwtUtil';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const getUser = () => {
    const serviceCaller = new ServiceCaller();
    const userId = sessionStorage.getItem('userId');
    UserService.getOneUser(serviceCaller, `/user/${userId}`, '')
    .then((res) => {
      setUser(res);
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
    })
    .catch((err) => {
      console.log(err);
    })
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <ProfileCard user={user} />
      </div>
  )
}

export default Profile;
