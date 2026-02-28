import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  LayoutDashboard, Map, Globe2, Sun, Droplets, Search, BellRing,
  TrendingUp, GitCompare, Clock, FileDown, Info, Sprout, Play, Layers, Pause,
  Thermometer, Wind, CloudRain, Wheat, Leaf, Zap, Target, BarChart3, Activity,
  MessageCircle, Mic, Send, MicOff, Volume2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════ */
const AI_MODELS = [
  { id: "claude-sonnet-4-20250514", label: "Claude Sonnet 4", short: "Sonnet 4", badge: "⚡", desc: { kz: "Жылдам, нақты", ru: "Быстрый, точный", en: "Fast & precise" }, color: "#059669" },
  { id: "claude-sonnet-4-5-20250929", label: "Claude Sonnet 4.5", short: "Sonnet 4.5", badge: "🧠", desc: { kz: "Ақылды, терең талдау", ru: "Умнее, глубокий анализ", en: "Smarter, deep analysis" }, color: "#7c3aed" },
  { id: "claude-opus-4-6", label: "Claude Opus 4.6", short: "Opus 4.6", badge: "🏆", desc: { kz: "Ең күшті, баяу", ru: "Мощнейший, медленнее", en: "Most powerful, slower" }, color: "#d97706" },
  { id: "gpt-5", label: "GPT-5", short: "GPT-5", badge: "🌐", desc: { kz: "Әмбебап, креативті", ru: "Универсальный, креативный", en: "Universal, creative" }, color: "#10a37f" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", short: "Gemini Pro", badge: "💎", desc: { kz: "Ойлау, көп модальді", ru: "Мыслительный, мультимодальный", en: "Reasoning, multimodal" }, color: "#4285f4" },
];
const AI_MODEL_MAP = { "gpt-5": "claude-sonnet-4-5-20250929", "gemini-2.5-pro": "claude-sonnet-4-5-20250929" };
const resolveModel = (id) => AI_MODEL_MAP[id] || id;
const API_KEY = "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";

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS — two themes
   ═══════════════════════════════════════════════════ */
const LIGHT = {
  bg:"#f5f7f6", panel:"rgba(255,255,255,0.82)", card:"rgba(255,255,255,0.75)",
  hover:"rgba(0,60,40,0.04)", brd:"rgba(0,80,60,0.09)", brdAct:"rgba(5,150,105,0.25)",
  fg:"#1a2e24", sub:"#4a6a5a", dim:"#8aaa9a",
  leaf:"#059669", gold:"#d97706", earth:"#b45309", sky:"#0891b2",
  rose:"#dc2626", violet:"#7c3aed", mint:"#10b981",
  ok:"#059669", warn:"#d97706", err:"#dc2626", crit:"#7c3aed",
  headerBg:"rgba(255,255,255,0.95)", headerSh:"0 1px 3px rgba(0,0,0,0.06)",
  mapBg:"#e8f0ec", popupBg:"rgba(255,255,255,0.97)", popupBrd:"rgba(0,80,60,0.12)",
  popupSh:"0 8px 30px rgba(0,0,0,0.12)", labelBg:"rgba(255,255,255,0.95)", labelFg:"#1a2e24",
  tipBg:"rgba(255,255,255,0.97)", tipSh:"0 4px 20px rgba(0,0,0,0.08)",
  gridLine:"rgba(0,60,40,0.08)", innerBg:"rgba(0,60,40,0.03)",
  scrollThumb:"rgba(5,150,105,0.2)", markerBrd:"rgba(0,60,40,0.3)",
  welcomeBg:"radial-gradient(ellipse at center, rgba(240,248,244,1), rgba(245,247,246,1))",
  menuBg:"rgba(255,255,255,0.98)", barBg:"rgba(255,255,255,0.95)",
  zoomBg:"rgba(255,255,255,0.92)", zoomFg:"#059669", zoomBrd:"rgba(0,80,60,0.15)",
  btnBg:"rgba(5,150,105,0.12)", btnFg:"#059669", btnBrdH:"rgba(5,150,105,0.25)",
  activeTabBg:"rgba(5,150,105,0.08)", controlBg:"rgba(0,60,40,0.03)", controlBrd:"rgba(0,80,60,0.09)",
  isDark: false,
};

const DARK = {
  bg:"#131517", panel:"rgba(28,31,36,0.82)", card:"rgba(28,31,36,0.65)",
  hover:"rgba(255,255,255,0.04)", brd:"rgba(255,255,255,0.06)", brdAct:"rgba(74,222,128,0.25)",
  fg:"#e2e6eb", sub:"#8490a0", dim:"#454e5c",
  leaf:"#4ade80", gold:"#fbbf24", earth:"#d97706", sky:"#38bdf8",
  rose:"#f87171", violet:"#a78bfa", mint:"#34d399",
  ok:"#4ade80", warn:"#fbbf24", err:"#f87171", crit:"#a78bfa",
  headerBg:"rgba(19,21,23,0.95)", headerSh:"0 1px 4px rgba(0,0,0,0.4)",
  mapBg:"#0d0f11", popupBg:"rgba(19,21,23,0.96)", popupBrd:"rgba(74,222,128,0.12)",
  popupSh:"0 8px 30px rgba(0,0,0,0.5)", labelBg:"rgba(19,21,23,0.9)", labelFg:"#e2e6eb",
  tipBg:"rgba(19,21,23,0.96)", tipSh:"0 4px 20px rgba(0,0,0,0.5)",
  gridLine:"rgba(255,255,255,0.05)", innerBg:"rgba(255,255,255,0.03)",
  scrollThumb:"rgba(74,222,128,0.15)", markerBrd:"rgba(255,255,255,0.2)",
  welcomeBg:"radial-gradient(ellipse at center, rgba(19,23,28,1), rgba(13,15,17,1))",
  menuBg:"rgba(19,21,23,0.98)", barBg:"rgba(19,21,23,0.95)",
  zoomBg:"rgba(28,31,36,0.9)", zoomFg:"#4ade80", zoomBrd:"rgba(74,222,128,0.15)",
  btnBg:"rgba(74,222,128,0.12)", btnFg:"#4ade80", btnBrdH:"rgba(74,222,128,0.3)",
  activeTabBg:"rgba(74,222,128,0.1)", controlBg:"rgba(255,255,255,0.03)", controlBrd:"rgba(255,255,255,0.06)",
  isDark: true,
};

let T = LIGHT; // updated in main component before render

/* ═══════════════════════════════════════════════════
   MULTILINGUAL — kz / ru / en
   ═══════════════════════════════════════════════════ */
const LANG = {
  kz: {
    overview:"Шолу", map:"Карта", regions:"Аймақтар", forecast:"Болжам",
    compare:"Салыстыру", drought:"Құрғақшылық", water:"Су", timeline:"Динамика",
    ai:"ЖИ-Талдау", alerts:"Сигналдар", about:"Жоба туралы",
    avgTemp:"Орт. температура", soilMoisture:"Топырақ ылғалдылығы",
    avgNDVI:"Орташа NDVI", riskZones:"Қауіп аймақтары",
    yieldIdx:"Өнімділік", waterStress:"Су тапшылығы",
    allRegions:"барлық аймақтар", search:"Іздеу…",
    export:"Есепті жүктеу", exporting:"Экспорттау…", enter:"Жүйеге кіру",
    low:"Төмен", medium:"Орташа", high:"Жоғары", critical:"Сыни",
    temp:"Температура", humidity:"Ылғалдылық", wind:"Жел",
    precip:"Жауын-шашын", evap:"Булану", balance:"Тепе-теңдік",
    ndvi:"NDVI", soilTemp:"Топырақ t°", airHum:"Ауа ылғалд.",
    recs:"Ұсыныстар", problems:"Мәселелер", details:"Толық ақпарат",
    status:"Күй", demo:"Демо режим", methodology:"Әдістеме",
    dataSources:"Деректер көздері", techStack:"Технологиялар",
    forecast7d:"7 күндік болжам", yieldForecast:"Өнімділік болжамы",
    bestRegion:"Ең жақсы аймақ", worstRegion:"Ең нашар аймақ",
    cropRecs:"Дақыл ұсыныстары", suitability:"Қолайлылық",
    droughtRisk:"Құрғақшылық қаупі", maxTemp:"Макс. t°",
    minMoist:"Мин. ылғалд.", maxET:"Макс. ET₀", critZones:"Сыни аймақтар",
    waterBalance:"Су балансы", soilMoist7:"Топырақ ылғалдылығы",
    precipWeek:"Жауын-шашын 7к", etWeek:"ET₀",
    daySlider:"Күн бойынша", play:"Ойнату", pause:"Тоқтату",
    uploadPhoto:"Сурет жүктеу", drawForAI:"ЖИ үшін белгілеу",
    analyze:"Талдау", analyzing:"Талдануда…", cancel:"Болдырмау",
    aiResult:"ЖИ нәтижесі", history:"Тарих", landType:"Жер түрі",
    erosion:"Эрозия", recovery:"Қалпына келтіру", coverage:"Жамылғы",
    usability:"Жарамдылық", irrigNeeded:"Суару қажет", noIrrig:"Суару қажет емес",
    critDrought:"Сыни құрғақшылық", extDry:"Өте құрғақ топырақ",
    heatWave:"Аномальды ыстық", highEvap:"Жоғары булану",
    clearSky:"Ашық",cloudyPart:"Аз бұлтты",cloudy:"Бұлтты",overcast:"Тұмшаланған",
    fog:"Тұман",drizzle:"Бұршақ",rain:"Жаңбыр",heavyRain:"Қатты жаңбыр",
    downpour:"Нөсер",snow:"Қар",snowfall:"Қар жауу",blizzard:"Боран",
    thunder:"Найзағай",hail:"Бұршақ тас",
    satellite:"Жерсерік",forecastW:"Болжам",aiW:"ЖИ",dataW:"Деректер",
    moreTab:"Тағы", overviewTab:"Шолу", mapTab:"Карта",
    forecastTab:"Болжам", aiTab:"ЖИ", chatTab:"Чат",
    wheat:"Бидай",corn:"Жүгері",barley:"Арпа",rice:"Күріш",
    sunflower:"Күнбағыс",rapeseed:"Рапс",potato:"Картоп",cotton:"Мақта",
    monitoring:"Қазақстан ауыл шаруашылығын",
    monitoringSub:"жерсерік деректері мен жасанды интеллект арқылы бақылау.",
    monitoringMeta:"17 аймақ · Нақты метеодеректер · ЖИ-талдау",
    competitionLine:"AEROO SPACE AI байқауы · 2025",
    arable:"Егіс алаңы", city:"Орталық",
    chat:"Чат", chatPlaceholder:"Сұрағыңызды жазыңыз...", voiceOn:"Дауыс қосулы", voiceOff:"Дауыс өшірулі",
    chatWelcome:"Сәлеметсіз бе! Мен DalaSpace ЖИ-көмекшісімін. Аймақтар, ауа райы, егіндер туралы сұраңыз.",
    speak:"Айту", stopSpeak:"Тоқтату", chatHint:"Мысалы: «Жамбыл облысында не егуге болады?»", loading:"Метеодеректер жүктелуде...", loadingSat:"Жерсерік суреті жүктелуде...",avgSoilMoist:"Орт. топырақ ылғалд.",avgPrecip7:"Орт. жауын-шашын 7к",avgET:"Орт. ET₀",avgSoilTemp:"Орт. топырақ t°",avgWaterStress:"Орт. су стресі",yieldLabel:"Өнімділік",regionCol:"Аймақ",tempCol:"Темп.",etCol:"ET₀",metricCol:"Метрика",
  },
  ru: {
    overview:"Обзор", map:"Карта", regions:"Регионы", forecast:"Прогноз",
    compare:"Сравнение", drought:"Засуха", water:"Вода", timeline:"Динамика",
    ai:"ИИ-Анализ", alerts:"Сигналы", about:"О проекте",
    avgTemp:"Ср. температура", soilMoisture:"Влажность почвы",
    avgNDVI:"Средний NDVI", riskZones:"Зоны риска",
    yieldIdx:"Урожайность", waterStress:"Водный стресс",
    allRegions:"все регионы", search:"Поиск…",
    export:"Скачать отчёт", exporting:"Экспорт…", enter:"Войти в систему",
    low:"Низкий", medium:"Средний", high:"Высокий", critical:"Критический",
    temp:"Температура", humidity:"Влажность", wind:"Ветер",
    precip:"Осадки", evap:"Испарение", balance:"Баланс",
    ndvi:"NDVI", soilTemp:"Темп. почвы", airHum:"Влажн. возд.",
    recs:"Рекомендации", problems:"Проблемы", details:"Подробности",
    status:"Статус", demo:"Демо-режим", methodology:"Методология",
    dataSources:"Источники данных", techStack:"Технологии",
    forecast7d:"Прогноз 7 дней", yieldForecast:"Прогноз урожайности",
    bestRegion:"Лучший регион", worstRegion:"Худший регион",
    cropRecs:"Рекомендации по культурам", suitability:"Пригодность",
    droughtRisk:"Риск засухи", maxTemp:"Макс. t°",
    minMoist:"Мин. влажн.", maxET:"Макс. ET₀", critZones:"Критич. зон",
    waterBalance:"Водный баланс", soilMoist7:"Влажность почвы",
    precipWeek:"Осадки 7д", etWeek:"ET₀",
    daySlider:"По дням", play:"Воспроизвести", pause:"Пауза",
    uploadPhoto:"Загрузить фото", drawForAI:"Выделить для ИИ",
    analyze:"Анализировать", analyzing:"Анализ…", cancel:"Отмена",
    aiResult:"Результат ИИ", history:"История", landType:"Тип земли",
    erosion:"Эрозия", recovery:"Восстановление", coverage:"Покрытие",
    usability:"Пригодность", irrigNeeded:"Нужен полив", noIrrig:"Полив не нужен",
    critDrought:"Критическая засуха", extDry:"Экстремальная сухость",
    heatWave:"Аномальная жара", highEvap:"Высокое испарение",
    clearSky:"Ясно",cloudyPart:"Малооблачно",cloudy:"Облачно",overcast:"Пасмурно",
    fog:"Туман",drizzle:"Морось",rain:"Дождь",heavyRain:"Сильный дождь",
    downpour:"Ливень",snow:"Снег",snowfall:"Снегопад",blizzard:"Метель",
    thunder:"Гроза",hail:"Град",
    satellite:"Спутник",forecastW:"Прогноз",aiW:"ИИ",dataW:"Данные",
    moreTab:"Ещё", overviewTab:"Обзор", mapTab:"Карта",
    forecastTab:"Прогноз", aiTab:"ИИ", chatTab:"Чат",
    wheat:"Пшеница",corn:"Кукуруза",barley:"Ячмень",rice:"Рис",
    sunflower:"Подсолнечник",rapeseed:"Рапс",potato:"Картофель",cotton:"Хлопок",
    monitoring:"Мониторинг сельского хозяйства Казахстана",
    monitoringSub:"через спутниковые данные и искусственный интеллект.",
    monitoringMeta:"17 регионов · Реальные метеоданные · ИИ-анализ снимков",
    competitionLine:"AEROO SPACE AI Competition · 2025",
    arable:"Пашня", city:"Центр",
    chat:"Чат", chatPlaceholder:"Задайте вопрос по агроданным...", voiceOn:"Голос вкл.", voiceOff:"Голос выкл.",
    chatWelcome:"Здравствуйте! Я ИИ-ассистент DalaSpace. Спросите меня о регионах, погоде, культурах или рисках.",
    speak:"Озвучить", stopSpeak:"Стоп", chatHint:"Например: «Что лучше сажать в Жамбылской области?»", loading:"Загружаем метеоданные...", loadingSat:"Загружаем спутниковый снимок...",avgSoilMoist:"Ср. влажн. почвы",avgPrecip7:"Ср. осадки 7д",avgET:"Ср. ET₀",avgSoilTemp:"Ср. темп. почвы",avgWaterStress:"Ср. водный стресс",yieldLabel:"Урожайность",regionCol:"Регион",tempCol:"Темп.",etCol:"ET₀",metricCol:"Метрика",
  },
  en: {
    overview:"Overview", map:"Map", regions:"Regions", forecast:"Forecast",
    compare:"Compare", drought:"Drought", water:"Water", timeline:"Timeline",
    ai:"AI Analysis", alerts:"Alerts", about:"About",
    avgTemp:"Avg. Temperature", soilMoisture:"Soil Moisture",
    avgNDVI:"Average NDVI", riskZones:"Risk Zones",
    yieldIdx:"Yield Index", waterStress:"Water Stress",
    allRegions:"all regions", search:"Search…",
    export:"Download Report", exporting:"Exporting…", enter:"Enter System",
    low:"Low", medium:"Medium", high:"High", critical:"Critical",
    temp:"Temperature", humidity:"Humidity", wind:"Wind",
    precip:"Precipitation", evap:"Evaporation", balance:"Balance",
    ndvi:"NDVI", soilTemp:"Soil Temp.", airHum:"Air Humidity",
    recs:"Recommendations", problems:"Problems", details:"Details",
    status:"Status", demo:"Demo Mode", methodology:"Methodology",
    dataSources:"Data Sources", techStack:"Tech Stack",
    forecast7d:"7-Day Forecast", yieldForecast:"Yield Forecast",
    bestRegion:"Best Region", worstRegion:"Worst Region",
    cropRecs:"Crop Recommendations", suitability:"Suitability",
    droughtRisk:"Drought Risk", maxTemp:"Max Temp.",
    minMoist:"Min Moisture", maxET:"Max ET₀", critZones:"Critical Zones",
    waterBalance:"Water Balance", soilMoist7:"Soil Moisture",
    precipWeek:"Precip. 7d", etWeek:"ET₀",
    daySlider:"Day by Day", play:"Play", pause:"Pause",
    uploadPhoto:"Upload Photo", drawForAI:"Select for AI",
    analyze:"Analyze", analyzing:"Analyzing…", cancel:"Cancel",
    aiResult:"AI Result", history:"History", landType:"Land Type",
    erosion:"Erosion", recovery:"Recovery", coverage:"Coverage",
    usability:"Usability", irrigNeeded:"Irrigation needed", noIrrig:"No irrigation needed",
    critDrought:"Critical drought", extDry:"Extreme dryness",
    heatWave:"Heat wave", highEvap:"High evaporation",
    clearSky:"Clear",cloudyPart:"Partly cloudy",cloudy:"Cloudy",overcast:"Overcast",
    fog:"Fog",drizzle:"Drizzle",rain:"Rain",heavyRain:"Heavy rain",
    downpour:"Downpour",snow:"Snow",snowfall:"Snowfall",blizzard:"Blizzard",
    thunder:"Thunderstorm",hail:"Hail",
    satellite:"Satellite",forecastW:"Forecast",aiW:"AI",dataW:"Data",
    moreTab:"More", overviewTab:"Overview", mapTab:"Map",
    forecastTab:"Forecast", aiTab:"AI", chatTab:"Chat",
    wheat:"Wheat",corn:"Corn",barley:"Barley",rice:"Rice",
    sunflower:"Sunflower",rapeseed:"Rapeseed",potato:"Potato",cotton:"Cotton",
    monitoring:"Agricultural monitoring of Kazakhstan",
    monitoringSub:"through satellite data and artificial intelligence.",
    monitoringMeta:"17 regions · Real-time weather data · AI image analysis",
    competitionLine:"AEROO SPACE AI Competition · 2025",
    arable:"Arable land", city:"Capital",
    chat:"Chat", chatPlaceholder:"Ask about your fields...", voiceOn:"Voice on", voiceOff:"Voice off",
    chatWelcome:"Hello! I'm the DalaSpace AI assistant. Ask me about regions, weather, crops, or risks.",
    speak:"Speak", stopSpeak:"Stop", chatHint:"Example: «What should I plant in Zhambyl region?»", loading:"Loading weather data...", loadingSat:"Loading satellite image...",avgSoilMoist:"Avg. Soil Moist.",avgPrecip7:"Avg. Precip 7d",avgET:"Avg. ET₀",avgSoilTemp:"Avg. Soil Temp",avgWaterStress:"Avg. Water Stress",yieldLabel:"Yield",regionCol:"Region",tempCol:"Temp",etCol:"ET₀",metricCol:"Metric",
  },
};

// Locale for dates
const DATE_LOCALE = { kz: "kk-KZ", ru: "ru-RU", en: "en-US" };

// Weather labels by lang
const wxKey = (code, t) => {
  const m = { 0:"clearSky",1:"cloudyPart",2:"cloudy",3:"overcast",
    45:"fog",51:"drizzle",61:"rain",63:"heavyRain",
    65:"downpour",71:"snow",73:"snowfall",75:"blizzard",80:"downpour",95:"thunder",99:"hail" };
  return t[m[code]] || "—";
};

// Crop name by lang
const cropKey = (nameRu, t) => {
  // crops now use keys directly
  return t[m[nameRu]] || nameRu;
};

// Region names in three langs (id → {kz, ru, en})
const RNAME = {
  akm:{kz:"Ақмола облысы",ru:"Акмолинская",en:"Akmola"},
  akt:{kz:"Ақтөбе облысы",ru:"Актюбинская",en:"Aktobe"},
  alm:{kz:"Алматы облысы",ru:"Алматинская",en:"Almaty"},
  atr:{kz:"Атырау облысы",ru:"Атырауская",en:"Atyrau"},
  vko:{kz:"Шығыс Қазақстан",ru:"ВКО",en:"East Kazakhstan"},
  zhm:{kz:"Жамбыл облысы",ru:"Жамбылская",en:"Zhambyl"},
  zko:{kz:"Батыс Қазақстан",ru:"ЗКО",en:"West Kazakhstan"},
  krg:{kz:"Қарағанды облысы",ru:"Карагандинская",en:"Karaganda"},
  kst:{kz:"Қостанай облысы",ru:"Костанайская",en:"Kostanay"},
  kyz:{kz:"Қызылорда облысы",ru:"Кызылординская",en:"Kyzylorda"},
  mng:{kz:"Маңғыстау облысы",ru:"Мангистауская",en:"Mangystau"},
  pvl:{kz:"Павлодар облысы",ru:"Павлодарская",en:"Pavlodar"},
  skz:{kz:"Солтүстік Қазақстан",ru:"СКО",en:"North Kazakhstan"},
  trk:{kz:"Түркістан облысы",ru:"Туркестанская",en:"Turkestan"},
  ult:{kz:"Ұлытау облысы",ru:"Улытауская",en:"Ulytau"},
  aba:{kz:"Абай облысы",ru:"Абайская",en:"Abai"},
  zht:{kz:"Жетісу облысы",ru:"Жетісу",en:"Zhetysu"},
};

// Current lang helper — set by main component
let _lang = "ru";
const rn = (r) => RNAME[r.id]?.[_lang] || r.name;

// Risk labels by lang
const riskLabel = (level, t) => t[level] || level;

const getRiskStyle = (t) => ({
  low:      { label: t?.low||"Low",      color: T.ok,   bg: `${T.ok}12`, brd: `${T.ok}33`, icon: "✦" },
  medium:   { label: t?.medium||"Med",   color: T.warn, bg: `${T.warn}12`, brd: `${T.warn}33`, icon: "◆" },
  high:     { label: t?.high||"High",    color: T.err,  bg: `${T.err}12`, brd: `${T.err}33`, icon: "▲" },
  critical: { label: t?.critical||"Crit", color: T.crit, bg: `${T.crit}12`, brd: `${T.crit}33`, icon: "◉" },
});
let RISK_STYLE = getRiskStyle(LANG.ru);

const ndviColor  = v => v > 0.55 ? T.ok : v > 0.4 ? "#22c55e" : v > 0.25 ? T.warn : T.err;
const moistColor = v => v > 0.3 ? T.sky : v > 0.18 ? T.leaf : v > 0.1 ? T.warn : T.err;

/* ═══════════════════════════════════════════════════
   DATA — Kazakhstan regions
   ═══════════════════════════════════════════════════ */
const REGIONS = [
  { id: "akm", name: "Акмолинская",     code: "АКМ", lat: 51.92, lng: 69.41, crop: 5480, city: "Кокшетау" },
  { id: "akt", name: "Актюбинская",     code: "АКТ", lat: 50.28, lng: 57.21, crop: 2100, city: "Актобе" },
  { id: "alm", name: "Алматинская",     code: "АЛМ", lat: 44.85, lng: 77.05, crop: 1950, city: "Талдыкорган" },
  { id: "atr", name: "Атырауская",      code: "АТР", lat: 47.10, lng: 51.92, crop: 85,   city: "Атырау" },
  { id: "vko", name: "ВКО",             code: "ВКО", lat: 49.95, lng: 82.61, crop: 1450, city: "Усть-Каменогорск" },
  { id: "zhm", name: "Жамбылская",      code: "ЖМБ", lat: 43.35, lng: 71.37, crop: 890,  city: "Тараз" },
  { id: "zko", name: "ЗКО",             code: "ЗКО", lat: 50.27, lng: 51.37, crop: 1820, city: "Уральск" },
  { id: "krg", name: "Карагандинская",  code: "КРГ", lat: 49.80, lng: 73.10, crop: 1650, city: "Караганда" },
  { id: "kst", name: "Костанайская",    code: "КСТ", lat: 53.21, lng: 63.63, crop: 5120, city: "Костанай" },
  { id: "kyz", name: "Кызылординская",  code: "КЫЗ", lat: 44.85, lng: 65.50, crop: 320,  city: "Кызылорда" },
  { id: "mng", name: "Мангистауская",   code: "МНГ", lat: 43.35, lng: 52.06, crop: 12,   city: "Актау" },
  { id: "pvl", name: "Павлодарская",    code: "ПВЛ", lat: 52.29, lng: 76.95, crop: 2340, city: "Павлодар" },
  { id: "skz", name: "СКО",             code: "СКО", lat: 54.87, lng: 69.15, crop: 3850, city: "Петропавловск" },
  { id: "trk", name: "Туркестанская",   code: "ТРК", lat: 41.20, lng: 68.25, crop: 680,  city: "Туркестан" },
  { id: "ult", name: "Улытауская",      code: "УЛТ", lat: 48.00, lng: 67.50, crop: 180,  city: "Жезказган" },
  { id: "aba", name: "Абайская",        code: "АБА", lat: 47.80, lng: 80.30, crop: 520,  city: "Семей" },
  { id: "zht", name: "Жетісу",          code: "ЖТС", lat: 45.50, lng: 79.00, crop: 640,  city: "Талдыкорган" },
];

const getNav = (t) => [
  { id: "overview", label: t.overview,  Icon: LayoutDashboard },
  { id: "map",      label: t.map,       Icon: Map },
  { id: "regions",  label: t.regions,   Icon: Globe2 },
  { id: "forecast", label: t.forecast,  Icon: TrendingUp },
  { id: "compare",  label: t.compare,   Icon: GitCompare },
  { id: "drought",  label: t.drought,   Icon: Sun },
  { id: "water",    label: t.water,     Icon: Droplets },
  { id: "timeline", label: t.timeline,  Icon: Clock },
  { id: "ai",       label: t.ai,        Icon: Search },
  { id: "chat",     label: t.chat,      Icon: MessageCircle },
  { id: "alerts",   label: t.alerts,    Icon: BellRing },
];

// WX_LABEL is now dynamic via wxKey(code, t) — see LANG section above

/* ═══════════════════════════════════════════════════
   API & CALCULATIONS
   ═══════════════════════════════════════════════════ */
async function fetchWeather(r) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${r.lat}&longitude=${r.lng}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,soil_temperature_0cm,soil_moisture_0_to_1cm` +
    `&hourly=soil_moisture_0_to_1cm,soil_temperature_0cm` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration,weather_code` +
    `&timezone=Asia/Almaty&past_days=7&forecast_days=7`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function calcNDVI(moisture, temp, precip) {
  if (moisture == null) return 0.2;
  const m = Math.min(moisture * 2.5, 1);
  const t = temp > 5 && temp < 35 ? Math.min((temp - 5) / 25, 1) * 0.8 + 0.2 : 0.15;
  const p = Math.min(precip / 5, 1) * 0.3;
  return +Math.min(0.85, Math.max(0.05, m * 0.5 + t * 0.3 + p * 0.2)).toFixed(3);
}

function calcRisk(moisture, temp, precip, et0) {
  let s = 0;
  if (moisture < 0.1) s += 3; else if (moisture < 0.2) s += 2; else if (moisture < 0.3) s += 1;
  if (temp > 35) s += 2; else if (temp > 30) s += 1;
  if (precip < 1) s += 2; else if (precip < 5) s += 1;
  if (et0 > 6) s += 2; else if (et0 > 4) s += 1;
  return s >= 7 ? "critical" : s >= 5 ? "high" : s >= 3 ? "medium" : "low";
}

function processWeather(raw) {
  const cur = raw.current || {};
  const d   = raw.daily || {};
  const h   = raw.hourly || {};
  const precip7 = (d.precipitation_sum || []).slice(0, 7).reduce((a, b) => a + (b || 0), 0);
  const et7     = (d.et0_fao_evapotranspiration || []).slice(0, 7).reduce((a, b) => a + (b || 0), 0);
  const avgET   = et7 / 7;
  const ndvi = calcNDVI(cur.soil_moisture_0_to_1cm, cur.temperature_2m, precip7 / 7);

  // Water stress index: lower = more stress (0-1 scale)
  const waterStress = avgET > 0 ? Math.min(1, Math.max(0, (precip7 / 7) / avgET)) : 1;

  // Daily chart data with NDVI trend
  const chart = (d.time || []).map((dt, i) => {
    const rain = d.precipitation_sum?.[i] || 0;
    const et0 = d.et0_fao_evapotranspiration?.[i] || 0;
    const tMax = d.temperature_2m_max?.[i];
    const tMin = d.temperature_2m_min?.[i];
    const avgT = (tMax + tMin) / 2;
    // Simplified daily NDVI estimate
    const dailyMoist = cur.soil_moisture_0_to_1cm || 0.15;
    const dayNDVI = calcNDVI(dailyMoist, avgT, rain);
    return {
      date: dt,
      label: new Date(dt).toLocaleDateString(DATE_LOCALE[_lang], { day: "numeric", month: "short" }),
      tMax, tMin, rain, et0,
      balance: rain - et0,
      ndvi: dayNDVI,
      waterStress: et0 > 0 ? Math.min(1, rain / et0) : 1,
    };
  });

  // Hourly soil data for timeline
  const hourly = (h.time || []).map((t, i) => ({
    time: t,
    soilMoisture: h.soil_moisture_0_to_1cm?.[i],
    soilTemp: h.soil_temperature_0cm?.[i],
  }));

  // Simple yield forecast (relative score 0-100)
  const yieldScore = Math.round(
    Math.min(100, Math.max(10,
      ndvi * 40 + waterStress * 30 + (cur.temperature_2m > 10 && cur.temperature_2m < 32 ? 30 : 10)
    ))
  );

  // Crop suitability based on conditions
  const crops = suggestCrops(cur.temperature_2m, cur.soil_moisture_0_to_1cm, precip7 / 7, ndvi);

  return {
    cur, ndvi, chart, hourly, crops,
    risk: calcRisk(cur.soil_moisture_0_to_1cm, cur.temperature_2m, precip7 / 7, avgET),
    p7:   +precip7.toFixed(1),
    et:   +avgET.toFixed(2),
    wx:   cur.weather_code,
    waterStress: +waterStress.toFixed(2),
    yieldScore,
  };
}

// Crop recommendations based on current conditions
function suggestCrops(temp, moisture, precip, ndvi) {
  const crops = [];
  if (temp > 15 && temp < 35 && moisture > 0.15) crops.push({ key: "wheat", score: 85, icon: "🌾" });
  if (temp > 18 && moisture > 0.2) crops.push({ key: "corn", score: 78, icon: "🌽" });
  if (temp > 12 && temp < 28 && moisture > 0.12) crops.push({ key: "barley", score: 82, icon: "🌿" });
  if (temp > 20 && moisture > 0.25 && precip > 2) crops.push({ key: "rice", score: 65, icon: "🍚" });
  if (temp > 10 && temp < 30) crops.push({ key: "sunflower", score: 72, icon: "🌻" });
  if (temp > 8 && moisture > 0.1) crops.push({ key: "rapeseed", score: 68, icon: "🥬" });
  if (temp > 5 && temp < 25 && moisture > 0.15) crops.push({ key: "potato", score: 75, icon: "🥔" });
  if (temp > 15 && moisture > 0.18) crops.push({ key: "cotton", score: 60, icon: "☁️" });
  return crops.sort((a, b) => b.score - a.score).slice(0, 5);
}

/* ═══════════════════════════════════════════════════
   ATOMS — tiny reusable pieces
   ═══════════════════════════════════════════════════ */

// DalaSpace minimalist logo — satellite orbit over field lines
const DalaLogo = ({ size = 32, color }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="36" height="36" rx="10" fill={`${color || T.leaf}15`} stroke={`${color || T.leaf}40`} strokeWidth="1.5"/>
    <path d="M10 28 Q15 22 20 24 Q25 26 30 20" stroke={color || T.leaf} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
    <path d="M8 32 Q16 26 24 28 Q30 30 34 24" stroke={color || T.leaf} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
    <ellipse cx="22" cy="14" rx="10" ry="4" stroke={color || T.leaf} strokeWidth="1.2" strokeDasharray="2 2" fill="none" opacity="0.5" transform="rotate(-20 22 14)"/>
    <circle cx="28" cy="11" r="2.5" fill={color || T.leaf} opacity="0.9"/>
    <circle cx="28" cy="11" r="4" fill="none" stroke={color || T.leaf} strokeWidth="0.8" opacity="0.4"/>
  </svg>
);

const tipStyle = () => ({
  background: T.tipBg, border: `1px solid ${T.brd}`,
  borderRadius: 10, fontSize: 12, color: T.fg, boxShadow: T.tipSh,
});

function Badge({ level }) {
  const s = RISK_STYLE[level] || RISK_STYLE.medium;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: s.bg, color: s.color, border: `1px solid ${s.brd}`,
      padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      letterSpacing: 0.2, whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 8 }}>{s.icon}</span> {s.label}
    </span>
  );
}

