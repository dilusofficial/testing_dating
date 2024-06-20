import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import image from '../../assets/dating3.jpg';
import style from './landing.module.css';
import UserLogin from '../userlogin/userlogin';


const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleLoginClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

const  handleCreateAccount=()=>{

    setShowModal(true);
}


  return (
    <>
      <div>
        <img src={image} style={{ width: '1480px', height: '600px' }} alt="Dating" />
        <b className={style.qoute}>Start Something Epic.</b>
        <button className={style.login_button} onClick={handleLoginClick}>Login</button>

        <button className={style.create_account_button} onClick={handleCreateAccount}><b className={style.createaccount}>Create account </b></button>
      </div>

      

      <Modal show={showModal} onHide={handleCloseModal} >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserLogin />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LandingPage;
