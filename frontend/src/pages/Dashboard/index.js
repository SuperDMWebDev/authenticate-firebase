import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { auth, db } from '../../config/firebase-config';
import { signOut } from 'firebase/auth';
import axios from 'axios';
function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [timer, setTimer] = useState(1);
  const navigate = useNavigate();
  const [authorize, setAuthorized] = useState(false);
  const token = sessionStorage.getItem('accessToken');

  const fetchData = async () => {
    const result = await user.getIdToken();
    const response = await axios.get('http://localhost:5000', {
      headers: {
        Authorization: `Bearer ${result}`,
      },
    });
    if (response.status === 200) {
      setAuthorized(true);
    }
  };
  useEffect(() => {
    console.log('dashboard user ', user);
    if (loading) {
      return;
    }
    if (!user) navigate('/');
    fetchData(token);
  }, [user, loading]);

  // useEffect(() => {
  //   const countTime = setInterval(() => {
  //     setTimer((timer) => timer + 1);
  //   }, [1000]);
  //   return () => {
  //     clearInterval(countTime);
  //   };
  // });
  const changeProfile = () => {
    navigate('/profile');
  };
  const logout = () => {
    console.log('logout ');
    signOut(auth);
    sessionStorage.clear();
    navigate('/');
  };
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as
        <div>{user?.displayName}</div>
        <div>{user?.email}</div>
        <div>{authorize ? 'Authorized person' : 'Unauthorized person'}</div>
        <button className="dashboard__btn" onClick={changeProfile}>
          Change profile
        </button>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
export default Dashboard;
