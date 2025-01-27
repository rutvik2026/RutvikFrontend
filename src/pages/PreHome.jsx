
import { useEffect, useState } from "react";
import Cards2 from "../component/Cards2";
import Head from "../component/Navbar1";
import axios from "axios";

import { Container } from "react-bootstrap";

export const PreHome = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseUrl}/owners`);
        const result = await response.data;
        setData(result);
        console.log("fetched data",result);
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    fetchData();
  }, []);

  return (
   <Head />
    <div className="d-flex flex-wrap mt-3 justify-content-center">
      <Container className="mt-3">
        <img
          src="https://cdn.thespicery.com/media/user_uploads/cache/2560x850/Mezze-Hero-2560x850px_1_1_.jpg"
          alt="Example"
          className="img-fluid"
        />
      </Container>
    
      {data.length > 0 ? (
        data.map((item, index) => (
          <Cards2
            key={index}
            id={item._id}
            Img={item.RestoPicture}
            title={item.name}
            description={item.address  || "No description available"}
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

