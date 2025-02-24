import React from "react";
import { Calendar as CalendarUI } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
} from "date-fns";

interface CalendarProps {
  onDateSelect?: (date: Date, classes: number) => void;
  markedDates?: Record<string, { numClasses: number }>;
}

const Calendar = ({
  onDateSelect = () => {},
  markedDates = {},
}: CalendarProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [numClasses, setNumClasses] = React.useState(1);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const calculateTotalClasses = (dates: Date[]) => {
    return dates.reduce((total, date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return total + (markedDates[dateStr]?.numClasses || 0);
    }, 0);
  };

  const getWeeklyClasses = (date: Date = new Date()) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    const weekDates = eachDayOfInterval({ start, end });
    return calculateTotalClasses(weekDates);
  };

  const getMonthlyClasses = (date: Date = new Date()) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const monthDates = eachDayOfInterval({ start, end });
    return calculateTotalClasses(monthDates);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsDialogOpen(true);
    }
  };

  const handleSave = () => {
    if (selectedDate) {
      onDateSelect(selectedDate, numClasses);
      setIsDialogOpen(false);
    }
  };

  const weeklyTotal = selectedDate
    ? getWeeklyClasses(selectedDate)
    : getWeeklyClasses(new Date());
  const monthlyTotal = selectedDate
    ? getMonthlyClasses(selectedDate)
    : getMonthlyClasses(new Date());

  return (
    <Card className="w-full min-w-[320px] max-w-[480px] bg-white">
      <CardHeader>
        <CardTitle>Class Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <div className="flex-1">
            <CalendarUI
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
            />
          </div>
          <div className="w-32 space-y-6 pt-2">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-1">Weekly</p>
              <p className="text-3xl font-bold text-gray-900">{weeklyTotal}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly</p>
              <p className="text-3xl font-bold text-gray-900">{monthlyTotal}</p>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Classes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Number of Classes</Label>
                <Input
                  type="number"
                  min="0"
                  value={numClasses}
                  onChange={(e) => setNumClasses(parseInt(e.target.value) || 0)}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default Calendar;
