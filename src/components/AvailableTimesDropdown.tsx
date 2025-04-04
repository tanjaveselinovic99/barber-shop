import { useState, useCallback, useEffect } from "react";
import useFetchData from "../hooks/useFetchData";

interface Appointment {
  id: string;
  startDate: number; // Unix timestamp
  barberId: string;
  serviceId: string;
}

interface WorkHours {
  id: number;
  day: number; // 0 (Sunday) - 6 (Saturday)
  startHour: number;
  endHour: number;
  lunchTime: {
    startHour: number;
    durationMinutes: number;
  };
}

interface Barber {
  id: string;
  firstName: string;
  lastName: string;
  workHours: WorkHours[];
}

interface Props {
  barberId: string;
  selectedDate: Date;
  serviceDuration: number;
  onSelect: (time: string) => void;
}

const AvailableTimesDropdown: React.FC<Props> = ({
  barberId,
  selectedDate,
  serviceDuration,
  onSelect,
}) => {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const transformBarbers = useCallback((data: any) => data, []);
  const {
    data: barbers,
    loading: barbersLoading,
    error: barbersError,
  } = useFetchData<Barber[]>("http://localhost:3000/barbers", transformBarbers);

  const transformAppointments = useCallback((data: any) => data, []);
  const {
    data: appointments,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useFetchData<Appointment[]>(
    "http://localhost:3000/appointments",
    transformAppointments
  );

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!barberId || !selectedDate || !barbers || !appointments) return;

      // Get barber
      const barber = barbers.find((b) => b.id === barberId);
      if (!barber) return;

      // (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const dayOfWeek = selectedDate.getDay();
      const workHours = barber.workHours.find(
        (wh: WorkHours) => wh.day === dayOfWeek
      );

      if (!workHours) {
        setAvailableTimes([]); // No available hours for that day
        return;
      }

      const { startHour, endHour, lunchTime } = workHours;

      // Filter out barber's appointments for the selected date
      const barberAppointments = appointments.filter(
        (appt) => appt.barberId === barberId
      );

      // Generate all possible appointment times within work hours considering service duration
      let times: string[] = [];
      for (let hour = startHour; hour < Number(endHour); hour++) {
        for (let minute = 0; minute < 60; minute += serviceDuration) {
          const time = `${hour}:${minute < 10 ? `0${minute}` : minute}`;
          times.push(time);
        }
      }

      // Remove occupied times based on appointments
      times = times.filter((time) => {
        const [hour, minute] = time.split(":").map(Number);

        return !barberAppointments.some((appt) => {
          const apptDate = new Date(appt.startDate * 1000);
          return (
            apptDate.getHours() === hour && apptDate.getMinutes() === minute
          );
        });
      });

      // Remove lunch break times
      times = times.filter((time) => {
        const [hour, minute] = time.split(":").map(Number);
        return !(
          (hour === lunchTime.startHour && minute >= lunchTime.startHour) ||
          (hour === lunchTime.startHour + 1 &&
            minute < lunchTime.durationMinutes)
        );
      });

      setAvailableTimes(times);
    };

    fetchAvailableTimes();
  }, [barberId, selectedDate, barbers, appointments, serviceDuration]);

  // Disable the select list if either barberId or selectedDate is not selected
  const isSelectDisabled =
    !barberId || !selectedDate || barbersLoading || appointmentsLoading;

  return (
    <select
      name="time"
      className="bg-white rounded-sm font-roboto text-light-gray p-2 w-full"
      onChange={(e) => onSelect(e.target.value)}
      disabled={isSelectDisabled}
    >
      <option value="">
        {barbersLoading || appointmentsLoading
          ? "Loading available times..."
          : availableTimes.length > 0
          ? "Select Time"
          : "Select barber & date first"}
      </option>
      {barbersError || appointmentsError ? (
        <option disabled>Error loading times</option>
      ) : availableTimes.length > 0 ? (
        availableTimes.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))
      ) : (
        <option disabled>Sorry. No available times.</option>
      )}
    </select>
  );
};

export default AvailableTimesDropdown;
