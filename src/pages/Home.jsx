import { useEffect, useState } from "react";
import Cards from "../component/Cards";
import axios from "axios";

import { Container } from "react-bootstrap";

export const Home = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseUrl}/owners/home?q=${query}` 
        });
        const result = await response.data;
        setData(result);
        console.log("fetched data1",result);
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="d-flex flex-wrap mt-3 justify-content-center">
        <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search menu items"
      />
      <Container className="mt-3">
        <img
          src="https://cdn.thespicery.com/media/user_uploads/cache/2560x850/Mezze-Hero-2560x850px_1_1_.jpg"
          alt="Example"
          className="img-fluid"
        />
      </Container>
    
      {data.length > 0 ? (
        data.map((item, index) => (
          <Cards
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
