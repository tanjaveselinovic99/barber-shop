import { useState } from "react";
import { getAppointments, getBarbers } from "../API/api";

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

  const fetchAvailableTimes = async () => {
    if (!barberId || !selectedDate) return;

    // Get barber
    const barbers: Barber[] = await getBarbers();
    const barber = barbers.find((b) => b.id === barberId);
    if (!barber) return;

    // (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = selectedDate.getDay();
    const workHours = barber.workHours.find(
      (wh: WorkHours) => wh.day === dayOfWeek,
    );

    if (!workHours) {
      setAvailableTimes([]); // No available hours for that day
      return;
    }

    const { startHour, endHour, lunchTime } = workHours;

    // Get existing appointments for the selected barber
    const appointments: Appointment[] = await getAppointments();
    const barberAppointments = appointments.filter(
      (appt) => appt.barberId === barberId,
    );

    // Generate all possible appointment times within work hours
    let times: string[] = [];
    for (let hour = startHour; hour < Number(endHour); hour++) {
      times.push(`${hour}:00`);
      if (hour + 0.5 < Number(endHour)) {
        times.push(`${hour}:30`);
      }
    }

    times = times.filter((time) => {
      const hour = parseInt(time.split(":")[0]);
      const minute = time.includes("30") ? 30 : 0;

      return !barberAppointments.some((appt) => {
        const apptDate = new Date(appt.startDate * 1000);
        return apptDate.getHours() === hour && apptDate.getMinutes() === minute;
      });
    });

    times = times.filter((time) => {
      const hour = parseInt(time.split(":")[0]);
      return !(
        hour === lunchTime.startHour || hour === lunchTime.startHour + 0.5
      );
    });

    setAvailableTimes(times);
  };

  return (
    <select
      name="time"
      className="bg-white rounded-sm font-roboto text-light-gray p-2 w-full"
      onFocus={fetchAvailableTimes}
      onChange={(e) => onSelect(e.target.value)}
      disabled={!barberId || !selectedDate}
    >
      <option value="">
        {availableTimes.length > 0
          ? "Select Time"
          : "Select barber & date first"}
      </option>
      {availableTimes.length > 0 ? (
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
