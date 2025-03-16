import { useState } from "react";
import { getBarbers } from "../API/api";

interface Barber {
  id: string;
  firstName: string;
  lastName: string;
}

interface Props {
  onSelect: (barberId: string) => void;
}

const BarbersDropdown: React.FC<Props> = ({ onSelect }) => {
  const [barbers, setBarbers] = useState<Barber[]>([]);

  const fetchBarbers = async () => {
    const data: Barber[] = await getBarbers();
    setBarbers(data);
  };

  return (
    <select
      className="bg-white rounded-[2px] roboto-slab-medium text-light-gray p-2 w-full"
      onFocus={fetchBarbers}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Select Barber</option>
      {barbers.map((barber) => (
        <option key={barber.id} value={barber.id}>
          {barber.firstName} {barber.lastName}
        </option>
      ))}
    </select>
  );
};

export default BarbersDropdown;
