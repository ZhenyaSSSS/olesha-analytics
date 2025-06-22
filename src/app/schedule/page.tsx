'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HeroNav } from '@/components/HeroNav';
import scheduleData from '@/data/future_streams_schedule.json';
import {
  format,
  parseISO,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  getMonth,
  getYear,
  setMonth,
  startOfYear,
  add,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Clock,
  Users,
  UserPlus,
  Gamepad2,
  Twitch,
  AlertTriangle,
  Moon,
  CalendarClock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- TYPE DEFINITIONS ---
interface Stream {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  game: string;
  predicted_avg_viewers: number;
  predicted_peak_viewers: number;
  predicted_followers_gain: number;
  is_night_stream: boolean;
  is_weekend: boolean;
  weekday_ru: string;
  season: string;
}

interface Day {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  stream: Stream | null;
}

interface Month {
  year: number;
  month: number;
  days: (Day | null)[];
}

// --- DATA PROCESSING ---
const streamsByDate: Map<string, Stream> = new Map(
  scheduleData.map((stream: any) => [format(parseISO(stream.date), 'yyyy-MM-dd'), stream])
);

const getViewerColor = (viewers: number) => {
  if (viewers > 2200) return 'bg-red-500/80 hover:bg-red-400/80 border-red-400';
  if (viewers > 2000) return 'bg-orange-500/80 hover:bg-orange-400/80 border-orange-400';
  if (viewers > 1800) return 'bg-yellow-500/80 hover:bg-yellow-400/80 border-yellow-400';
  if (viewers > 1600) return 'bg-lime-500/80 hover:bg-lime-400/80 border-lime-400';
  return 'bg-green-500/80 hover:bg-green-400/80 border-green-400';
};

const generateCalendarData = (startDate: Date, monthsToShow: number): Month[] => {
  const months: Month[] = [];
  let currentDate = startDate;

  for (let i = 0; i < monthsToShow; i++) {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start, end });

    let dayOfWeek = getDay(start);
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
    const emptyDays = Array(dayOfWeek).fill(null);

    months.push({
      year: getYear(currentDate),
      month: getMonth(currentDate),
      days: [
        ...emptyDays,
        ...daysInMonth.map(date => {
          const dateString = format(date, 'yyyy-MM-dd');
          return {
            date,
            isCurrentMonth: true,
            isToday: isSameDay(date, new Date()),
            stream: streamsByDate.get(dateString) || null,
          };
        }),
      ],
    });
    currentDate = add(currentDate, { months: 1 });
  }
  return months;
};

// --- SUB-COMPONENTS ---

