import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import React from "react";
import { useAppointments } from "../component/AppointmentContext";
import "./MyAppointments.css";
const MyApointment = () => {
  const [id, setId] = useState(null);
  const [data, setData] = useState([]); 
  const { appointments, updateAppointmentStatus } = useAppointments(); 
  const [count,setCount]=useState(false);
   const baseUrl = import.meta.env.VITE_API_BASE_URL;


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
  const payAppointment = async (index) => {
    try {
      const appointment = data[index]; // Assuming data is an array of appointments
      const number = "9657979917";

      const makePaymentRequest = async (retryCount = 0) => {
        try {
          const response = await axios.post(`${baseUrl}/v1/user/paymentgateway`, {
            username: appointment.name, // Replace with the correct field
            appointmentPrice: appointment.price, // Replace with the correct field
            number,
          });
          console.log("Payment Successful:", response.data);
        } catch (error) {
          if (error.response?.status === 429 && retryCount < 3) {
            console.warn(
              `Rate limit hit. Retrying... Attempt ${retryCount + 1}`
            );
            const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
            await new Promise((resolve) => setTimeout(resolve, waitTime)); // Wait before retrying
            await makePaymentRequest(retryCount + 1); // Retry with incremented count
          } else {
            console.error("Error during payment:", error);
          }
        }
      };

      await makePaymentRequest(); // Call the payment request with retry logic
    } catch (error) {
      console.error("Unexpected error during payment:", error);
    }
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
            <Col xs={12} md={1}>
              <strong>Name:</strong> {appointment.name}
            </Col>
            <Col xs={6} md={1}>
              <strong>Date:</strong> {appointment.date}
            </Col>
            <Col xs={6} md={1}>
              <strong>Time:</strong> {appointment.time}
            </Col>
            <Col xs={12} md={1}>
              <strong>Items:</strong> {appointment.Items}
            </Col>
            <Col xs={6} md={1}>
              <strong>Guests:</strong> {appointment.guests}
            </Col>
            <Col xs={6} md={1}>
              <strong>Price:</strong> {appointment.price}
            </Col>
            <Col xs={12} md={1}>
              <strong>Status:</strong> {appointment.status}
            </Col>
            <Col xs={12} md={2}>
              <Button
                variant="danger"
                size="sm"
                className="m-1"
                onClick={() => removeAppointment(index)}
              >
                Cancel
              </Button>
              {appointment.status === "accepted" && (
                <Button
                  variant="success"
                  size="sm"
                  className="m-1"
                  onClick={() => payAppointment(index)}
                >
                  Pay
                </Button>
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
