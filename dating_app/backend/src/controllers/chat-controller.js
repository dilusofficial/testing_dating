const io=require("../socket/socket")

const chat=(req,res)=>{

    const { message } = req.body;

    
    io.emit('message', message);
  
    res.status(200).json({ success: true });

}


module.exports = {chat};