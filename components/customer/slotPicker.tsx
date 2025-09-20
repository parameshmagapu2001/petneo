import React, { useEffect, useState } from "react";

interface TimeSlot {
  time: string; // "10:30 AM"
  status: "available" | "booked";
}

interface DaySlots {
  date: string; // "2024-07-24"
  slots: TimeSlot[];
}

interface SlotPickerProps {
  savedAppointment?: { date: string; time: string };
  onChange: (selected: { date: string; time: string }) => void;
}

// Dummy doctor availability data (for next 7 days)
const generateDummyAvailability = (): DaySlots[] => {
  const availability: DaySlots[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Example slots
    const slots: TimeSlot[] = [
      { time: "9:30 AM", status: Math.random() > 0.5 ? "booked" : "available" },
      { time: "10:30 AM", status: "available" },
      { time: "3:30 PM", status: "booked" },
      { time: "6:30 PM", status: Math.random() > 0.5 ? "booked" : "available" },
      { time: "7:30 PM", status: "available" },
      { time: "9:30 PM", status: "available" },
    ];

    availability.push({
      date: date.toISOString().split("T")[0], // yyyy-mm-dd
      slots,
    });
  }
  return availability;
};

// Utility: convert "10:30 AM" -> Date
const parseTime = (dateStr: string, timeStr: string): Date => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const date = new Date(dateStr);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export default function SlotPicker({
  savedAppointment,
  onChange,
}: SlotPickerProps) {
  const [availability] = useState<DaySlots[]>(generateDummyAvailability);
  const [selectedDate, setSelectedDate] = useState<string>(
    savedAppointment?.date || availability[0].date
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(
    savedAppointment?.time || null
  );

  const now = new Date();

  useEffect(() => {
    if (selectedDate && selectedTime) {
      onChange({ date: selectedDate, time: selectedTime });
    }
  }, [selectedDate, selectedTime]);

  return (
    <div className="py-6 max-w-lg mx-auto">
      {/* Date Picker */}
      <div className="flex flex-col mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-sm block">Select Date:</h2>
          <span className="text-sm text-gray-600">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex gap-2 self-center overflow-x-auto">
          {availability.map((d) => {
            const dateObj = new Date(d.date);
            const day = dateObj.toLocaleDateString("en-US", { weekday: "short" });
            const dateNum = dateObj.getDate();

            return (
              <div
                key={d.date}
                onClick={() => {
                  setSelectedDate(d.date);
                  setSelectedTime(null); // reset time when changing date
                }}
                className={`w-14 text-center rounded-lg border cursor-pointer transition 
                  ${
                    selectedDate === d.date
                      ? "bg-pink-500 text-white"
                      : "bg-white text-black"
                  }`}
              >
                <p className="text-xs">{day}</p>
                <p className="text-lg font-semibold">{dateNum}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Picker */}
      <div>
        <h2 className="font-semibold text-sm mb-3">Select Schedule Time:</h2>
        <div className="grid grid-cols-3 gap-3">
          {availability
            .find((d) => d.date === selectedDate)
            ?.slots.filter((t) => {
              // Hide past times for today
              const slotTime = parseTime(selectedDate, t.time);
              return selectedDate === now.toISOString().split("T")[0]
                ? slotTime > now
                : true;
            })
            .map((t) => (
              <div
                key={t.time}
                onClick={() =>
                  t.status === "available" ? setSelectedTime(t.time) : null
                }
                className={`p-2 rounded-lg text-center cursor-pointer transition flex flex-col items-center justify-center
                  ${
                    t.status === "booked"
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : selectedTime === t.time
                      ? "bg-pink-500 text-white"
                      : "bg-white text-black border border-green-500"
                  }`}
              >
                <p className="text-sm font-medium">{t.time}</p>
                <p
                  className={`text-xs ${
                    t.status === "booked"
                      ? "text-gray-600"
                      : selectedTime === t.time
                      ? "text-pink-100"
                      : "text-green-500"
                  }`}
                >
                  {t.status === "booked" ? "Booked" : "Available"}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
