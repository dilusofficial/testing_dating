import React, { useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import style from './image_upload.module.css';
import icon from '../../assets/plus.png'
import { Context1 } from '../describe/describe';


const ImageUploadGrid = () => {
  const [images, setImages] = useContext(Context1);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (upload) => {
        const newImages = [...images];
        newImages[index] = upload.target.result;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container className={style.imageUploadGrid}>
      <Row>
        {images.map((image, index) => (
          <Col key={index} xs={12} md={4} className="mb-4">
            <div className={style.uploadBox}>
              {image ? (
                <img src={image} alt={`upload-${index}`} className={style.uploadedImage} />
              ) : (
                <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, index)}
                  className={style.fileInput}
                />
                <img src={icon} alt="plus icon" className={style.plusIcon}/>
                </>
              )}
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ImageUploadGrid;
