import { useState, useEffect } from "react";
import "./RestaurantAppointment.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Col,
 Row,
  ListGroup,
} from "react-bootstrap";


const RestaurantAppointment = () => {
     const location = useLocation();
     const initialRestaurantName = location.state?.title || "";
     const ownerId=location.state?.id || "";
      const [menu, setMenu] = useState([]);
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const [isPaymentComplete,setIsPaymentComplete]=useState(false);
     const [feedback,setFeedback]=useState([]);
   const sendBack = async (customer) => {
     try {
       console.log("iniial id in sendBack", customer);
       const res = await axios.post(`${baseUrl}/v1/user/appointmentid`, customer, {
         headers: {
           "Content-Type": "application/json",
         },
       });

       if (res.data.success) {
         console.log("id send successfully", customer);
       } else {
         console.log("id not send ");
       }
     } catch (error) {
       console.log("Error during id send appoint to server ", customer, error);
     }
   };
  
  const [restaurantName, setRestaurantName] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
   const [Items, setItem] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [checkedItem,setCheckedItems]=useState({});
  const [numberInputs, setNumberInputs] = useState({});
  const [idd,setId]=useState();
 const [contact,setContact]=useState();
  const today = new Date().toISOString().split("T")[0];
 
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (initialRestaurantName && name && date && time && guests && Items &&price) {
      console.log({ initialRestaurantName, name, date, time, guests,Items });
       function generateUniqueId() {
         const timestamp = Date.now();
         const randomNum = Math.floor(Math.random() * 100000);
         return `${timestamp}-${randomNum}`;
       }

       const uniqueId1 = generateUniqueId();
      const customer = {
        initialRestaurantName,
        name,
        date,
        time,
        guests,
        Items,
        ownerId,
        price,
        idd,
        uniqueId1,
        contact,
        isPaymentComplete,
      };
      console.log("initial id", ownerId);
       sendBack(customer);
      setMessage("Appointment booked successfully!");
      alert("Appointment booked successfully!");
     
    } else {
      setMessage("Please fill out all fields");
    }
  };

  useEffect(() => {
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      const { id } = JSON.parse(customerData);
      setId(id);
      console.log("user ID:", id);
    }
  }, []);

  useEffect(() => {
    if (!ownerId) return;

    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${baseUrl}/v1/user/menuget`, {
          params: { restaurantId: ownerId },
        });
        setMenu(response.data);
        console.log("menu", response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenu();
  }, []);
const handleCheckbox = (index, item) => {
     setCheckedItems((prev) => {
       const isChecked = !prev[index];

       setNumberInputs((prevQty) => ({
         ...prevQty,
         [index]: isChecked ? 1 : undefined, // Remove quantity when unchecked
       }));

       setItem((prevItems) => {
         if (isChecked) {
           // ✅ Add the new item with default quantity 1
           return [
             ...prevItems,
             { name: item.name, quantity: 1, price: item.price },
           ];
         } else {
           // ✅ Remove only the unchecked item, keeping the rest
           return prevItems.filter((fod) => fod.name !== item.name);
         }
       });

       setPrice((prevTotal) => {
         return isChecked
           ? prevTotal + item.price
           : prevTotal - (numberInputs[index] || 1) * item.price;
       });

       return { ...prev, [index]: isChecked };
     });
   };


   const handleNumberChange = (index, value, item) => {
     let quantity = parseInt(value) || 1;
     if (quantity < 1) return;

     const oldQuantity = numberInputs[index] || 1;
     setNumberInputs((prev) => ({ ...prev, [index]: quantity }));

     setPrice(
       (prevTotal) =>
         prevTotal - oldQuantity * item.price + quantity * item.price
     );

     // Update the quantity in selected items
     setItem((prevItems) =>
       prevItems.map((fod) =>
         fod.name === item.name ? { ...fod, quantity: quantity } : fod
       )
     );
   };

 useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${baseUrl}/v1/user/getfeedback`, {
          params: { ownerId: ownerId },
        });

        console.log("Fetched Feedback Data:", response.data);

        // ✅ Ensure feedback is an array before setting state
        if (Array.isArray(response.data)) {
          setFeedback(response.data);
        } else {
          setFeedback([]); // Handle unexpected response
        }
      } catch (error) {
        console.log("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, [ownerId]);
  return (
     <>
      <div className="justify-content-center align-items-center d-flex">
        <div className="form-container justify-content-center align-items-center">
          <h2>Book a Appoint</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Restaurant Name:
              <input
                type="text"
                value={restaurantName || initialRestaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
              />
            </label>
            <label>
              Your Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label>Contact</label>
              <input
                type="tel"
                placeholder="Enter Contact No."
                name="contact"
                value={contact}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers and limit to 10 digits
                  if (/^\d{0,10}$/.test(value)) {
                    setContact(value);
                  }
                }}
                maxLength="10"
                pattern="\d{10}" // Validates exactly 10 digits on form submission
                required
              />
            </label>
            <label>Selected Items:</label>
            <ul>
              {Items.map((food, index) => (
                <li key={index}>
                  {food.name} - Quantity: {food.quantity}
                </li>
              ))}
            </ul>

            <label>
              Date:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                required
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </label>
            <label>
              Number of Guests:
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min="1"
                max="10"
                required
              />
            </label>

            <label>
              Price
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="1"
                required
              />
            </label>
            <button type="submit">Book Appointment</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
        <Row className="mt-4">
          <Col>
            <h3>Menu</h3>
            {menu.length > 0 ? (
              <ListGroup>
                {menu.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <div className="d-flex align-items-center justify-content-center">
                      <div>
                        <h5>
                          {index + 1} ) {item.name}
                        </h5>
                        <p>{item.description}</p>
                        <p>
                          <strong>Price:</strong> {item.price} Rupees
                        </p>
                      </div>
                      <div className="d-flex">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={checkedItem[index] || false}
                          onChange={() => handleCheckbox(index, item)}
                        />
                        {/* Show Quantity Input if Checked */}
                        {checkedItem[index] && (
                          <input
                            type="number"
                            value={numberInputs[index] || 1} // Default to 1
                            onChange={(e) =>
                              handleNumberChange(index, e.target.value, item)
                            }
                            min="1"
                            className="form-control mt-2"
                            inputMode="numeric"
                            pattern="[1-9][0-9]*"
                          />
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No menu items added yet.</p>
            )}
          </Col>
        </Row>
      </div>
      <div>
        <h3>Feedback</h3>
        {feedback.length > 0 ? (
          feedback.map((fb, index) => (
            <div key={index}>
              <h4>Name: {fb.name || "No Name"}</h4>
              <p>Username: {fb.username || "No Username"}</p>
              <p>Feedback: {fb.feedback || "No Feedback"}</p>
            </div>
          ))
        ) : (
          <p>No feedback available.</p>
        )}
      </div>
    </>
  );
};

export default RestaurantAppointment;
