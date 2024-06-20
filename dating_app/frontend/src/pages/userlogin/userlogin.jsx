import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import styles from './userlogin.module.css';
import image from '../../assets/search.png';
import image2 from '../../assets/phone-call.png';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from './config';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


const UserLogin = () => {
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  const navigate = useNavigate();

  const handleClick_gmail = async () => {
    try {
      window.location.href = 'http://localhost:3000/api/auth/google', "_self";
      axios.get('http://localhost:3000/api/after-auth').then(response => {
        console.log(response.data);
      });

    } catch (error) {
      console.log(error);
    }
  };

  const handleClick_phone = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setShowVerificationInput(false);
    setTimer(60);
  };

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/phone/otp', {
        to: phoneNumber
      });
      console.log(response.data);
      setShowVerificationInput(true);
      startTimer();
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const startTimer = () => {
    let timeLeft = 60;
    const interval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1;
        setTimer(timeLeft);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };



const verification=async()=>{
try{
  const response=await axios.post("http://localhost:3000/api/auth/otp/verification",{

code:verificationCode
})
if (response.data.success) {
  navigate('/profile')
} else {
  console.log('Invalid username or password');
}

}
catch(error){

console.log(error)
}
  


}

  return (
    <>
      <h3 className={styles.app_name}>Dating App</h3>
      <h5 className={styles.create_account}>Create an account</h5>

      <div className={styles.login_form_main}>
        <Form className={styles.login_form}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Button variant="primary" className={styles.email_button} onClick={handleClick_gmail}>
              <img src={image} style={{ height: '20px', width: '20px', marginRight: '20px' }} /> Continue With Google
            </Button>
          </Form.Group>

          <Button variant="primary" className={styles.email_button} onClick={handleClick_phone}>
            <img src={image2} style={{ height: '20px', width: '20px', marginRight: '20px' }} /> Login With Phone Number
          </Button>
        </Form>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login with Phone Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSendVerificationCode}>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <PhoneInput
                country={'us'}
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Send Verification Code
            </Button>
          </Form>

          {showVerificationInput && (
            <>
              <Form.Group controlId="formVerificationCode" className="mt-3">
                <Form.Label>Verification Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e)=>{setVerificationCode(e.target.value)}}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3" onClick={verification}>
              Enter the Verification code
            </Button>

              <div className="mt-3">
                <span>Resend code in: {timer} seconds</span>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserLogin;
