import { useState, useEffect } from "react";
import { getServices } from "../API/api";

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
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const data: Service[] = await getServices();
      setServices(data);
    };
    fetchServices();
  }, []);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedServiceId = event.target.value;
    onSelect(selectedServiceId);

    const selectedService = services.find(
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
      className="bg-white rounded-[2px] roboto-slab-medium text-light-gray p-2 w-full"
      onChange={handleSelect}
      required
    >
      <option value="">Select Service</option>
      {services.map((service) => (
        <option key={service.id} value={service.id}>
          {service.name}
        </option>
      ))}
    </select>
  );
};

export default ServicesDropdown;
