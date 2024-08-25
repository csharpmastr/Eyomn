import axios from "axios"

const AddUserToWaitlist = async(data) =>{
    try{
        const res = await axios.post('http://localhost:5000/api/sheet/submit', data,{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(res);
        return res.data
    }catch(err){
        console.log(err);
        
    }
}

export default AddUserToWaitlist;