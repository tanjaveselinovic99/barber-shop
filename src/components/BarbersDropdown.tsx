import { useCallback } from "react";
import useFetchData from "../hooks/useFetchData";

interface Barber {
  id: string;
  firstName: string;
  lastName: string;
}

interface Props {
  field: any; // accept field directly
}

const BarbersDropdown: React.FC<Props> = ({ field }) => {
  const transformData = useCallback((data: any) => data, []);

  const {
    data: barbers,
    loading,
    error,
  } = useFetchData<Barber[]>("http://localhost:3000/barbers", transformData);

  return (
    <select
      {...field}
      className="bg-white rounded-sm font-roboto text-light-gray p-2 w-full"
      disabled={loading || error !== null}
    >
      <option value="">Select Barber</option>
      {loading && <option>Loading...</option>}
      {error && <option>Error loading barbers</option>}
      {barbers?.map((barber) => (
        <option key={barber.id} value={barber.id}>
          {barber.firstName} {barber.lastName}
        </option>
      ))}
    </select>
  );
};

export default BarbersDropdown;
