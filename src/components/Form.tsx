import { useState } from "react";
import BarbersDropdown from "./BarbersDropdown";
import ServicesDropdown from "./ServicesDropdown";
import AvailableTimesDropdown from "./AvailableTimesDropdown";
import { bookAppointment } from "../API/api"; // Import the booking function

function Form() {
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0] // Preselect today's date
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [servicePrice, setServicePrice] = useState<string>("");

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!firstName || !lastName) {
      newErrors.name = "Please enter your full name";
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!phone || !/^(\+386\s?[1-7]\s?\d{3}\s?\d{2}\s?\d{2})$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!selectedBarber) {
      newErrors.barber = "Please select a barber";
    }

    if (!selectedService) {
      newErrors.service = "Please select a service";
    }

    if (!selectedDate) {
      newErrors.date = "Please select a date";
    }

    if (!selectedTime) {
      newErrors.time = "Please select a time";
    }
    console.log("Errors:", newErrors); // De
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!"); // Check if the form submission starts

    if (validateForm()) {
      console.log("Form validation passed!"); // Ensure validation is working

      try {
        console.log("Booking appointment...");
        await bookAppointment({
          startDate: new Date(`${selectedDate}T${selectedTime}`).getTime(),
          barberId: selectedBarber,
          serviceId: selectedService,
        });
        console.log("Appointment booked successfully!"); // Confirm success
      } catch (error) {
        console.error("Error booking appointment:", error);
      }
    }
  };

  return (
    <div className="md:mt-[-25vh] mt-4 max-w-4xl m-auto flex justify-center items-center md:ml-[40%]">
      <form
        className="bg-dark-blue p-6 flex flex-col items-center justify-center space-y-4 w-full"
        onSubmit={handleSubmit}
      >
        <h3 className="text-white md:text-h3 text-[30px] text-h3-letter-spacing squada-one-medium text-center">
          BOOK YOUR APPOINTMENT
        </h3>
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <input
                type="text"
                placeholder="First Name"
                className="bg-white rounded-[2px] roboto-slab-medium p-2 w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                className="bg-white rounded-[2px] roboto-slab-medium p-2 w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          {errors.name && (
            <p className="text-red-500 roboto-slab-medium">{errors.name}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="bg-white rounded-[2px] roboto-slab-medium p-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 roboto-slab-medium">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Contact Number"
                className="bg-white rounded-[2px] roboto-slab-medium p-2 w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <p className="text-red-500 roboto-slab-medium">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <BarbersDropdown onSelect={setSelectedBarber} />
              {errors.barber && (
                <p className="text-red-500 roboto-slab-medium">
                  {errors.barber}
                </p>
              )}
            </div>
            <div>
              <ServicesDropdown
                onSelect={setSelectedService}
                setPrice={setServicePrice}
              />
              {errors.service && (
                <p className="text-red-500">{errors.service}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <input
                type="date"
                className="bg-white rounded-[2px] roboto-slab-medium text-light-gray p-2 w-full"
                min={new Date().toISOString().split("T")[0]} // Disable past dates
                value={selectedDate} // Preselect today's date
                onChange={(e) => setSelectedDate(e.target.value)} // Update selected date
              />
              {errors.date && (
                <p className="text-red-500 roboto-slab-medium">{errors.date}</p>
              )}
            </div>
            <div>
              {selectedDate && (
                <AvailableTimesDropdown
                  barberId={selectedBarber}
                  selectedDate={new Date(selectedDate)}
                  serviceDuration={30}
                  onSelect={setSelectedTime}
                />
              )}
              {errors.time && (
                <p className="text-red-500 roboto-slab-medium">{errors.time}</p>
              )}
            </div>
          </div>

          <div className="w-full">
            <input
              type="text"
              placeholder="Service Price"
              className="w-full bg-white rounded-[2px] roboto-slab-medium text-light-gray p-2"
              value={
                servicePrice ? `Service is ${servicePrice} $` : "Service price"
              }
              readOnly
            />
          </div>

          <div className="w-full mt-4 flex justify-center">
            <button
              type="submit"
              className="hidden md:block bg-bright-orange text-white rounded-[15px] p-2 roboto-slab-medium w-full"
            >
              BOOK APPOINTMENT
            </button>
            <button
              type="submit"
              className="md:hidden bg-bright-orange text-white rounded-[15px] p-2 roboto-slab-medium w-full"
            >
              BOOK
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Form;
