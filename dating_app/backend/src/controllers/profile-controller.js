const User = require('../models/profile');

const profile = async (req, res) => {
    try {
       const { firstname, location, day, month, year, gender, interests } = req.body; 
        const files = req.files;

   // console.log('Received data:', firstname, location, day, month, year, gender, interests);
        console.log('Received files:', files);

        const imageBuffers = files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype,
            filename: file.originalname
        }));

    const newUser = new User({
            firstname,
            location,
            day,
            month,
            year,
            gender,
            interests: interests.split(','),
            images: imageBuffers
        });
 




        await newUser.save();

        res.status(201).json(newUser);
    } catch (err) {
        console.error('Error in profile controller:', err);
        res.status(500).send('Internal server error');
    }
};



const profile_reterival=async()=>{
try{



}
catch(error){

    console.log(error)
}

}




module.exports = { profile };