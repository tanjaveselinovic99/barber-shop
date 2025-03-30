import { useCallback } from "react";
import useFetchData from "../hooks/useFetchData";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: string;
}

interface Props {
  onSelect: (serviceId: string) => void;
  setPrice: (price: string) => void;
}

const ServicesDropdown: React.FC<Props> = ({ onSelect, setPrice }) => {
  const transformData = useCallback((data: any) => data, []);

  const {
    data: services = [],
    loading,
    error,
  } = useFetchData<Service[]>("http://localhost:3000/services", transformData);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedServiceId = event.target.value;
    onSelect(selectedServiceId);

    const selectedService = services?.find(
      (service) => service.id === selectedServiceId
    );
    if (selectedService) {
      setPrice(selectedService.price);
    } else {
      setPrice("");
    }
  };

  return (
    <select
      name="service"
      className="bg-white rounded-sm font-roboto text-light-gray p-2 w-full"
      onChange={handleSelect}
      required
    >
      <option value="">Select Service</option>
      {loading && <option>Loading...</option>}
      {error && <option>Error loading services</option>}
      {services?.map((service) => (
        <option key={service.id} value={service.id}>
          {service.name}
        </option>
      ))}
    </select>
  );
};

export default ServicesDropdown;
