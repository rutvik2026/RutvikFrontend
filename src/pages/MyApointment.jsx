import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import React from "react";
import { useAppointments } from "../component/AppointmentContext";
import "./MyAppointments.css";
const MyApointment = () => {
  const [id, setId] = useState(null);
  const [data, setData] = useState([]); 
  const { appointments, updateAppointmentStatus } = useAppointments(); 
  const [count,setCount]=useState(false);
   const [isPaymentComplete,setIsPaymentComplete]=useState(false);
   const baseUrl = import.meta.env.VITE_API_BASE_URL;
   const [completionStatus, setCompletionStatus] = useState("no");

  useEffect(() => {
    console.log("uodated id", appointments);
  }, [appointments]);
  useEffect(() => {
    
    const fetchUserId = () => {
      try {
        const customerData = localStorage.getItem("customer");
        if (customerData) {
          const { id } = JSON.parse(customerData);
          setId(id); 
        }
      } catch (error) {
        console.error("Error parsing customer data:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (id) {
      // Fetch appointment history based on user ID
      const getAppointmentHistory = async () => {
        try {
          const response = await axios.get(`${baseUrl}/v1/user/appointmenthistory`, {
            params: { userId: id },
          });
          setData(response.data); // Set fetched data
        } catch (error) {
          console.error("Error fetching appointment history:", error);
        }
      };

      getAppointmentHistory();
    }
  }, [id,count]);

  const removeAppointment = async (index) => {
    try {
      const appointment = data[index]; // Assuming data is an array of appointments
      const response = await axios.post(`${baseUrl}/v1/user/removeappointment`, {
        userId: appointment.idd, // Replace with the correct field
        ownerId: appointment.ownerId, // Replace with the correct field
        appointmentId: appointment.uniqueId1, // Replace with the correct field
      });
      setCount(!count);

      console.log("Appointment removed successfully:", response.data);
    } catch (error) {
      console.error("Error removing appointment:", error);
    }
  };

const handlePayment = async (index) => {
  const appointment = data[index];
  console.log("Data for appointment:", appointment.price);
  const fac = appointment.price/4;
  const requestdata = JSON.stringify({
    amount:fac * 100, // Convert to smallest currency unit (paise)
    currency: "INR",
  });

  console.log("Client-side amount data:", requestdata);

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url:`${baseUrl}/v1/user/orders`,
    headers: {
      "Content-Type": "application/json", // Fixed typo: "application/ison" -> "application/json"
    },
    data:requestdata,
  };

  try {
    const response = await axios.request(config);
    console.log("Response from server:", JSON.stringify(response.data));

    // Call the Razorpay payment screen
    handleRazorpayScreen(response.data.amount, appointment);
  } catch (error) {
    console.error("Error while creating payment order:", error);
  }
};

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      console.log(`Script loaded: ${src}`);
      resolve(true);
    };
    script.onerror = () => {
      console.error(`Script failed to load: ${src}`);
      reject(false);
    };
    document.body.appendChild(script);
  });
};

