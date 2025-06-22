'use client';

import Image from 'next/image';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, Maximize, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { InfoCard } from './InfoCard';

const FadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
    },
  },
});

const Background = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const gradientX = useTransform(mouseX, [0, 1], ['0%', '100%']);
  const gradientY = useTransform(mouseY, [0, 1], ['0%', '100%']);

  return (
    <motion.div
      className="fixed inset-0 -z-10"
      onMouseMove={(e) => {
        mouseX.set(e.clientX / window.innerWidth);
        mouseY.set(e.clientY / window.innerHeight);
      }}
    >
      <div
        className="absolute inset-0 bg-zinc-950"
        style={{
          backgroundImage: `radial-gradient(at ${gradientX.get()} ${gradientY.get()}, rgba(255, 255, 255, 0.05) 0px, transparent 50%)`,
        }}
      />
    </motion.div>
  );
};

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
  <motion.li className="flex items-start" variants={FadeIn(0.4)}>
    <CheckCircle className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" />
    <span>{children}</span>
  </motion.li>
);

const InsightSection = ({
  title,
  description,
  imgSrc,
  imgAlt,
  children,
  reverse = false,
}: {
  title: string;
  description: React.ReactNode;
  imgSrc?: string;
  imgAlt?: string;
  children?: React.ReactNode;
  reverse?: boolean;
}) => (
  <motion.section
    className="min-h-[80vh] w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={FadeIn()}
  >
    <motion.div className={cn('md:col-span-5 space-y-6', reverse && 'md:order-2')} variants={FadeIn()}>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tighter" dangerouslySetInnerHTML={{ __html: title }} />
      <div className="text-lg text-muted-foreground space-y-5 leading-relaxed">{description}</div>
    </motion.div>
    <motion.div
      className={cn('md:col-span-7 relative w-full aspect-video rounded-xl overflow-hidden group', reverse && 'md:order-1')}
      variants={FadeIn(0.2)}
    >
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer w-full h-full">
            {imgSrc && imgAlt && (
              <Image
                src={imgSrc}
                alt={imgAlt}
                fill
                className="object-contain bg-zinc-900/50 p-4 rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-primary/20 group-hover:shadow-2xl group-hover:scale-[1.01]"
              />
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2">
              <Maximize className="w-12 h-12 text-white/70 animate-pulse" />
              <span className="text-white/70 text-lg">Увеличить</span>
            </div>
            {children}
          </div>
        </DialogTrigger>
        <DialogContent
          className="bg-black/80 backdrop-blur-2xl border-zinc-800 p-1 overflow-hidden"
          style={{ width: '95vw', height: '90vh', maxWidth: '95vw' }}
        >
          <DialogTitle className="sr-only">{imgAlt}</DialogTitle>
          <DialogDescription className="sr-only">
            Увеличенное изображение: {imgAlt}. Вы можете использовать колесико мыши для масштабирования и зажимать левую кнопку для перемещения.
          </DialogDescription>
          {imgSrc && imgAlt && (
            <TransformWrapper
              centerOnInit
              limitToBounds={true}
              doubleClick={{ disabled: true }}
            >
              <TransformComponent
                wrapperStyle={{ width: '100%', height: '100%' }}
                contentStyle={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={imgSrc}
                  alt={imgAlt}
                  width={1920}
                  height={1080}
                  className="w-auto h-auto max-w-full max-h-full object-contain"
                />
              </TransformComponent>
            </TransformWrapper>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  </motion.section>
);

export function Insights() {
  return (
    <div className="relative w-full max-w-7xl space-y-16 py-16 px-4 mx-auto pt-8">
      <Background />

      <InfoCard title="Интерактивные графики">
        <p>
          Все графики на этой странице — интерактивны. Нажмите на любой из них, чтобы открыть увеличенную версию, которую можно масштабировать и перемещать для детального изучения.
        </p>
      </InfoCard>

      <InsightSection
        title="Расписание: <br/>предсказуемый дневной пик"
        description={
          <p>
            Большинство стримов (<strong className="text-primary">91.6%</strong>) начинаются днем, с пиком около <strong className="text-primary">12:30</strong>. Ночные стримы — редкость, что говорит о стабильном графике. На графике показано распределение времени начала всех стримов.
          </p>
        }
        imgSrc="/images/olesha_analysis_basic.png"
        imgAlt="Распределение времени начала"
      />

      <InsightSection
        title="Стабильность и циклические сбои"
        description={
          <ul className="space-y-4">
            <FeatureListItem>
              <b>Период стабильности:</b> С 6 января по 18 марта 2023 года стримы начинались почти в одно и то же время, около <strong className="text-primary">12:40</strong>. Вы можете увидеть этот плотный кластер на графике.
            </FeatureListItem>
            <FeatureListItem>
              <b>Циклические сбои:</b> Примерно раз в месяц (каждые <strong className="text-primary">23-30</strong> стримов) происходят резкие сдвиги во времени начала. Это указывает на наличие определенного ритма в &quot;хаосе&quot;.
            </FeatureListItem>
          </ul>
        }
        imgSrc="/images/timeline_streams_beautiful.png"
        imgAlt="Карта всех стримов"
        reverse
      />

      <InsightSection
        title="Анализ сбоев режима"
        description="На этом графике показаны все отклонения времени начала стримов от среднего значения. Красные треугольники — это 'крупные нарушения', когда стрим начинался на 6 и более часов позже или раньше обычного. Видно, что такие сбои происходят регулярно, но без очевидной сезонности, в то время как 'обычные' сдвиги (желтая линия) имеют свои циклы."
        imgSrc="/images/schedule_disruption_beautiful.png"
        imgAlt="Сдвиги времени начала стримов"
      />

      <InfoCard title="Что такое 'Корреляция'?">
        <p>
          Это показатель того, как два параметра связаны друг с другом. Коэффициент <strong className="text-primary">0.83</strong> (как у длительности стрима и времени просмотра) означает очень сильную связь: когда один растет, почти всегда растет и другой. Это помогает понять, какие рычаги сильнее всего влияют на результат.
        </p>
      </InfoCard>

      <InsightSection
        title="Ключевые факторы роста"
        description={
          <ul className="space-y-6">
            <FeatureListItem>
              <b>Длительность — главный драйвер.</b> Сильная положительная корреляция с общим временем просмотра (коэффициент <strong className="text-primary">0.83</strong>) и приростом подписчиков (<strong className="text-primary">0.64</strong>). Проще говоря, чем дольше стрим, тем больше его смотрят.
            </FeatureListItem>
            <FeatureListItem>
              <b>Время начала имеет значение.</b> Небольшая, но заметная отрицательная корреляция (<strong className="text-primary">-0.3</strong>) между временем начала и средним числом зрителей. Это значит, что более ранние стримы (ближе к полудню) как правило привлекают немного больше зрителей.
            </FeatureListItem>
          </ul>
        }
        imgSrc="/images/correlation_heatmap.png"
        imgAlt="Тепловая карта корреляций"
      />

      <InsightSection
        title="Магия выходных и сезонность"
        description={
          <ul className="space-y-6">
            <FeatureListItem>
              <b>Магия выходных.</b> Выходные дни стабильно собирают больше зрителей, в то время как понедельник — самый слабый день. Ранние стримы (<strong className="text-primary">11:00-13:00</strong>) также привлекают больше зрителей.
            </FeatureListItem>
            <FeatureListItem>
              <b>Сезонность.</b> Пик зрительской активности приходится на август, а спад — на апрель. Разница в среднем количестве зрителей между этими месяцами составляет <strong className="text-primary">32.5%</strong>.
            </FeatureListItem>
          </ul>
        }
        imgSrc="/images/avg_viewers_by_day.png"
        imgAlt="Среднее количество зрителей по дням недели"
        reverse={true}
      />

      <InsightSection
        title="Общая картина: дашборд статистики"
        description="Этот дашборд объединяет несколько ключевых метрик: от динамики зрителей до распределения длительности. Он наглядно показывает, что категория Just Chatting доминирует, являясь частью практически каждого стрима. При этом разница в среднем количестве зрителей между играми и 'болтовней' статистически незначима (всего 1.2%), что подчеркивает важность самой личности стримера, а не только контента."
        imgSrc="/images/viewer_stats_dashboard.png"
        imgAlt="Полная статистика стримов OLESHA"
        reverse
      />

      <InfoCard title="Что такое 'Кластеры'?">
        <p>
          Кластерный анализ автоматически находит группы похожих стримов (например, &quot;короткие будничные&quot; или &quot;длинные выходные&quot;), помогая увидеть скрытую структуру в вашем контенте и понять, какие &quot;форматы&quot; у вас есть.
        </p>
      </InfoCard>

      <InsightSection
        title="Четыре архетипа стримов"
        description={
          <>
            <motion.p variants={FadeIn(0.2)}>
              Анализ выделил 4 основных &quot;архетипа&quot; стримов на основе их характеристик. Это показывает, что у канала есть четкая структура: регулярные стримы для поддержания активности, стримы выходного дня для максимального онлайна и редкие марафоны для роста аудитории.
            </motion.p>
            <motion.ul variants={FadeIn(0.4)} className="space-y-4 text-base">
              <FeatureListItem>
                <span className="inline-block align-middle w-3 h-3 rounded-full bg-cyan-400 mr-2" />
                <b>&quot;Стандартные будничные&quot; (Сине-голубой, 484 стрима):</b> Основа канала. Проходят в будни, длятся в среднем <strong className="text-primary">5.5 часов</strong>, собирают стабильную, но базовую аудиторию (<strong className="text-primary">~1300</strong> зрителей).
              </FeatureListItem>
              <FeatureListItem>
                <span className="inline-block align-middle w-3 h-3 rounded-full bg-yellow-400 mr-2" />
                <b>&quot;Прайм-тайм выходного дня&quot; (Желтый, 326 стримов):</b> Самые популярные. Проходят в выходные, длятся дольше (<strong className="text-primary">~6.5 часов</strong>) и привлекают наибольшее количество зрителей (<strong className="text-primary">~1830</strong>).
              </FeatureListItem>
              <FeatureListItem>
                <span className="inline-block align-middle w-3 h-3 rounded-full bg-purple-800 mr-2" />
                <b>&quot;Длинные марафоны&quot; (Темно-фиолетовый, 124 стрима):</b> Редкие, но очень длинные (<strong className="text-primary">11+ часов</strong>). Не всегда собирают пиковый онлайн, но очень эффективно привлекают новых подписчиков (в среднем <strong className="text-primary">+220</strong> за стрим).
              </FeatureListItem>
              <FeatureListItem>
                <b>&quot;Аномальный рост&quot; (1 стрим):</b> Уникальный стрим с аномально высоким приростом подписчиков (<strong className="text-primary">&gt;5000</strong>), выделенный алгоритмом как статистический выброс.
              </FeatureListItem>
            </motion.ul>
          </>
        }
        imgSrc="/images/stream_clusters.png"
        imgAlt="Кластеры стримов"
      />
      <InfoCard title="Что такое 'Статистический выброс'?">
        <p>Это значение, которое сильно отличается от остальных в наборе данных. В нашем случае, это стрим с аномально высоким приростом подписчиков, который не вписывается в общую картину. Такие выбросы часто указывают на уникальные, очень успешные события, которые стоит изучить отдельно.</p>
      </InfoCard>

        
      <InfoCard title="Как работает прогноз?">
        <p>
          Эти графики — не просто предположения. Они построены с помощью математических моделей (SARIMA), которые анализируют исторические данные, находят в них закономерности (такие как тренды и сезонность) и продлевают их в будущее. Это позволяет получить статистически вероятный сценарий развития.
        </p>
      </InfoCard>
      
      <InsightSection
        title="Прогнозы: Эволюция канала"
        description="Модель не только предсказывает отдельные стримы, но и показывает долгосрочные тренды. К 2028 году ожидается смещение времени начала на более позднее, а среднее количество зрителей продолжит расти. Анализ сезонности показывает, что пик 'нарушений режима' приходится на весну, а популярность игр циклична."
        imgSrc="/images/predictions_beautiful.png"
        imgAlt="Дашборд с прогнозами"
        reverse
      />

      <InfoCard title="Что такое 'Декомпозиция'?">
        <p>Этот метод разделяет сложный график (например, количество зрителей) на три простых компонента:</p>
        <ul className="list-disc list-inside space-y-2 pl-2 pt-2">
          <li>
            <b>Тренд:</b> Общее направление движения (рост или падение в долгосрочной перспективе).
          </li>
          <li>
            <b>Сезонность:</b> Регулярные, предсказуемые циклы (например, еженедельные пики по выходным).
          </li>
          <li>
            <b>Аномалии:</b> Уникальные, непредсказуемые всплески или падения, которые остались после вычета тренда и сезонности.
          </li>
        </ul>
      </InfoCard>

      <InsightSection
        title="Анализ зрителей: тренд, сезонность и аномалии"
        description={
          <>
            <motion.p variants={FadeIn(0.2)} className="mb-6">
              Декомпозиция временных рядов позволяет заглянуть &quot;под капот&quot; графика зрителей. Долгосрочный тренд — уверенный рост. Есть стабильные недельные циклы и аномальные всплески, которые указывают на уникальные события. Анализ того, что происходило на стримах в эти дни, может дать ключ к пониманию самых эффективных (и неэффективных) форматов.
            </motion.p>

            <motion.div variants={FadeIn(0.4)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-green-950/50 border-green-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ArrowUpRight className="w-6 h-6 text-green-400" />
                    Топ-3 дня успеха
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-green-300/90 text-sm space-y-1">
                  <p>
                    <strong>2022-05-28:</strong> +2842 сверх нормы
                  </p>
                  <p>
                    <strong>2023-06-24:</strong> +2476 сверх нормы
                  </p>
                  <p>
                    <strong>2022-08-06:</strong> +2365 сверх нормы
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-red-950/50 border-red-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ArrowDownRight className="w-6 h-6 text-red-400" />
                    Топ-3 дня провала
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-red-300/90 text-sm space-y-1">
                  <p>
                    <strong>2022-02-21:</strong> -1160 от нормы
                  </p>
                  <p>
                    <strong>2022-02-22:</strong> -928 от нормы
                  </p>
                  <p>
                    <strong>2024-01-25:</strong> -758 от нормы
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.p variants={FadeIn(0.6)} className="text-sm text-muted-foreground pt-4 mt-4">
              Эти даты — точки для дальнейшего исследования. Анализ того, что происходило на стримах в эти дни, может дать ключ к пониманию самых эффективных (и неэффективных) форматов.
            </motion.p>
          </>
        }
        imgSrc="/images/viewers_decomposition.png"
        imgAlt="Декомпозиция зрителей"
      />

      <InsightSection
        title="Анализ расписания: предсказуемый хаос"
        description={
          <>
            <motion.p variants={FadeIn(0.2)}>
              Анализ времени начала стримов доказывает: сбои режима цикличны. График четко показывает <b>30-дневный цикл &quot;плавающего&quot; расписания</b>. В течение месяца время старта постепенно смещается на 2-3 часа, после чего происходит резкий &quot;сброс&quot; к раннему началу.
            </motion.p>
            <motion.p variants={FadeIn(0.4)} className="text-sm text-muted-foreground pt-4">
              Этот анализ доказывает, что &quot;хаос&quot; в расписании на самом деле является сложной, но предсказуемой системой. Ниже — самые экстремальные сбои.
            </motion.p>
            <motion.ul variants={FadeIn(0.6)} className="space-y-4 text-base pt-4">
              <FeatureListItem>
                <b>Раннее начало:</b> 2022-02-26 (на <strong className="text-primary">6.7ч</strong> раньше), 2021-04-24 (на <strong className="text-primary">6.1ч</strong> раньше).
              </FeatureListItem>
              <FeatureListItem>
                <b>Позднее начало:</b> 2022-07-20 (на <strong className="text-primary">8.6ч</strong> позже), 2023-08-10 (на <strong className="text-primary">8.4ч</strong> позже).
              </FeatureListItem>
            </motion.ul>
          </>
        }
        imgSrc="/images/start_time_decomposition.png"
        imgAlt="Декомпозиция времени начала"
        reverse
      />
    </div>
  );
}