const StreamDetails = ({ selectedDay, onClose }: { selectedDay: Day | null; onClose: () => void; }) => {
  if (!selectedDay) return null;

  const { stream } = selectedDay;
  const capitalize = (s: string) => (s && s.charAt(0).toUpperCase() + s.slice(1)) || '';

  return (
    <Sheet open={!!selectedDay} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-zinc-950/95 border-zinc-800 text-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl text-white">
            {stream
              ? `Прогноз на ${format(selectedDay.date, 'dd MMMM yyyy г.', { locale: ru })}`
              : 'Нет стрима'}
          </SheetTitle>
          <SheetDescription className="text-zinc-400">
            {stream
              ? `${capitalize(format(selectedDay.date, 'EEEE', { locale: ru }))}, ${stream.season}`
              : 'В этот день стрим не запланирован. Может, отдохнем?'}
          </SheetDescription>
        </SheetHeader>
        {stream ? (
          <div className="space-y-6 py-6">
            <div className="flex items-center p-4 rounded-lg bg-zinc-900 border border-zinc-700 shadow-md">
              <Gamepad2 className="w-8 h-8 mr-4 text-primary shrink-0" />
              <div>
                <p className="font-bold text-xl">{stream.game}</p>
                <p className="text-sm text-zinc-400">Основная категория стрима</p>
              </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-zinc-400 px-1">Особенности стрима</h3>
                <div className="flex flex-wrap gap-2">
                    {stream.is_night_stream && (
                        <div className="flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full px-3 py-1 text-xs font-medium">
                            <Moon className="h-4 w-4" />
                            Ночной стрим
                        </div>
                    )}
                    {stream.is_weekend && (
                         <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-3 py-1 text-xs font-medium">
                            <CalendarClock className="h-4 w-4" />
                            Выходной день
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
                <Clock className="w-6 h-6 mb-2 text-zinc-400" />
                <p className="font-semibold">{stream.start_time} - {stream.end_time}</p>
                <p className="text-xs text-zinc-500">(~{stream.duration_hours.toFixed(1)} ч.)</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
                <Users className="w-6 h-6 mb-2 text-zinc-400" />
                <p className="font-semibold">~{stream.predicted_avg_viewers}</p>
                 <p className="text-xs text-zinc-500">зрителей</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
                <UserPlus className="w-6 h-6 mb-2 text-zinc-400" />
                <p className="font-semibold">~{stream.predicted_followers_gain}</p>
                 <p className="text-xs text-zinc-500">фолловеров</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
                <Twitch className="w-6 h-6 mb-2 text-zinc-400" />
                <p className="font-semibold">~{stream.predicted_peak_viewers}</p>
                 <p className="text-xs text-zinc-500">в пике</p>
              </div>
            </div>
            
            <div className="text-xs text-center text-zinc-500 pt-4">
              <AlertTriangle className="inline w-4 h-4 mr-1" />
              Все данные являются результатом работы нейросети и могут быть неточными.
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <img src="/images/pepe-hands.png" alt="No streams" className="w-32 h-32 mb-4" onError={(e) => e.currentTarget.src = 'https://static-cdn.jtvnw.net/emoticons/v2/115488/default/dark/3.0'}/>
            <p className="text-2xl font-bold text-zinc-300">No streams :(</p>
            <p className="text-zinc-500">Время косплеить работягу.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};


// --- MAIN PAGE COMPONENT ---
export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [months, setMonths] = useState<Month[]>([]);
  const [visibleDate, setVisibleDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (!scheduleData || scheduleData.length === 0) {
      console.error('Schedule data is empty or not loaded!');
      setLoading(false);
      return;
    }

    const scheduleStartDate = parseISO(scheduleData[0].date);
    const startDate = startOfMonth(scheduleStartDate);
    const endDate = parseISO(scheduleData[scheduleData.length - 1].date);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date parsed from schedule data.');
        setLoading(false);
        return;
    }

    const monthsToShow = (getYear(endDate) - getYear(startDate)) * 12 + getMonth(endDate) - getMonth(startDate) + 1;
    const generatedMonths = generateCalendarData(startDate, monthsToShow);
    
    setMonths(generatedMonths);
    setVisibleDate(scheduleStartDate);
    setLoading(false);
  }, []);

  const uniqueYears = useMemo(() => [...new Set(months.map(m => m.year))].sort((a,b) => a - b), [months]);
  const monthsInYear = (year: number) => [...new Set(months.filter(m => m.year === year).map(m => m.month))].sort((a,b) => a-b);
  
  const handleYearChange = (yearStr: string) => {
    const year = parseInt(yearStr, 10);
    const firstMonthOfYearWithStreams = months.find(m => m.year === year);
    if(firstMonthOfYearWithStreams) {
        const newDate = new Date(year, firstMonthOfYearWithStreams.month);
        document.getElementById(`month-${year}-${firstMonthOfYearWithStreams.month}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setVisibleDate(newDate);
    }
  };
  
  const handleMonthChange = (monthStr: string) => {
      const month = parseInt(monthStr, 10);
      const year = getYear(visibleDate);
      document.getElementById(`month-${year}-${month}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setVisibleDate(setMonth(visibleDate, month));
  };


  return (
    <>
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/20 sticky top-0 z-20 backdrop-blur-md">
        <div className="container pt-6 pb-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
             Прогноз стримов
          </h1>
           <p className="mt-4 text-base text-muted-foreground max-w-3xl mx-auto">
            Интерактивный календарь стримов, рассчитанный на ближайшие 5&nbsp;лет.
          </p>
          <button onClick={() => setShowIntro(!showIntro)} className="mt-4 text-xs text-primary underline hover:text-primary/80">
            {showIntro ? 'Скрыть описание' : 'Показать описание'}
          </button>
          {showIntro && (
          <div className="mt-6 text-sm text-zinc-400 mx-auto w-full max-w-7xl px-8 leading-relaxed grid grid-cols-1 md:grid-cols-3 gap-10 text-center place-items-center">
            <p className="space-y-2">
               <span>
                 В&nbsp;основе прогноза — <strong>ансамбль моделей</strong>. Каждая отвечала за&nbsp;свой параметр: средний онлайн, пиковый, продолжительность, игры и&nbsp;т.&nbsp;д.
               </span>
               <br />
               <span>
                 На&nbsp;обучение ушли почти сутки на&nbsp;Ryzen&nbsp;9&nbsp;9950X.
               </span>
             </p>
            <p className="space-y-2">
               <span>
                 <em>Это не «пророчество»</em>: алгоритм не&nbsp;видит будущее, а&nbsp;лишь <strong>эмулирует вероятный сценарий</strong> по&nbsp;историческим данным.
               </span>
               <br />
               <span>
                 Особенно трудно угадать будущие <strong>игры</strong>: модель знает лишь то, что уже было. Новые релизы ещё не&nbsp;существуют в&nbsp;данных, поэтому алгоритм подставляет самые близкие аналоги из&nbsp;прошлых стримов.
               </span>
             </p>
            <p className="space-y-2">
               <span>
                 Кликните на&nbsp;день, чтобы открыть детали справа.
               </span>
               <br />
               <span>
                 Цвет плитки показывает ожидаемую популярность: зелёный&nbsp;— выше среднего, красный&nbsp;— близко к&nbsp;рекорду.
               </span>
             </p>
          </div>
          )}
        </div>
        <div className="container">
          <div className="border-t border-zinc-800">
             <HeroNav />
          </div>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="container mx-auto p-4 md:p-8">
        {loading ? (
           <p className="text-center text-white">Загрузка календаря...</p>
        ) : (
          <div className="space-y-12">
            {months.map(({ year, month, days }) => (
              <div key={`${year}-${month}`} id={`month-${year}-${month}`}>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-6 sticky bg-zinc-950/90 backdrop-blur-sm py-2 px-4 rounded-lg" style={{ top: showIntro ? 440 : 240 }}>
                  {format(new Date(year, month), 'LLLL yyyy', { locale: ru })}
                </h2>
                <div className="grid grid-cols-7 gap-1">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-zinc-400 pb-2">
                      {day}
                    </div>
                  ))}
                  {days.map((day, index) =>
                    day ? (
                      <button
                        key={day.date.toISOString()}
                        onClick={() => setSelectedDay(day)}
                        className={cn(
                          'h-28 rounded-md border text-left p-2 transition-all duration-200 flex flex-col',
                          day.stream
                            ? `${getViewerColor(day.stream.predicted_avg_viewers)} text-white`
                            : 'bg-zinc-900 hover:bg-zinc-800/60 border-zinc-800',
                          { 'border-blue-500 ring-2 ring-blue-500': day.isToday }
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <time dateTime={format(day.date, 'yyyy-MM-dd')} className="font-semibold">
                            {format(day.date, 'd')}
                          </time>
                          {day.stream?.is_night_stream && (
                            <Moon className="h-3.5 w-3.5 text-white/60" />
                          )}
                        </div>
                        {day.stream && (
                          <div className="mt-auto text-xs font-medium">
                            {(() => {
                               const games = day.stream.game.split(',').map(g => g.trim());
                               const display = games.length > 4 ? games.slice(0, 4).join(', ') + '…' : games.join(', ');
                               return <p className="font-semibold" title={day.stream.game}>{display}</p>;
                            })()}
                            <p className="opacity-80">{day.stream.start_time}</p>
                          </div>
                        )}
                      </button>
                    ) : (
                      <div key={index} />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Quick Jump (Bottom) */}
      <div className="sticky bottom-0 z-30 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-center space-x-4 p-3">
            <span className="text-sm font-medium text-white">Быстрый переход:</span>
            <Select onValueChange={handleYearChange} value={getYear(visibleDate).toString()}>
                <SelectTrigger className="w-[120px] bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Год" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select onValueChange={handleMonthChange} value={getMonth(visibleDate).toString()}>
                 <SelectTrigger className="w-[160px] bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Месяц" />
                </SelectTrigger>
                <SelectContent>
                    {monthsInYear(getYear(visibleDate)).map(month => (
                        <SelectItem key={month} value={month.toString()}>
                            {format(new Date(getYear(visibleDate), month), 'LLLL', { locale: ru })}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* Details Sheet */}
      <StreamDetails selectedDay={selectedDay} onClose={() => setSelectedDay(null)} />
    </>
  );
} 