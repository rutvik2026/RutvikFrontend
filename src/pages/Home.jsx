import { useEffect, useState } from "react";
import Cards from "../component/Cards";
import axios from "axios";
import "./Appointment.css";

import { Container } from "react-bootstrap";

export const Home = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  useEffect(() => {
    
   const fetchData = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL; // Fetch the base URL from environment variables
    const response = await axios.get(`${baseUrl}/owners/home`, {
      params: { q: query }, // Pass query as a parameter (recommended)
    });
     console.log("Query:", query);
    const result = response.data; // No need for `await` here
    setData(result);
    console.log("Fetched data:", result);
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

fetchData();
}, [query]); // Dependency array ensures it refetches when `query` changes


  return (
    <div className="d-flex flex-wrap mt-3 justify-content-center">
        <input
        type="text"
        value={query}
        className="mt-4 custom-input"
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
            email={item.email ||"No Email"}
            description={item.address  || "No description available"}
            description1={item.contact ||"Contact" }
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
