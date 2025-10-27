import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { ReadingEntry } from "../types/book";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Flame } from "lucide-react";

interface ReadingProgressChartProps {
  entries: ReadingEntry[];
  streak?: number;
}

type TimeScale = "week" | "month" | "year";

export function ReadingProgressChart({ entries, streak }: ReadingProgressChartProps) {
  const [timeScale, setTimeScale] = useState<TimeScale>("week");

  // Week View Data - Dot plot for last 7 days
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
        // Size for scatter plot (min 40, max 800 for better visibility)
        size: totalPages === 0 ? 40 : Math.min(800, 40 + totalPages * 12),
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-foreground mb-1">
            {data.fullDate}
          </p>
          <p className="text-primary">
            <span className="font-medium">{data.pages}</span> pages
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header with tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="mb-1">Reading Progress</h3>
            <p className="text-muted-foreground text-sm">Track your daily reading journey</p>
          </div>

          {/* Time scale tabs */}
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            <Button
              variant={timeScale === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeScale("week")}
              className="relative"
            >
              Week
              {timeScale === "week" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-md -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Button>
            <Button
              variant={timeScale === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeScale("month")}
              className="relative"
            >
              Month
              {timeScale === "month" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-md -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Button>
            <Button
              variant={timeScale === "year" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeScale("year")}
              className="relative"
            >
              Year
              {timeScale === "year" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-md -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-6 text-sm">
          <div>
            <div className="text-muted-foreground mb-1">This {stats.period}</div>
            <div className="text-primary">{stats.totalPages} pages</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Daily Average</div>
            <div className="text-foreground">{stats.avgPages} pages</div>
          </div>
          {stats.maxDay && stats.maxDay.pages > 0 && (
            <div>
              <div className="text-muted-foreground mb-1">Best Day</div>
              <div className="text-foreground">{stats.maxDay.pages} pages</div>
            </div>
          )}
          {streak && streak > 0 && (
            <div>
              <div className="text-muted-foreground mb-1">Current Streak</div>
              <div className="text-foreground flex items-center gap-1">
                <Flame className="w-4 h-4 text-red-500" />
                {streak} days
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
            transition={{ duration: 0.3 }}
            className="h-80"
          >
            {timeScale === "week" && (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="day"
                    type="number"
                    domain={[0, 6]}
                    ticks={[0, 1, 2, 3, 4, 5, 6]}
                    tickFormatter={(value) => weekData[value]?.dayLabel || ""}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    dataKey="pages"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    label={{
                      value: "Pages",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Line
                    type="monotone"
                    dataKey="pages"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Scatter data={weekData} fill="hsl(var(--primary))">
                    {weekData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.pages > 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                        fillOpacity={entry.pages > 0 ? 0.9 : 0.3}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            )}

            {timeScale === "month" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="dayLabel"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    label={{
                      value: "Pages",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="pages"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {timeScale === "year" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    label={{
                      value: "Pages",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="pages"
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {stats.totalPages === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No reading logged for this {stats.period.toLowerCase()}. Start tracking your daily reading!
          </p>
        )}
      </div>
    </Card>
  );
}