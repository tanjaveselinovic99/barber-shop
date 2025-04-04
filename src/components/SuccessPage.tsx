import barberGif from "../assets/barber.gif";

function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 font-medium">
      <h3 className="text-2xl text-tracking-xl font-squada text-center mb-4">
        APPOINTMENT SUCCESSFULLY BOOKED
      </h3>

      <img
        src={barberGif}
        alt="barber.gif"
        className="m-4 md:m-8 h-auto max-w-xs outline-2 outline-solid outline-chocolate p-1"
      />
    </div>
  );
}
export default SuccessPage;
