import { useState, useMemo } from "react";
import { ReadingEntry } from "../types/book";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Flame, BookOpen } from "lucide-react";

interface ReadingChartProps {
  entries: ReadingEntry[];
  streak?: number;
}

type TimeScale = "week" | "month" | "year";

export function ReadingChart({ entries, streak }: ReadingChartProps) {
  const [timeScale, setTimeScale] = useState<TimeScale>("week");

  // Week View Data - Last 7 days with connected dots
  const weekData = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return last7Days.map((date, index) => {
      const dayEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });

      const totalPages = dayEntries.reduce((sum, entry) => sum + entry.pagesRead, 0);

      return {
        day: index,
        dayLabel: date.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        pages: totalPages,
      };
    });
  }, [entries]);

  // Month View Data - Last 30 days
  const monthData = useMemo(() => {
    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (29 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return last30Days.map((date, index) => {
      const dayEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });

      const totalPages = dayEntries.reduce((sum, entry) => sum + entry.pagesRead, 0);

      return {
        day: index,
        dayLabel: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: date.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
        pages: totalPages,
      };
    });
  }, [entries]);

  // Year View Data - Last 12 months
  const yearData = useMemo(() => {
    const today = new Date();
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
      return date;
    });

    return last12Months.map((monthDate, index) => {
      const monthEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.getMonth() === monthDate.getMonth() &&
          entryDate.getFullYear() === monthDate.getFullYear()
        );
      });

      const totalPages = monthEntries.reduce((sum, entry) => sum + entry.pagesRead, 0);

      return {
        month: index,
        monthLabel: monthDate.toLocaleDateString("en-US", { month: "short" }),
        fullDate: monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        pages: totalPages,
      };
    });
  }, [entries]);

  // Calculate stats based on current view
  const stats = useMemo(() => {
    let data: any[];
    let period: string;

    switch (timeScale) {
      case "week":
        data = weekData;
        period = "Week";
        break;
      case "month":
        data = monthData;
        period = "Month";
        break;
      case "year":
        data = yearData;
        period = "Year";
        break;
    }

    const totalPages = data.reduce((sum, item) => sum + item.pages, 0);
    const avgPages = Math.round(totalPages / data.length);
    const maxDay = data.reduce((max, item) => (item.pages > max.pages ? item : max), data[0]);

    return { totalPages, avgPages, maxDay, period };
  }, [timeScale, weekData, monthData, yearData]);

  // Custom tooltip with cream background and dusty blue text
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl px-4 py-3 shadow-xl border-2"
          style={{
            backgroundColor: "#F7F4EF",
            borderColor: "#89AFCB",
          }}
        >
          <p className="text-sm mb-1" style={{ color: "#6C6C6C" }}>
            {data.fullDate}
          </p>
          <p className="font-medium" style={{ color: "#5E8CA7" }}>
            {data.pages} pages
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div
      className="rounded-2xl p-8 shadow-lg border"
      style={{
        backgroundColor: "#F7F4EF",
        borderColor: "#E0D7CC",
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6" style={{ color: "#89AFCB" }} />
              <h3 style={{ color: "#2E2E2E" }}>Reading Chart</h3>
            </div>
            <p className="text-sm italic" style={{ color: "#6C6C6C" }}>
              Your pages, your progress.
            </p>
          </div>

          {/* Streak Badge */}
          {streak && streak > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                className="gap-2 px-4 py-2 text-sm rounded-full shadow-md"
                style={{
                  backgroundColor: "#89AFCB",
                  color: "#F7F4EF",
                }}
              >
                <Flame className="w-4 h-4" />
                {streak}-Day Reading Streak!
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Time scale tabs */}
        <div className="flex gap-2 justify-center">
          <Button
            variant={timeScale === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeScale("week")}
            className="rounded-full px-6"
            style={
              timeScale === "week"
                ? {
                    backgroundColor: "#89AFCB",
                    color: "#F7F4EF",
                  }
                : {
                    backgroundColor: "transparent",
                    color: "#6C6C6C",
                  }
            }
          >
            Week
          </Button>
          <Button
            variant={timeScale === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeScale("month")}
            className="rounded-full px-6"
            style={
              timeScale === "month"
                ? {
                    backgroundColor: "#89AFCB",
                    color: "#F7F4EF",
                  }
                : {
                    backgroundColor: "transparent",
                    color: "#6C6C6C",
                  }
            }
          >
            Month
          </Button>
          <Button
            variant={timeScale === "year" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeScale("year")}
            className="rounded-full px-6"
            style={
              timeScale === "year"
                ? {
                    backgroundColor: "#89AFCB",
                    color: "#F7F4EF",
                  }
                : {
                    backgroundColor: "transparent",
                    color: "#6C6C6C",
                  }
            }
          >
            Year
          </Button>
        </div>

        {/* Stats Row */}
        <div className="flex justify-center gap-8 text-sm">
          <div className="text-center">
            <div className="text-xs mb-1" style={{ color: "#6C6C6C" }}>
              This {stats.period}
            </div>
            <div className="font-medium" style={{ color: "#5E8CA7" }}>
              {stats.totalPages} pages
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs mb-1" style={{ color: "#6C6C6C" }}>
              Daily Average
            </div>
            <div className="font-medium" style={{ color: "#2E2E2E" }}>
              {stats.avgPages} pages
            </div>
          </div>
          {stats.maxDay && stats.maxDay.pages > 0 && (
            <div className="text-center">
              <div className="text-xs mb-1" style={{ color: "#6C6C6C" }}>
                Best Day
              </div>
              <div className="font-medium" style={{ color: "#2E2E2E" }}>
                {stats.maxDay.pages} pages
              </div>
            </div>
          )}
        </div>

        {/* Chart Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={timeScale}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="h-80 mt-4"
          >
            {timeScale === "week" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekData} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#EDEDED"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="dayLabel"
                    tick={{ fill: "#6C6C6C", fontSize: 12 }}
                    axisLine={{ stroke: "#EDEDED" }}
                    tickLine={{ stroke: "#EDEDED" }}
                  />
                  <YAxis
                    tick={{ fill: "#6C6C6C", fontSize: 12 }}
                    axisLine={{ stroke: "#EDEDED" }}
                    tickLine={{ stroke: "#EDEDED" }}
                    label={{
                      value: "Pages",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#6C6C6C", fontSize: 12 },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#89AFCB", strokeWidth: 1 }} />
                  <Line
                    type="natural"
                    dataKey="pages"
                    stroke="#89AFCB"
                    strokeWidth={3}
                    dot={{
                      fill: "#5E8CA7",
                      stroke: "#F7F4EF",
                      strokeWidth: 3,
                      r: 6,
                      filter: "drop-shadow(0px 2px 4px rgba(94, 140, 167, 0.3))",
                    }}
                    activeDot={{
                      fill: "#5E8CA7",
                      stroke: "#F7F4EF",
                      strokeWidth: 3,
                      r: 8,
                      filter: "drop-shadow(0px 4px 8px rgba(94, 140, 167, 0.5))",
                    }}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {timeScale === "month" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthData} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#EDEDED"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="dayLabel"
                    tick={{ fill: "#6C6C6C", fontSize: 10 }}
                    axisLine={{ stroke: "#EDEDED" }}
                    tickLine={{ stroke: "#EDEDED" }}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fill: "#6C6C6C", fontSize: 12 }}
                    axisLine={{ stroke: "#EDEDED" }}
                    tickLine={{ stroke: "#EDEDED" }}
                    label={{
                      value: "Pages",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#6C6C6C", fontSize: 12 },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#89AFCB", strokeWidth: 1 }} />
                  <Line
                    type="natural"
                    dataKey="pages"
                    stroke="#89AFCB"
                    strokeWidth={3}
                    dot={{
                      fill: "#5E8CA7",
                      stroke: "#F7F4EF",
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{
                      fill: "#5E8CA7",
                      stroke: "#F7F4EF",
                      strokeWidth: 3,
                      r: 6,
                    }}
                    animationDuration={1200}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {timeScale === "year" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearData} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#EDEDED"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fill: "#6C6C6C", fontSize: 12 }}
                    axisLine={{ stroke: "#EDEDED" }}
                    tickLine={{ stroke: "#EDEDED" }}
                  />
                  <YAxis
                    tick={{ fill: "#6C6C6C", fontSize: 12 }}
                    axisLine={{ stroke: "#EDEDED" }}
                    tickLine={{ stroke: "#EDEDED" }}
                    label={{
                      value: "Pages",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#6C6C6C", fontSize: 12 },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#89AFCB", fillOpacity: 0.1 }} />
                  <Bar
                    dataKey="pages"
                    fill="#89AFCB"
                    radius={[12, 12, 0, 0]}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {stats.totalPages === 0 && (
          <p className="text-center text-sm py-8" style={{ color: "#6C6C6C" }}>
            No reading logged for this {stats.period.toLowerCase()}. Start tracking your daily reading!
          </p>
        )}
      </div>
    </div>
  );
}
