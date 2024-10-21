const ping = (req, res)=>{
    if(req.body.type === 1){
        res.json({
            type: 1
        })
    }
}

export default ping