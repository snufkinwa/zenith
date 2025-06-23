import React, { useMemo, useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

const client = generateClient<Schema>();

interface DayActivity {
  date: Date;
  count: number;
}

interface ActivityHeatmapProps {
  userId?: string; // Pass user ID to fetch their specific activity
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ userId }) => {
  const [activityData, setActivityData] = useState<DayActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate empty year structure (365 days)
  const generateEmptyYearData = (): DayActivity[] => {
    const today = new Date();
    const start = new Date(today);
    start.setFullYear(today.getFullYear() - 1);

    const data: DayActivity[] = [];
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      data.push({
        date: new Date(d),
        count: 0, // Start with 0, will be filled with real data
      });
    }
    return data;
  };

  // Fetch real activity data from Amplify
  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        if (!userId) {
          // No user, show empty heatmap
          setActivityData(generateEmptyYearData());
          setLoading(false);
          return;
        }

        // Get user's ZenithSessions from last year
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const oneYearAgoTimestamp = Math.floor(oneYearAgo.getTime() / 1000);

        const { data: sessions, errors } =
          await client.models.ZenithSession.list({
            filter: {
              userId: { eq: userId },
              lastUpdated: { ge: oneYearAgoTimestamp },
            },
            limit: 1000, // Adjust based on your needs
          });

        if (errors) {
          console.error('Error fetching sessions:', errors);
          setActivityData(generateEmptyYearData());
          setLoading(false);
          return;
        }

        let realData: DayActivity[] = generateEmptyYearData();

        if (sessions && sessions.length > 0) {
          // Count sessions per day
          const dateCounts: { [key: string]: number } = {};

          sessions.forEach((session) => {
            if (session.lastUpdated) {
              // Convert timestamp to date
              const sessionDate = new Date(session.lastUpdated * 1000);
              const dateKey = sessionDate.toDateString();

              // Only count completed/solved sessions
              if (session.status === 'completed' || session.finalAnswer) {
                dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
              }
            }
          });

          // Update real data with counts
          realData = realData.map((day) => ({
            ...day,
            count: dateCounts[day.date.toDateString()] || 0,
          }));
        }

        setActivityData(realData);
      } catch (error) {
        console.error('Error fetching activity data:', error);
        setActivityData(generateEmptyYearData());
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [userId]);

  // Add demo data if no real data (for testing)
  useEffect(() => {
    if (!loading && userId && activityData.every((day) => day.count === 0)) {
      // Add some demo activity for the last 30 days for testing
      const demoData = [...activityData];
      const today = new Date();

      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dayIndex = demoData.findIndex(
          (day) => day.date.toDateString() === date.toDateString(),
        );

        if (dayIndex !== -1 && Math.random() > 0.5) {
          demoData[dayIndex].count = Math.floor(Math.random() * 4) + 1;
        }
      }

      setActivityData(demoData);
    }
  }, [loading, userId, activityData]);

  const colorForCount = (count: number) => {
    const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
    return colors[Math.min(count, colors.length - 1)];
  };

  const groupByWeek = (days: DayActivity[]): DayActivity[][] => {
    if (days.length === 0) return [];

    const startOfFirstWeek = new Date(days[0].date);
    startOfFirstWeek.setDate(
      startOfFirstWeek.getDate() - startOfFirstWeek.getDay(),
    );

    const end = days[days.length - 1].date;
    const weeks: DayActivity[][] = [];
    let week: DayActivity[] = [];

    for (
      let d = new Date(startOfFirstWeek);
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      const found = days.find(
        (day) => day.date.toDateString() === d.toDateString(),
      );
      week.push(found || { date: new Date(d), count: 0 });

      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length) {
      while (week.length < 7) {
        week.push({ date: new Date(week[0].date), count: 0 });
      }
      weeks.push(week);
    }

    return weeks;
  };

  const weeks = useMemo(() => groupByWeek(activityData), [activityData]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; span: number }[] = [];
    let currentMonth = '';
    let span = 0;

    weeks.forEach((week, idx) => {
      const month = week[0].date.toLocaleString('default', { month: 'short' });
      if (month !== currentMonth) {
        if (currentMonth && span > 0) {
          labels.push({ label: currentMonth, span });
        }
        currentMonth = month;
        span = 1;
      } else {
        span++;
      }
    });

    if (currentMonth && span > 0) {
      labels.push({ label: currentMonth, span });
    }

    return labels;
  }, [weeks]);

  // Calculate total activity for stats
  const totalActivity = useMemo(() => {
    return activityData.reduce((sum, day) => sum + day.count, 0);
  }, [activityData]);

  const longestStreak = useMemo(() => {
    let maxStreak = 0;
    let currentStreak = 0;

    for (let i = activityData.length - 1; i >= 0; i--) {
      if (activityData[i].count > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  }, [activityData]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <div className="text-sm text-gray-500">Loading activity...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-center p-2">
      {/* Stats */}
      <div className="mb-4 flex justify-between text-sm text-gray-600">
        <span>{totalActivity} problems solved this year</span>
        <span>Longest streak: {longestStreak} days</span>
      </div>

      {/* Month labels */}
      <div className="mb-2 flex pl-10">
        {monthLabels.map((month, idx) => (
          <div
            key={idx}
            className="text-center text-xs text-gray-500"
            style={{ width: `${month.span * 12}px` }}
          >
            {month.label}
          </div>
        ))}
      </div>

      {/* Main heatmap */}
      <div className="flex items-center">
        {/* Day labels */}
        <div className="mr-2 flex h-20 flex-col justify-between text-xs text-gray-500">
          <span className="leading-none">Mon</span>
          <span className="leading-none">Wed</span>
          <span className="leading-none">Fri</span>
        </div>

        {/* Heatmap grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-1" style={{ minWidth: 'max-content' }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className="h-2.5 w-2.5 cursor-pointer rounded-sm transition-all hover:scale-110 hover:ring-1 hover:ring-gray-400"
                    style={{ backgroundColor: colorForCount(day.count) }}
                    title={`${day.date.toLocaleDateString()}: ${day.count} problems solved`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: colorForCount(level) }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
