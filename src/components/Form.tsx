import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarbersDropdown from "./BarbersDropdown";
import ServicesDropdown from "./ServicesDropdown";
import AvailableTimesDropdown from "./AvailableTimesDropdown";
import { bookAppointment } from "../API/api";
import barberImage from "../assets/Image.jpg";
import { useForm, SubmitHandler } from "react-hook-form";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  selectedBarber: string;
  selectedService: string;
  selectedTime: string;
  selectedDate: string;
};

function Form() {
  const [servicePrice, setServicePrice] = useState<string>("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();

  const selectedDate = watch("selectedDate");
  const selectedBarber = watch("selectedBarber");

  const onSubmit: SubmitHandler<FormData> = (data) => {
    bookAppointment({
      startDate: new Date(
        `${data.selectedDate}T${data.selectedTime}`
      ).getTime(),
      barberId: data.selectedBarber,
      serviceId: data.selectedService,
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
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="text-white text-2xl  text-tracking-xl font-squada text-center">
          BOOK YOUR APPOINTMENT
        </h3>
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <input
                {...register("firstName", {
                  required: "Please enter full name",
                })}
                type="text"
                placeholder="First Name"
                className="bg-white rounded-sm font-roboto p-2 w-full"
              />
            </div>
            <div>
              <input
                {...register("lastName", {
                  required: "Please enter full name",
                })}
                type="text"
                placeholder="Last Name"
                className="bg-white rounded-sm font-roboto p-2 w-full"
              />
            </div>

            {(errors.firstName || errors.lastName) && (
              <p className="text-red-500 font-roboto">Please enter full name</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
              type="email"
              placeholder="Email"
              className="bg-white rounded-sm font-roboto p-2 w-full"
            />
            {errors.email && (
              <p className="text-red-500 font-roboto">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^(\+386\s?[1-7]\s?\d{3}\s?\d{2}\s?\d{2})$/,
                  message: "Please enter a valid phone number",
                },
              })}
              type="text"
              placeholder="Slovenian Contact Number"
              className="bg-white rounded-sm font-roboto p-2 w-full"
            />
            {errors.phone && (
              <p className="text-red-500 font-roboto">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <BarbersDropdown
              onSelect={(barberId) => setValue("selectedBarber", barberId)}
            />
            {errors.selectedBarber && (
              <p className="text-red-500 font-roboto">
                {errors.selectedBarber.message}
              </p>
            )}
          </div>
          <div>
            <ServicesDropdown
              onSelect={(serviceId) => {
                setValue("selectedService", serviceId);
              }}
              setPrice={setServicePrice}
            />
            {errors.selectedService && (
              <p className="text-red-500">{errors.selectedService.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <input
              {...register("selectedDate", {
                required: "Please select a date",
              })}
              type="date"
              className="bg-white rounded-sm font-roboto text-light-gray p-2 w-full"
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.selectedDate && (
              <p className="text-red-500 font-roboto">
                {errors.selectedDate.message}
              </p>
            )}
          </div>
          <div>
            <AvailableTimesDropdown
              barberId={selectedBarber}
              selectedDate={new Date(selectedDate)}
              serviceDuration={30}
              onSelect={(time) => setValue("selectedTime", time)}
            />
            {errors.selectedTime && (
              <p className="text-red-500 roboto-slab-medium">
                {errors.selectedTime.message}
              </p>
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
