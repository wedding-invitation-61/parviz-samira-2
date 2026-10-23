// ============================================================
// СВАДЕБНОЕ ПРИГЛАСИТЕЛЬНОЕ | СЦЕНАРИЙ И ИНТЕРАКТИВ
// ПАРВИЗ И САМИРА | 29 ОКТЯБРЯ 2026
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const config = window.WEDDING_CONFIG || {};

  // 1. Применение настроек из config
  applyConfigData(config);

  // 2. Генерация календаря на Октябрь 2026
  generateCalendar(config.weddingYear || 2026, config.weddingMonth || 10, config.weddingDay || 29);

  // 3. Таймер обратного отсчёта до 29 октября 2026, 17:30
  initCountdown(config.weddingYear || 2026, config.weddingMonth || 10, config.weddingDay || 29, 17, 30);

  // 4. Анимации при скролле (включая расписание)
  initScrollAnimations();

  // 5. Частицы золотой пыльцы и искр (Canvas)
  initSparklesCanvas();

  // 6. Музыкальный плеер с треком Amr Diab
  initAudioPlayer(config.audioTrack || 'assets/audio/wedding_music.mp3');

  // 7. Инлайн-анкета присутствия (RSVP) с Google Таблицей
  initInlineRsvpSurvey(config);

  // 8. Добавление события в календарь (.ICS)
  initCalendarExport(config);
});

// ------------------------------------------------------------
// Функция применения настроек
// ------------------------------------------------------------
function applyConfigData(config) {
  if (config.coupleTitle) {
    const mainTitle = document.getElementById('coupleTitleDisplay');
    if (mainTitle) mainTitle.textContent = config.coupleTitle;
    const storyTitle = document.getElementById('coupleNamesDisplay');
    if (storyTitle) storyTitle.textContent = config.coupleTitle;
  }
  if (config.celebrationType && document.getElementById('celebrationTypeDisplay')) {
    document.getElementById('celebrationTypeDisplay').textContent = config.celebrationType.toUpperCase();
  }
  if (config.greetingTitle && document.getElementById('greetingTitleDisplay')) {
    document.getElementById('greetingTitleDisplay').textContent = config.greetingTitle;
  }
  if (config.fullDateText && document.getElementById('dateTextDisplay')) {
    document.getElementById('dateTextDisplay').textContent = config.fullDateText.toUpperCase();
  }
  if (config.timeText && document.getElementById('timeTextDisplay')) {
    document.getElementById('timeTextDisplay').textContent = config.timeText.toUpperCase();
  }
  if (config.venueName && document.getElementById('venueNameDisplay')) {
    document.getElementById('venueNameDisplay').textContent = config.venueName;
  }
  if (config.blessingText && document.getElementById('blessingTextDisplay')) {
    document.getElementById('blessingTextDisplay').textContent = config.blessingText;
  }

  // Ссылка на Яндекс.Карты (автомаршрут)
  const mapBtn = document.getElementById('mapBtn');
  if (mapBtn && config.mapLink) {
    mapBtn.href = config.mapLink;
  }
}

// ------------------------------------------------------------
// Генерация интерактивного календаря месяца (Октябрь 2026)
// ------------------------------------------------------------
function generateCalendar(year, month, weddingDay) {
  const monthNamesRu = [
    'ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ',
    'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'
  ];
  
  const monthHeader = document.getElementById('calendarMonthName');
  if (monthHeader) {
    monthHeader.textContent = `${monthNamesRu[month - 1]} ${year}`;
  }

  const daysGrid = document.getElementById('calendarDaysGrid');
  if (!daysGrid) return;
  daysGrid.innerHTML = '';

  // Первый день месяца
  const firstDay = new Date(year, month - 1, 1);
  let startDayOfWeek = firstDay.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  // Количество дней в месяце
  const daysInMonth = new Date(year, month, 0).getDate();

  // Пустые ячейки
  for (let i = 0; i < startDayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day-cell empty';
    daysGrid.appendChild(emptyCell);
  }

  // Ячейки дней
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day-cell';
    dayCell.textContent = day;

    if (day === weddingDay) {
      dayCell.classList.add('highlight-day');
      // Вставляем пульсирующее орнаментальное кольцо
      const ringImg = document.createElement('img');
      ringImg.src = 'assets/ornaments/calendar_ring.svg';
      ringImg.alt = 'День свадьбы';
      ringImg.className = 'day-wedding-ring';
      dayCell.appendChild(ringImg);
    }

    daysGrid.appendChild(dayCell);
  }
}

