"use client";


// appointmentHelper.ts
function isAppointmentInFuture(
    appointmentDate: string, // "2025-11-14"
    appointmentTime: string  // "09:00 AM"
): boolean {
    // Convert 12-hour format to 24-hour format
    const timeRegex = /^(\d{1,2}):(\d{2})\s(AM|PM)$/i;
    const match = appointmentTime.match(timeRegex);

    if (!match) {
        console.error('Invalid time format. Use "HH:MM AM/PM"');
        return false;
    }

    const [, hours, minutes, period] = match;
    let hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    // Convert to 24-hour format
    if (period.toUpperCase() === 'PM' && hour !== 12) {
        hour += 12;
    } else if (period.toUpperCase() === 'AM' && hour === 12) {
        hour = 0;
    }

    // Create appointment Date object (in local timezone)
    const appointment = new Date(`${appointmentDate}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);

    // Validate date
    if (Number.isNaN(appointment.getTime())) {
        console.error('Invalid date format. Use "YYYY-MM-DD"');
        return false;
    }

    const now = new Date();

    // Return true if appointment is in the future
    return appointment.getTime() > now.getTime();
}

export default isAppointmentInFuture;
