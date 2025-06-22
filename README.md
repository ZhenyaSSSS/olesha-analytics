# Аналитика и Прогнозы стримов Olesha

Этот проект — интерактивный дашборд для визуализации аналитики и прогнозов по стримам стримера Olesha. Сайт построен на основе анализа ~1000 прошлых трансляций и генерирует прогнозы на 5 лет вперёд, используя ансамбль ML-моделей.

## 🌐 Live Demo

**Посмотреть проект вживую можно здесь: [olesha-analytics.vercel.app](https://olesha-analytics.vercel.app/)**

## 🚀 Основные фичи

*   **Интерактивный календарь**: Визуализация прогнозов стримов на 5 лет с цветовой кодировкой по ожидаемой популярности.
*   **Детальная карточка стрима**: При клике на день открывается подробная информация о прогнозе: список игр, время, ожидаемые зрители, фолловеры и т.д.
*   **Динамические теги**: Особые стримы (ночные, на выходных) помечаются специальными бейджами.
*   **Адаптивный дизайн**: Удобно просматривать как на десктопе, так и на мобильных устройствах.
*   **Быстрая навигация**: Возможность быстрого перехода к нужному году и месяцу.

## 🛠️ Стек технологий

*   **Фреймворк**: [Next.js](https://nextjs.org/) (React)
*   **Стилизация**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI-компоненты**: [shadcn/ui](https://ui.shadcn.com/)
*   **Анимации**: [Framer Motion](https://www.framer.com/motion/)
*   **Работа с датами**: [date-fns](https://date-fns.org/)
*   **Иконки**: [Lucide React](https://lucide.dev/)
*   **Деплой**: [Vercel](https://vercel.com/)

## ⚙️ Локальный запуск

1.  Клонируйте репозиторий:
    ```bash
    git clone https://github.com/ZhenyaSSSS/olesha-analytics.git
    ```
2.  Перейдите в директорию проекта:
    ```bash
    cd olesha-analytics
    ```
3.  Установите зависимости:
    ```bash
    npm install
    ```
4.  Запустите сервер для разработки:
    ```bash
    npm run dev
    ```

После этого откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
