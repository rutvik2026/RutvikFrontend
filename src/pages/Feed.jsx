
import axios from "axios";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Feedback from "react-bootstrap/esm/Feedback";
import { useLocation } from "react-router-dom";
const Feed = () => {
  const location=useLocation();
  const name=location.state?.title;
  const ownerId=location.state?.id;
  const username=location.state?.name;
  const [fed,setfed]=useState();
  const feedd=async ()=>{
   try {
    const res = await axios.post("/api/v1/user/feed", { name: name,username:username,feedback:fed,ownerId:ownerId });
    console.log(res.data);
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