function Stat({ icon, title, value, unit, accent, note }) {
  return (
    <div className="mob-stat" style={{
      background: T.card, border: `1px solid ${T.brd}`, borderRadius: 18,
      padding: "20px 22px", position: "relative", overflow: "hidden",
      boxShadow: T.isDark ? "none" : "0 1px 3px rgba(0,0,0,0.03)",
    }}>
      <div style={{
        position: "absolute", top: -16, right: -16, width: 72, height: 72,
        borderRadius: "50%", background: `${accent}12`, filter: "blur(28px)",
      }} />
      <div className="mob-stat-title" style={{
        fontSize: 11, color: T.sub, marginBottom: 12, fontWeight: 600,
        letterSpacing: 0.3, textTransform: "uppercase",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{icon}  {title}</div>
      <div className="mob-stat-val" style={{ fontSize: 28, fontWeight: 800, color: accent, letterSpacing: -1.2, lineHeight: 1 }}>
        {value}
        {unit && <span style={{ fontSize: 13, fontWeight: 500, color: T.sub, marginLeft: 5 }}>{unit}</span>}
      </div>
      {note && <div className="mob-stat-note" style={{
        fontSize: 11, color: T.dim, marginTop: 8,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{note}</div>}
    </div>
  );
}

function Panel({ children, style }) {
  return (
    <div className="mob-panel" style={{
      background: T.card, border: `1px solid ${T.brd}`, borderRadius: 20, padding: 24,
      boxShadow: T.isDark ? "none" : "0 1px 4px rgba(0,0,0,0.03)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Title({ children }) {
  return <div className="mob-title" style={{ fontSize: 13, fontWeight: 700, color: T.fg, marginBottom: 16, letterSpacing: 0.1 }}>{children}</div>;
}

function MoistureBar({ value }) {
  const pct = Math.min((value || 0) * 250, 100);
  const col = moistColor(value || 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: T.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,60,40,0.05)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 3, transition: "width 0.8s" }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: col, minWidth: 44, textAlign: "right" }}>
        {((value || 0) * 100).toFixed(1)}%
      </span>
    </div>
  );
}

function Loader({ text, progress }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 20, padding: "100px 20px",
    }}>
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: `3px solid ${T.brd}`, borderTopColor: T.leaf,
          animation: "revolve 1.2s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: 8, borderRadius: "50%",
          border: `2px solid ${T.brd}`, borderBottomColor: T.gold,
          animation: "revolve 1.8s linear infinite reverse",
        }} />
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 18,
        }}>🌾</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.fg }}>{text || "Загрузка…"}</div>
        {progress != null && (
          <div style={{ marginTop: 12, width: 240 }}>
            <div style={{ height: 4, background: T.brd, borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                width: `${progress}%`, height: "100%", borderRadius: 2,
                background: `linear-gradient(90deg, ${T.leaf}, ${T.sky})`, transition: "width 0.3s",
              }} />
            </div>
            <div style={{ fontSize: 11, color: T.dim, marginTop: 6 }}>{progress}%</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LEAFLET MAP — real interactive map
   ═══════════════════════════════════════════════════ */
const LEAFLET_CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
const LEAFLET_JS  = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
const LEAFLET_HEAT = "https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js";

const BASE_LAYERS = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    label: "🛰️", name: "Satellite",
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    label: "🌙", name: "Dark",
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    label: "⛰️", name: "Terrain",
  },
  streets: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    label: "🗺️", name: "Streets",
  },
};

// Preload immediately — don't wait for map component
const _leafletReady = (function() {
  loadCSS(LEAFLET_CSS);
  return loadScript(LEAFLET_JS).then(() => loadScript(LEAFLET_HEAT).catch(() => {}));
})();

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}
function loadCSS(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet"; l.href = href;
  document.head.appendChild(l);
}

// Dark map overlay CSS — injected once
const getMapCSS = () => `
  .leaflet-container { background: ${T.mapBg} !important; }
  .leaflet-control-zoom a { background: ${T.zoomBg} !important; color: ${T.zoomFg} !important; border-color: ${T.zoomBrd} !important; box-shadow: ${T.headerSh}; }
  .leaflet-control-zoom a:hover { background: ${T.headerBg} !important; }
  .leaflet-control-attribution { display: none !important; }
  .agro-popup .leaflet-popup-content-wrapper { background: ${T.popupBg}; color: ${T.fg}; border: 1px solid ${T.popupBrd}; border-radius: 14px; box-shadow: ${T.popupSh}; }
  .agro-popup .leaflet-popup-content { margin: 12px 14px !important; }
  .agro-popup .leaflet-popup-tip { background: ${T.popupBg}; border: 1px solid ${T.popupBrd}; }
  .agro-popup .leaflet-popup-close-button { color: ${T.sub} !important; font-size: 20px !important; top: 6px !important; right: 8px !important; }
  .agro-pulse { animation: agro-ring 2.5s ease-out infinite; }
  @keyframes agro-ring { 0% { box-shadow: 0 0 0 0 currentColor; opacity:0.7; } 70% { box-shadow: 0 0 0 18px transparent; opacity:0; } 100% { box-shadow: 0 0 0 0 transparent; opacity:0; } }
  .leaflet-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
  .leaflet-tooltip::before { display: none !important; }
  #dala-minimap .leaflet-container { background: #0e1012 !important; }
  #dala-minimap { transition: opacity 0.3s; }
  #dala-minimap:hover { opacity: 0.6; }
`;

// Approximate area of a lat/lng rectangle in hectares
function calcHectares(sw, ne) {
  const toRad = d => d * Math.PI / 180;
  const R = 6371000; // earth radius in meters
  const dLat = Math.abs(ne.lat - sw.lat);
  const dLng = Math.abs(ne.lng - sw.lng);
  const midLat = (sw.lat + ne.lat) / 2;
  const h = dLat * (Math.PI / 180) * R;
  const w = dLng * (Math.PI / 180) * R * Math.cos(toRad(midLat));
  return (h * w) / 10000; // m² → hectares
}

function formatHa(ha) {
  if (ha >= 10000) return `${(ha / 1000).toFixed(1)} тыс. га`;
  if (ha >= 100) return `${Math.round(ha).toLocaleString()} га`;
  if (ha >= 1) return `${ha.toFixed(1)} га`;
  return `${(ha * 10000).toFixed(0)} м²`;
}

/* ── GeoJSON boundary loader ── */
const GEOJSON_URLS = [
  "https://raw.githubusercontent.com/open-data-kazakhstan/geo-boundaries-kz/master/data/geo-boundaries-kz.geojson",
  "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/KAZ/ADM1/geoBoundaries-KAZ-ADM1.geojson",
];

// Map English / GADM / ISO names → our region IDs
const NAME_TO_ID = {
  // GADM & various English forms
  "aqmola":       "akm", "akmola":       "akm", "акмолинская":      "akm",
  "aqtöbe":       "akt", "aktobe":       "akt", "aqtobe":       "akt", "актюбинская": "akt", "актобе": "akt",
  "almaty":       "alm", "алматинская":     "alm",
  "atyrau":       "atr", "атырауская":      "atr",
  "east kazakhstan": "vko", "shyghys qazaqstan": "vko", "shygys": "vko", "вко": "vko", "восточно-казахстанская": "vko",
  "zhambyl":      "zhm", "jambyl":       "zhm", "жамбылская": "zhm",
  "west kazakhstan": "zko", "batys qazaqstan": "zko", "batys": "zko", "зко": "zko", "западно-казахстанская": "zko",
  "qaraghandy":   "krg", "karaganda":    "krg", "karagandy":    "krg", "карагандинская": "krg",
  "qostanay":     "kst", "kostanay":     "kst", "костанайская": "kst",
  "qyzylorda":    "kyz", "kyzylorda":    "kyz", "кызылординская": "kyz",
  "mangghystau":  "mng", "mangystau":    "mng", "мангистауская": "mng",
  "pavlodar":     "pvl", "павлодарская":    "pvl",
  "soltüstik qazaqstan": "skz", "north kazakhstan": "skz", "ско": "skz", "северо-казахстанская": "skz",
  "turkistan":    "trk", "turkestan":    "trk", "south kazakhstan": "trk", "ongtüstik qazaqstan": "trk", "туркестанская": "trk",
  "ulytau":       "ult", "улытауская": "ult",
  "abai":         "aba", "abay":         "aba", "абайская": "aba",
  "jetisu":       "zht", "zhetysu":      "zht", "жетісу": "zht", "жетисуская": "zht",
  // ISO codes (simplemaps)
  "kz11": "akm", "kz15": "akt", "kz19": "alm", "kz23": "atr",
  "kz63": "vko", "kz31": "zhm", "kz27": "zko", "kz35": "krg",
  "kz39": "kst", "kz43": "kyz", "kz47": "mng", "kz55": "pvl",
  "kz59": "skz", "kz61": "trk", "kz62": "ult", "kz10": "aba", "kz33": "zht",
};

function matchFeatureToRegion(feature) {
  const props = feature.properties || {};
  const candidates = [
    props.NAME_1, props.name, props.shapeName, props.shapename,
    props.NAME, props.name_en, props.name_local, props.ADM1_EN,
    props.iso_3166_2, props.hasc_1, props.code,
  ].filter(Boolean);
  for (const c of candidates) {
    const key = c.toLowerCase().trim();
    if (NAME_TO_ID[key]) return NAME_TO_ID[key];
    // partial match
    for (const [pattern, id] of Object.entries(NAME_TO_ID)) {
      if (key.includes(pattern) || pattern.includes(key)) return id;
    }
  }
  return null;
}

let _geoCache = null;
async function loadBoundaries() {
  if (_geoCache) return _geoCache;
  for (const url of GEOJSON_URLS) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const geojson = await res.json();
      if (geojson?.features?.length) {
        // Build map: regionId → feature geometry
        const map = {};
        for (const f of geojson.features) {
          const id = matchFeatureToRegion(f);
          if (id) map[id] = f.geometry;
        }
        if (Object.keys(map).length >= 10) {
          _geoCache = map;
          console.log(`[DalaSpace] Loaded ${Object.keys(map).length} region boundaries`);
          return map;
        }
      }
    } catch (e) {
      console.warn("[DalaSpace] GeoJSON fetch failed:", url, e);
    }
  }
  return null;
}

