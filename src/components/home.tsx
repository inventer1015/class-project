import React, { useState, useEffect } from "react";
import AttendanceCard from "./AttendanceCard";
import Calendar from "./Calendar";

const Home = () => {
  const [totalClasses, setTotalClasses] = useState(0);
  const [presents, setPresents] = useState(0);
  const [absents, setAbsents] = useState(0);
  const [classSchedule, setClassSchedule] = useState<
    Record<string, { numClasses: number }>
  >({});

  // Maintain consistency: Total Classes = Presents + Absents
  useEffect(() => {
    if (totalClasses > 0) {
      // When total classes changes, adjust absents
      setAbsents(totalClasses - presents);
    }
  }, [totalClasses]);

  const handleTotalClassesChange = (value: number) => {
    setTotalClasses(value);
  };

  const handlePresentsChange = (value: number) => {
    setPresents(value);
    // Automatically adjust absents to maintain total
    setAbsents(totalClasses - value);
  };

  const handleAbsentsChange = (value: number) => {
    setAbsents(value);
    // Automatically adjust presents to maintain total
    setPresents(totalClasses - value);
  };

  const handleDateSelect = (date: Date, classes: number) => {
    const dateStr = date.toISOString().split("T")[0];
    setClassSchedule((prev) => ({
      ...prev,
      [dateStr]: { numClasses: classes },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Tracker
          </h1>
          <p className="mt-2 text-gray-600">
            Keep track of your attendance records
          </p>
        </div>

        <div className="flex justify-center gap-8">
          <AttendanceCard
            totalClasses={totalClasses}
            presents={presents}
            absents={absents}
            onTotalClassesChange={handleTotalClassesChange}
            onPresentsChange={handlePresentsChange}
            onAbsentsChange={handleAbsentsChange}
          />
          <Calendar
            onDateSelect={handleDateSelect}
            markedDates={classSchedule}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
