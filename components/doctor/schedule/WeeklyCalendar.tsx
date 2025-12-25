"use client";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const scheduleData = {
  Monday: [
    { time: "9:00 AM", title: "Morning Shift", room: "Room 101", type: "work" },
    { time: "2:00 PM", title: "Afternoon Shift", room: "Room 101", type: "work" }
  ],
  Tuesday: [
    { time: "9:00 AM", title: "Morning Shift", room: "Room 101", type: "work" }
  ],
  Wednesday: [
    { time: "10:00 AM", title: "Extended Shift", room: "Room 102", type: "work" }
  ],
  Thursday: [
    { time: "9:00 AM", title: "Morning Shift", room: "Room 101", type: "work" }
  ],
  Friday: [],
  Saturday: [],
  Sunday: []
};

export default function WeeklyCalendar() {
  const getScheduleForTimeAndDay = (time: string, day: string) => {
    const daySchedule = scheduleData[day as keyof typeof scheduleData] || [];
    return daySchedule.find(item => item.time === time);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Weekly Calendar</h2>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Work Shift</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-8 gap-2 mb-4">
          <div className="p-3 text-center font-medium text-gray-500 text-sm">Time</div>
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center font-semibold text-gray-700 bg-gray-50 rounded-lg">
              {day}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {timeSlots.map(time => (
            <div key={time} className="grid grid-cols-8 gap-2">
              <div className="p-3 text-sm text-gray-600 font-medium bg-gray-50 rounded-lg text-center">
                {time}
              </div>
              {weekDays.map(day => {
                const schedule = getScheduleForTimeAndDay(time, day);
                return (
                  <div key={`${day}-${time}`} className="min-h-[60px]">
                    {schedule ? (
                      <div className="bg-blue-100 border-2 border-blue-200 rounded-lg p-3 h-full hover:bg-blue-200 transition-colors cursor-pointer">
                        <div className="font-medium text-blue-900 text-sm">{schedule.title}</div>
                        <div className="text-blue-700 text-xs mt-1">{schedule.room}</div>
                      </div>
                    ) : (
                      <div className="h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Available</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}