import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import AttendanceStats from "./AttendanceStats";

interface AttendanceCardProps {
  totalClasses?: number;
  presents?: number;
  absents?: number;
  onTotalClassesChange?: (value: number) => void;
  onPresentsChange?: (value: number) => void;
  onAbsentsChange?: (value: number) => void;
}

const AttendanceCard = ({
  totalClasses = 0,
  presents = 0,
  absents = 0,
  onTotalClassesChange = () => {},
  onPresentsChange = () => {},
  onAbsentsChange = () => {},
}: AttendanceCardProps) => {
  const [plannedClasses, setPlannedClasses] = React.useState(0);
  const [error, setError] = React.useState("");

  const calculatePercentage = (total: number, present: number) => {
    if (total === 0) return 0;
    const percentage = (present / total) * 100;
    return Number(percentage.toFixed(2));
  };

  // Calculate predicted values
  const predictedPresents = presents + plannedClasses;
  const predictedAbsents = Math.max(0, absents - plannedClasses);

  // Calculate current and predicted percentages
  const currentPercentage = calculatePercentage(totalClasses, presents);
  const predictedPercentage = calculatePercentage(
    totalClasses,
    predictedPresents,
  );
  const percentageIncrease = (predictedPercentage - currentPercentage).toFixed(
    2,
  );

  const validateAndFormatInput = (value: string) => {
    const cleanValue = value.replace(/^0+/, "").replace(/[^0-9]/g, "");
    return cleanValue === "" ? "" : cleanValue;
  };

  const handleInputChange = (
    value: string,
    setter: (value: number) => void,
    field: string,
  ) => {
    const formattedValue = validateAndFormatInput(value);
    const numValue = formattedValue === "" ? 0 : parseInt(formattedValue);

    // Validation logic
    if (field === "plannedClasses") {
      if (numValue > absents) {
        setError(
          `You cannot plan more classes than current absences (${absents})`,
        );
        return;
      }
    } else if (field === "totalClasses") {
      if (numValue < presents + absents) {
        setError(
          `Total classes cannot be less than current attendance (${presents + absents})`,
        );
        return;
      }
    }

    setError("");
    setter(numValue);

    // Reset planned classes if absents would become invalid
    if (
      field === "totalClasses" ||
      field === "presents" ||
      field === "absents"
    ) {
      if (plannedClasses > absents) {
        setPlannedClasses(0);
      }
    }
  };

  return (
    <Card className="w-full max-w-[480px] bg-white">
      <CardHeader>
        <CardTitle>Attendance Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totalClasses">Total Classes</Label>
            <Input
              id="totalClasses"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={totalClasses || ""}
              onChange={(e) =>
                handleInputChange(
                  e.target.value,
                  onTotalClassesChange,
                  "totalClasses",
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="presents">Present Days</Label>
            <Input
              id="presents"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={presents || ""}
              onChange={(e) =>
                handleInputChange(e.target.value, onPresentsChange, "presents")
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="absents">Absent Days</Label>
            <Input
              id="absents"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={absents || ""}
              onChange={(e) =>
                handleInputChange(e.target.value, onAbsentsChange, "absents")
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plannedClasses">
              Planned Classes to Attend (What-if Scenario)
            </Label>
            <Input
              id="plannedClasses"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={plannedClasses || ""}
              onChange={(e) =>
                handleInputChange(
                  e.target.value,
                  setPlannedClasses,
                  "plannedClasses",
                )
              }
            />
          </div>
        </div>

        <AttendanceStats
          percentage={currentPercentage}
          totalClasses={totalClasses}
          presents={presents}
          absents={absents}
          plannedClasses={plannedClasses}
          predictedPresents={predictedPresents}
          predictedAbsents={predictedAbsents}
          predictedPercentage={predictedPercentage}
          percentageIncrease={parseFloat(percentageIncrease)}
        />
      </CardContent>
    </Card>
  );
};

export default AttendanceCard;
