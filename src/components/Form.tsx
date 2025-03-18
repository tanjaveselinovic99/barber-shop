import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarbersDropdown from "./BarbersDropdown";
import ServicesDropdown from "./ServicesDropdown";
import AvailableTimesDropdown from "./AvailableTimesDropdown";
import { bookAppointment } from "../API/api";
import barberImage from "../assets/Image.jpg";

const validateForm = ({
  email,
  firstName,
  lastName,
  phone,
  selectedBarber,
  selectedService,
  selectedTime,
  selectedDate,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  selectedTime: string;
  selectedBarber: string;
  selectedService: string;
  selectedDate: string;
}): {
  errors: Record<string, string>;
  errorCount: number;
  success: boolean;
} => {
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

  if (selectedDate !== "") {
    newErrors.date = "Please select a date";
  }

  if (!selectedTime) {
    newErrors.time = "Please select a time";
  }

  const errorCount = Object.keys(newErrors).length;
  return {
    errors: newErrors,
    errorCount,
    success: errorCount === 0,
  };
};

function Form() {
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [servicePrice, setServicePrice] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const validationResult = validateForm({
      firstName: formData.get("firstName")?.toString().trim() || "",
      lastName: formData.get("lastName")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
      selectedBarber: formData.get("barber")?.toString() || "",
      selectedService: formData.get("service")?.toString() || "",
      selectedDate: formData.get("date")?.toString() || "",
      selectedTime: formData.get("time")?.toString() || "",
    });
    console.log(validationResult);
    setErrors(validationResult.errors);

    if (!validationResult.success) {
      console.log("Form has errors:", validationResult.errors);
      return;
    }

    bookAppointment({
      startDate: new Date(`${selectedDate}T${selectedTime}`).getTime(),
      barberId: selectedBarber,
      serviceId: selectedService,
    });

    navigate("/success");
  };

  return (
    <div className="max-w-4xl mx-auto relative w-full flex md:flex-row flex-col md:justify-end md:items-end md:pt-40 font-medium">
      <div className="w-full h-auto md:absolute md:pr-36 md:pb-16 -z-10 flex justify-center md:justify-start inset-0 mt-4 mb-6 md:mt-0">
        <img
          src={barberImage}
          alt="barber"
          className="h-auto border-2 border-chocolate p-2 w-full"
        />
      </div>
      <form
        className="bg-dark-blue p-6 flex flex-col items-center w-full md:w-max justify-center space-y-4  mb-6 md:mt-0 md:mb-0"
        onSubmit={handleSubmit}
      >
        <h3 className="text-white text-2xl  text-tracking-xl font-squada text-center">
          BOOK YOUR APPOINTMENT
        </h3>
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="bg-white rounded-sm font-roboto p-2 w-full"
              />
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="bg-white rounded-sm font-roboto p-2 w-full"
              />
            </div>
          </div>
          {errors.name && (
            <p className="text-red-500 font-roboto">{errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="bg-white rounded-sm font-roboto p-2 w-full"
            />
            {errors.email && (
              <p className="text-red-500 font-roboto">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Slovenian Contact Number"
              className="bg-white rounded-sm font-roboto p-2 w-full"
            />
            {errors.phone && (
              <p className="text-red-500 font-roboto">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <BarbersDropdown
              onSelect={(barberId) => setSelectedBarber(barberId)}
            />
            {errors.barber && (
              <p className="text-red-500 font-roboto">{errors.barber}</p>
            )}
          </div>
          <div>
            <ServicesDropdown
              onSelect={(serviceId) => setSelectedService(serviceId)}
              setPrice={setServicePrice}
            />
            {errors.service && <p className="text-red-500">{errors.service}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <input
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white rounded-sm font-roboto text-light-gray p-2 w-full"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
            />
            {errors.date && (
              <p className="text-red-500 font-roboto">{errors.date}</p>
            )}
          </div>
          <div>
            <AvailableTimesDropdown
              barberId={selectedBarber}
              selectedDate={new Date(selectedDate)}
              serviceDuration={30}
              onSelect={setSelectedTime}
            />{" "}
            {errors.time && (
              <p className="text-red-500 roboto-slab-medium">{errors.time}</p>
            )}
          </div>
        </div>

        <div className="w-full">
          <input
            type="text"
            placeholder="Service Price"
            className="w-full bg-white rounded-sm font-roboto text-light-gray p-2"
            value={
              servicePrice ? `Service is ${servicePrice} $` : "Service price"
            }
            readOnly
          />
        </div>

        <div className="w-full mt-4 flex justify-center text-xl text-white text-tracking-2xl">
          <button
            type="submit"
            className="hidden md:block bg-bright-orange text-white rounded-xl p-2 font-roboto w-full"
          >
            BOOK APPOINTMENT
          </button>
          <button
            type="submit"
            className="md:hidden bg-bright-orange rounded-xl p-2 font-roboto w-full"
          >
            BOOK
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