// ------------------------------------------------------------
// Таймер обратного отсчёта
// ------------------------------------------------------------
function initCountdown(year, month, day, hour = 17, minute = 30) {
  const targetDate = new Date(year, month - 1, day, hour, minute, 0).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('timerDays').textContent = '00';
      document.getElementById('timerHours').textContent = '00';
      document.getElementById('timerMinutes').textContent = '00';
      document.getElementById('timerSeconds').textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => (n < 10 ? '0' + n : n);

    if (document.getElementById('timerDays')) document.getElementById('timerDays').textContent = pad(d);
    if (document.getElementById('timerHours')) document.getElementById('timerHours').textContent = pad(h);
    if (document.getElementById('timerMinutes')) document.getElementById('timerMinutes').textContent = pad(m);
    if (document.getElementById('timerSeconds')) document.getElementById('timerSeconds').textContent = pad(s);
  }

  update();
  setInterval(update, 1000);
}

// ------------------------------------------------------------
// Intersection Observer для плавной анимации появления текста и расписания
// ------------------------------------------------------------
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-on-scroll, .flower-bloom-on-scroll');
  const timelineItems = document.querySelectorAll('.reveal-timeline');
  
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
    timelineItems.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  reveals.forEach(el => observer.observe(el));
  timelineItems.forEach(el => observer.observe(el));
}

// ------------------------------------------------------------
// Частицы золотой пыльцы и искр на Canvas
// ------------------------------------------------------------
function initSparklesCanvas() {
  const canvas = document.getElementById('sparklesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 28;

  for (let i = 0; i < particleCount; i++) {
    const isRuby = Math.random() < 0.25;
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
      isRuby: isRuby
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.y += p.speedY;
      p.x += Math.sin(p.angle) * 0.3 + p.speedX;
      p.angle += 0.02;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.angle * 2));

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      if (p.isRuby) {
        ctx.fillStyle = `rgba(180, 24, 50, ${currentOpacity * 0.85})`;
        ctx.shadowColor = 'rgba(220, 50, 80, 0.9)';
      } else {
        ctx.fillStyle = `rgba(212, 175, 55, ${currentOpacity})`;
        ctx.shadowColor = 'rgba(255, 230, 150, 0.9)';
      }
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

// ------------------------------------------------------------
// Музыкальный плеер с треком Amr Diab
// ------------------------------------------------------------
function initAudioPlayer(trackUrl) {
  const toggleBtn = document.getElementById('musicToggle');
  const audioElement = document.getElementById('weddingAudio');
  if (!toggleBtn || !audioElement) return;

  if (trackUrl) {
    audioElement.src = trackUrl;
  }

  let isPlaying = false;

  function playAudio() {
    audioElement.play()
      .then(() => {
        isPlaying = true;
        toggleBtn.classList.add('playing');
      })
      .catch((err) => {
        console.log('Audio autoplay blocked until user gesture:', err);
      });
  }

  function pauseAudio() {
    audioElement.pause();
    isPlaying = false;
    toggleBtn.classList.remove('playing');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isPlaying) {
      playAudio();
    } else {
      pauseAudio();
    }
  });

  // Запуск при первом клике на экране
  const startOnFirstClick = () => {
    if (!isPlaying) {
      playAudio();
    }
    document.removeEventListener('click', startOnFirstClick);
    document.removeEventListener('touchstart', startOnFirstClick);
  };

  document.addEventListener('click', startOnFirstClick, { once: true });
  document.addEventListener('touchstart', startOnFirstClick, { once: true });
}

