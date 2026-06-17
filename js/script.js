  // Это просто запасной адрес — показывается, если автоматическая отправка не сработает
  const SUPPORT_EMAIL = "akkyevnurbek@gmail.com";

  const ticketId = "MS-" + Date.now().toString(36).toUpperCase().slice(-6);
  document.getElementById('ticketId').textContent = ticketId;
  document.getElementById('ticketDate').textContent = new Date().toLocaleDateString('ru-RU');

  const select = document.getElementById('f-category');
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      select.value = chip.dataset.value;
      document.getElementById('f-name').focus({ preventScroll: true });
    });
  });

  const form = document.getElementById('supportForm');
  const statusMsg = document.getElementById('statusMsg');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const category = fd.get('category');
    const topic = fd.get('topic') || 'без темы';
    fd.set('subject', `[MegaStore Support] ${category} — ${topic} (${ticketId})`);
    fd.append('ticket_id', ticketId);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';
    statusMsg.style.display = 'block';
    statusMsg.style.color = 'var(--gold)';
    statusMsg.textContent = 'Отправляем обращение…';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd
      });
      const result = await res.json();

      if (result.success) {
        statusMsg.style.color = 'var(--gold)';
        statusMsg.textContent = `Готово! Мы получили обращение (бланк ${ticketId}) и ответим на ${fd.get('email')}.`;
        form.reset();
        chips.forEach(c => c.classList.remove('active'));
      } else {
        throw new Error(result.message || 'Сервис вернул ошибку');
      }
    } catch (err) {
      statusMsg.style.color = '#E2604A';
      statusMsg.textContent = `Не получилось отправить автоматически.`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить обращение';
    }
  });

  document.getElementById('fallbackLink').textContent = SUPPORT_EMAIL;
  document.getElementById('fallbackLink').href = "mailto:" + SUPPORT_EMAIL;