const handleRazorpayScreen = async (amount, appointment) => {
  // Load Razorpay script
  const isScriptLoaded = await loadScript(
    "https://checkout.razorpay.com/v1/checkout.js"
  );
  if (!isScriptLoaded) {
    alert(
      "Failed to load Razorpay SDK. Please check your internet connection."
    );
    return;
  }

  console.log("Razorpay script successfully loaded.");

  // Razorpay options
  const options = {
    key: "rzp_live_H2YbNsMpB8KRqc", // Replace with your live Razorpay key
    amount: amount, // Amount in paise
    currency: "INR",
    name: appointment.initialRestaurantName,
    handler: async function (response) {
      console.log(
        "Payment successful! Razorpay Payment ID:",
        response.razorpay_payment_id
      );
      
      try {
          await axios.post(`${baseUrl}/v1/user/update-payment-status`, {
            userId: appointment.idd,
            ownerId: appointment.ownerId,
            uniqueId1: appointment.uniqueId1,
          });
          setCount(!count);
          setIsPaymentComplete((prevStatus) => ({
            ...prevStatus,
            [appointment._id]: true, // Update UI state
          }));
          alert("Payment successful!");
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
    },
    prefill: {
      name: appointment.initialRestaurantName,
      contact: "9657079917", // Replace with user contact information
    },
    theme: {
      color: "#f4c430",
    },
  };

  // Initialize Razorpay and open payment screen
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

const handleCompletionChange = (appointmentId, status) => {
   setCompletionStatus((prevStatus) => ({
     ...prevStatus,
     [appointmentId]: status, // Update status for specific appointment
   }));
 };  
  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">My Appointments</h1>
      <Row className="font-weight-bold text-center d-none d-md-flex">
        <Col>Restaurant Name</Col>
        <Col>Name</Col>
        <Col>Date</Col>
        <Col>Time</Col>
        <Col>Items</Col>
        <Col>Guests</Col>
        <Col>Price</Col>
        <Col>Status</Col>
        <Col>Action</Col>
      </Row>
      <hr />
      {data.length > 0 ? (
        data.map((appointment, index) => (
          <Row
            key={appointment._id}
            className="align-items-center text-center mb-3 appointment-row"
          >
            <Col xs={12} md={1}>
              <strong>Restaurant:</strong> {appointment.initialRestaurantName}
            </Col>
            <Col xs={12} md={2}>
              <strong>Name:</strong> {appointment.name}
            </Col>
            <Col xs={12} md={1}>
              <strong>Date:</strong> {appointment.date}
            </Col>
            <Col xs={12} md={2}>
              <strong>Time:</strong> {appointment.time}
            </Col>
            <Col xs={12} md={1}>
             <strong>Items:</strong>
              <ul>
                {appointment.Items.map((item, index) => (
                  <li key={index}>
                    {item.name}  Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
            </Col>
            <Col xs={12} md={1}>
              <strong>Guests:</strong> {appointment.guests}
            </Col>
            <Col xs={12} md={1}>
              <strong>Price:</strong> {appointment.price}
            </Col>
            <Col xs={12} md={1}>
              <strong>Status:</strong> {appointment.status}
            </Col>
            { !appointment.isPaymentComplete && (
              <Col xs={12} md={1}>
                <Button
                  variant="danger"
                  size="sm"
                  className="m-1"
                  onClick={() => removeAppointment(index)}
                >
                  Cancel
                </Button>
              </Col>
            )}
             <Col xs={12} md={1}>
              {appointment.status === "accepted" && !appointment.isPaymentComplete && (
                <Button
                  variant="success"
                  size="sm"
                  className="m-1"
                  onClick={() =>handlePayment(index)}
                 
                >
                  Pay
                </Button>
              )}
                
               {appointment.status === "accepted" && appointment.isPaymentComplete && (
                      <>
                            <h6>Appointment completed successfully?</h6>
                                <Form>
                                  <Form.Check
                                      type="radio"
                                      label="Yes"
                                       name={`appointment-${appointment.uniqueId1}`}
                                        value="yes"
                                       checked={completionStatus[appointment.uniqueId1] === "yes"}
                                        onChange={() => handleCompletionChange(appointment.uniqueId1, "yes")}
                                        />
                                <Form.Check
                                type="radio"
                                label="No"
                                name={`appointment-${appointment.uniqueId1}`}
                                value="no"
                                checked={
                                completionStatus[appointment.uniqueId1] === "no" ||
                                !completionStatus[appointment.uniqueId1] // Default to "no"
                                }
                            onChange={() => handleCompletionChange(appointment.uniqueId1, "no")}
                            disabled={completionStatus[appointment.uniqueId1] === "yes"} // Disable if "Yes" is selected
                          />
                      </Form>
                    </>
                )}
            </Col>
          </Row>
        ))
      ) : (
        <p className="text-center">No appointments available</p>
      )}
    </Container>
  );
};

export default MyApointment;