function LeafletMap({ data, selected, onSelect, layer = "ndvi", height = "100%", drawMode = false, onAreaCapture }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const geoRef = useRef(null); // boundary geometries
  const drawRef = useRef({ active: false, rect: null, start: null });
  const baseRef = useRef(null);   // current base tile layer
  const labelsRef = useRef(null); // Esri labels overlay
  const hillRef = useRef(null);   // hillshade relief layer
  const heatRef = useRef(null);   // heatmap layer
  const miniRef = useRef(null);   // minimap instance
  const [ready, setReady] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [areaHa, setAreaHa] = useState(null);
  const [baseLayer, setBaseLayer] = useState("satellite");
  const [showHeat, setShowHeat] = useState(false);
  const [showRelief, setShowRelief] = useState(true);

  const getColor = useCallback((r) => {
    const d = data[r.id];
    if (!d) return T.isDark ? "#1e2428" : "#c8e0d4";
    if (layer === "moisture") return moistColor(d.cur?.soil_moisture_0_to_1cm || 0);
    if (layer === "temp") {
      const t = d.cur?.temperature_2m || 15;
      return t > 35 ? T.err : t > 28 ? T.warn : t > 15 ? T.ok : T.sky;
    }
    if (layer === "risk") return RISK_STYLE[d.risk || "medium"].color;
    return ndviColor(d.ndvi || 0.2);
  }, [data, layer]);

  // Init Leaflet + load boundaries
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await _leafletReady;
      if (cancelled || !containerRef.current || mapRef.current) return;

      // Inject dark styles once
      if (!document.getElementById("agro-leaflet-css")) {
        const st = document.createElement("style");
        st.id = "agro-leaflet-css"; st.textContent = getMapCSS();
        document.head.appendChild(st);
      }

      const L = window.L;
      const KZ_BOUNDS = [[40.5, 46.5], [55.5, 87.5]];
      const map = L.map(containerRef.current, {
        center: [48.5, 67.0],
        zoom: 5,
        zoomControl: true,
        attributionControl: false,
        minZoom: 5,
        maxZoom: 17,
        maxBounds: L.latLngBounds([39.5, 45], [56.5, 89]),
        maxBoundsViscosity: 1.0,
      });

      // Base layer (default: satellite)
      const baseCfg = BASE_LAYERS["satellite"];
      baseRef.current = L.tileLayer(baseCfg.url, { maxZoom: 18, crossOrigin: "anonymous" }).addTo(map);

      // Esri labels overlay
      labelsRef.current = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 18, opacity: 0.45 }
      ).addTo(map);

      // 3D Relief — Esri World Hillshade
      hillRef.current = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 18, opacity: 0.18 }
      ).addTo(map);

      // Minimap in corner
      try {
        const miniDiv = document.createElement("div");
        miniDiv.id = "dala-minimap";
        miniDiv.style.cssText = "width:120px;height:80px;border-radius:8px;overflow:hidden;border:2px solid rgba(5,150,105,0.3);box-shadow:0 4px 20px rgba(0,0,0,0.3);";
        const miniWrap = document.createElement("div");
        miniWrap.style.cssText = "position:absolute;bottom:14px;right:14px;z-index:1000;";
        miniWrap.appendChild(miniDiv);
        map.getContainer().appendChild(miniWrap);
        const mini = L.map(miniDiv, {
          center: [48.5, 67.0], zoom: 3,
          zoomControl: false, attributionControl: false,
          dragging: false, touchZoom: false, scrollWheelZoom: false,
          doubleClickZoom: false, boxZoom: false,
        });
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", { maxZoom: 6 }).addTo(mini);
        miniRef.current = { map: mini, marker: null };
      } catch(e) { console.warn("Minimap init failed", e); }

      mapRef.current = map;

      // Load boundaries in background
      loadBoundaries().then(geo => {
        if (!cancelled && geo) geoRef.current = geo;
        setReady(true);
      }).catch(() => setReady(true));
    })();
    return () => { cancelled = true; };
  }, []);

  // Switch base tile layer
  useEffect(() => {
    if (!ready || !mapRef.current || !window.L) return;
    const map = mapRef.current;
    const L = window.L;
    const cfg = BASE_LAYERS[baseLayer];
    if (!cfg) return;
    if (baseRef.current) map.removeLayer(baseRef.current);
    baseRef.current = L.tileLayer(cfg.url, { maxZoom: 18, crossOrigin: "anonymous" }).addTo(map);
    baseRef.current.bringToBack();
    // Re-add labels on top for satellite
    if (labelsRef.current) {
      labelsRef.current.setOpacity(baseLayer === "satellite" ? 0.45 : 0);
    }
  }, [ready, baseLayer]);

  // Toggle 3D relief
  useEffect(() => {
    if (!ready || !mapRef.current || !hillRef.current) return;
    hillRef.current.setOpacity(showRelief ? 0.18 : 0);
  }, [ready, showRelief]);

  // Heatmap layer
  useEffect(() => {
    if (!ready || !mapRef.current || !window.L?.heatLayer) return;
    const map = mapRef.current;
    // Remove old
    if (heatRef.current) { map.removeLayer(heatRef.current); heatRef.current = null; }
    if (!showHeat) return;
    // Generate heat points from region data
    const points = [];
    REGIONS.forEach(r => {
      const d = data[r.id];
      if (!d?.cur) return;
      const val = layer === "temp" ? Math.max(0, d.cur.temperature_2m || 0) / 45
        : layer === "moisture" ? (d.cur.soil_moisture_0_to_1cm || 0) * 2
        : layer === "risk" ? ({ critical: 1, high: 0.75, medium: 0.5, low: 0.25 }[d.risk] || 0.3)
        : (d.ndvi || 0.2);
      // Spread points around region center for smoother look
      for (let i = 0; i < 8; i++) {
        const jLat = (Math.random() - 0.5) * 1.5;
        const jLng = (Math.random() - 0.5) * 2;
        points.push([r.lat + jLat, r.lng + jLng, val]);
      }
    });
    heatRef.current = window.L.heatLayer(points, {
      radius: 45, blur: 35, maxZoom: 8,
      gradient: layer === "temp"
        ? { 0.2: "#3b82f6", 0.4: "#22c55e", 0.6: "#facc15", 0.8: "#f97316", 1: "#ef4444" }
        : layer === "moisture"
        ? { 0.2: "#ef4444", 0.4: "#facc15", 0.6: "#22c55e", 0.8: "#3b82f6", 1: "#6366f1" }
        : { 0.2: "#22c55e", 0.4: "#facc15", 0.6: "#f97316", 0.8: "#ef4444", 1: "#dc2626" },
    }).addTo(map);
  }, [ready, showHeat, data, layer]);

  // Minimap — sync selected region marker
  useEffect(() => {
    if (!miniRef.current?.map || !window.L) return;
    const mini = miniRef.current;
    const L = window.L;
    if (mini.marker) { mini.map.removeLayer(mini.marker); mini.marker = null; }
    if (selected) {
      mini.marker = L.circleMarker([selected.lat, selected.lng], {
        radius: 5, color: "#059669", fillColor: "#4ade80", fillOpacity: 1, weight: 2,
      }).addTo(mini.map);
    }
  }, [selected]);

  // Update region layers when data/layer/selected changes
  useEffect(() => {
    if (!ready || !mapRef.current || !window.L) return;
    const L = window.L;
    const map = mapRef.current;
    const geo = geoRef.current;

    // Remove old layers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    REGIONS.forEach(r => {
      const d = data[r.id];
      const color = getColor(r);
      const isSel = selected?.id === r.id;
      const boundary = geo?.[r.id];

      if (boundary) {
        // ── Polygon boundary ──
        const polyLayer = L.geoJSON(boundary, {
          style: {
            color: isSel ? "#059669" : "rgba(0,80,60,0.4)",
            weight: isSel ? 3 : 1.5,
            fillColor: color,
            fillOpacity: isSel ? 0.45 : 0.28,
            dashArray: isSel ? null : "4 2",
          },
        }).addTo(map);

        // Label at centroid
        const center = polyLayer.getBounds().getCenter();
        // Enhanced label with metric value
        const metricVal = d ? (
          layer === "temp" ? `${d.cur?.temperature_2m?.toFixed(0)}°`
          : layer === "moisture" ? `${(d.cur?.soil_moisture_0_to_1cm * 100).toFixed(0)}%`
          : layer === "risk" ? (RISK_STYLE[d.risk]?.icon || "")
          : `${d.ndvi?.toFixed(2)}`
        ) : "";
        const metricColor = d ? (
          layer === "temp" ? (d.cur?.temperature_2m > 30 ? T.err : d.cur?.temperature_2m > 20 ? T.warn : T.sky)
          : layer === "moisture" ? moistColor(d.cur?.soil_moisture_0_to_1cm || 0)
          : layer === "risk" ? (RISK_STYLE[d.risk]?.color || T.dim)
          : ndviColor(d.ndvi || 0.2)
        ) : T.dim;
        const label = L.tooltip({
          permanent: true,
          direction: "center",
          className: "",
        }).setContent(
          `<div style="background:${T.labelBg};color:${T.labelFg};padding:4px 10px;border-radius:8px;font-size:${isSel ? 12 : 10}px;font-weight:700;border:1px solid ${isSel ? 'rgba(5,150,105,0.4)' : 'rgba(0,80,60,0.15)'};font-family:Inter,system-ui;white-space:nowrap;display:flex;align-items:center;gap:5px;backdrop-filter:blur(6px);"><span>${r.code}</span><span style=\"font-size:${isSel ? 11 : 9}px;color:${metricColor};font-weight:800;\">${metricVal}</span></div>`
        );
        polyLayer.bindTooltip(label);

        // Popup with data
        if (d?.cur) {
          const riskS = RISK_STYLE[d.risk] || RISK_STYLE.medium;
          const popupHTML = `
            <div style="font-family:Inter,system-ui;min-width:190px;padding:4px 2px;">
              <div style="font-size:14px;font-weight:800;margin-bottom:10px;color:${T.fg};">${rn(r)}</div>
              <div style="display:grid;gap:5px;font-size:11px;">
                <div style="display:flex;justify-content:space-between;"><span style="color:${T.sub};">${LANG[_lang].temp}</span><span style="color:${T.fg};font-weight:700;">${d.cur.temperature_2m?.toFixed(1)}°C</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:${T.sub};">${LANG[_lang].soilMoisture}</span><span style="color:${T.sky};font-weight:700;">${(d.cur.soil_moisture_0_to_1cm * 100).toFixed(1)}%</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:${T.sub};">NDVI</span><span style="color:${T.ok};font-weight:700;">${d.ndvi?.toFixed(2)}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:${T.sub};">${LANG[_lang].precipWeek}</span><span style="color:${T.ok};font-weight:700;">${d.p7} мм</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:${T.sub};">ET₀</span><span style="color:${T.warn};font-weight:700;">${d.et} мм/д</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:${T.sub};">${LANG[_lang].status}</span><span style="color:${T.fg};">${wxKey(d.wx, LANG[_lang])}</span></div>
              </div>
              <div style="margin-top:10px;display:inline-flex;align-items:center;gap:4px;background:${riskS.bg};color:${riskS.color};border:1px solid ${riskS.brd};padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;">
                <span style="font-size:8px;">${riskS.icon}</span> ${riskS.label}
              </div>
              <div style="margin-top:8px;font-size:10px;color:${T.dim};">${LANG[_lang].arable}: ${r.crop.toLocaleString()} ${_lang==="en"?"k ha":"тыс.га"} · ${r.city}</div>
            </div>
          `;
          polyLayer.bindPopup(popupHTML, { className: "agro-popup", maxWidth: 260 });
        }

        polyLayer.on("click", () => onSelect(r));

        // Highlight pulse for selected
        if (isSel) {
          const highlight = L.geoJSON(boundary, {
            style: {
              color: "#059669",
              weight: 4,
              fillColor: "transparent",
              fillOpacity: 0,
              opacity: 0.6,
              className: "agro-pulse",
            },
          }).addTo(map);
          markersRef.current.push(highlight);
        }

        markersRef.current.push(polyLayer);
      } else {
        // ── Fallback: circle marker for regions without boundaries ──
        const radius = Math.max(10, Math.sqrt(r.crop / 200) * 2.5 + 6);

        const glow = L.circleMarker([r.lat, r.lng], {
          radius: radius + (isSel ? 16 : 8),
          color: "transparent", fillColor: color,
          fillOpacity: isSel ? 0.22 : 0.10,
        }).addTo(map);

        const marker = L.circleMarker([r.lat, r.lng], {
          radius: isSel ? radius + 3 : radius,
          color: isSel ? "#059669" : "rgba(0,60,40,0.3)",
          weight: isSel ? 3 : 2,
          fillColor: color,
          fillOpacity: isSel ? 0.95 : 0.8,
          className: isSel ? "agro-pulse" : "",
        }).addTo(map);

        const fbMetric = d ? (
          layer === "temp" ? `${d.cur?.temperature_2m?.toFixed(0)}°`
          : layer === "moisture" ? `${(d.cur?.soil_moisture_0_to_1cm * 100).toFixed(0)}%`
          : `${d.ndvi?.toFixed(2)}`
        ) : "";
        const label = L.tooltip({
          permanent: true,
          direction: "top",
          offset: [0, -radius - 4],
          className: "",
        }).setContent(
          `<div style="background:${T.labelBg};color:${T.labelFg};padding:4px 10px;border-radius:7px;font-size:11px;font-weight:700;border:1px solid rgba(0,80,60,0.15);font-family:Inter,system-ui;white-space:nowrap;display:flex;align-items:center;gap:4px;backdrop-filter:blur(6px);">${r.code} <span style=\"font-size:9px;opacity:0.7;\">${fbMetric}</span></div>`
        );
        marker.bindTooltip(label);

        if (d?.cur) {
          const riskS = RISK_STYLE[d.risk] || RISK_STYLE.medium;
          const popupHTML = `
            <div style="font-family:Inter,system-ui;min-width:190px;padding:4px 2px;">
              <div style="font-size:14px;font-weight:800;margin-bottom:10px;color:${T.fg};">${rn(r)}</div>
              <div style="display:grid;gap:5px;font-size:11px;">
                <div style="display:flex;justify-content:space-between;"><span style="color:${T.sub};">${LANG[_lang].temp}</span><span style="color:${T.fg};font-weight:700;">${d.cur.temperature_2m?.toFixed(1)}°C</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:${T.sub};">${LANG[_lang].soilMoisture}</span><span style="color:${T.sky};font-weight:700;">${(d.cur.soil_moisture_0_to_1cm * 100).toFixed(1)}%</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:${T.sub};">NDVI</span><span style="color:${T.ok};font-weight:700;">${d.ndvi?.toFixed(2)}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:${T.sub};">${LANG[_lang].precipWeek}</span><span style="color:${T.ok};font-weight:700;">${d.p7} мм</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:${T.sub};">ET₀</span><span style="color:${T.warn};font-weight:700;">${d.et} мм/д</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:${T.sub};">${LANG[_lang].status}</span><span style="color:${T.fg};">${wxKey(d.wx, LANG[_lang])}</span></div>
              </div>
              <div style="margin-top:10px;display:inline-flex;align-items:center;gap:4px;background:${riskS.bg};color:${riskS.color};border:1px solid ${riskS.brd};padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;">
                <span style="font-size:8px;">${riskS.icon}</span> ${riskS.label}
              </div>
              <div style="margin-top:8px;font-size:10px;color:${T.dim};">${LANG[_lang].arable}: ${r.crop.toLocaleString()} ${_lang==="en"?"k ha":"тыс.га"} · ${r.city}</div>
            </div>
          `;
          marker.bindPopup(popupHTML, { className: "agro-popup", maxWidth: 260 });
        }

        marker.on("click", () => onSelect(r));
        markersRef.current.push(marker, glow);
      }
    });
  }, [ready, data, layer, selected, getColor, onSelect]);

  // Fly to selected region
  useEffect(() => {
    if (!ready || !mapRef.current || !selected) return;
    const geo = geoRef.current;
    const L = window.L;
    if (geo?.[selected.id]) {
      try {
        const layer = L.geoJSON(geo[selected.id]);
        mapRef.current.flyToBounds(layer.getBounds().pad(0.15), { duration: 0.8 });
      } catch {
        mapRef.current.flyTo([selected.lat, selected.lng], 7, { duration: 0.8 });
      }
    } else {
      mapRef.current.flyTo([selected.lat, selected.lng], 7, { duration: 0.8 });
    }
  }, [ready, selected]);

  // Drawing mode — rectangle selection for satellite capture
  useEffect(() => {
    if (!ready || !mapRef.current || !window.L) return;
    const L = window.L;
    const map = mapRef.current;
    const dr = drawRef.current;

    if (!drawMode) {
      // Clean up draw state
      if (dr.rect) { map.removeLayer(dr.rect); dr.rect = null; }
      dr.active = false;
      map.dragging.enable();
      map.touchZoom?.enable();
      map.boxZoom?.enable();
      map.tap?.enable?.();
      map.getContainer().style.cursor = "";
      map.getContainer().style.touchAction = "";
      map.getContainer().style.userSelect = "";
      map.getContainer().style.webkitUserSelect = "";
      setDrawing(false);
      setAreaHa(null);
      return;
    }

    // Enable draw mode
    map.dragging.disable();
    map.touchZoom?.disable();
    map.doubleClickZoom?.disable();
    map.scrollWheelZoom?.disable();
    map.boxZoom?.disable();
    map.tap?.disable?.();
    map.getContainer().style.cursor = "crosshair";
    map.getContainer().style.touchAction = "none";
    map.getContainer().style.userSelect = "none";
    map.getContainer().style.webkitUserSelect = "none";
    setDrawing(true);
    setAreaHa(null);

    // Shared draw logic
    const drawStart = (latlng) => {
      dr.start = latlng;
      dr.active = true;
      setAreaHa(null);
      if (dr.rect) { map.removeLayer(dr.rect); dr.rect = null; }
    };

    const drawMove = (latlng) => {
      if (!dr.active || !dr.start) return;
      const bounds = L.latLngBounds(dr.start, latlng);
      if (dr.rect) {
        dr.rect.setBounds(bounds);
      } else {
        dr.rect = L.rectangle(bounds, {
          color: T.violet, weight: 2, fillColor: T.violet, fillOpacity: 0.15,
          dashArray: "6 3",
        }).addTo(map);
      }
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      setAreaHa(calcHectares(sw, ne));
    };

    const drawEnd = async (latlng) => {
      if (!dr.active || !dr.start) return;
      dr.active = false;
      const bounds = L.latLngBounds(dr.start, latlng);
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      if (Math.abs(ne.lat - sw.lat) < 0.002 || Math.abs(ne.lng - sw.lng) < 0.002) return;

      const ha = calcHectares(sw, ne);
      setAreaHa(ha);

      if (onAreaCapture) {
        setCapturing(true);
        try {
          // Method 1: Canvas capture from the live map (no CORS issues)
          let dataUrl = null;
          try {
            const container = map.getContainer();
            const mapRect = container.getBoundingClientRect();
            const swPx = map.latLngToContainerPoint(sw);
            const nePx = map.latLngToContainerPoint(ne);
            const x = Math.min(swPx.x, nePx.x);
            const y = Math.min(swPx.y, nePx.y);
            const w = Math.abs(nePx.x - swPx.x);
            const h = Math.abs(nePx.y - swPx.y);

            // Gather all tile images from the map container
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(w, 100);
            canvas.height = Math.max(h, 100);
            const ctx2d = canvas.getContext("2d");

            // Draw map tiles onto canvas
            const tiles = container.querySelectorAll(".leaflet-tile-pane img");
            let drawn = 0;
            tiles.forEach(tile => {
              try {
                const tileRect = tile.getBoundingClientRect();
                const dx = tileRect.left - mapRect.left - x;
                const dy = tileRect.top - mapRect.top - y;
                ctx2d.drawImage(tile, dx, dy, tileRect.width, tileRect.height);
                drawn++;
              } catch(e) { /* crossOrigin tile, skip */ }
            });

            if (drawn > 0) {
              dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            }
          } catch(canvasErr) {
            console.warn("Canvas capture failed:", canvasErr);
          }

          // Method 2: Esri export API fallback
          if (!dataUrl || dataUrl.length < 500) {
            try {
              const bbox = `${sw.lng},${sw.lat},${ne.lng},${ne.lat}`;
              const esriUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${bbox}&bboxSR=4326&size=900,600&imageSR=4326&format=jpg&f=image`;
              const res = await fetch(esriUrl);
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const blob = await res.blob();
              if (!blob || blob.size < 1000) throw new Error("Empty response");
              dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = () => reject(new Error("FileReader failed"));
                reader.readAsDataURL(blob);
              });
            } catch(esriErr) {
              console.warn("Esri export failed:", esriErr);
            }
          }

          // Method 3: Generate a placeholder with coordinates if both methods fail
          if (!dataUrl || dataUrl.length < 500) {
            const placeholderCanvas = document.createElement("canvas");
            placeholderCanvas.width = 900; placeholderCanvas.height = 600;
            const pCtx = placeholderCanvas.getContext("2d");
            // Dark green background
            pCtx.fillStyle = "#1a3a2a";
            pCtx.fillRect(0, 0, 900, 600);
            // Grid lines
            pCtx.strokeStyle = "rgba(74,222,128,0.15)";
            pCtx.lineWidth = 1;
            for (let i = 0; i < 900; i += 60) { pCtx.beginPath(); pCtx.moveTo(i, 0); pCtx.lineTo(i, 600); pCtx.stroke(); }
            for (let i = 0; i < 600; i += 60) { pCtx.beginPath(); pCtx.moveTo(0, i); pCtx.lineTo(900, i); pCtx.stroke(); }
            // Text
            pCtx.fillStyle = "#4ade80";
            pCtx.font = "bold 18px Inter, system-ui";
            pCtx.textAlign = "center";
            pCtx.fillText("DalaSpace — Satellite Area Capture", 450, 260);
            pCtx.fillStyle = "rgba(255,255,255,0.5)";
            pCtx.font = "14px Inter, system-ui";
            pCtx.fillText(`${sw.lat.toFixed(4)}°N, ${sw.lng.toFixed(4)}°E → ${ne.lat.toFixed(4)}°N, ${ne.lng.toFixed(4)}°E`, 450, 300);
            pCtx.fillText(`${formatHa(ha)}`, 450, 325);
            dataUrl = placeholderCanvas.toDataURL("image/jpeg", 0.9);
          }

          if (dataUrl && dataUrl.length > 100) {
            onAreaCapture({
              preview: dataUrl,
              bounds: { sw: { lat: sw.lat, lng: sw.lng }, ne: { lat: ne.lat, lng: ne.lng } },
              name: `Спутник_${sw.lat.toFixed(2)}_${sw.lng.toFixed(2)}_${ne.lat.toFixed(2)}_${ne.lng.toFixed(2)}.jpg`,
              hectares: ha,
            });
          }
          setCapturing(false);
          setAreaHa(null);
        } catch (err) {
          console.error("Area capture error:", err);
          setCapturing(false);
          setAreaHa(null);
        }
      }
    };

    // Mouse events
    const onMouseDown = (e) => drawStart(e.latlng);
    const onMouseMove = (e) => drawMove(e.latlng);
    const onMouseUp = (e) => drawEnd(e.latlng);

    // Touch events — on the DOM container
    const el = map.getContainer();
    const touchToLatLng = (touch) => {
      const rect = el.getBoundingClientRect();
      const point = L.point(touch.clientX - rect.left, touch.clientY - rect.top);
      return map.containerPointToLatLng(point);
    };

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      drawStart(touchToLatLng(e.touches[0]));
    };
    const onTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      drawMove(touchToLatLng(e.touches[0]));
    };
    const onTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      if (!touch) return;
      e.preventDefault();
      drawEnd(touchToLatLng(touch));
    };

    map.on("mousedown", onMouseDown);
    map.on("mousemove", onMouseMove);
    map.on("mouseup", onMouseUp);
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      map.off("mousedown", onMouseDown);
      map.off("mousemove", onMouseMove);
      map.off("mouseup", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      map.dragging.enable();
      map.touchZoom?.enable();
      map.doubleClickZoom?.enable();
      map.scrollWheelZoom?.enable();
      map.boxZoom?.enable();
      map.tap?.enable?.();
      map.getContainer().style.cursor = "";
      map.getContainer().style.touchAction = "";
      map.getContainer().style.userSelect = "";
      map.getContainer().style.webkitUserSelect = "";
    };
  }, [ready, drawMode, onAreaCapture]);

  // Resize handler — periodically invalidate to handle container changes
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const doResize = () => map.invalidateSize();
    // Initial + delayed invalidation covers most layout shifts
    doResize();
    const t1 = setTimeout(doResize, 200);
    const t2 = setTimeout(doResize, 600);
    const t3 = setTimeout(doResize, 1500);
    window.addEventListener("resize", doResize);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      window.removeEventListener("resize", doResize);
    };
  }, [ready, height]);

  const containerHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div style={{ position: "relative", width: "100%", height: containerHeight }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", borderRadius: "inherit", zIndex: 1 }} />

      {/* Live indicator overlay */}
      <div style={{
        position: "absolute", bottom: 14, left: 14, zIndex: 1000,
        display: "flex", alignItems: "center", gap: 6,
        background: T.labelBg, padding: "5px 12px",
        borderRadius: 20, backdropFilter: "blur(8px)",
        border: `1px solid ${T.brd}`,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%", background: drawing ? T.violet : T.leaf,
          display: "inline-block", animation: "blink 2s infinite",
        }} />
        <span style={{ fontSize: 10, color: drawing ? T.violet : T.dim }}>
          {drawing ? "Выделите область мышью" : "Open-Meteo · Esri Satellite · live"}
        </span>
      </div>

      {/* Draw mode banner */}
      {drawing && (
        <div style={{
          position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 1000,
          background: "rgba(124,58,237,0.08)", padding: "8px 20px",
          borderRadius: 12, backdropFilter: "blur(10px)",
          border: `1px solid rgba(124,58,237,0.3)`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 14 }}>✦</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.violet }}>
            {areaHa != null && areaHa > 0
              ? `Выделено: ${formatHa(areaHa)}`
              : "Проведите пальцем по карте для выделения"}
          </span>
          {areaHa != null && areaHa > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 800, color: T.fg,
              background: "rgba(124,58,237,0.2)", padding: "2px 10px",
              borderRadius: 8, marginLeft: 2,
            }}>
              {areaHa >= 100 ? `≈ ${Math.round(areaHa).toLocaleString()} га` : `≈ ${areaHa.toFixed(1)} га`}
            </span>
          )}
        </div>
      )}

      {/* Capturing overlay */}
      {capturing && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 1001,
          background: T.labelBg, boxShadow: T.headerSh,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 12, borderRadius: "inherit",
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            border: `3px solid ${T.brd}`, borderTopColor: T.violet,
            animation: "revolve 1s linear infinite",
          }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: T.violet }}>{LANG[_lang].loadingSat||"Loading..."}</span>
        </div>
      )}

      {/* Gradient legend */}
      <div style={{
        position: "absolute", top: 14, right: 14, zIndex: 1000,
        background: T.labelBg, padding: "10px 14px 8px",
        borderRadius: 12, backdropFilter: "blur(10px)",
        border: `1px solid ${T.brd}`, width: 180,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.fg, marginBottom: 6 }}>
          {layer === "ndvi" ? "NDVI" : layer === "moisture" ? LANG[_lang].soilMoisture : layer === "temp" ? LANG[_lang].temp : LANG[_lang].risk || "Risk"}
        </div>
        <div style={{
          height: 8, borderRadius: 4,
          background: layer === "ndvi"
            ? "linear-gradient(90deg, #ef4444, #f97316, #facc15, #22c55e, #059669)"
            : layer === "moisture"
            ? "linear-gradient(90deg, #ef4444, #facc15, #22c55e, #3b82f6, #6366f1)"
            : layer === "temp"
            ? "linear-gradient(90deg, #3b82f6, #22c55e, #facc15, #f97316, #ef4444)"
            : "linear-gradient(90deg, #059669, #22c55e, #facc15, #f97316, #ef4444)",
        }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: T.dim }}>
          {layer === "ndvi" ? <><span>0.05</span><span>0.25</span><span>0.55</span><span>0.85</span></> : null}
          {layer === "moisture" ? <><span>&lt;10%</span><span>18%</span><span>30%</span><span>&gt;40%</span></> : null}
          {layer === "temp" ? <><span>&lt;5°</span><span>15°</span><span>28°</span><span>&gt;35°</span></> : null}
          {layer === "risk" ? <><span>Low</span><span>Medium</span><span>High</span><span>Critical</span></> : null}
        </div>
      </div>

      {/* Map controls — base layers + toggles */}
      {!drawing && (
        <div style={{
          position: "absolute", top: 14, left: 14, zIndex: 1000,
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {/* Base layer switcher */}
          <div style={{
            background: T.labelBg, borderRadius: 10, backdropFilter: "blur(10px)",
            border: `1px solid ${T.brd}`, padding: 3, display: "flex", gap: 2,
          }}>
            {Object.entries(BASE_LAYERS).map(([key, cfg]) => (
              <button key={key} onClick={() => setBaseLayer(key)} title={cfg.name} style={{
                width: 32, height: 28, borderRadius: 7, border: "none", cursor: "pointer",
                background: baseLayer === key ? `${T.leaf}20` : "transparent",
                color: baseLayer === key ? T.leaf : T.dim,
                fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
                outline: baseLayer === key ? `1px solid ${T.leaf}40` : "none",
              }}>{cfg.label}</button>
            ))}
          </div>

          {/* Toggle buttons */}
          <div style={{
            background: T.labelBg, borderRadius: 10, backdropFilter: "blur(10px)",
            border: `1px solid ${T.brd}`, padding: 3, display: "flex", gap: 2,
          }}>
            <button onClick={() => setShowHeat(h => !h)} title="Heatmap" style={{
              height: 28, padding: "0 10px", borderRadius: 7, border: "none", cursor: "pointer",
              background: showHeat ? `${T.warn}20` : "transparent",
              color: showHeat ? T.warn : T.dim,
              fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 4,
            }}>🔥 Heat</button>
            <button onClick={() => setShowRelief(r => !r)} title="3D Relief" style={{
              height: 28, padding: "0 10px", borderRadius: 7, border: "none", cursor: "pointer",
              background: showRelief ? `${T.sky}20` : "transparent",
              color: showRelief ? T.sky : T.dim,
              fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 4,
            }}>⛰️ 3D</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: OVERVIEW
   ═══════════════════════════════════════════════════ */
function PageOverview({ data, regions, selected, onSelect, onAreaCapture, t, lang }) {
  const valid = regions.filter(r => data[r.id]?.cur);
  const n = valid.length || 1;
  const sel = data[selected?.id];
  const [drawMode, setDrawMode] = useState(false);

  const handleCapture = useCallback((areaData) => {
    setDrawMode(false);
    if (onAreaCapture) onAreaCapture(areaData);
  }, [onAreaCapture]);

  const stats = useMemo(() => ({
    temp:   (valid.reduce((s, r) => s + (data[r.id].cur.temperature_2m || 0), 0) / n).toFixed(1),
    moist:  ((valid.reduce((s, r) => s + (data[r.id].cur.soil_moisture_0_to_1cm || 0), 0) / n) * 100).toFixed(1),
    ndvi:   (valid.reduce((s, r) => s + (data[r.id].ndvi || 0), 0) / n).toFixed(2),
    risk:   valid.filter(r => ["critical", "high"].includes(data[r.id].risk)).length,
    area:   regions.reduce((s, r) => s + r.crop, 0).toLocaleString(),
    yield:  Math.round(valid.reduce((s, r) => s + (data[r.id].yieldScore || 0), 0) / n),
    water:  Math.round(valid.reduce((s, r) => s + (data[r.id].waterStress || 0), 0) / n * 100),
  }), [valid, data, regions, n]);

  const pie = useMemo(() => {
    const c = { low: 0, medium: 0, high: 0, critical: 0 };
    valid.forEach(r => { if (data[r.id].risk) c[data[r.id].risk]++; });
    return Object.entries(c).filter(([, v]) => v > 0).map(([k, v]) => ({
      name: RISK_STYLE[k].label, value: v, color: RISK_STYLE[k].color,
    }));
  }, [valid, data]);

  return (
    <div style={{ display: "grid", gap: 22 }}>
      {/* KPI row */}
      <div className="g-auto" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <Stat icon="◎" title={t.avgTemp} value={stats.temp} unit="°C" accent={T.err} note={t.allRegions} />
        <Stat icon="◇" title={t.soilMoisture} value={stats.moist} unit="%" accent={T.sky} note="0–1 cm" />
        <Stat icon="◈" title={t.avgNDVI} value={stats.ndvi} accent={T.leaf} note="" />
        <Stat icon="△" title={t.riskZones} value={stats.risk} unit={lang==="en"?"reg.":"рег."} accent={T.warn} note={`${t.high} + ${t.critical}`} />
        <Stat icon="▤" title={t.yieldIdx} value={stats.yield} unit="/100" accent={T.ok} note="" />
        <Stat icon="◆" title={t.waterStress} value={stats.water} unit="%" accent={T.gold} note="" />
      </div>

      {/* Map + selected region */}
      <div className="g-map" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 16 }}>
        <Panel style={{ padding: 0, overflow: "hidden", minHeight: 340, borderRadius: 18, position: "relative" }}>
          <LeafletMap data={data} selected={selected} onSelect={drawMode ? () => {} : onSelect} layer="ndvi" height="100%" drawMode={drawMode} onAreaCapture={handleCapture} />
          {/* Draw mode toggle */}
          <div style={{ position: "absolute", top: 90, left: 14, zIndex: 1000, display: "flex", gap: 8 }}>
            <button onClick={() => setDrawMode(!drawMode)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 14px", borderRadius: 10, cursor: "pointer",
              border: drawMode ? `1px solid rgba(124,58,237,0.4)` : `1px solid ${T.brd}`,
              background: drawMode ? "rgba(124,58,237,0.08)" : T.labelBg,
              color: drawMode ? T.violet : T.fg,
              fontSize: 11, fontWeight: 700, backdropFilter: "blur(10px)",
              transition: "all 0.2s", minHeight: 40,
            }}>
              <span style={{ fontSize: 13 }}>{drawMode ? "✕" : "⬡"}</span>
              {drawMode ? t.cancel : t.drawForAI}
            </button>
          </div>
        </Panel>

        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          {/* Selected region card */}
          <Panel>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.fg }}>{selected?.name}</div>
                <div style={{ fontSize: 10, color: T.dim, marginTop: 2 }}>{selected?.city} · {selected?.crop?.toLocaleString()} {lang==="en"?"k ha":"тыс.га"}</div>
              </div>
              {sel && <Badge level={sel.risk} />}
            </div>
            {sel?.cur ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  ["◎", t.temp, `${sel.cur.temperature_2m?.toFixed(1)}°C`],
                  ["◇", "Влажн. возд.", `${sel.cur.relative_humidity_2m}%`],
                  ["◈", "Влажн. почвы", `${(sel.cur.soil_moisture_0_to_1cm * 100).toFixed(1)}%`],
                  ["△", "Темп. почвы", `${sel.cur.soil_temperature_0cm?.toFixed(1)}°C`],
                  ["▷", "Ветер", `${sel.cur.wind_speed_10m?.toFixed(1)} км/ч`],
                  ["◇", "Осадки 7д", `${sel.p7} мм`],
                  ["○", "ET₀", `${sel.et} мм/д`],
                  ["◈", "NDVI", sel.ndvi?.toFixed(2)],
                  ["▤", t.yieldLabel, `${sel.yieldScore}/100`],
                  ["◆", "Вод. стресс", `${((sel.waterStress || 0) * 100).toFixed(0)}%`],
                ].map(([ic, label, val]) => (
                  <div key={label} style={{
                    background: T.innerBg, borderRadius: 8, padding: "7px 10px",
                  }}>
                    <div style={{ fontSize: 9, color: T.dim, marginBottom: 2 }}>{ic}  {label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.fg }}>{val}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: T.dim, fontSize: 13 }}>Нет данных</div>
            )}
            {sel?.wx && (
              <div style={{
                marginTop: 10, padding: "8px 12px", background: T.innerBg,
                borderRadius: 10, fontSize: 12, color: T.sub,
              }}>{wxKey(sel.wx, LANG[_lang])}</div>
            )}
          </Panel>

          {/* Risk pie */}
          <Panel>
            <Title>Распределение рисков</Title>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={pie} dataKey="value" cx="42%" cy="50%" innerRadius={36} outerRadius={56} strokeWidth={0}>
                  {pie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Legend iconType="circle" iconSize={6} formatter={v => <span style={{ color: T.sub, fontSize: 11 }}>{v}</span>} />
                <Tooltip contentStyle={tipStyle()} />
              </PieChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      </div>

      {/* Charts row */}
      {sel?.chart && (
        <div className="g-charts" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <Panel>
            <Title>Температура · {selected?.name}</Title>
            <ResponsiveContainer width="100%" height={155}>
              <AreaChart data={sel.chart}>
                <defs>
                  <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.err} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={T.err} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,60,40,0.08)" />
                <XAxis dataKey="label" tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} unit="°" />
                <Tooltip contentStyle={tipStyle()} />
                <Area type="monotone" dataKey="tMax" stroke={T.err} fill="url(#tGrad)" strokeWidth={2} name="Макс °C" />
                <Line type="monotone" dataKey="tMin" stroke={T.sky} strokeWidth={1.5} dot={false} name="Мин °C" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel>
            <Title>Осадки vs Испарение</Title>
            <ResponsiveContainer width="100%" height={155}>
              <BarChart data={sel.chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,60,40,0.08)" />
                <XAxis dataKey="label" tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tipStyle()} />
                <Bar dataKey="rain" fill={T.sky} radius={[3, 3, 0, 0]} name="Осадки мм" />
                <Bar dataKey="et0" fill="rgba(217,119,6,0.45)" radius={[3, 3, 0, 0]} name="ET₀ мм" />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel>
            <Title>Баланс влаги</Title>
            <ResponsiveContainer width="100%" height={155}>
              <BarChart data={sel.chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,60,40,0.08)" />
                <XAxis dataKey="label" tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} unit=" мм" />
                <Tooltip contentStyle={tipStyle()} formatter={v => [`${v} мм`, t.balance]} />
                <Bar dataKey="balance" radius={[3, 3, 0, 0]} name={t.balance}>
                  {sel.chart.map((e, i) => <Cell key={i} fill={e.balance >= 0 ? T.ok : T.err} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 10, color: T.dim, marginTop: 6 }}>
              <span style={{ color: T.ok }}>■</span> профицит  <span style={{ color: T.err }}>■</span> дефицит
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: MAP
   ═══════════════════════════════════════════════════ */
function PageMap({ data, regions, selected, onSelect, t, lang }) {
  const [layer, setLayer] = useState("ndvi");
  const layers = [
    { key: "ndvi",     label: "NDVI" },
    { key: "moisture", label: t.humidity },
    { key: "temp",     label: t.temp },
    { key: "risk",     label: t.risk },
  ];

  return (
    <div className="g-map" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 270px", gap: 16, height: "calc(100dvh - 140px)", minHeight: 320 }}>
      <Panel style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", borderRadius: 18 }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.brd}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {layers.map(l => (
            <button key={l.key} onClick={() => setLayer(l.key)} style={{
              padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600,
              border: layer === l.key ? `1px solid ${T.brdAct}` : "1px solid transparent",
              background: layer === l.key ? "rgba(5,150,105,0.1)" : T.hover,
              color: layer === l.key ? T.leaf : T.sub,
            }}>{l.label}</button>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <LeafletMap data={data} selected={selected} onSelect={onSelect} layer={layer} height="100%" />
        </div>
      </Panel>

      <Panel style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.brd}`, fontSize: 13, fontWeight: 700, color: T.fg }}>
          {t.regions}
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
          {regions.map(r => {
            const d = data[r.id];
            const isSel = selected?.id === r.id;
            return (
              <div key={r.id} onClick={() => onSelect(r)} style={{
                padding: "10px 12px", borderRadius: 11, marginBottom: 4, cursor: "pointer",
                background: isSel ? "rgba(5,150,105,0.06)" : "rgba(0,60,40,0.02)",
                border: `1px solid ${isSel ? T.brdAct : T.brd}`, transition: "all 0.15s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: d ? 4 : 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: isSel ? T.leaf : T.fg }}>{rn(r)}</span>
                  {d && <Badge level={d.risk} />}
                </div>
                {d?.cur && (
                  <div style={{ display: "flex", gap: 10, fontSize: 10, color: T.dim }}>
                    <span>{d.cur.temperature_2m?.toFixed(1)}°C</span>
                    <span style={{ color: moistColor(d.cur.soil_moisture_0_to_1cm) }}>
                      {(d.cur.soil_moisture_0_to_1cm * 100).toFixed(0)}%
                    </span>
                    <span style={{ color: ndviColor(d.ndvi) }}>NDVI {d.ndvi?.toFixed(2)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: REGIONS TABLE
   ═══════════════════════════════════════════════════ */
function PageRegions({ data, regions, onSelect, navigate, t, lang }) {
  const [sort, setSort] = useState("name");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    let list = regions.map(r => ({ ...r, d: data[r.id] })).filter(r => r.d?.cur);
    if (filter !== "all") list = list.filter(r => r.d.risk === filter);
    if (query) list = list.filter(r => rn(r).toLowerCase().includes(query.toLowerCase()) || r.name.toLowerCase().includes(query.toLowerCase()));
    const riskOrd = { critical: 0, high: 1, medium: 2, low: 3 };
    list.sort((a, b) => {
      if (sort === "name")  return a.name.localeCompare(b.name);
      if (sort === "temp")  return (b.d.cur.temperature_2m || 0) - (a.d.cur.temperature_2m || 0);
      if (sort === "moist") return (b.d.cur.soil_moisture_0_to_1cm || 0) - (a.d.cur.soil_moisture_0_to_1cm || 0);
      if (sort === "ndvi")  return (b.d.ndvi || 0) - (a.d.ndvi || 0);
      if (sort === "yield") return (b.d.yieldScore || 0) - (a.d.yieldScore || 0);
      if (sort === "risk")  return (riskOrd[a.d.risk] || 2) - (riskOrd[b.d.risk] || 2);
      return 0;
    });
    return list;
  }, [regions, data, sort, filter, query]);

  const cols = [
    ["name",  t.regionCol],   ["temp",  t.tempCol],      ["moist", t.humidity],
    [null,    "Возд."],    [null,    "Ветер"],       [null,    "Осадки 7д"],
    [null,    "ET₀"],      ["ndvi",  "NDVI"],        ["yield", t.yieldLabel],
    [null,    "Водный стресс"],     ["risk",  "Риск"],        [null,    "Погода"],
  ];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search}
          style={{
            padding: "8px 14px", borderRadius: 10, border: `1px solid ${T.brd}`,
            background: T.innerBg, color: T.fg, fontSize: 13, outline: "none", width: 170,
          }} />
        <div style={{ display: "flex", gap: 2, background: "rgba(0,60,40,0.025)", borderRadius: 10, padding: 3 }}>
          {["all", "critical", "high", "medium", "low"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "4px 11px", borderRadius: 7, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 600,
              background: filter === f ? T.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,60,40,0.06)" : "transparent",
              color: f === "all" ? (filter === f ? T.fg : T.dim) : (filter === f ? RISK_STYLE[f]?.color : T.dim),
            }}>
              {f === "all" ? "Все" : RISK_STYLE[f]?.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: T.dim, marginLeft: "auto" }}>{rows.length} / {regions.length}</span>
      </div>

      <Panel style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.brd}` }}>
                {cols.map(([key, label]) => (
                  <th key={label} onClick={() => key && setSort(key)} style={{
                    padding: "12px 13px", textAlign: "left", whiteSpace: "nowrap",
                    color: key && sort === key ? T.sky : T.dim, fontWeight: 700, fontSize: 11,
                    cursor: key ? "pointer" : "default", background: "rgba(0,60,40,0.02)",
                  }}>
                    {label}{key && sort === key ? " ↓" : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const d = r.d;
                return (
                  <tr key={r.id}
                    onClick={() => { onSelect(r); navigate("overview"); }}
                    style={{ cursor: "pointer", borderBottom: `1px solid ${T.innerBg}`, transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.hover}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "11px 13px" }}>
                      <div style={{ fontWeight: 700, color: T.fg }}>{rn(r)}</div>
                      <div style={{ fontSize: 10, color: T.dim }}>{r.city}</div>
                    </td>
                    <td style={{ padding: "11px 13px", fontWeight: 700, color: d.cur.temperature_2m > 35 ? T.err : d.cur.temperature_2m < 0 ? T.sky : T.fg }}>
                      {d.cur.temperature_2m?.toFixed(1)}°C
                    </td>
                    <td style={{ padding: "11px 13px", minWidth: 130 }}><MoistureBar value={d.cur.soil_moisture_0_to_1cm} /></td>
                    <td style={{ padding: "11px 13px", color: T.sub }}>{d.cur.relative_humidity_2m}%</td>
                    <td style={{ padding: "11px 13px", color: T.sub }}>{d.cur.wind_speed_10m?.toFixed(1)} км/ч</td>
                    <td style={{ padding: "11px 13px", color: T.leaf, fontWeight: 600 }}>{d.p7} мм</td>
                    <td style={{ padding: "11px 13px", color: T.gold }}>{d.et} мм/д</td>
                    <td style={{ padding: "11px 13px" }}>
                      <span style={{ fontWeight: 800, color: ndviColor(d.ndvi), fontSize: 14 }}>{d.ndvi?.toFixed(2)}</span>
                    </td>
                    <td style={{ padding: "11px 13px" }}>
                      <span style={{
                        fontWeight: 700, fontSize: 12,
                        color: d.yieldScore > 70 ? T.ok : d.yieldScore > 45 ? T.warn : T.err,
                      }}>{d.yieldScore || "—"}</span>
                    </td>
                    <td style={{ padding: "11px 13px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{
                          width: 40, height: 5, borderRadius: 3, background: T.brd, overflow: "hidden",
                        }}>
                          <div style={{
                            width: `${(d.waterStress || 0) * 100}%`, height: "100%", borderRadius: 3,
                            background: d.waterStress > 0.7 ? T.ok : d.waterStress > 0.4 ? T.warn : T.err,
                          }} />
                        </div>
                        <span style={{ fontSize: 10, color: T.sub }}>{((d.waterStress || 0) * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 13px" }}><Badge level={d.risk} /></td>
                    <td style={{ padding: "11px 13px", color: T.sub, fontSize: 11 }}>{wxKey(d.wx, LANG[_lang])}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: DROUGHT
   ═══════════════════════════════════════════════════ */
function PageDrought({ data, regions, selected, onSelect, t, lang }) {
  const valid = regions.filter(r => data[r.id]?.cur);
  const sel = data[selected?.id];

  const sorted = useMemo(() => {
    const ord = { critical: 0, high: 1, medium: 2, low: 3 };
    return valid.map(r => ({ ...r, d: data[r.id] })).sort((a, b) => (ord[a.d.risk] || 2) - (ord[b.d.risk] || 2));
  }, [valid, data]);

  const stats = useMemo(() => ({
    maxT:  Math.max(...valid.map(r => data[r.id].cur.temperature_2m || 0)).toFixed(1),
    minM:  (Math.min(...valid.map(r => data[r.id].cur.soil_moisture_0_to_1cm || 1)) * 100).toFixed(1),
    maxET: Math.max(...valid.map(r => data[r.id].et || 0)).toFixed(1),
    crit:  valid.filter(r => data[r.id].risk === "critical").length,
  }), [valid, data]);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="g-auto" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12 }}>
        <Stat icon="△" title={t.maxTemp} value={stats.maxT} unit="°C" accent={T.err} note={t.allRegions} />
        <Stat icon="◇" title="Мин. влажность" value={stats.minM} unit="%" accent={T.gold} note="самый сухой" />
        <Stat icon="○" title={t.maxET} value={stats.maxET} unit={lang==="en"?"mm/d":"мм/д"} accent={T.violet} note="FAO Penman-Monteith" />
        <Stat icon="◉" title="Критических" value={stats.crit} accent={T.crit} note="зон засухи" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16 }}>
        <Panel>
          <Title>Рейтинг по риску засухи</Title>
          <div style={{ display: "grid", gap: 6, maxHeight: 380, overflow: "auto" }}>
            {sorted.map((r, i) => (
              <div key={r.id} onClick={() => onSelect(r)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 10, cursor: "pointer",
                background: selected?.id === r.id ? T.hover : "rgba(0,60,40,0.02)",
                border: `1px solid ${RISK_STYLE[r.d.risk].brd}`, transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 11, color: T.dim, minWidth: 22, fontWeight: 700 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.fg }}>{rn(r)}</div>
                  <div style={{ fontSize: 10, color: T.dim }}>
                    {r.d.cur.temperature_2m?.toFixed(1)}°C · {(r.d.cur.soil_moisture_0_to_1cm * 100).toFixed(0)}% · {r.d.p7}мм
                  </div>
                </div>
                <Badge level={r.d.risk} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Title>Дефицит влаги — Осадки vs Испарение</Title>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart layout="vertical" data={sorted.slice(0, 12).map(r => ({
              name: r.code, precip: r.d.p7, deficit: +Math.max(0, r.d.et * 7 - r.d.p7).toFixed(1),
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,60,40,0.08)" />
              <XAxis type="number" tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} unit=" мм" />
              <YAxis dataKey="name" type="category" tick={{ fill: T.sub, fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={tipStyle()} />
              <Bar dataKey="precip" fill={T.sky} radius={[0, 3, 3, 0]} name="Осадки мм" stackId="a" />
              <Bar dataKey="deficit" fill="rgba(220,38,38,0.5)" radius={[0, 3, 3, 0]} name="Дефицит мм" stackId="b" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {sel?.chart && (
        <div className="g-charts" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <Panel>
            <Title>Температура · {selected?.name}</Title>
            <ResponsiveContainer width="100%" height={165}>
              <AreaChart data={sel.chart}>
                <defs>
                  <linearGradient id="drT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.err} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={T.err} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,60,40,0.08)" />
                <XAxis dataKey="label" tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} unit="°" />
                <Tooltip contentStyle={tipStyle()} />
                <Area type="monotone" dataKey="tMax" stroke={T.err} fill="url(#drT)" strokeWidth={2} name="Макс °C" />
                <Line type="monotone" dataKey="tMin" stroke={T.sky} strokeWidth={1.5} dot={false} name="Мин °C" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
          <Panel>
            <Title>Баланс влаги · {selected?.name}</Title>
            <ResponsiveContainer width="100%" height={165}>
              <BarChart data={sel.chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,60,40,0.08)" />
                <XAxis dataKey="label" tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} unit=" мм" />
                <Tooltip contentStyle={tipStyle()} formatter={v => [`${v} мм`, t.balance]} />
                <Bar dataKey="balance" radius={[3, 3, 0, 0]} name={t.balance}>
                  {sel.chart.map((e, i) => <Cell key={i} fill={e.balance >= 0 ? T.ok : T.err} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: WATER
   ═══════════════════════════════════════════════════ */
function PageWater({ data, regions, t, lang }) {
  const valid = regions.filter(r => data[r.id]?.cur);
  const n = valid.length || 1;

  const sorted = useMemo(() =>
    valid.map(r => ({ ...r, d: data[r.id] }))
      .sort((a, b) => (b.d.cur.soil_moisture_0_to_1cm || 0) - (a.d.cur.soil_moisture_0_to_1cm || 0))
  , [valid, data]);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="g-auto" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12 }}>
        <Stat icon="◇" title={t.avgSoilMoist} value={(valid.reduce((s, r) => s + (data[r.id].cur.soil_moisture_0_to_1cm || 0), 0) / n * 100).toFixed(1)} unit="%" accent={T.sky} note="0–1 cm" />
        <Stat icon="◈" title={t.avgPrecip7} value={(valid.reduce((s, r) => s + (data[r.id].p7 || 0), 0) / n).toFixed(1)} unit="мм" accent={T.leaf} note={t.allRegions} />
        <Stat icon="○" title={t.avgET} value={(valid.reduce((s, r) => s + (data[r.id].et || 0), 0) / n).toFixed(1)} unit={lang==="en"?"mm/d":"мм/д"} accent={T.gold} note="FAO-56" />
        <Stat icon="◎" title={t.avgSoilTemp} value={(valid.reduce((s, r) => s + (data[r.id].cur.soil_temperature_0cm || 0), 0) / n).toFixed(1)} unit="°C" accent={T.ok} />
        <Stat icon="◆" title={t.avgWaterStress} value={Math.round(valid.reduce((s, r) => s + (data[r.id].waterStress || 0), 0) / n * 100)} unit="%" accent={T.gold} note={t.precipWeek} />
      </div>

      <Panel>
        <Title>Влажность почвы по регионам</Title>
        <div style={{ fontSize: 11, color: T.dim, marginBottom: 16 }}>
          <span style={{ color: T.sky }}>■</span> хорошо (&gt;30%)  ·  <span style={{ color: T.warn }}>■</span> умеренно  ·  <span style={{ color: T.err }}>■</span> сухо (&lt;10%)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px 28px" }}>
          {sorted.map(r => (
            <div key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: T.sub }}>{rn(r)}</span>
                <span style={{ color: moistColor(r.d.cur.soil_moisture_0_to_1cm), fontWeight: 700 }}>
                  {r.d.cur.soil_moisture_0_to_1cm?.toFixed(3)} м³/м³
                </span>
              </div>
              <MoistureBar value={r.d.cur.soil_moisture_0_to_1cm} />
            </div>
          ))}
        </div>
      </Panel>

      <div className="g-charts" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <Panel>
          <Title>Осадки за 7 дней</Title>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sorted.map(r => ({ name: r.code, rain: r.d.p7 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,60,40,0.08)" />
              <XAxis dataKey="name" tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} unit=" мм" />
              <Tooltip contentStyle={tipStyle()} />
              <Bar dataKey="rain" radius={[4, 4, 0, 0]} name="Осадки мм">
                {sorted.map((r, i) => <Cell key={i} fill={moistColor(r.d.cur.soil_moisture_0_to_1cm)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel>
          <Title>Испарение ET₀</Title>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sorted.map(r => ({ name: r.code, et0: r.d.et }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,60,40,0.08)" />
              <XAxis dataKey="name" tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.dim, fontSize: 9 }} axisLine={false} tickLine={false} unit=" мм" />
              <Tooltip contentStyle={tipStyle()} />
              <Bar dataKey="et0" radius={[4, 4, 0, 0]} name="ET₀ мм/д">
                {sorted.map((r, i) => <Cell key={i} fill={r.d.et > 5 ? T.err : r.d.et > 3 ? T.warn : T.ok} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: ALERTS
   ═══════════════════════════════════════════════════ */
function PageAlerts({ data, regions, t, lang }) {
  const alerts = useMemo(() => {
    const list = [];
    regions.forEach(r => {
      const d = data[r.id];
      if (!d?.cur) return;
      const c = d.cur;
      if (d.risk === "critical")
        list.push({ id: `dr-${r.id}`, region: rn(r), sev: "critical", title: LANG[_lang].critDrought, msg: `Влажность ${(c.soil_moisture_0_to_1cm * 100).toFixed(1)}%, темп. ${c.temperature_2m?.toFixed(1)}°C` });
      if (c.soil_moisture_0_to_1cm < 0.08)
        list.push({ id: `sm-${r.id}`, region: rn(r), sev: "critical", title: LANG[_lang].extDry, msg: `Влажность ${(c.soil_moisture_0_to_1cm * 100).toFixed(2)}% — ниже порога` });
      if (c.temperature_2m > 37)
        list.push({ id: `ht-${r.id}`, region: rn(r), sev: "high", title: LANG[_lang].heatWave, msg: `${c.temperature_2m?.toFixed(1)}°C — угроза посевам` });
      if (d.risk === "high")
        list.push({ id: `drh-${r.id}`, region: rn(r), sev: "high", title: LANG[_lang].droughtRisk, msg: `Осадки 7д: ${d.p7} мм, ET₀: ${d.et} мм/день` });
      if (d.et > 6)
        list.push({ id: `et-${r.id}`, region: rn(r), sev: "medium", title: LANG[_lang].highEvap, msg: `ET₀: ${d.et} мм/день` });
    });
    const ord = { critical: 0, high: 1, medium: 2 };
    return list.sort((a, b) => (ord[a.sev] || 2) - (ord[b.sev] || 2));
  }, [data, regions]);

  const cnt = {
    c: alerts.filter(a => a.sev === "critical").length,
    h: alerts.filter(a => a.sev === "high").length,
    m: alerts.filter(a => a.sev === "medium").length,
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="g-auto" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12 }}>
        <Stat icon="◉" title="Критических" value={cnt.c} accent={T.crit} />
        <Stat icon="▲" title="Высоких" value={cnt.h} accent={T.err} />
        <Stat icon="◆" title="Средних" value={cnt.m} accent={T.gold} />
        <Stat icon="▤" title="Всего" value={alerts.length} unit="событий" accent={T.sub} />
      </div>

      <Panel>
        <Title>Активные оповещения · Open-Meteo</Title>
        {alerts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: T.ok, fontSize: 15, fontWeight: 600 }}>
            ✦ Все показатели в норме
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {alerts.map(a => (
              <div key={a.id} style={{
                display: "flex", gap: 12, padding: "13px 16px", borderRadius: 12,
                background: RISK_STYLE[a.sev]?.bg || T.card,
                border: `1px solid ${RISK_STYLE[a.sev]?.brd || T.brd}`,
              }}>
                <span style={{ fontSize: 14, color: RISK_STYLE[a.sev]?.color, flexShrink: 0, marginTop: 1 }}>
                  {RISK_STYLE[a.sev]?.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3, flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.fg }}>{a.region} — {a.title}</span>
                    <Badge level={a.sev} />
                  </div>
                  <p style={{ fontSize: 12, color: T.sub, margin: 0, lineHeight: 1.5 }}>{a.msg}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: AI ANALYSIS
   ═══════════════════════════════════════════════════ */
function PageAI({ initialImage, onConsumeImage, t, lang }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const autoRunRef = useRef(false);
  const boundsRef = useRef(null);
  const hectaresRef = useRef(null);

  // Handle initial satellite image from map selection
  useEffect(() => {
    if (initialImage && !autoRunRef.current) {
      try {
        if (initialImage.preview && initialImage.preview.startsWith("data:image") && initialImage.preview.length > 200) {
          setPreview(initialImage.preview);
          setFile({ name: initialImage.name, type: "image/jpeg" });
          boundsRef.current = initialImage.bounds;
          hectaresRef.current = initialImage.hectares || null;
          setResult(null);
          setError(null);
          autoRunRef.current = true;
        } else {
          setError(lang === "kz" ? "Сурет жарамсыз, қайтадан белгілеңіз" : lang === "ru" ? "Снимок повреждён, попробуйте выделить заново" : "Image corrupted, please try again");
        }
      } catch(e) {
        setError("Error: " + e.message);
      }
      if (onConsumeImage) onConsumeImage();
    }
  }, [initialImage, onConsumeImage]);

  // Auto-run analysis when preview is set from map capture
  useEffect(() => {
    if (autoRunRef.current && preview && !loading && !result) {
      autoRunRef.current = false;
      const t = setTimeout(() => doAnalyze(), 500);
      return () => clearTimeout(t);
    }
  }, [preview]);

  const pickFile = (f) => {
    if (!f?.type.startsWith("image/")) { setError("Нужно изображение: JPG, PNG, WEBP"); return; }
    setFile(f); setResult(null); setError(null); boundsRef.current = null; hectaresRef.current = null;
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const doAnalyze = async () => {
    if (!preview) return;
    setLoading(true); setError(null); setResult(null);
    try {
      // Safety: validate preview is a valid data URL
      if (!preview.startsWith("data:image")) {
        throw new Error("Invalid image data");
      }
      const b64 = preview.split(",")[1];
      if (!b64 || b64.length < 100) {
        throw new Error("Image data too small or corrupted");
      }
      const mt = file?.type || "image/jpeg";
      const bounds = boundsRef.current;
      const ha = hectaresRef.current;
      const coordInfo = bounds
        ? `\nКоординаты выделенной области: ЮЗ ${bounds.sw.lat.toFixed(3)}°N, ${bounds.sw.lng.toFixed(3)}°E — СВ ${bounds.ne.lat.toFixed(3)}°N, ${bounds.ne.lng.toFixed(3)}°E (Казахстан).${ha ? ` Площадь выделенного участка: ~${Math.round(ha)} гектаров.` : ""} Это спутниковый снимок Esri World Imagery.`
        : "";

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: mt, data: b64 } },
            { type: "text", text: `Ты — агроаналитик DalaSpace. Проанализируй снимок земельного участка.${coordInfo}\nОтветь СТРОГО в JSON без markdown:\n{"land_type":"тип","status":"active/abandoned/degraded/recovering","ndvi_estimate":0.0,"moisture_estimate":0.0,"vegetation_cover":0,"erosion_risk":"low/medium/high/critical","soil_condition":"описание","crops_detected":"культуры или нет","problems":["проблема"],"recommendations":["совет"],"recovery_potential":0,"summary":"вывод 2-3 предложения","season_estimate":"сезон","irrigation_needed":true,"usability_score":0}` },
          ] }],
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);
      const text = (json.content || []).map(i => i.text || "").join("\n");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(parsed);
      setHistory(h => [{ id: Date.now(), preview, result: parsed, name: file?.name || "satellite.jpg", date: new Date().toLocaleString(DATE_LOCALE[_lang]), hectares: hectaresRef.current }, ...h].slice(0, 8));
    } catch (e) {
      setError(`Ошибка: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setPreview(null); setResult(null); setError(null); boundsRef.current = null; hectaresRef.current = null; };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="ai-main" style={{ display: "grid", gridTemplateColumns: result ? "minmax(0,340px) minmax(0,1fr)" : "minmax(0,420px) minmax(0,1fr)", gap: 18 }}>
        {/* Upload panel */}
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <Panel>
            <Title>ИИ-анализ земельного участка</Title>
            {!preview ? (
              <div
                onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer?.files?.[0]) pickFile(e.dataTransfer.files[0]); }}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onClick={() => inputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragging ? T.violet : T.brd}`, borderRadius: 14,
                  padding: "48px 20px", minHeight: 220,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", gap: 12, transition: "all 0.2s",
                  background: dragging ? "rgba(124,58,237,0.04)" : "rgba(0,60,40,0.02)",
                }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "rgba(124,58,237,0.08)", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 26,
                }}>⬡</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.fg }}>Загрузите фото участка</div>
                  <div style={{ fontSize: 12, color: T.dim, marginTop: 3 }}>JPG · PNG · WEBP</div>
                </div>
                <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => e.target.files?.[0] && pickFile(e.target.files[0])} />
              </div>
            ) : (
              <div>
                <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                  <img src={preview} alt="" style={{ width: "100%", maxHeight: 210, objectFit: "cover", display: "block" }} />
                  <button onClick={reset} style={{
                    position: "absolute", top: 8, right: 8, width: 28, height: 28,
                    borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none",
                    color: "#fff", cursor: "pointer", fontSize: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>×</button>
                </div>
                <div style={{ fontSize: 11, color: T.dim, marginBottom: 10 }}>
                  {file?.name}
                  {hectaresRef.current && (
                    <span style={{ marginLeft: 8, color: T.gold, fontWeight: 700 }}>
                      · {formatHa(hectaresRef.current)}
                    </span>
                  )}
                </div>
                <button onClick={doAnalyze} disabled={loading} style={{
                  width: "100%", padding: 14, borderRadius: 12, border: "none",
                  cursor: loading ? "wait" : "pointer",
                  background: loading ? "rgba(124,58,237,0.15)" : `linear-gradient(135deg, ${T.violet}, #8b5cf6)`,
                  color: "#fff", fontSize: 14, fontWeight: 700, opacity: loading ? 0.75 : 1,
                }}>
                  {loading ? "Анализирую…" : "Запустить анализ"}
                </button>
                {error && (
                  <div style={{
                    marginTop: 10, padding: "10px 14px", borderRadius: 10,
                    background: "rgba(220,38,38,0.06)", border: `1px solid rgba(220,38,38,0.2)`,
                    color: T.err, fontSize: 12,
                  }}>{error}</div>
                )}
              </div>
            )}
          </Panel>

          {!preview && (
            <Panel>
              <Title>Что можно загрузить</Title>
              {[
                ["Спутниковые снимки", "Sentinel-2, Landsat, Google Earth"],
                ["Фото с дрона", "Аэросъёмка посевов и угодий"],
                ["Фото с телефона", "Обычное фото поля или почвы"],
              ].map(([t, s]) => (
                <div key={t} style={{
                  display: "flex", gap: 12, marginBottom: 8, padding: "10px 12px",
                  borderRadius: 10, background: "rgba(0,60,40,0.025)",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "rgba(5,150,105,0.06)", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 15, color: T.leaf,
                  }}>◎</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.fg }}>{t}</div>
                    <div style={{ fontSize: 11, color: T.dim }}>{s}</div>
                  </div>
                </div>
              ))}
            </Panel>
          )}
        </div>

        {/* Results */}
        {result ? (
          <div style={{ display: "grid", gap: 14, alignContent: "start" }}>

            {/* ══ TOP: Verdict banner — one glance tells everything ══ */}
            <div style={{
              background: T.isDark
                ? `linear-gradient(135deg, ${RISK_STYLE[result.erosion_risk]?.bg || T.card}, rgba(255,255,255,0.04))`
                : `linear-gradient(135deg, ${RISK_STYLE[result.erosion_risk]?.bg || T.card}, rgba(255,255,255,0.8))`,
              border: `1px solid ${RISK_STYLE[result.erosion_risk]?.brd || T.brd}`,
              borderRadius: 18, padding: "18px 22px",
              display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center",
            }} className="ai-verdict">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: T.fg, textTransform: "uppercase", letterSpacing: 0.5 }}>{result.land_type}</span>
                  <Badge level={result.status === "active" ? "low" : result.status === "recovering" ? "medium" : result.status === "degraded" ? "high" : "critical"} />
                  <Badge level={result.erosion_risk} />
                  {result.irrigation_needed && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.sky, background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.2)", padding: "2px 10px", borderRadius: 20 }}>◇ {lang === "kz" ? "Суару қажет" : lang === "ru" ? "Нужен полив" : "Irrigation needed"}</span>
                  )}
                  {hectaresRef.current && (
                    <span style={{ fontSize: 11, fontWeight: 800, color: T.gold, background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.22)", padding: "2px 10px", borderRadius: 20 }}>
                      ▤ {formatHa(hectaresRef.current)}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: T.sub, lineHeight: 1.6, margin: 0 }}>{result.summary}</p>
              </div>
              {/* Big usability score */}
              <div style={{ textAlign: "center", minWidth: 80 }}>
                <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto" }}>
                  <svg viewBox="0 0 72 72" style={{ width: 72, height: 72, transform: "rotate(-90deg)" }}>
                    <circle cx="36" cy="36" r="30" fill="none" stroke={T.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,60,40,0.06)"} strokeWidth="5" />
                    <circle cx="36" cy="36" r="30" fill="none"
                      stroke={result.usability_score > 70 ? T.ok : result.usability_score > 40 ? T.warn : T.err}
                      strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={`${(result.usability_score / 100) * 188.5} 188.5`}
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: T.fg, lineHeight: 1 }}>{result.usability_score}</span>
                    <span style={{ fontSize: 8, color: T.dim, fontWeight: 600 }}>из 100</span>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: T.dim, marginTop: 4, fontWeight: 600 }}>{lang === "kz" ? "Жарамдылық" : lang === "ru" ? "Пригодность" : "Suitability"}</div>
              </div>
            </div>

            {/* ══ METRICS: 6 key numbers in a row ══ */}
            <div className="ai-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
              {[
                { label: "NDVI", val: result.ndvi_estimate?.toFixed(2), col: ndviColor(result.ndvi_estimate || 0), icon: "◈", pct: (result.ndvi_estimate || 0) * 100 },
                { label: t.humidity, val: result.moisture_estimate?.toFixed(2), col: T.sky, icon: "◇", pct: (result.moisture_estimate || 0) * 100 },
                { label: "Покрытие", val: `${result.vegetation_cover}%`, col: T.ok, icon: "◎", pct: result.vegetation_cover || 0 },
                { label: "Эрозия", val: RISK_STYLE[result.erosion_risk]?.label, col: RISK_STYLE[result.erosion_risk]?.color, icon: "△", pct: result.erosion_risk === "critical" ? 100 : result.erosion_risk === "high" ? 75 : result.erosion_risk === "medium" ? 50 : 20 },
                { label: "Восстановление", val: `${result.recovery_potential}%`, col: T.leaf, icon: "▤", pct: result.recovery_potential || 0 },
                { label: "Статус", val: result.status === "active" ? "Активный" : result.status === "recovering" ? "Восстановл." : result.status === "degraded" ? "Деградация" : "Заброшен", col: result.status === "active" ? T.ok : result.status === "recovering" ? T.leaf : T.err, icon: "✦", pct: result.status === "active" ? 90 : result.status === "recovering" ? 60 : result.status === "degraded" ? 35 : 10 },
              ].map(m => (
                <div key={m.label} style={{
                  background: T.card, border: `1px solid ${T.brd}`, borderRadius: 14,
                  padding: "12px 10px", textAlign: "center", position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${Math.max(m.pct, 5)}%`, background: `${m.col}08`, transition: "height 1s" }} />
                  <div style={{ fontSize: 10, color: T.dim, marginBottom: 4 }}>{m.icon} {m.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: m.col, lineHeight: 1 }}>{m.val}</div>
                </div>
              ))}
            </div>

            {/* ══ DETAILS: 3-column grid ══ */}
            <div className="ai-details" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>

              {/* Quick facts */}
              <Panel style={{ padding: 16 }}>
                <Title>Детали участка</Title>
                <div style={{ display: "grid", gap: 4 }}>
                  {[
                    ["Тип", result.land_type, T.fg],
                    ["Культуры", result.crops_detected, result.crops_detected === "нет" || result.crops_detected === "не определены" ? T.dim : T.ok],
                    ["Сезон", result.season_estimate, T.gold],
                    ["Полив", result.irrigation_needed ? "Нужен" : "Не нужен", result.irrigation_needed ? T.sky : T.ok],
                    ["Почва", result.soil_condition, T.sub],
                  ].map(([k, v, c]) => (
                    <div key={k} style={{ padding: "6px 0", borderBottom: `1px solid ${T.innerBg}` }}>
                      <div style={{ fontSize: 10, color: T.dim, marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: c, lineHeight: 1.4 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Problems — red accent */}
              <Panel style={{ padding: 16, background: "rgba(220,38,38,0.03)", border: `1px solid rgba(220,38,38,0.08)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <span style={{ color: T.err, fontSize: 12, fontWeight: 800 }}>▲</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.fg }}>Проблемы</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: T.err, background: "rgba(220,38,38,0.1)", padding: "1px 8px", borderRadius: 10 }}>{(result.problems || []).length}</span>
                </div>
                {(result.problems || []).map((p, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 7, padding: "7px 9px", borderRadius: 8,
                    background: "rgba(220,38,38,0.05)", marginBottom: 5,
                  }}>
                    <span style={{ color: T.err, flexShrink: 0, fontSize: 9, marginTop: 3 }}>●</span>
                    <span style={{ fontSize: 12, color: T.fg, lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </Panel>

              {/* Recommendations — green accent */}
              <Panel style={{ padding: 16, background: "rgba(5,150,105,0.03)", border: `1px solid rgba(5,150,105,0.08)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <span style={{ color: T.ok, fontSize: 12, fontWeight: 800 }}>✦</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.fg }}>Рекомендации</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: T.ok, background: "rgba(5,150,105,0.1)", padding: "1px 8px", borderRadius: 10 }}>{(result.recommendations || []).length}</span>
                </div>
                {(result.recommendations || []).map((r, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 7, padding: "7px 9px", borderRadius: 8,
                    background: "rgba(5,150,105,0.05)", marginBottom: 5,
                  }}>
                    <span style={{ color: T.ok, flexShrink: 0, fontSize: 9, marginTop: 3 }}>●</span>
                    <span style={{ fontSize: 12, color: T.fg, lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </Panel>
            </div>
          </div>
        ) : preview && !loading ? (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            background: T.card, border: `1px solid ${T.brd}`, borderRadius: 18,
          }}>
            <div style={{ textAlign: "center", color: T.dim }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⬡</div>
              <div style={{ fontSize: 14 }}>Нажмите «Запустить анализ»</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* History */}
      {history.length > 0 && (
        <Panel>
          <Title>История анализов</Title>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {history.map(h => (
              <div key={h.id}
                onClick={() => { setPreview(h.preview); setResult(h.result); setFile({ name: h.name }); setError(null); hectaresRef.current = h.hectares || null; }}
                style={{
                  display: "flex", gap: 10, padding: 10, borderRadius: 12,
                  cursor: "pointer", background: "rgba(0,60,40,0.02)", border: `1px solid ${T.brd}`,
                }}>
                <img src={h.preview} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.fg }}>{h.result.land_type}</div>
                  <div style={{ fontSize: 10, color: T.dim, marginBottom: 4 }}>
                    {h.date}{h.hectares ? ` · ${formatHa(h.hectares)}` : ""}
                  </div>
                  <Badge level={h.result.erosion_risk} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: FORECAST — Yield prediction & crop recommendations
   ═══════════════════════════════════════════════════ */
function PageForecast({ data, regions, selected, onSelect, t, lang }) {
  // Yield data for all regions
  const yieldData = useMemo(() =>
    regions.map(r => {
      const d = data[r.id];
      return {
        name: r.code, region: rn(r), id: r.id,
        yield: d?.yieldScore || 0,
        ndvi: d?.ndvi || 0,
        water: d?.waterStress || 0,
        crop: r.crop,
      };
    }).sort((a, b) => b.yield - a.yield)
  , [data, regions]);

  const selData = data[selected?.id];
  const avgYield = Math.round(yieldData.reduce((s, r) => s + r.yield, 0) / yieldData.length);
  const topRegion = yieldData[0];
  const worstRegion = yieldData[yieldData.length - 1];

  // Weekly forecast chart for selected region
  const forecastChart = useMemo(() => {
    if (!selData?.chart) return [];
    return selData.chart.map((day, i) => ({
      ...day,
      yieldIndex: Math.round(Math.min(100, Math.max(10,
        day.ndvi * 40 + day.waterStress * 30 + (day.tMax > 10 && day.tMax < 35 ? 30 : 10)
      ))),
      week: i < 7 ? "Прошлая" : "Следующая",
    }));
  }, [selData]);

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <Title>Прогноз урожайности</Title>

      {/* KPI */}
      <div className="g-auto" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12 }}>
        <Stat icon="◎" title="Средний индекс" value={avgYield} unit="/100" accent={T.leaf} note={t.allRegions} />
        <Stat icon="▲" title="Лучший регион" value={topRegion?.yield || 0} unit="/100" accent={T.ok} note={topRegion?.region} />
        <Stat icon="▼" title="Худший регион" value={worstRegion?.yield || 0} unit="/100" accent={T.err} note={worstRegion?.region} />
        <Stat icon="◇" title={t.waterStress} value={selData ? (selData.waterStress * 100).toFixed(0) : "—"} unit="%" accent={T.sky} note={selected?.name} />
      </div>

      {/* Yield ranking chart */}
      <Panel>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: T.fg }}>
          <TrendingUp size={14} style={{ marginRight: 6 }} />
          Рейтинг регионов по прогнозу урожайности
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={yieldData} layout="vertical" margin={{ left: 40, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.brd} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: T.dim }} />
            <YAxis dataKey="name" type="category" width={40} tick={{ fontSize: 10, fill: T.sub }} />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const d = payload[0].payload;
              return (
                <div style={{ ...tipStyle, padding: 10 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.region}</div>
                  <div style={{ fontSize: 11, color: T.sub }}>Индекс: {d.yield}/100</div>
                  <div style={{ fontSize: 11, color: T.sub }}>NDVI: {d.ndvi.toFixed(2)} · Водный стресс: {(d.water * 100).toFixed(0)}%</div>
                </div>
              );
            }} />
            <Bar dataKey="yield" radius={[0, 4, 4, 0]} onClick={(d) => {
              const r = regions.find(x => x.id === d.id);
              if (r) onSelect(r);
            }}>
              {yieldData.map((d, i) => (
                <Cell key={i} fill={d.yield > 70 ? T.ok : d.yield > 45 ? T.warn : T.err}
                  fillOpacity={d.id === selected?.id ? 1 : 0.7}
                  stroke={d.id === selected?.id ? "#fff" : "none"} strokeWidth={2} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <div className="g-charts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Weekly yield trend */}
        <Panel>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: T.fg }}>
            Динамика индекса: {selected?.name}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={forecastChart}>
              <defs>
                <linearGradient id="yGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.leaf} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={T.leaf} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.brd} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: T.dim }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: T.dim }} />
              <Tooltip contentStyle={tipStyle()} />
              <Area type="monotone" dataKey="yieldIndex" stroke={T.leaf} fill="url(#yGrad)" name="Индекс" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        {/* Crop recommendations */}
        <Panel>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: T.fg }}>
            <Sprout size={14} style={{ marginRight: 6 }} />
            Рекомендуемые культуры: {selected?.name}
          </div>
          {selData?.crops?.length ? selData.crops.map((c, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
              borderRadius: 10, marginBottom: 6,
              background: `rgba(${c.score > 75 ? '52,211,153' : c.score > 60 ? '232,185,49' : '240,115,110'},0.06)`,
              border: `1px solid rgba(${c.score > 75 ? '52,211,153' : c.score > 60 ? '232,185,49' : '240,115,110'},0.15)`,
            }}>
              <span style={{ fontSize: 22 }}>{c.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.fg }}>{c.key ? (t[c.key] || c.key) : c.name}</div>
                <div style={{ fontSize: 11, color: T.sub }}>Пригодность: {c.score}%</div>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: `conic-gradient(${c.score > 75 ? T.ok : c.score > 60 ? T.warn : T.err} ${c.score * 3.6}deg, ${T.card} 0deg)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: T.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800, color: T.fg,
                }}>{c.score}</div>
              </div>
            </div>
          )) : <div style={{ color: T.dim, fontSize: 12 }}>Нет данных</div>}
        </Panel>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: COMPARE — Side-by-side region comparison
   ═══════════════════════════════════════════════════ */
function PageCompare({ data, regions, t, lang }) {
  const [sel, setSel] = useState([regions[0]?.id, regions[4]?.id, regions[8]?.id]);

  const toggleRegion = (id) => {
    setSel(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const compareData = useMemo(() =>
    sel.map(id => {
      const r = regions.find(x => x.id === id);
      const d = data[id];
      return r && d ? { ...r, ...d } : null;
    }).filter(Boolean)
  , [sel, data, regions]);

  const metrics = [
    { key: "ndvi", label: "NDVI", fmt: v => v?.toFixed(2), color: T.leaf },
    { key: "temp", label: t.temp, fmt: v => v?.toFixed(1) + "°C", color: T.err, get: d => d.cur?.temperature_2m },
    { key: "moist", label: "Влажность почвы", fmt: v => (v * 100).toFixed(1) + "%", color: T.sky, get: d => d.cur?.soil_moisture_0_to_1cm },
    { key: "p7", label: "Осадки 7д", fmt: v => v + " мм", color: T.leaf },
    { key: "et", label: "ET₀", fmt: v => v + " мм/д", color: T.gold },
    { key: "waterStress", label: "Водный стресс", fmt: v => (v * 100).toFixed(0) + "%", color: T.sky },
    { key: "yieldScore", label: "Индекс урожайности", fmt: v => v + "/100", color: T.ok },
  ];

  // Radar-like comparison chart data
  const radarData = metrics.map(m => {
    const row = { metric: m.label };
    compareData.forEach(d => {
      const val = m.get ? m.get(d) : d[m.key];
      row[d.code] = val;
    });
    return row;
  });

  const COLORS = [T.leaf, T.sky, T.gold, T.violet];

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <Title>Сравнение регионов</Title>

      {/* Region picker */}
      <Panel>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 10 }}>
          Выберите до 4 регионов для сравнения:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {regions.map(r => (
            <button key={r.id} onClick={() => toggleRegion(r.id)} style={{
              padding: "6px 14px", borderRadius: 8, border: `1px solid ${sel.includes(r.id) ? T.leaf : T.brd}`,
              background: sel.includes(r.id) ? "rgba(5,150,105,0.1)" : "transparent",
              color: sel.includes(r.id) ? T.leaf : T.sub,
              fontSize: 11, fontWeight: 600, cursor: "pointer",
            }}>{r.code}</button>
          ))}
        </div>
      </Panel>

      {/* Comparison table */}
      {compareData.length > 0 && (
        <Panel style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.brd}` }}>
                <th style={{ textAlign: "left", padding: "10px 12px", color: T.sub, fontWeight: 600 }}>{t.metricCol}</th>
                {compareData.map((d, i) => (
                  <th key={d.id} style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, color: COLORS[i] }}>
                    {d.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, mi) => {
                const vals = compareData.map(d => m.get ? m.get(d) : d[m.key]);
                const maxVal = Math.max(...vals.filter(v => v != null));
                return (
                  <tr key={m.key} style={{ borderBottom: `1px solid ${T.brd}` }}>
                    <td style={{ padding: "10px 12px", color: T.sub, fontWeight: 600 }}>{m.label}</td>
                    {compareData.map((d, i) => {
                      const v = vals[i];
                      const isBest = v === maxVal && v != null;
                      return (
                        <td key={d.id} style={{
                          textAlign: "center", padding: "10px 12px",
                          fontWeight: isBest ? 800 : 500,
                          color: isBest ? COLORS[i] : T.fg,
                          background: isBest ? `${COLORS[i]}10` : "transparent",
                        }}>
                          {v != null ? m.fmt(v) : "—"}
                          {isBest && <span style={{ fontSize: 9, marginLeft: 4 }}>★</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr style={{ borderBottom: `1px solid ${T.brd}` }}>
                <td style={{ padding: "10px 12px", color: T.sub, fontWeight: 600 }}>Риск засухи</td>
                {compareData.map((d, i) => (
                  <td key={d.id} style={{ textAlign: "center", padding: "10px 12px" }}>
                    <Badge level={d.risk} />
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: "10px 12px", color: T.sub, fontWeight: 600 }}>Погода</td>
                {compareData.map((d, i) => (
                  <td key={d.id} style={{ textAlign: "center", padding: "10px 12px", color: T.fg }}>{wxKey(d.wx, LANG[_lang])}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </Panel>
      )}

      {/* Side-by-side charts */}
      {compareData.length >= 2 && (
        <div className="g-charts" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(compareData.length, 2)}, 1fr)`, gap: 16 }}>
          {compareData.slice(0, 2).map((d, i) => (
            <Panel key={d.id}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: COLORS[i] }}>{d.name}</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={d.chart || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.brd} />
                  <XAxis dataKey="label" tick={{ fontSize: 8, fill: T.dim }} />
                  <YAxis tick={{ fontSize: 9, fill: T.dim }} />
                  <Tooltip contentStyle={tipStyle()} />
                  <Area type="monotone" dataKey="rain" stroke={T.sky} fill={T.sky} fillOpacity={0.15} name="Осадки мм" />
                  <Area type="monotone" dataKey="et0" stroke={T.gold} fill={T.gold} fillOpacity={0.1} name="ET₀" />
                </AreaChart>
              </ResponsiveContainer>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: TIMELINE — Historical dynamics with day slider
   ═══════════════════════════════════════════════════ */
function PageTimeline({ data, regions, selected, onSelect, t, lang }) {
  const [dayIdx, setDayIdx] = useState(7); // start at today (past_days=7)
  const [playing, setPlaying] = useState(false);
  const [metric, setMetric] = useState("temp"); // temp, rain, ndvi, balance
  const intervalRef = useRef(null);

  const selData = data[selected?.id];
  const days = selData?.chart || [];
  const currentDay = days[dayIdx] || {};

  // Auto-play
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setDayIdx(prev => {
          if (prev >= days.length - 1) { setPlaying(false); return 0; }
          return prev + 1;
        });
      }, 800);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, days.length]);

  // Get value for all regions on current day
  const daySnapshot = useMemo(() => {
    return regions.map(r => {
      const d = data[r.id];
      const day = d?.chart?.[dayIdx];
      if (!day) return { ...r, value: 0 };
      let value = 0;
      if (metric === "temp") value = (day.tMax + day.tMin) / 2;
      else if (metric === "rain") value = day.rain;
      else if (metric === "ndvi") value = day.ndvi;
      else if (metric === "balance") value = day.balance;
      return { ...r, value, day };
    }).sort((a, b) => b.value - a.value);
  }, [data, regions, dayIdx, metric]);

  const METRICS = [
    { id: "temp", label: t.temp, unit: "°C", color: T.err },
    { id: "rain", label: t.precip, unit: "мм", color: T.sky },
    { id: "ndvi", label: "NDVI", unit: "", color: T.leaf },
    { id: "balance", label: "Водный баланс", unit: "мм", color: T.gold },
  ];
  const activeMetric = METRICS.find(m => m.id === metric);

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <Title>Динамика по дням</Title>

      {/* Controls */}
      <Panel>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {/* Day slider */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 11, color: T.sub, marginBottom: 6 }}>
              {currentDay.label || "—"} · День {dayIdx + 1} / {days.length}
              {dayIdx < 7 ? " (прошлое)" : dayIdx === 7 ? " (сегодня)" : " (прогноз)"}
            </div>
            <input type="range" min={0} max={Math.max(0, days.length - 1)} value={dayIdx}
              onChange={e => setDayIdx(+e.target.value)}
              style={{ width: "100%", accentColor: T.leaf }} />
          </div>

          {/* Play/pause */}
          <button onClick={() => setPlaying(!playing)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 10, border: `1px solid ${T.brd}`,
            background: playing ? "rgba(220,38,38,0.12)" : "rgba(5,150,105,0.08)",
            color: playing ? T.err : T.leaf, cursor: "pointer", fontSize: 12, fontWeight: 700,
          }}>
            {playing ? <><Pause size={14} /> Пауза</> : <><Play size={14} /> Воспроизвести</>}
          </button>

          {/* Metric selector */}
          <div style={{ display: "flex", gap: 4 }}>
            {METRICS.map(m => (
              <button key={m.id} onClick={() => setMetric(m.id)} style={{
                padding: "6px 12px", borderRadius: 8, border: `1px solid ${metric === m.id ? m.color + '44' : T.brd}`,
                background: metric === m.id ? m.color + '15' : "transparent",
                color: metric === m.id ? m.color : T.sub,
                fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}>{m.label}</button>
            ))}
          </div>
        </div>
      </Panel>

      {/* Current day snapshot — bar chart */}
      <Panel>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: T.fg }}>
          {activeMetric?.label} по регионам · {currentDay.label || "—"}
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={daySnapshot} margin={{ bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.brd} />
            <XAxis dataKey="code" tick={{ fontSize: 9, fill: T.sub, angle: -45 }} interval={0} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 10, fill: T.dim }} />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const d = payload[0].payload;
              return (
                <div style={{ ...tipStyle, padding: 10 }}>
                  <div style={{ fontWeight: 700 }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: T.sub }}>{activeMetric?.label}: {d.value?.toFixed(2)} {activeMetric?.unit}</div>
                </div>
              );
            }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {daySnapshot.map((d, i) => (
                <Cell key={i} fill={activeMetric?.color || T.leaf}
                  fillOpacity={d.id === selected?.id ? 1 : 0.6}
                  stroke={d.id === selected?.id ? "#fff" : "none"} strokeWidth={2} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* Selected region 14-day chart with highlight */}
      <Panel>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: T.fg }}>
          {selected?.name}: 14-дневная динамика {activeMetric?.label.toLowerCase()}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={days}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.brd} />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: T.dim }} />
            <YAxis tick={{ fontSize: 10, fill: T.dim }} />
            <Tooltip contentStyle={tipStyle()} />
            {metric === "temp" && <>
              <Line type="monotone" dataKey="tMax" stroke={T.err} name="Макс." dot={false} />
              <Line type="monotone" dataKey="tMin" stroke={T.sky} name="Мин." dot={false} />
            </>}
            {metric === "rain" && <Line type="monotone" dataKey="rain" stroke={T.sky} name={t.precip} />}
            {metric === "ndvi" && <Line type="monotone" dataKey="ndvi" stroke={T.leaf} name="NDVI" />}
            {metric === "balance" && <Line type="monotone" dataKey="balance" stroke={T.gold} name={t.balance} />}
            {/* Current day marker */}
            <Line data={[{ ...days[dayIdx], marker: days[dayIdx]?.[metric === "temp" ? "tMax" : metric] }]}
              dataKey="marker" stroke="#fff" dot={{ r: 6, fill: T.leaf }} legendType="none" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ textAlign: "center", fontSize: 11, color: T.dim, marginTop: 6 }}>
          ← 7 дней назад | сегодня | 7 дней вперёд →
        </div>
      </Panel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: ABOUT — Project info, methodology, demo mode
   ═══════════════════════════════════════════════════ */
