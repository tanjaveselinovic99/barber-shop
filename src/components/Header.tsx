import barberImage from "../assets/Image.jpg";

function Header() {
  return (
    <div className="flex flex-col items-center justify-center md:p-4 p-2 text-center">
      <h1 className="md:text-h1 text-h3 squada-one-medium uppercase">
        Book Your Barber
      </h1>
      <p className="hidden md:block text-p text-h3-letter-spacing roboto-slab-medium">
        Great Hair Doesn’t Happen By Chance. It Happens By Appointment! So,
        Don't Wait And Book Your Appointment Now!
      </p>

      <p className="md:hidden text-input text-input-letter-spacing roboto-slab-medium">
        Great Hair Doesn’t Happen By Chance. It Happens By Appointment!
      </p>

      <div className="w-full flex justify-center md:justify-start">
        <img
          src={barberImage}
          alt="barber"
          className="m-4 md:m-8 h-auto max-w-xs sm:max-w-md md:max-w-2xl outline-2 outline-solid outline-chocolate p-1 w-full"
        />
      </div>
    </div>
  );
}

export default Header;
