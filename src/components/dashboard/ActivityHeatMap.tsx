import React, { useMemo } from 'react';

interface DayActivity {
  date: Date;
  count: number;
}

const generateYearData = (): DayActivity[] => {
  const today = new Date();
  const start = new Date(today);
  start.setFullYear(today.getFullYear() - 1);
  
  const data: DayActivity[] = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    data.push({ 
      date: new Date(d), 
      count: Math.floor(Math.random() * 5) 
    });
  }
  return data;
};

const colorForCount = (count: number) => {
  const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
  return colors[Math.min(count, colors.length - 1)];
};

const groupByWeek = (days: DayActivity[]): DayActivity[][] => {
  if (days.length === 0) return [];
  
  const startOfFirstWeek = new Date(days[0].date);
  startOfFirstWeek.setDate(startOfFirstWeek.getDate() - startOfFirstWeek.getDay());
  
  const end = days[days.length - 1].date;
  const weeks: DayActivity[][] = [];
  let week: DayActivity[] = [];
  
  for (let d = new Date(startOfFirstWeek); d <= end; d.setDate(d.getDate() + 1)) {
    const found = days.find(day => day.date.toDateString() === d.toDateString());
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

const ActivityHeatmap: React.FC = () => {
  const weeks = useMemo(() => groupByWeek(generateYearData()), []);
  
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

  return (
    <div className="w-full h-full flex flex-col justify-center p-2">
      {/* Month labels */}
      <div className="flex mb-2 pl-10">
        {monthLabels.map((month, idx) => (
          <div 
            key={idx} 
            className="text-xs text-gray-500 text-center"
            style={{ width: `${(month.span * 12)}px` }}
          >
            {month.label}
          </div>
        ))}
      </div>
      
      {/* Main heatmap */}
      <div className="flex items-center">
        {/* Day labels */}
        <div className="flex flex-col justify-between h-20 mr-2 text-xs text-gray-500">
          <span className="leading-none">Mon</span>
          <span className="leading-none">Wed</span>
          <span className="leading-none">Fri</span>
        </div>
        
        {/* Heatmap grid */}
        <div className="flex-1 overflow-x-hidden">
          <div className="flex gap-1 w-full">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className="w-2.5 h-2.5 rounded-sm cursor-pointer hover:ring-1 hover:ring-gray-400 transition-all"
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
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className="w-2.5 h-2.5 rounded-sm"
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