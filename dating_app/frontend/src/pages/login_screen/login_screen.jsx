import React, { useEffect, useState } from 'react';
import { Button, Form, Col, Container, Row } from 'react-bootstrap';
import style from './loginscreen.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import {auth,provider} from "./config";
import {getAuth, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup} from "firebase/auth";





const LoginScreen = () => {

const [user,setUser]=useState(null)
const [usersotp,setUserotp]=useState('')

  const sendOtp=async()=>{

    try{
      const recaptcha=new RecaptchaVerifier(auth,"recaptcha",{})
      const confirmation=await signInWithPhoneNumber(auth,phone,recaptcha)
    setUser(confirmation)
    }
    catch(err){
    console.error(err)
    }
    }


const confirmOtp=()=>{

otp=user.confirm(usersotp)

console.log(otp)
if(otp){
  navigate('/dashboard')

}

}

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username,setusername]=useState()
  const [password,setpassword]=useState()

const[phone,setPhone]=useState()


  const navigate = useNavigate();
  const [value,setValue] = useState('')

  console.log(localStorage)
  const handleClick =()=>{
      signInWithPopup(auth,provider).then((data)=>{
          setValue(data.user.email)
        {/*localStorage.setItem("email",data.user.email)
        */}
        navigate('/dashboard')
        
      })
  }

{/*  useEffect(()=>{
    const email = localStorage.getItem('email');
    if (email) {
      setValue(email);
      navigate('/dashboard'); 
    }
  },[navigate])

*/} 





  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const logincall = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password,
      });
      if (response.data.success) {
        navigate('/dashboard')
      } else {
        console.log('Invalid username or password');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <div
      className={`d-flex justify-content-center align-items-center ${style.signup_bg}`}
    >
      <Container className={`${style.signup_container}`}>
        <Row className="p-3 h-100 bg-white rounded-4 d-flex justify-content-center align-items-center shadow-sm">
          <Col lg={6} className="px-4">
            <center>
              <h5 className={`${style.signupheading}`}>Admin Login</h5>
            </center>
            <div className="form-group py-1">
              <label>User Name</label>
              <input
                type="text"
                name="name"
                className={`form-control py-2 ${style.input_field}`}
                placeholder="Enter your name"
                onChange={(e)=>{ setusername(e.target.value)}}
              />
            </div>
          
            <div className="form-group py-1">
              <label>Password</label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                className={`form-control py-2  ${style.input_field}`}
                placeholder="Enter your password"
                onChange={(e)=>{setpassword(e.target.value)}}
              />
            </div>
            <div className="form-check py-1 mt-1">
              <input
                className="form-check-input"
                type="checkbox"
                onClick={togglePasswordVisibility}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Show Password
              </label>
            </div>
            <Button variant="primary" className="w-100 mb-1 mt-2" onClick={logincall}>
              Login In
            </Button>
            
          </Col>
       
        </Row>
      </Container>
    </div>


    <div>
       
        <button onClick={handleClick}>Signin With Google</button>
       
    </div>

    <PhoneInput
  country={'us'}
value={phone}
onChange={()=>{setPhone(phone)}}
/>

<Button onClick={sendOtp} >send otp</Button>

<div id='recaptcha'></div>

<input type='text' onChange={(e)=>{setUserotp(e.target.value)}}/> <br/>

<Button onClick={confirmOtp} >confirm  otp</Button>


    </>
  );
};

export default LoginScreen;