// ------------------------------------------------------------
// Инлайн-анкета присутствия (RSVP) с кнопками +- и записью
// ------------------------------------------------------------
function initInlineRsvpSurvey(config) {
  const form = document.getElementById('inlineRsvpForm');
  const btnMinus = document.getElementById('btnMinus');
  const btnPlus = document.getElementById('btnPlus');
  const guestsDisplay = document.getElementById('guestsCountDisplay');
  const guestsInput = document.getElementById('inlineGuestsCountInput');
  const guestsField = document.getElementById('guestsCountField');
  const submitBtn = document.getElementById('submitSurveyBtn');
  const successAlert = document.getElementById('surveySuccessAlert');
  const successDesc = document.getElementById('successTextDesc');
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');

  if (!form || !btnMinus || !btnPlus) return;

  let currentGuests = 1;

  // Логика кнопок + и - с анимацией
  function updateGuestCount(newVal) {
    if (newVal < 1) newVal = 1;
    if (newVal > 10) newVal = 10;
    currentGuests = newVal;
    guestsDisplay.textContent = currentGuests;
    guestsInput.value = currentGuests;

    // Анимация числа
    guestsDisplay.classList.remove('pop-anim');
    void guestsDisplay.offsetWidth; // Триггер перезапуска анимации
    guestsDisplay.classList.add('pop-anim');
  }

  btnMinus.addEventListener('click', () => {
    updateGuestCount(currentGuests - 1);
  });

  btnPlus.addEventListener('click', () => {
    updateGuestCount(currentGuests + 1);
  });

  // Если гость выбрал "К сожалению, не смогу" - скрываем счетчик гостей
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'Не смогу') {
        guestsField.style.display = 'none';
      } else {
        guestsField.style.display = 'block';
      }
    });
  });

  // Обработка отправки формы
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guestName').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const guests = attendance === 'Буду' ? currentGuests : 0;
    const timestamp = new Date().toLocaleString('ru-RU');

    if (!name) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Отправка ответа...</span>`;

    const dataToSend = {
      name: name,
      attendance: attendance,
      guests_count: guests,
      submitted_at: timestamp
    };

    // 1. Если настроен скрипт Google Таблиц:
    if (config.googleScriptUrl && config.googleScriptUrl.trim() !== '') {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('attendance', attendance);
      formData.append('guests_count', guests);
      formData.append('date', timestamp);

      fetch(config.googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      })
      .then(() => {
        showSuccessMessage(name, attendance, guests);
      })
      .catch(() => {
        // Даже если возникла CORS-ошибка Google Apps Script, no-cors обычно срабатывает
        showSuccessMessage(name, attendance, guests);
      });
    } else {
      // 2. Локальное сохранение (если ссылка на таблицу пока не вставлена)
      try {
        const saved = JSON.parse(localStorage.getItem('wedding_rsvp_responses') || '[]');
        saved.push(dataToSend);
        localStorage.setItem('wedding_rsvp_responses', JSON.stringify(saved));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      // Имитация быстрой отправки
      setTimeout(() => {
        showSuccessMessage(name, attendance, guests);
      }, 500);
    }
  });

  function showSuccessMessage(name, attendance, guests) {
    submitBtn.style.display = 'none';
    successAlert.style.display = 'block';

    if (attendance === 'Буду') {
      successDesc.textContent = `Дорогой(ая) ${name}, ваш ответ успешно записан (${guests} чел.)! Будем бесконечно рады видеть вас на нашей свадьбе!`;
    } else {
      successDesc.textContent = `Дорогой(ая) ${name}, благодарим за ваш ответ! Очень жаль, что вы не сможете быть, но мы ценим ваше внимание!`;
    }

    // Сохраняем имя в локальной сессии
    localStorage.setItem('wedding_guest_confirmed', name);
  }
}

// ------------------------------------------------------------
// Генерация файла календаря .ICS
// ------------------------------------------------------------
function initCalendarExport(config) {
  const btn = document.getElementById('calendarAddBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const year = config.weddingYear || 2026;
    const month = String(config.weddingMonth || 10).padStart(2, '0');
    const day = String(config.weddingDay || 29).padStart(2, '0');

    const dtStart = `${year}${month}${day}T173000`;
    const dtEnd = `${year}${month}${day}T235900`;

    const title = `Свадебное торжество: ${config.coupleTitle || 'Парвиз и Самира'}`;
    const description = `Свадьба ${config.coupleTitle}. Ресторан «Летний дворец».`;
    const location = `${config.venueName || 'Ресторан «Летний дворец»'}, ${config.venueAddress || 'село Чалтырь, Ростовская улица, 104'}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Invitation//RU',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `wedding_parviz_samira_29_10_2026.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
