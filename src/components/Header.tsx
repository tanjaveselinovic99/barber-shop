function Header() {
  return (
    <div className="flex flex-col items-center justify-center md:p-4 p-2 text-center font-medium">
      <h1 className="md:text-3xl md:text-tracking-lg font-medium text-2xl font-squada uppercase">
        Book Your Barber
      </h1>
      <p className="md:block md:text-lg md:text-tracking-lg text-input text-tracking-sm font-roboto">
        Great Hair Doesn’t Happen By Chance. It Happens By Appointment!
        <span className="hidden md:inline">
          So, Don't Wait And Book Your Appointment Now!
        </span>
      </p>
    </div>
  );
}

export default Header;
