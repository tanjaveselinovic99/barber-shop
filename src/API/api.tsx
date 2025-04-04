import axios from "axios";

const API_URL = "http://localhost:3000";

interface Appointment {
  startDate: number; // Unix timestamp
  barberId: string;
  serviceId: string;
}

export const bookAppointment = async (
  appointment: Appointment
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/appointments`, appointment);
  } catch (error) {
    console.error("Failed to book appointment:", error);
    alert("Failed to book appointment. Please try again ❌");
  }
};