function PageAbout({ data, regions, onSelect, navigate, t, lang }) {
  const [demoActive, setDemoActive] = useState(false);
  const demoRef = useRef(null);
  const [demoIdx, setDemoIdx] = useState(0);

  // Demo mode — auto-rotate through regions
  useEffect(() => {
    if (demoActive) {
      demoRef.current = setInterval(() => {
        setDemoIdx(prev => {
          const next = (prev + 1) % regions.length;
          onSelect(regions[next]);
          return next;
        });
      }, 2500);
    }
    return () => clearInterval(demoRef.current);
  }, [demoActive, regions, onSelect]);

  const startDemo = () => {
    setDemoActive(true);
    onSelect(regions[0]);
    setDemoIdx(0);
    navigate("overview");
  };

  const dataSources = [
    { name: "Open-Meteo API", desc: "Метеоданные в реальном времени: температура, влажность, осадки, ET₀, влажность почвы", url: "open-meteo.com" },
    { name: "Esri World Imagery", desc: "Спутниковые снимки высокого разрешения для визуализации и ИИ-анализа", url: "arcgis.com" },
    { name: "Claude Sonnet (Anthropic)", desc: "ИИ-модель для анализа спутниковых снимков и генерации рекомендаций", url: "anthropic.com" },
    { name: "Leaflet.js", desc: "Интерактивная картография с поддержкой GeoJSON-границ областей", url: "leafletjs.com" },
    { name: "Open Data Kazakhstan", desc: "GeoJSON-границы административных областей Республики Казахстан", url: "github.com/open-data-kazakhstan" },
  ];

  const methods = [
    { title: "Оценка NDVI", desc: "Вычисляется на основе влажности почвы (50%), температурного фактора (30%) и осадков (20%). Формула: min(0.85, max(0.05, moisture×2.5×0.5 + tempFactor×0.3 + precipFactor×0.2))" },
    { title: "Индекс засухи", desc: "Балльная система из 4 факторов: влажность почвы (<0.1: +3), температура (>35°C: +2), осадки (<1мм: +2), эвапотранспирация (>6мм/д: +2). Сумма ≥7 = критический, ≥5 = высокий, ≥3 = средний." },
    { title: "Водный стресс", desc: "Отношение среднесуточных осадков к эвапотранспирации ET₀. Значение <0.5 указывает на дефицит воды, >1.0 — избыток." },
    { title: "Прогноз урожайности", desc: "Композитный индекс: NDVI (40%) + водный стресс (30%) + температурный оптимум 10-32°C (30%). Диапазон 0-100." },
    { title: "Площадь в гектарах", desc: "Формула Хаверсина для прямоугольных выделений: (dLat × π/180 × R) × (dLng × π/180 × R × cos(midLat)) / 10000." },
  ];

  const techStack = [
    "React 19 + Vite 6", "Recharts (графики)", "Leaflet.js (карта)",
    "Esri World Imagery (спутник)", "Open-Meteo API (метео)",
    "Claude Sonnet 4 (ИИ)", "GeoJSON (границы)",
  ];

  return (
    <div style={{ display: "grid", gap: 28, maxWidth: 900 }}>
      {/* Hero */}
      <div style={{
        padding: "40px 32px", borderRadius: 20, textAlign: "center",
        background: `linear-gradient(160deg, rgba(5,150,105,0.06), rgba(8,145,178,0.04), rgba(124,58,237,0.04))`,
        border: `1px solid ${T.brd}`,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: "0 auto 16px",
          background: `linear-gradient(145deg, ${T.leaf}22, ${T.sky}22)`,
          border: `1px solid ${T.brd}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, color: T.leaf, fontWeight: 900,
        }}><DalaLogo size={56} /></div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: T.fg, margin: 0, letterSpacing: -1 }}>DalaSpace</h1>
        <div style={{ fontSize: 12, color: T.leaf, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>
          Satellite Agri Analytics Platform
        </div>
        <p style={{ fontSize: 14, color: T.sub, marginTop: 16, lineHeight: 1.7, maxWidth: 600, marginInline: "auto" }}>
          Платформа спутниковой аналитики сельского хозяйства Казахстана.
          Мониторинг 17 регионов в реальном времени, прогнозирование урожайности,
          ИИ-анализ спутниковых снимков и рекомендации по культурам.
        </p>

        {/* Demo button */}
        <button onClick={startDemo} style={{
          marginTop: 20, padding: "12px 28px", borderRadius: 12,
          border: `1px solid rgba(5,150,105,0.3)`,
          background: "rgba(5,150,105,0.1)",
          color: T.leaf, fontSize: 14, fontWeight: 700, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          <Play size={16} /> Запустить демо-режим
        </button>
      </div>

      {/* Methodology */}
      <Panel>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: T.fg }}>
          <Target size={16} style={{ marginRight: 8 }} />
          Методология
        </div>
        {methods.map((m, i) => (
          <div key={i} style={{
            padding: "14px 16px", marginBottom: 8, borderRadius: 12,
            background: "rgba(0,60,40,0.025)", border: `1px solid ${T.brd}`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.leaf, marginBottom: 4 }}>{m.title}</div>
            <div style={{ fontSize: 12, color: T.sub, lineHeight: 1.6 }}>{m.desc}</div>
          </div>
        ))}
      </Panel>

      {/* Data sources */}
      <Panel>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: T.fg }}>
          <Layers size={16} style={{ marginRight: 8 }} />
          Источники данных
        </div>
        {dataSources.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "12px 0",
            borderBottom: i < dataSources.length - 1 ? `1px solid ${T.brd}` : "none",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `rgba(5,150,105,0.06)`, border: `1px solid ${T.brd}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: T.leaf, fontWeight: 800, flexShrink: 0,
            }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.fg }}>{s.name}</div>
              <div style={{ fontSize: 11, color: T.sub }}>{s.desc}</div>
              <div style={{ fontSize: 10, color: T.dim }}>{s.url}</div>
            </div>
          </div>
        ))}
      </Panel>

      {/* Tech stack */}
      <Panel>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: T.fg }}>
          <Zap size={16} style={{ marginRight: 8 }} />
          Технологический стек
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {techStack.map((t, i) => (
            <span key={i} style={{
              padding: "6px 14px", borderRadius: 20,
              background: "rgba(5,150,105,0.06)", border: `1px solid ${T.brd}`,
              fontSize: 12, fontWeight: 600, color: T.sub,
            }}>{t}</span>
          ))}
        </div>
      </Panel>

      {/* Competition info */}
      <Panel>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: T.fg }}>
          🏆 AEROO SPACE AI Competition
        </div>
        <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.8 }}>
          DalaSpace — проект разработан для участия в конкурсе AEROO SPACE AI.
          Цель: продемонстрировать возможности спутниковых технологий и искусственного
          интеллекта для мониторинга и управления сельским хозяйством Казахстана.
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Activity size={14} color={T.leaf} />
            <span style={{ fontSize: 12, color: T.fg, fontWeight: 600 }}>17 регионов</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <BarChart3 size={14} color={T.sky} />
            <span style={{ fontSize: 12, color: T.fg, fontWeight: 600 }}>14-дневные данные</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Search size={14} color={T.violet} />
            <span style={{ fontSize: 12, color: T.fg, fontWeight: 600 }}>ИИ-анализ снимков</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Wheat size={14} color={T.gold} />
            <span style={{ fontSize: 12, color: T.fg, fontWeight: 600 }}>Прогноз урожайности</span>
          </div>
        </div>
      </Panel>

      <div style={{ textAlign: "center", color: T.dim, fontSize: 11, padding: "10px 0" }}>
        © 2025 DalaSpace · Республика Казахстан
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PDF EXPORT utility
   ═══════════════════════════════════════════════════ */
