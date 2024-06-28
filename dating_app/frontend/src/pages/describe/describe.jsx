import React, { useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import style from './describe.module.css';
import ImageUploadGrid from '../image_upload/image_upload';
export const Context1 = React.createContext();
import axios from 'axios';

const Descripition = () => {
  const [location, setLocation] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState('');
  const [images, setImages] = useState(Array(6).fill(null));
  const [firstname, setFirstname] = useState('');

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleYearChange = (e) => setYear(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleDayChange = (e) => setDay(e.target.value);
  const handleGenderSelect = (gender) => setSelectedGender(gender);
  const handleInterestChange = (e) => setInterestInput(e.target.value);
  const addInterest = () => {
    if (interestInput && interests.length < 5) {
      setInterests([...interests, interestInput]);
      setInterestInput('');
    }
  };

  const profile_details = async () => {
    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('location', location);
    formData.append('day', day);
    formData.append('month', month);
    formData.append('year', year);
    formData.append('gender', selectedGender);
    formData.append('interests', interests.join(','));

    images.forEach((image, index) => {
      if (image) {
        formData.append('files', image); // Use 'files' as the field name
      }
    });

    try {
      const response = await axios.post('http://localhost:3000/api/personal/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data); 
    } catch (error) {
      console.error('Error uploading profile:', error);
    }
  };

  const logout_user = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/logout');
      if (response.data.success) {
        localStorage.clear();
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className={`d-flex justify-content-center align-items-center ${style.signup_bg}`}>
      <Container className={`${style.signup_container}`}>
        <Row className="p-3 h-100 bg-white rounded-4 d-flex justify-content-center align-items-center shadow-sm">
          <Col lg={6} className="px-4">
            <center>
              <h5 className={`${style.signupheading}`}>Describe you</h5>
            </center>
            <div className="form-group py-1">
              <label> Name</label>
              <input
                type="text"
                name="name"
                className={`form-control py-2 ${style.input_field}`}
                placeholder="Enter your name"
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>

            <div className="form-group py-1">
              <label>Birth Day</label>
              <div className="d-flex">
                <input
                  type="text"
                  name="year"
                  className={`form-control py-2 ${style.input_field} ${style.date_input}`}
                  placeholder="Year"
                  value={year}
                  onChange={handleYearChange}
                />
                <input
                  type="text"
                  name="month"
                  className={`form-control py-2 ${style.input_field} ${style.date_input}`}
                  placeholder="Month"
                  value={month}
                  onChange={handleMonthChange}
                />
                <input
                  type="text"
                  name="day"
                  className={`form-control py-2 ${style.input_field} ${style.date_input}`}
                  placeholder="Day"
                  value={day}
                  onChange={handleDayChange}
                />
              </div>
            </div>
            <div className="form-group py-1">
              <label> Location </label>
              <input
                type="text"
                name="name"
                className={`form-control py-2 ${style.input_field}`}
                placeholder="Enter your location"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="form-group py-1">
              <label>Gender</label>
              <div className={style.genderButtons}>
                {['Men', 'Women', 'More'].map((gender) => (
                  <Button
                    key={gender}
                    variant={selectedGender === gender ? 'primary' : 'outline-primary'}
                    className={style.genderButton}
                    onClick={() => handleGenderSelect(gender)}
                  >
                    {gender}
                  </Button>
                ))}
              </div>
            </div>
            <div className="form-check py-1 mt-1">
              <input
                className="form-check-input"
                type="checkbox"
                onClick={togglePasswordVisibility}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Show gender in profile
              </label>
            </div>
            <div className="form-group py-1">
              <label>Interests</label>
              <div className="d-flex">
                <input
                  type="text"
                  value={interestInput}
                  onChange={handleInterestChange}
                  className={`form-control py-2 ${style.input_field}`}
                  placeholder="Add an interest"
                />
                <Button onClick={addInterest} className="ms-2">
                  Add
                </Button>
              </div>
              <div className="mt-2">
                {interests.map((interest, index) => (
                  <span key={index} className={`badge bg-secondary me-2 ${style.interestBadge}`}>
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <Button className={`ms-2 ${style.continue_btn}`} onClick={profile_details}>
              Continue
            </Button>
            <Button className={`ms-2`} onClick={logout_user}>
              Log out
            </Button>
          </Col>
          <Col lg={6} className="px-4">
            <Context1.Provider value={[images, setImages]}>
              <ImageUploadGrid />
            </Context1.Provider>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Descripition;
