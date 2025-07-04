
import axios from "axios";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Feedback from "react-bootstrap/esm/Feedback";
 
import { useLocation } from "react-router-dom";
const Feed = () => {
 const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const location=useLocation();
  const name=location.state?.title;
  const ownerId=location.state?.id;
  const username=location.state?.name;
  const [fed,setfed]=useState();
  const feedd=async ()=>{
   try {
    const res = await axios.post(`${baseUrl}/v1/user/feed`, { name: name,username:username,feedback:fed,ownerId:ownerId });
    console.log(res.data);
    alert("thank you for feedback...");
   } catch (error) {
    console.log("error in feedback",error)
   }
  }
  return (
    <div className="mt-5">
      <h3>Feedback</h3>
      <Feedback />
      <label>{name}</label>

      <input
        type="textarea"
        value={fed}
        onChange={(e) => {
          setfed(e.target.value);
        }}
      ></input>
      <Button type="submit" variant="success" size="sm" className="m-1" 
      onClick={()=>feedd()}>
        Submit
      </Button>
    </div>
  );
}

export default Feed