function ExportButton({ data, regions, selected, t, lang }) {
  const [exporting, setExporting] = useState(false);

  const exportReport = async () => {
    setExporting(true);
    try {
      const selR = selected || regions[0];
      const d = data[selR.id];
      if (!d) { setExporting(false); return; }

      // Build text report
      const lines = [
        `DALASPACE — ОТЧЁТ ПО РЕГИОНУ`,
        `═════════════════════════════════`,
        `Регион: ${selR.name} (${selR.code})`,
        `Центр: ${selR.city}`,
        `Площадь пашни: ${selR.crop.toLocaleString()} тыс. га`,
        `Дата: ${new Date().toLocaleDateString(DATE_LOCALE[_lang])}`,
        ``,
        `ТЕКУЩИЕ ПОКАЗАТЕЛИ:`,
        `  Температура: ${d.cur?.temperature_2m?.toFixed(1)}°C`,
        `  Влажность воздуха: ${d.cur?.relative_humidity_2m}%`,
        `  Влажность почвы: ${(d.cur?.soil_moisture_0_to_1cm * 100).toFixed(1)}%`,
        `  Скорость ветра: ${d.cur?.wind_speed_10m?.toFixed(1)} км/ч`,
        `  NDVI (оценка): ${d.ndvi?.toFixed(3)}`,
        `  Осадки 7 дней: ${d.p7} мм`,
        `  ET₀: ${d.et} мм/день`,
        `  Водный стресс: ${(d.waterStress * 100).toFixed(0)}%`,
        `  Индекс урожайности: ${d.yieldScore}/100`,
        `  Риск засухи: ${RISK_STYLE[d.risk]?.label || d.risk}`,
        `  Погода: ${wxKey(d.wx, LANG[_lang])}`,
        ``,
        `РЕКОМЕНДУЕМЫЕ КУЛЬТУРЫ:`,
        ...(d.crops || []).map((c, i) => `  ${i + 1}. ${c.icon} ${c.key ? (t[c.key] || c.key) : c.name} — ${t.suitability || "score"} ${c.score}%`),
        ``,
        `14-ДНЕВНЫЕ ДАННЫЕ:`,
        `Дата          | Макс.°C | Мин.°C | Осадки мм | ET₀ мм | Баланс`,
        `─────────────┼─────────┼────────┼───────────┼────────┼───────`,
        ...(d.chart || []).map(row =>
          `${row.label.padEnd(13)}| ${(row.tMax||0).toFixed(1).padStart(7)} | ${(row.tMin||0).toFixed(1).padStart(6)} | ${row.rain.toFixed(1).padStart(9)} | ${row.et0.toFixed(1).padStart(6)} | ${row.balance.toFixed(1).padStart(6)}`
        ),
        ``,
        `СВОДКА ПО ВСЕМ РЕГИОНАМ:`,
        ...regions.map(r => {
          const rd = data[r.id];
          if (!rd?.cur) return `  ${r.code}: нет данных`;
          return `  ${r.code}: T=${rd.cur.temperature_2m?.toFixed(1)}°C  NDVI=${rd.ndvi?.toFixed(2)}  Риск=${RISK_STYLE[rd.risk]?.label || "—"}  Урожай=${rd.yieldScore}/100`;
        }),
        ``,
        `Сгенерировано: DalaSpace`,
        `Источник данных: Open-Meteo API, Esri World Imagery`,
      ];

      const text = lines.join("\n");
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DalaSpace_${selR.code}_${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export error:", e);
    }
    setExporting(false);
  };

  return (
    <button onClick={exportReport} disabled={exporting} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "8px 16px", borderRadius: 10,
      border: `1px solid ${T.brd}`, background: T.innerBg,
      color: T.sub, fontSize: 12, fontWeight: 600, cursor: "pointer",
      opacity: exporting ? 0.5 : 1,
    }}>
      <FileDown size={14} /> {exporting ? t.exporting : t.export}
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   WELCOME SCREEN
   ═══════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════
   PAGE: AI CHAT — conversational agro analytics
   ═══════════════════════════════════════════════════ */
// Simple markdown → JSX renderer
function renderMd(text) {
  if (!text) return text;
  return text.split("\n").map((line, j) => {
    const parts = [];
    let rest = line;
    let k = 0;
    // Bold **text**
    const boldRx = /\*\*(.+?)\*\*/g;
    let last = 0;
    let match;
    while ((match = boldRx.exec(line)) !== null) {
      if (match.index > last) parts.push(<span key={k++}>{line.slice(last, match.index)}</span>);
      parts.push(<strong key={k++} style={{ fontWeight: 700 }}>{match[1]}</strong>);
      last = match.index + match[0].length;
    }
    if (last < line.length) parts.push(<span key={k++}>{line.slice(last)}</span>);
    if (parts.length === 0) parts.push(<span key={0}>{line}</span>);
    return <span key={j}>{parts}<br/></span>;
  });
}
function stripMd(text) { return (text || "").replace(/\*\*/g, "").replace(/\*/g, "").replace(/#{1,6}\s?/g, "").replace(/[_~`]/g, ""); }

function PageChat({ data, regions, selected, t, lang, userName }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: userName && userName !== "Demo" ? `${t.chatWelcome.split("!")[0]}${userName ? `, ${userName}` : ""}! ${t.chatWelcome.split("!").slice(1).join("!").trim()}` : t.chatWelcome }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [aiModel, setAiModel] = useState(AI_MODELS[0].id);
  const chatRef = useRef(null);
  const recogRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // Build context summary from current agro data
  const buildContext = () => {
    const lines = [];
    regions.forEach(r => {
      const d = data[r.id];
      if (!d?.cur) return;
      const name = RNAME[r.id]?.[lang] || r.name;
      lines.push(`${name}: t=${d.cur.temperature_2m?.toFixed(1)}°C, soil_moisture=${(d.cur.soil_moisture_0_to_1cm*100).toFixed(1)}%, ndvi=${d.ndvi?.toFixed(2)}, rain7d=${d.p7}mm, et0=${d.et}mm/d, yield=${d.yieldScore}/100, risk=${d.risk}, water_stress=${(d.waterStress*100).toFixed(0)}%`);
    });
    const selName = selected ? (RNAME[selected.id]?.[lang] || selected.name) : "none";
    return `You are DalaSpace AI assistant.${userName ? ` The user's name is ${userName}.` : ""} You help farmers and agronomists analyze agricultural data for Kazakhstan regions. Current selected region: ${selName}.\n\nLive data for all 17 regions:\n${lines.join("\n")}\n\nRespond in the same language the user writes in. Be concise, practical, use numbers from the data above. If asked about recommendations, base them on real metrics. Format numbers with units. NEVER use markdown formatting like **bold** or *italic* — respond with plain text only.`;
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMsg].slice(-12).map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: resolveModel(aiModel),
          max_tokens: 800,
          system: buildContext(),
          messages: history,
        }),
      });
      const json = await res.json();
      const reply = (json.content?.[0]?.text || "...").replace(/\*\*/g, "").replace(/\*/g, "");
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", text: "⚠ API error: " + e.message }]);
    }
    setLoading(false);
  };

  // Voice input — Web Speech API
  const toggleVoice = () => {
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = lang === "kz" ? "kk-KZ" : lang === "en" ? "en-US" : "ru-RU";
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      // Auto-send after voice input
      setTimeout(() => sendMessage(transcript), 300);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recogRef.current = r;
    r.start();
    setListening(true);
  };

  // TTS — speak assistant response with correct language voice
  const speakText = (text) => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utter = new SpeechSynthesisUtterance(stripMd(text));
    const targetLang = lang === "kz" ? "kk" : lang === "en" ? "en" : "ru";
    utter.lang = lang === "kz" ? "kk-KZ" : lang === "en" ? "en-US" : "ru-RU";

    // Explicitly find a matching voice — fixes Chrome/Edge reading Russian as English
    const voices = window.speechSynthesis.getVoices();
    const exactMatch = voices.find(v => v.lang.startsWith(targetLang));
    const fuzzyMatch = voices.find(v => v.lang.toLowerCase().includes(targetLang));
    if (exactMatch) utter.voice = exactMatch;
    else if (fuzzyMatch) utter.voice = fuzzyMatch;

    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  // Preload voices (Chrome loads them async)
  useEffect(() => {
    window.speechSynthesis?.getVoices();
    window.speechSynthesis?.addEventListener?.("voiceschanged", () => {});
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 120px)", maxWidth: 720, margin: "0 auto", width: "100%" }} className="chat-wrap">
      {/* Chat messages */}
      <div ref={chatRef} style={{
        flex: 1, overflowY: "auto", padding: "16px 4px", display: "flex", flexDirection: "column", gap: 12,
      }}>
        {/* Hint */}
        <div style={{ textAlign: "center", fontSize: 11, color: T.dim, padding: "8px 0 12px" }}>
          {t.chatHint}
        </div>

        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column",
            alignItems: m.role === "user" ? "flex-end" : "flex-start",
            animation: "enter 0.2s ease",
          }}>
            <div style={{
              maxWidth: "85%", padding: "12px 16px", borderRadius: 16,
              background: m.role === "user"
                ? T.leaf
                : (T.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"),
              color: m.role === "user" ? (T.isDark ? "#0a0c0e" : "#fff") : T.fg,
              fontSize: 13, lineHeight: 1.65, fontWeight: 400,
              borderBottomRightRadius: m.role === "user" ? 4 : 16,
              borderBottomLeftRadius: m.role === "user" ? 16 : 4,
              boxShadow: m.role === "user" ? `0 2px 8px ${T.leaf}20` : "none",
            }}>
              {renderMd(m.text)}
            </div>
            {/* TTS button for assistant messages */}
            {m.role === "assistant" && i > 0 && (
              <button onClick={() => speakText(m.text)} style={{
                marginTop: 4, padding: "3px 10px", borderRadius: 8, border: `1px solid ${T.brd}`,
                background: "transparent", color: T.dim, fontSize: 10, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <Volume2 size={11} /> {speaking ? t.stopSpeak : t.speak}
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.leaf, animation: "blink 1s infinite" }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: T.dim }}><DalaLogo size={16} /> DalaSpace AI</span>
          </div>
        )}
      </div>

      {/* Model selector + Input bar */}
      <div style={{ borderTop: `1px solid ${T.brd}`, paddingTop: 8 }}>
        {/* Model pills */}
        <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap", alignItems: "center", overflowX: "auto", paddingBottom: 2 }}>
          <span style={{ fontSize: 10, color: T.dim, marginRight: 2, flexShrink: 0 }}>AI:</span>
          {AI_MODELS.map(m => (
            <button key={m.id} onClick={() => setAiModel(m.id)} title={m.desc[lang]} style={{
              padding: "3px 9px", borderRadius: 8, border: `1px solid ${aiModel === m.id ? (m.color || T.leaf) : T.brd}`,
              background: aiModel === m.id ? `${m.color || T.leaf}18` : "transparent",
              color: aiModel === m.id ? (m.color || T.leaf) : T.dim,
              fontSize: 10, fontWeight: aiModel === m.id ? 700 : 500,
              cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 3, flexShrink: 0,
            }}><span style={{ fontSize: 11 }}>{m.badge}</span> {m.short}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* Voice button */}
        <button onClick={toggleVoice} style={{
          width: 42, height: 42, borderRadius: 12, border: `1px solid ${listening ? T.leaf : T.brd}`,
          background: listening ? `${T.leaf}15` : T.controlBg,
          color: listening ? T.leaf : T.sub, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.15s",
          animation: listening ? "blink 1s infinite" : "none",
        }}>
          {listening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && sendMessage(input)}
          placeholder={t.chatPlaceholder}
          style={{
            flex: 1, height: 42, padding: "0 16px", borderRadius: 12,
            border: `1px solid ${T.brd}`, background: T.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
            color: T.fg, fontSize: 13, outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={e => e.target.style.borderColor = T.leaf}
          onBlur={e => e.target.style.borderColor = T.brd}
        />

        <button
          onClick={() => !loading && sendMessage(input)}
          disabled={loading || !input.trim()}
          style={{
            width: 42, height: 42, borderRadius: 12, border: "none",
            background: input.trim() ? T.leaf : T.controlBg,
            color: input.trim() ? (T.isDark ? "#0a0c0e" : "#fff") : T.dim,
            cursor: input.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.15s",
          }}
        >
          <Send size={18} />
        </button>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onStart, t, lang, setLang, theme, setTheme, data, progress, userName, setUserName }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [blurOut, setBlurOut] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Optimized photo URLs — smaller sizes for fast load
  const photos = [
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=70&auto=format",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=70&auto=format",
    "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1200&q=70&auto=format",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=70&auto=format",
  ];

  // Preload all images on mount
  useEffect(() => {
    photos.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      if (i === 0) img.onload = () => setImgLoaded(true);
    });
  }, []);

  // Blur-based photo rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setBlurOut(true);
      setTimeout(() => {
        setPhotoIdx(prev => (prev + 1) % photos.length);
        setBlurOut(false);
      }, 700);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Live stats
  const liveStats = useMemo(() => {
    const entries = Object.values(data || {}).filter(d => d?.cur);
    if (!entries.length) return null;
    const n = entries.length;
    return {
      avgT: (entries.reduce((s, d) => s + (d.cur.temperature_2m || 0), 0) / n).toFixed(1),
      avgNDVI: (entries.reduce((s, d) => s + (d.ndvi || 0), 0) / n).toFixed(2),
      riskCount: entries.filter(d => ["critical", "high"].includes(d.risk)).length,
    };
  }, [data]);

  // CountUp
  const CountUp = ({ end, suffix = "", duration = 1400 }) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
      const num = parseFloat(end);
      if (isNaN(num)) { setVal(end); return; }
      const start = Date.now();
      const decimals = end.toString().includes(".") ? end.toString().split(".")[1].length : 0;
      const tick = () => {
        const pct = Math.min((Date.now() - start) / duration, 1);
        const ease = 1 - Math.pow(1 - pct, 3);
        setVal(decimals ? (num * ease).toFixed(decimals) : Math.round(num * ease));
        if (pct < 1) requestAnimationFrame(tick);
      };
      tick();
    }, [end]);
    return <>{val}{suffix}</>;
  };

  const changelog = [
    lang === "kz" ? "6 жаңа карта мүмкіндігі" : lang === "ru" ? "6 новых фич карты" : "6 new map features",
    lang === "kz" ? "AI модель таңдау" : lang === "ru" ? "Выбор AI-модели" : "AI model selection",
    lang === "kz" ? "Тепловая карта + 3D рельеф" : lang === "ru" ? "Тепловая карта + 3D рельеф" : "Heatmap + 3D relief",
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", minHeight: "100dvh", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>
      <style>{`
        @keyframes wZoom { 0% { transform: scale(1); } 100% { transform: scale(1.06); } }
        @keyframes wBlurIn { from { filter: blur(20px); opacity: 0.6; } to { filter: blur(0); opacity: 1; } }
        @keyframes wSlideUp { from { opacity: 0; transform: translateY(20px); filter: blur(6px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes wFadeIn { from { opacity: 0; filter: blur(8px); } to { opacity: 1; filter: blur(0); } }
        @media(max-width:840px) {
          .w-photo { height: 160px !important; flex: none !important; }
          .w-form { flex: 1 1 auto !important; min-height: 0 !important; padding: 20px 20px 28px !important; justify-content: center !important; align-items: center !important; overflow-x: hidden !important; }
          .w-wrap { flex-direction: column !important; overflow: hidden !important; }
          .w-photo-info { bottom: 10px !important; left: 14px !important; right: 14px !important; }
          .w-photo-info h2 { font-size: 14px !important; }
          .w-photo-desc, .w-photo-feat { display: none !important; }
          .w-photo-dots { bottom: 8px !important; right: 12px !important; }
          .w-top-bar { top: 10px !important; right: 10px !important; gap: 4px !important; }
          .w-top-bar button { font-size: 9px !important; }
          .w-content { max-width: 300px !important; width: 100% !important; margin: 0 auto !important; }
          .w-content h1 { font-size: 20px !important; margin-top: 14px !important; }
          .w-logo-icon { width: 36px !important; height: 36px !important; }
          .w-stats { grid-template-columns: 1fr 1fr 1fr !important; gap: 6px !important; padding: 10px !important; }
          .w-stats-num { font-size: 16px !important; }
          .w-enter-btn { padding: 12px 0 !important; font-size: 13px !important; }
          .w-demo-btn { padding: 8px 0 !important; }
          .w-changelog-dd { right: 10px !important; top: 46px !important; width: 200px !important; }
        }
      `}</style>

      <div className="w-wrap" style={{ display: "flex", flex: 1 }}>
        {/* Left — photos with blur transitions */}
        <div className="w-photo" style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* Gradient placeholder while loading */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, #0a2e1a 0%, #1a4a2e 40%, #0d3320 100%)",
          }} />
          {/* Photo with blur animation */}
          <div style={{
            position: "absolute", inset: -8,
            backgroundImage: `url('${photos[photoIdx]}')`,
            backgroundSize: "cover", backgroundPosition: "center",
            animation: "wZoom 22s ease-in-out infinite alternate",
            filter: blurOut ? "blur(16px) brightness(0.8)" : "blur(0) brightness(1)",
            opacity: imgLoaded ? 1 : 0,
            transition: "filter 0.7s ease, opacity 0.8s ease",
          }} />
          {/* Gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.6) 100%)" }} />

          {/* Dots */}
          <div className="w-photo-dots" style={{ position: "absolute", bottom: 14, right: 18, zIndex: 3, display: "flex", gap: 5 }}>
            {photos.map((_, i) => (
              <div key={i} style={{
                width: i === photoIdx ? 18 : 6, height: 6, borderRadius: 3,
                background: i === photoIdx ? "#fff" : "rgba(255,255,255,0.3)",
                transition: "all 0.4s",
              }} />
            ))}
          </div>

          {/* Info */}
          <div className="w-photo-info" style={{
            position: "absolute", bottom: 40, left: 40, right: 40, zIndex: 2,
            color: "#fff", animation: "wSlideUp 0.8s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <DalaLogo size={32} color="#fff" />
              <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.8, margin: 0 }}>DalaSpace</h2>
            </div>
            <p className="w-photo-desc" style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.75, maxWidth: 340 }}>{t.monitoring}</p>
            <div className="w-photo-feat" style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
              {[{ icon: "🛰️", text: t.satellite }, { icon: "🌾", text: t.forecastW }, { icon: "🤖", text: t.aiW }, { icon: "📊", text: t.dataW }].map((f, i) => (
                <span key={i} style={{ fontSize: 10, opacity: 0.55, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 12 }}>{f.icon}</span> {f.text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="w-form" style={{
          flex: "0 0 480px", maxWidth: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", padding: "36px 28px",
          background: T.isDark ? "#0e1012" : "#fff", position: "relative", overflowY: "auto",
          boxSizing: "border-box",
        }}>
          {/* Top bar */}
          <div className="w-top-bar" style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 6, alignItems: "center", zIndex: 5 }}>
            <button onClick={() => setShowChangelog(!showChangelog)} style={{
              padding: "3px 9px", borderRadius: 6, border: "none", cursor: "pointer",
              background: T.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              color: T.leaf, fontSize: 9, fontWeight: 700,
            }}>v2.1</button>
            <div style={{ display: "flex", gap: 2, background: T.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", borderRadius: 8, padding: 2 }}>
              {["kz","ru","en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: "4px 0", width: 30, borderRadius: 6, border: "none", cursor: "pointer",
                  fontSize: 10, fontWeight: lang === l ? 700 : 500, textTransform: "uppercase", textAlign: "center",
                  background: lang === l ? T.leaf : "transparent", color: lang === l ? "#fff" : T.dim,
                }}>{l}</button>
              ))}
            </div>
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={{
              width: 30, height: 30, borderRadius: 8, border: "none",
              background: T.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              color: T.dim, cursor: "pointer", fontSize: 13,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{theme === "light" ? "☾" : "☀"}</button>
          </div>

          {/* Changelog dropdown */}
          {showChangelog && (
            <div className="w-changelog-dd" style={{
              position: "absolute", top: 50, right: 16, zIndex: 10,
              background: T.isDark ? "#1a1d20" : "#fff", borderRadius: 12,
              border: `1px solid ${T.brd}`, padding: 14, width: 220,
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)", animation: "wFadeIn 0.25s ease",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.fg, marginBottom: 6 }}>
                {lang === "kz" ? "Жаңалықтар" : lang === "ru" ? "Что нового" : "What's new"} v2.1
              </div>
              {changelog.map((item, i) => (
                <div key={i} style={{ fontSize: 11, color: T.sub, padding: "3px 0", display: "flex", gap: 5 }}>
                  <span style={{ color: T.leaf, fontSize: 7, marginTop: 4 }}>●</span> {item}
                </div>
              ))}
            </div>
          )}

          <div className="w-content" style={{ width: "100%", maxWidth: 330, animation: "wSlideUp 0.5s ease" }}>
            <div className="w-logo-icon"><DalaLogo size={44} /></div>

            <h1 style={{ fontSize: 26, fontWeight: 700, color: T.fg, margin: "24px 0 0", letterSpacing: -0.5, lineHeight: 1.2 }}>
              {lang === "kz" ? "Қош келдіңіз" : lang === "ru" ? "Добро пожаловать" : "Welcome"}
            </h1>
            <p style={{ fontSize: 13, color: T.sub, marginTop: 6, lineHeight: 1.5 }}>
              {lang === "kz" ? "DalaSpace жүйесіне кіру" : lang === "ru" ? "Войдите в DalaSpace" : "Sign in to DalaSpace"}
            </p>

            {/* Name input */}
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: T.dim, marginBottom: 5, display: "block" }}>
                {lang === "kz" ? "Сіздің атыңыз" : lang === "ru" ? "Ваше имя" : "Your name"}
              </label>
              <input
                value={userName} onChange={e => setUserName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && onStart()}
                placeholder={lang === "kz" ? "Мұрат" : lang === "ru" ? "Мурат" : "Murat"}
                autoComplete="name"
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10,
                  border: `1px solid ${T.brd}`, background: T.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                  color: T.fg, fontSize: 14, outline: "none", transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = T.leaf}
                onBlur={e => e.target.style.borderColor = T.brd}
              />
            </div>

            {/* Live stats or progress */}
            {liveStats ? (
              <div className="w-stats" style={{
                marginTop: 14, padding: "12px 14px", borderRadius: 12,
                background: T.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${T.brd}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10,
                animation: "wFadeIn 0.8s ease",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div className="w-stats-num" style={{ fontSize: 18, fontWeight: 800, color: T.fg }}><CountUp end={liveStats.avgT} suffix="°" /></div>
                  <div style={{ fontSize: 9, color: T.dim, marginTop: 1 }}>{lang === "kz" ? "орт. t°" : lang === "ru" ? "ср. t°" : "avg t°"}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div className="w-stats-num" style={{ fontSize: 18, fontWeight: 800, color: T.leaf }}><CountUp end={liveStats.avgNDVI} /></div>
                  <div style={{ fontSize: 9, color: T.dim, marginTop: 1 }}>NDVI</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div className="w-stats-num" style={{ fontSize: 18, fontWeight: 800, color: liveStats.riskCount > 0 ? T.err : T.ok }}><CountUp end={String(liveStats.riskCount)} /></div>
                  <div style={{ fontSize: 9, color: T.dim, marginTop: 1 }}>{lang === "kz" ? "қауіп" : lang === "ru" ? "риск" : "risk"}</div>
                </div>
              </div>
            ) : progress > 0 ? (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.dim, marginBottom: 3 }}>
                  <span>{lang === "kz" ? "Деректер жүктелуде" : lang === "ru" ? "Загрузка данных" : "Loading data"}</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: T.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                  <div style={{ height: "100%", borderRadius: 2, background: T.leaf, width: `${progress}%`, transition: "width 0.3s" }} />
                </div>
              </div>
            ) : null}

            {/* Enter */}
            <button className="w-enter-btn" onClick={onStart} style={{
              width: "100%", marginTop: 16, padding: "13px 0", borderRadius: 12,
              background: T.leaf, border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "opacity 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {userName.trim()
                ? (lang === "kz" ? `Кіру, ${userName.trim()}` : lang === "ru" ? `Войти, ${userName.trim()}` : `Enter, ${userName.trim()}`)
                : t.enter}
            </button>

            {/* Demo */}
            <button className="w-demo-btn" onClick={() => { setUserName("Demo"); onStart(); }} style={{
              width: "100%", marginTop: 8, padding: "9px 0", borderRadius: 10,
              background: "transparent", border: `1px solid ${T.brd}`,
              color: T.sub, fontSize: 12, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.leaf; e.currentTarget.style.color = T.leaf; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.brd; e.currentTarget.style.color = T.sub; }}
            >
              {lang === "kz" ? "Демо режимді көру →" : lang === "ru" ? "Посмотреть демо →" : "Try demo →"}
            </button>

            <div style={{ marginTop: 24, fontSize: 10, color: T.dim }}>{t.competitionLine}</div>
          </div>
        </div>
      </div>
    </div>
  );
}




