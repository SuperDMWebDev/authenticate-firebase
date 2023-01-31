import React, { useEffect, useState } from 'react';
import { auth, db, changeProfile } from '../../config/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import './style.css';
function Profile() {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/');
    }
    console.log('user ', user);
  }, [user, loading]);
  const submitProfile = () => {
    changeProfile(user, name);
    navigate('/dashboard');
  };
  return (
    <div className="profile">
      <div className="profile__container">
        <label className="profile__label">Change your name</label>
        <input
          className="profile__input"
          type="text"
          placeholder="Please type your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="profile__button" onClick={() => submitProfile()}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Profile;
