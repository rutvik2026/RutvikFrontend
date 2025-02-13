import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useAppointments } from "../component/AppointmentContext";
import "./Appointment.css";

export const Appointments = () => {
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);
  const [completionStatus, setCompletionStatus] = useState("no");
 const baseUrl = import.meta.env.VITE_API_BASE_URL;

   const [count,setCount]=useState(false);
  // Fetch user ID from localStorage on mount
  const { appointments, updateAppointmentStatus } = useAppointments();
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const customerData = localStorage.getItem("customer");
        console.log("Customer data from localStorage:", customerData);
        if (customerData) {
          const { id } = JSON.parse(customerData);
          setId(id);
          console.log("Owner ID:", id);
        }
      } catch (error) {
        console.error("Error parsing customer data:", error);
      }
    };

    fetchMenu();
  }, []);

  // Fetch appointments when ID is available
  useEffect(() => {
    if (id) {
      console.log("Fetching appointments for ownerId:", id);
      const getAppointments = async () => {
        try {
          const response = await axios.get(`${baseUrl}/v1/user/appointments`, {
            params: { ownerId: id },
          });
          console.log("Fetched appointments from API:", response.data);
          setData(response.data || []);
          
        } catch (error) {
          console.error(
            "Error fetching appointments:",
            error.response || error
          );
        }
      };

      getAppointments();
    }
  }, [id,count]);

  // Log data when updated
  useEffect(() => {
    console.log("Current Appointments Data:", data);
  }, [data]);
const whatsapp=async(index)=>{
      const appointment=data[index];
      const message = `Your appointment is accepted by ${appointment.initialRestaurantName} Pay 25% and Confirm Appointment`; 
      const subject = "Regarding Food Appointment on FoodApoint"
      const result = await axios.post(`${baseUrl}/v1/user/sendmassage`, {
        to: appointment.email,
        subject:subject,
        text: message,
      });
      console.log(result.data);
  }
  // Accept Appointment
  const handleStatusChange = async(uniqueId1, status,index) => {
    updateAppointmentStatus(uniqueId1, status);
    console.log("Accepted the appointment:", uniqueId1, status);
    console.log("Updated appointments:", appointments);
      try {
    const appointment = data[index]; // Assuming data is an array of appointments
    const response = await axios.patch(`${baseUrl}/v1/user/updatestatusappointment`, {
    userId: appointment.idd,
    ownerId: id,
    appointmentId: appointment.uniqueId1,
    status: status,
    index: index,
  });
   
    setCount(!count);
        whatsapp(index);
    console.log("Appointment status is updated successfully:", response.data);
  } catch (error) {
    console.error("Error in status updation:", error);
  }
  };


  // Remove Appointment
const removeAppointment = async (index) => {
  try {
    const appointment = data[index]; // Assuming data is an array of appointments
    const response = await axios.post(`${baseUrl}/v1/user/removeappointment`, {
      userId: appointment.idd, // Replace with the correct field
      ownerId:id, // Replace with the correct field
      appointmentId: appointment.uniqueId1, // Replace with the correct field
    });
    setCount(!count)
   
    console.log("Appointment removed successfully:", response.data);
  } catch (error) {
    console.error("Error removing appointment:", error);
  }
};
const handleCompletionChange = (appointmentId, status) => {
   setCompletionStatus((prevStatus) => ({
     ...prevStatus,
     [appointmentId]: status, // Update status for specific appointment
   }));
 };
  return (
    <div className="container mt-4 ">
      <h1 className="mb-4 text-center">All Appointments</h1>
      <Row className="font-weight-bold text-center d-none d-md-flex">
        {/* Column headers */}
        <Col>ID</Col>
        <Col>Name</Col>
        <Col>Phone</Col>
        <Col>Date</Col>
        <Col>Time</Col>
        <Col>Items</Col>
        <Col>Guests</Col>
        <Col>Price</Col>
        <Col>Ststus</Col>
        <Col>Actions</Col>
        <Col>Actions</Col>
      </Row>
      <hr className="d-none d-md-block" />
      {data.length > 0 ? (
        data.map((appointment, index) => (
          <Row
            key={appointment._id || index}
            className="align-items-center mb-3 appointment-row"
          >
            <Col xs={12} md={1} className="text-center">
              <strong>ID:</strong> {appointment.otp || "N/A"}
            </Col>
            <Col xs={12} md={1} className="text-center">
              <strong>Name:</strong> {appointment.name || "N/A"}
            </Col>
            <Col xs={12} md={1} className="text-center">
              <strong>Phone:</strong> {appointment.contact || "N/A"}
            </Col>
            <Col xs={12} md={1} className="text-center">
              <strong>Date:</strong> {appointment.date || "N/A"}
            </Col>
            <Col xs={12} md={2} className="text-center">
              <strong>Time:</strong> {appointment.time || "N/A"}
            </Col>
            <Col xs={12} md={1} className="text-center">
             <strong>Items:</strong>
              <ul>
                {appointment.Items.map((item, index) => (
                  <li key={index}>
                    {item.name}  Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
            </Col>
            <Col xs={12} md={1} className="text-center">
              <strong>Guests:</strong> {appointment.guests || "N/A"}
            </Col>
            <Col xs={12} md={1} className="text-center">
              <strong>Price:</strong> {appointment.price || "N/A"}
            </Col>
             <Col xs={12} md={1} className="text-center">
              <strong>Status:</strong> {appointment.status || "N/A"}
            </Col>
            <Col xs={6} md={1} className="text-center">
              {appointment.status === "pending" && ( <Button
                className="mr-2"
                variant="success"
                onClick={() =>
                  handleStatusChange(appointment.uniqueId1, "accepted", index)
                }
              >
                Accept
              </Button>) }
            </Col>
            <Col xs={6} md={1} className="text-center">
              {appointment.status === "pending" && (<Button variant="danger" onClick={() => removeAppointment(index)}>
                Remove
              </Button>)}
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
    </div>
  );
};