function SettingsPanel({ show, onClose, lang, setLang, theme, setTheme, t }) {
  if (!show) return null;

  const CHANGELOG = [
    { ver: "2.1", date: "27.02.2026", items: {
      kz: ["5 AI модель (Sonnet, Opus, GPT-5, Gemini)", "6 карта мүмкіндігі: тепловая, 3D, minimap", "Дауыс енгізу + TTS озвучивание", "Blur анимациялар + фото карусель", "Мобильді адаптив толық қайта жасалды", "Демо режим + Changelog"],
      ru: ["5 AI-моделей (Sonnet, Opus, GPT-5, Gemini)", "6 фич карты: тепловая, 3D, minimap, легенда", "Голосовой ввод + TTS озвучивание", "Blur-анимации + фото-карусель", "Полная мобильная адаптация", "Демо-режим + Changelog"],
      en: ["5 AI models (Sonnet, Opus, GPT-5, Gemini)", "6 map features: heatmap, 3D, minimap, legend", "Voice input + TTS read-aloud", "Blur animations + photo carousel", "Full mobile responsive redesign", "Demo mode + Changelog"],
    }},
    { ver: "2.0", date: "26.02.2026", items: {
      kz: ["DalaSpace ребрендинг", "Google-стиль авторизация экраны", "SVG логотип", "Dark/Light тема", "3 тілде интерфейс (KZ/RU/EN)"],
      ru: ["Ребрендинг в DalaSpace", "Авторизация в стиле Google", "SVG-логотип", "Тёмная/светлая тема", "Интерфейс на 3 языках (KZ/RU/EN)"],
      en: ["DalaSpace rebrand", "Google-style auth screen", "SVG logo", "Dark/Light theme", "3-language UI (KZ/RU/EN)"],
    }},
    { ver: "1.0", date: "25.02.2026", items: {
      kz: ["17 аймақ нақты уақыт мониторингі", "Open-Meteo API интеграция", "NDVI + ылғалдылық + жауын-шашын деректері", "ИИ спутник суреттерін талдау (Claude Vision)", "ИИ чат-ассистент", "TXT есеп экспорты", "Recharts графиктері"],
      ru: ["Мониторинг 17 регионов в реальном времени", "Интеграция Open-Meteo API", "Данные NDVI + влажность + осадки", "ИИ-анализ спутниковых снимков (Claude Vision)", "ИИ чат-ассистент", "Экспорт отчёта TXT", "Графики Recharts"],
      en: ["17-region real-time monitoring", "Open-Meteo API integration", "NDVI + moisture + precipitation data", "AI satellite analysis (Claude Vision)", "AI chat assistant", "TXT report export", "Recharts visualizations"],
    }},
  ];

  const about = {
    kz: { title: "DalaSpace туралы", desc: "Қазақстанның ауыл шаруашылығын спутниктік мониторингілеу платформасы. 17 аймақты нақты уақытта бақылау, ИИ-талдау және мәдени дақылдар бойынша ұсыныстар.", stack: "Технологиялар", contest: "AEROO SPACE AI конкурсы үшін жасалды", dev: "Разработчик" },
    ru: { title: "О DalaSpace", desc: "Платформа спутниковой аналитики сельского хозяйства Казахстана. Мониторинг 17 регионов в реальном времени, ИИ-анализ снимков и рекомендации по культурам.", stack: "Технологии", contest: "Создано для конкурса AEROO SPACE AI", dev: "Разработчик" },
    en: { title: "About DalaSpace", desc: "Satellite agricultural analytics platform for Kazakhstan. Real-time monitoring of 17 regions, AI image analysis, and crop recommendations.", stack: "Technologies", contest: "Built for AEROO SPACE AI competition", dev: "Developer" },
  };
  const a = about[lang];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 9998, backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 360, maxWidth: "90vw",
        background: T.isDark ? "#0e1012" : "#fff", zIndex: 9999,
        boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", overflowY: "auto",
        display: "flex", flexDirection: "column",
        animation: "slideInRight 0.25s ease",
      }}>
        <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div style={{ padding: "20px 20px 12px", borderBottom: `1px solid ${T.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: T.fg }}>
            {lang === "kz" ? "Баптаулар" : lang === "ru" ? "Настройки" : "Settings"}
          </span>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: T.controlBg, color: T.sub, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Language */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
              {lang === "kz" ? "Тіл" : lang === "ru" ? "Язык" : "Language"}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[{l:"kz",f:"🇰🇿",n:"Қазақша"},{l:"ru",f:"🇷🇺",n:"Русский"},{l:"en",f:"🇬🇧",n:"English"}].map(({l,f,n}) => (
                <button key={l} onClick={() => setLang(l)} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${lang === l ? T.leaf : T.brd}`,
                  background: lang === l ? `${T.leaf}12` : "transparent",
                  color: lang === l ? T.leaf : T.sub,
                  fontSize: 12, fontWeight: lang === l ? 700 : 500,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}><span style={{ fontSize: 16 }}>{f}</span> {n}</button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
              {lang === "kz" ? "Тема" : lang === "ru" ? "Тема" : "Theme"}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[{k:"light",i:"☀",n:lang==="kz"?"Жарық":lang==="ru"?"Светлая":"Light"},{k:"dark",i:"☾",n:lang==="kz"?"Қараңғы":lang==="ru"?"Тёмная":"Dark"}].map(({k,i,n}) => (
                <button key={k} onClick={() => setTheme(k)} style={{
                  flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${theme === k ? T.leaf : T.brd}`,
                  background: theme === k ? `${T.leaf}12` : "transparent",
                  color: theme === k ? T.leaf : T.sub,
                  fontSize: 12, fontWeight: theme === k ? 700 : 500,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}><span style={{ fontSize: 16 }}>{i}</span> {n}</button>
              ))}
            </div>
          </div>

          {/* About */}
          <div style={{ padding: 16, borderRadius: 14, background: T.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${T.brd}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <DalaLogo size={28} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.fg }}>DalaSpace</div>
                <div style={{ fontSize: 10, color: T.dim }}>v2.1 · AEROO SPACE AI</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: T.sub, lineHeight: 1.6, margin: 0 }}>{a.desc}</p>
            <div style={{ marginTop: 10, fontSize: 10, color: T.dim }}>{a.dev}: Murat · {a.contest}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["React","Leaflet","Recharts","Claude API","Open-Meteo","Esri"].map(s => (
                <span key={s} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 6, background: T.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: T.dim, fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Changelog */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.dim, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
              {lang === "kz" ? "Жаңартулар тарихы" : lang === "ru" ? "История обновлений" : "Update history"}
            </div>
            {CHANGELOG.map((c, ci) => (
              <div key={ci} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: T.leaf, background: `${T.leaf}15`, padding: "2px 8px", borderRadius: 6 }}>v{c.ver}</span>
                  <span style={{ fontSize: 10, color: T.dim }}>{c.date}</span>
                </div>
                {c.items[lang].map((item, i) => (
                  <div key={i} style={{ fontSize: 11, color: T.sub, padding: "3px 0", display: "flex", gap: 6 }}>
                    <span style={{ color: T.leaf, fontSize: 7, marginTop: 5, flexShrink: 0 }}>●</span> {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


export default function DalaSpaceApp() {
  const [tab, setTab] = useState("overview");
  const [selected, setSelected] = useState(REGIONS[0]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [updated, setUpdated] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [userName, setUserName] = useState("");
  const [lang, setLang] = useState("ru");
  const [theme, setTheme] = useState("light");

  // Update global tokens on every render
  T = theme === "dark" ? DARK : LIGHT;
  _lang = lang;
  const t = LANG[lang];
  RISK_STYLE = getRiskStyle(t);
  const NAV = getNav(t);

  const loadAll = useCallback(async () => {
    setLoading(true); setProgress(0);
    const results = {};
    // Параллельная загрузка всех регионов разом
    const promises = REGIONS.map(r =>
      fetchWeather(r)
        .then(raw => { results[r.id] = processWeather(raw); })
        .catch(() => { results[r.id] = { error: true }; })
    );
    // Обновляем прогресс по мере завершения
    let done = 0;
    promises.forEach(p => p.finally(() => {
      done++;
      setProgress(Math.round((done / REGIONS.length) * 100));
    }));
    await Promise.all(promises);
    setData(results); setUpdated(new Date()); setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const alertCount = useMemo(() => {
    let n = 0;
    REGIONS.forEach(r => {
      const d = data[r.id];
      if (!d?.cur) return;
      if (["critical", "high"].includes(d.risk)) n++;
      if (d.cur.soil_moisture_0_to_1cm < 0.08) n++;
    });
    return n;
  }, [data]);

  // Satellite area capture for AI analysis
  const [satImage, setSatImage] = useState(null);
  const handleAreaCapture = useCallback((areaData) => {
    setSatImage(areaData);
    setTab("ai");
  }, []);
  const consumeSatImage = useCallback(() => {
    // Don't clear immediately — PageAI needs it for one render cycle
    setTimeout(() => setSatImage(null), 100);
  }, []);

  const ctx = { data, regions: REGIONS, selected, onSelect: setSelected, navigate: setTab, t, lang, userName };

  return (
    <div style={{
      fontFamily: "'Inter', 'Nunito', system-ui, sans-serif",
      background: T.bg, color: T.fg, minHeight: "100dvh",
      display: "flex", flexDirection: "column", overflowX: "hidden",
    }}>
      {/* Settings panel */}
      <SettingsPanel show={showSettings} onClose={() => setShowSettings(false)} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} t={t} />
      {/* Welcome screen */}
      {showWelcome ? <WelcomeScreen onStart={() => setShowWelcome(false)} t={t} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} data={data} progress={progress} userName={userName} setUserName={setUserName} /> : <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; }
        body { margin: 0; background: ${T.bg}; color: ${T.fg}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; line-height: 1.5; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.scrollThumb}; border-radius: 2px; }
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0.3 } }
        @keyframes revolve { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes enter { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }
        .page { animation: enter 0.2s ease; }
        button, input { font-family: inherit; }
        .desk-nav { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .desk-nav::-webkit-scrollbar { display: none; }
        @media(max-width:720px) {
          .desk-nav { display:none !important; }
          .mob-btn { display:flex !important; }
          .mob-bottom-bar { display:flex !important; }
          .mob-export { display:none !important; }
          .g-auto { grid-template-columns: repeat(2,1fr) !important; gap: 8px !important; }
          .g-map { grid-template-columns: 1fr !important; gap: 10px !important; height: auto !important; min-height: 0 !important; }
          .ai-main { grid-template-columns: 1fr !important; gap: 12px !important; }
          .ai-verdict { grid-template-columns: 1fr !important; text-align: center; padding: 16px !important; }
          .ai-metrics { grid-template-columns: repeat(3, 1fr) !important; gap: 6px !important; }
          .ai-details { grid-template-columns: 1fr !important; gap: 10px !important; }
          .g-charts { grid-template-columns: 1fr !important; gap: 10px !important; }
          .page { padding: 12px !important; padding-bottom: 72px !important; overflow-x: hidden !important; }
          .page > div { gap: 12px !important; }
          .mob-header { height: 46px !important; }
          .mob-header-inner { padding: 0 10px !important; gap: 0 !important; }
          .mob-logo-box { width: 28px !important; height: 28px !important; font-size: 12px !important; border-radius: 8px !important; }
          .mob-logo-text { font-size: 13px !important; }
          .mob-logo-sub { font-size: 7px !important; letter-spacing: 2px !important; }
          #dala-minimap { display: none !important; }
          .mob-logo-wrap { gap: 7px !important; margin-right: 0 !important; }
          .mob-stat { padding: 10px 12px !important; border-radius: 12px !important; overflow: hidden !important; }
          .mob-stat-val { font-size: 18px !important; }
          .mob-stat-title { font-size: 9px !important; margin-bottom: 5px !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; }
          .mob-stat-note { font-size: 9px !important; margin-top: 3px !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; }
          .mob-panel { padding: 12px !important; border-radius: 14px !important; overflow-x: auto !important; }
          .mob-title { font-size: 12px !important; margin-bottom: 8px !important; }
          .mob-time { display:none !important; }
          .recharts-wrapper { font-size: 10px !important; }
          table { font-size: 11px !important; display: block !important; overflow-x: auto !important; }
          table th, table td { padding: 6px 6px !important; white-space: nowrap !important; }
          footer { display: none !important; }
          .chat-wrap { height: calc(100dvh - 130px) !important; }
        }
        @media(max-width:400px) {
          .g-auto { grid-template-columns: repeat(2,1fr) !important; gap: 6px !important; }
          .mob-stat { padding: 8px 10px !important; }
          .mob-stat-val { font-size: 16px !important; }
          .mob-panel { padding: 10px !important; border-radius: 12px !important; }
          .page { padding: 8px !important; padding-bottom: 72px !important; }
          .ai-metrics { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media(min-width:721px) {
          .mob-btn { display:none !important; }
          .mob-menu { display:none !important; }
          .mob-bottom-bar { display:none !important; }
        }
        @media(min-width:721px) and (max-width:1200px) {
          .desk-nav button .nav-lbl { display: none !important; }
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="mob-header" style={{
        display: "flex", alignItems: "center", height: 56, flexShrink: 0,
        borderBottom: `1px solid ${T.brd}`,
        background: T.headerBg, backdropFilter: "blur(16px)", boxShadow: T.headerSh,
        position: "sticky", top: 0, zIndex: 200,
      }}>
        <div className="mob-header-inner" style={{ display: "flex", alignItems: "center", width: "100%", padding: "0 20px", gap: 0 }}>
          {/* Logo */}
          <div className="mob-logo-wrap" style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 28, flexShrink: 0 }}>
            <div className="mob-logo-box">
              <DalaLogo size={34} />
            </div>
            <div>
              <div className="mob-logo-text" style={{ fontSize: 15, fontWeight: 900, color: T.fg, lineHeight: 1, letterSpacing: -0.5 }}>DalaSpace</div>
              <div className="mob-logo-sub" style={{ fontSize: 8, color: T.leaf, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" }}>Kazakhstan</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="desk-nav" style={{ display: "flex", gap: 1, flex: 1, overflow: "hidden", minWidth: 0, alignItems: "center" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)} title={n.label} style={{
                display: "flex", alignItems: "center", gap: 5, padding: "7px 10px",
                borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: tab === n.id ? 700 : 500,
                background: tab === n.id ? T.activeTabBg : "transparent",
                color: tab === n.id ? T.leaf : T.sub,
                position: "relative", transition: "all 0.15s",
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
                <n.Icon size={14} strokeWidth={tab === n.id ? 2.2 : 1.8} />
                <span className="nav-lbl">{n.label}</span>
                {n.id === "alerts" && alertCount > 0 && (
                  <span style={{
                    position: "absolute", top: 3, right: 5,
                    background: T.err, color: "#fff", fontSize: 8, fontWeight: 800,
                    width: 14, height: 14, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{Math.min(alertCount, 9)}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button className="mob-btn" onClick={() => setMobileMenu(!mobileMenu)} style={{
            display: "none", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: 9, border: "none",
            background: T.controlBg, color: T.sub,
            cursor: "pointer", fontSize: 16, flexShrink: 0, marginLeft: "auto",
          }}>☰</button>

          {/* Status + Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 }}>
            <span className="mob-export">{!loading && <ExportButton data={data} regions={REGIONS} selected={selected} t={t} lang={lang} />}</span>
            {!loading && updated && (
              <div className="mob-time" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.dim }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%", background: T.leaf,
                  display: "inline-block", animation: "blink 2s infinite",
                }} />
                {updated.toLocaleTimeString(DATE_LOCALE[lang])}
              </div>
            )}
            {loading && <span style={{ fontSize: 11, color: T.gold }}>{progress}%</span>}
            <button onClick={() => setShowSettings(true)} style={{
              width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.brd}`,
              background: T.controlBg, color: T.sub,
              cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
            }}>⚙</button>
            <button onClick={loadAll} disabled={loading} style={{
              padding: "6px 14px", borderRadius: 8, border: `1px solid ${T.brd}`,
              background: T.controlBg, color: T.sub,
              fontSize: 12, cursor: "pointer", opacity: loading ? 0.4 : 1, fontWeight: 600,
            }}>↻</button>
          </div>
        </div>
      </header>

      {/* ─── MOBILE DROPDOWN MENU ─── */}
      {mobileMenu && (
        <div className="mob-menu" style={{
          position: "fixed", top: 46, left: 0, right: 0, bottom: 56, zIndex: 190,
          background: T.menuBg, backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${T.brd}`, padding: 8, overflowY: "auto",
        }}>
          {/* Mobile lang/theme controls */}
          <div style={{ display: "flex", gap: 8, padding: "8px 14px 12px", borderBottom: `1px solid ${T.brd}`, marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 2, background: T.controlBg, borderRadius: 7, padding: 2, border: `1px solid ${T.brd}` }}>
              {["kz","ru","en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: "4px 0", width: 34, borderRadius: 5, border: "none", cursor: "pointer",
                  fontSize: 11, fontWeight: lang === l ? 800 : 500, textTransform: "uppercase",
                  textAlign: "center",
                  background: lang === l ? T.leaf : "transparent",
                  color: lang === l ? (T.isDark ? "#0a0c0e" : "#fff") : T.sub,
                }}>{l}</button>
              ))}
            </div>
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={{
              width: 36, height: 36, borderRadius: 8, border: `1px solid ${T.brd}`,
              background: T.controlBg, color: T.leaf, cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{theme === "light" ? "☾" : "☀"}</button>
          </div>
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setTab(n.id); setMobileMenu(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
              borderRadius: 10, border: "none", cursor: "pointer", width: "100%",
              background: tab === n.id ? T.activeTabBg : "transparent",
              color: tab === n.id ? T.leaf : T.sub,
              fontSize: 13, fontWeight: tab === n.id ? 700 : 500, marginBottom: 2,
            }}>
              <n.Icon size={16} strokeWidth={tab === n.id ? 2.2 : 1.8} /> {n.label}
              {n.id === "alerts" && alertCount > 0 && (
                <span style={{
                  marginLeft: "auto", background: T.err, color: "#fff",
                  fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 10,
                }}>{alertCount}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ─── MOBILE BOTTOM TAB BAR ─── */}
      <div className="mob-bottom-bar" style={{
        display: "none", position: "fixed", bottom: 0, left: 0, right: 0,
        height: 56, zIndex: 200,
        background: T.barBg, backdropFilter: "blur(16px)", boxShadow: T.headerSh,
        borderTop: `1px solid ${T.brd}`,
        justifyContent: "space-around", alignItems: "center",
        padding: "0 2px",
      }}>
        {[
          { id: "overview", Icon: LayoutDashboard, label: t.overviewTab },
          { id: "map",      Icon: Map,             label: t.mapTab },
          { id: "forecast", Icon: TrendingUp,      label: t.forecastTab },
          { id: "chat",     Icon: MessageCircle,   label: t.chatTab },
          { id: "more",     Icon: null,            label: t.moreTab },
        ].map(n => (
          <button key={n.id} onClick={() => {
            if (n.id === "more") { setMobileMenu(!mobileMenu); }
            else { setTab(n.id); setMobileMenu(false); }
          }} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            padding: "6px 0", border: "none", cursor: "pointer",
            background: "transparent", flex: 1,
            color: (n.id === "more" && mobileMenu) || tab === n.id ? T.leaf : T.dim,
            fontSize: 9, fontWeight: tab === n.id ? 700 : 500,
            position: "relative", overflow: "hidden",
            whiteSpace: "nowrap", textOverflow: "ellipsis",
          }}>
            {n.id === "more"
              ? <span style={{ fontSize: 18, lineHeight: 1 }}>⋯</span>
              : <n.Icon size={20} strokeWidth={tab === n.id ? 2.2 : 1.5} />
            }
            {n.label}
            {n.id === "alerts" && alertCount > 0 && (
              <span style={{
                position: "absolute", top: 2, right: 6,
                background: T.err, width: 6, height: 6, borderRadius: "50%",
              }} />
            )}
          </button>
        ))}
      </div>

      {/* ─── CONTENT ─── */}
      <main className="page" key={tab} style={{ flex: 1, padding: "22px 24px", overflow: "auto", overflowX: "hidden", paddingBottom: 22 }}>
        {loading ? (
          <Loader text={t.loading || "Loading..."} progress={progress} />
        ) : (
          <>
            {tab === "overview" && <PageOverview {...ctx} onAreaCapture={handleAreaCapture} />}
            {tab === "map"      && <PageMap      {...ctx} />}
            {tab === "regions"  && <PageRegions  {...ctx} />}
            {tab === "forecast" && <PageForecast {...ctx} />}
            {tab === "compare"  && <PageCompare  {...ctx} />}
            {tab === "drought"  && <PageDrought  {...ctx} />}
            {tab === "water"    && <PageWater    {...ctx} />}
            {tab === "timeline" && <PageTimeline {...ctx} />}
            {tab === "ai"       && <PageAI initialImage={satImage} onConsumeImage={consumeSatImage} t={t} lang={lang} />}
            {tab === "chat"     && <PageChat {...ctx} />}
            {tab === "alerts"   && <PageAlerts   {...ctx} />}
            {/* about moved to Settings panel */}
          </>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: `1px solid ${T.brd}`, padding: "10px 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 6, fontSize: 11, color: T.dim,
      }}>
        <span>© 2025 DalaSpace · AEROO SPACE AI</span>
        <span>Open-Meteo API · Esri Imagery · Claude AI · {REGIONS.length} регионов</span>
        <span>Казахстан</span>
      </footer>
      </>}
    </div>
  );
}
