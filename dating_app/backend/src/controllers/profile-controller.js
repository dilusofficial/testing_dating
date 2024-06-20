const profile=(req,res)=>{

    const { firstname, email, day, month, year, gender, interests } = req.body;
    const image = req.file;
  
    console.log(firstname, email, day, month, year, gender, interests, image);
  
    res.send('Profile received');

}

module.exports={profile}