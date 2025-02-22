import React from "react";
import { Progress } from "./ui/progress";

interface AttendanceStatsProps {
  percentage?: number;
  totalClasses?: number;
  presents?: number;
  absents?: number;
  plannedClasses?: number;
  predictedPresents?: number;
  predictedAbsents?: number;
  predictedPercentage?: number;
  percentageIncrease?: number;
}

const AttendanceStats = ({
  percentage = 0,
  totalClasses = 0,
  presents = 0,
  absents = 0,
  plannedClasses = 0,
  predictedPresents = 0,
  predictedAbsents = 0,
  predictedPercentage = 0,
  percentageIncrease = 0,
}: AttendanceStatsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold text-gray-900">
            {percentage.toFixed(2)}%
          </h3>
          <p className="text-sm text-gray-500">Current Attendance</p>
        </div>
        <Progress value={percentage} className="w-24" />
      </div>

      {plannedClasses > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold text-blue-600">
              {predictedPercentage.toFixed(2)}%
            </h3>
            <p className="text-sm text-blue-500">
              Predicted Attendance (+{percentageIncrease}%)
            </p>
          </div>
          <Progress value={predictedPercentage} className="w-24" />
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Total</p>
          <p className="text-lg font-semibold text-gray-900">{totalClasses}</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-green-600">Present</p>
          <p className="text-lg font-semibold text-green-600">
            {presents}
            {plannedClasses > 0 && (
              <span className="text-sm text-blue-500 ml-1">
                → {predictedPresents}
              </span>
            )}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-red-600">Absent</p>
          <p className="text-lg font-semibold text-red-600">
            {absents}
            {plannedClasses > 0 && (
              <span className="text-sm text-blue-500 ml-1">
                → {predictedAbsents}
              </span>
            )}
          </p>
        </div>
      </div>

      {plannedClasses > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>
            This prediction shows the impact if you attend {plannedClasses} more
            classes
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceStats;
