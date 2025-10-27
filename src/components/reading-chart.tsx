import { useMemo } from "react";
import { Card } from "./ui/card";
import { ReadingEntry } from "../types/book";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ReadingChartProps {
  entries: ReadingEntry[];
}

export function ReadingChart({ entries }: ReadingChartProps) {
  const weeklyData = useMemo(() => {
    // Get the last 7 days
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    // Create data for each day
    return last7Days.map((date) => {
      const dayEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });

      const totalPages = dayEntries.reduce((sum, entry) => sum + entry.pagesRead, 0);

      return {
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        pages: totalPages,
      };
    });
  }, [entries]);

  const totalWeekPages = weeklyData.reduce((sum, day) => sum + day.pages, 0);
  const avgPages = Math.round(totalWeekPages / 7);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3>Weekly Reading Progress</h3>
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-muted-foreground">This Week</div>
              <div>{totalWeekPages} pages</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground">Daily Avg</div>
              <div>{avgPages} pages</div>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                label={{
                  value: "Pages",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "hsl(var(--muted-foreground))" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number, name: string) => {
                  return [value + " pages", "Read"];
                }}
                labelFormatter={(label, payload) => {
                  return payload[0]?.payload?.fullDate || label;
                }}
              />
              <Bar
                dataKey="pages"
                fill="hsl(var(--primary))"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {totalWeekPages === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No reading logged this week. Start tracking your daily reading!
          </p>
        )}
      </div>
    </Card>
  );
}
