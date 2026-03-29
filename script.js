const variants = [
  { name: 'Rose', image: 'assets/images/07216a6f-ed1c-49eb-8713-bebbb8f6638a.jpeg' },
  { name: 'Rose clair', image: 'assets/images/04a8c3bd-b79f-4aab-b294-697c1f01caf9.jpeg' },
  { name: 'Gris', image: 'assets/images/276c92f9-af37-4a65-b3f5-61d03229a6c1.jpeg' },
  { name: 'Noir', image: 'assets/images/28bfc26e-045c-42f2-bcb2-810611f1ffec.jpeg' },
  { name: 'Vert sauge', image: 'assets/images/4a410dfd-cf58-4026-8056-039bd497de69.jpeg' },
  { name: 'Beige', image: 'assets/images/5302eda4-836d-4665-828d-df61c8166615.jpeg' },
  { name: 'Bleu nuit', image: 'assets/images/6ca216b2-e116-4357-a86b-bff119a6e204.jpeg' },
  { name: 'Bleu royal', image: 'assets/images/84929e0f-b16d-4fbb-80d5-106b214cf619.jpeg' },
  { name: 'Rose nude', image: 'assets/images/87ebcc59-15d8-47c6-b482-40e44ffc768f.jpeg' },
  { name: 'Silver', image: 'assets/images/8b7ff2ef-00cc-481d-b301-b4df2eb20bba.jpeg' },
  { name: 'Rose gold', image: 'assets/images/8ddd7e43-d7ce-4990-abd9-2580df773224.jpeg' },
  { name: 'Taupe', image: 'assets/images/9adc9a31-12ae-4a30-a497-1fc21504b14f.jpeg' },
  { name: 'Noisette', image: 'assets/images/9ecf0c9e-bb41-421c-b206-47fb9138fd2e.jpeg' },
  { name: 'Sable', image: 'assets/images/a79d6728-3a69-4611-bb8c-b9bd32f8e4a8.jpeg' },
  { name: 'Perle', image: 'assets/images/b6b2ae6a-38eb-45c3-bc00-917f3c1b9526.jpeg' },
  { name: 'Camel', image: 'assets/images/b6c45c13-b075-4b6e-a85f-7e61e8ebde6f.jpeg' },
  { name: 'Lilac', image: 'assets/images/baf8698c-f9aa-4e90-974a-b84a5d846503.jpeg' },
  { name: 'Nude rosé', image: 'assets/images/c2b97d88-1dce-42cb-9af8-0fcc0144f9f2.jpeg' },
  { name: 'Marron glacé', image: 'assets/images/c5679a50-b0f3-4c08-8393-fabd02f97330.jpeg' },
  { name: 'Marron', image: 'assets/images/ce11bae9-ff26-4557-ace9-9253922d0647.jpeg' }
];

let activeImageIndex = 0;
let selectedColorIndex = 0;
let autoSlide = null;
let touchStartX = 0;
let lightboxOpen = false;

const el = {
  mainImage: document.getElementById('mainImage'),
  galleryStage: document.getElementById('galleryStage'),
  thumbs: document.getElementById('thumbs'),
  dots: document.getElementById('dots'),
  summarySet: document.getElementById('summarySet'),
  selectedColorLabel: document.getElementById('selectedColorLabel'),
  selectedColorValue: document.getElementById('selectedColorValue'),
  floatingWa: document.getElementById('floatingWa'),
  heroWhatsapp: document.getElementById('heroWhatsapp'),
  whatsappBtn: document.getElementById('whatsappBtn'),
  submitBtn: document.getElementById('submitBtn'),
  colorModal: document.getElementById('colorModal'),
  colorPickerGrid: document.getElementById('colorPickerGrid'),
  colorPickerTrigger: document.getElementById('colorPickerTrigger'),
  closeColorModal: document.getElementById('closeColorModal'),
  lightbox: document.getElementById('lightbox'),
  lightboxImage: document.getElementById('lightboxImage'),
  openLightbox: document.getElementById('openLightbox'),
  closeLightbox: document.getElementById('closeLightbox')
};

function getSelectedColor() {
  return variants[selectedColorIndex];
}

function getActiveImage() {
  return variants[activeImageIndex];
}

function renderThumbs() {
  el.thumbs.innerHTML = variants.map((variant, index) => `
    <button class="${index === activeImageIndex ? 'active' : ''}" data-index="${index}" type="button" aria-label="${variant.name}">
      <img src="${variant.image}" alt="${variant.name}">
    </button>
  `).join('');

  el.thumbs.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => setImage(Number(button.dataset.index), { userTriggered: true }));
  });
}

function renderDots() {
  el.dots.innerHTML = variants.map((_, index) => `
    <button class="${index === activeImageIndex ? 'active' : ''}" data-index="${index}" type="button" aria-label="slide ${index + 1}"></button>
  `).join('');

  el.dots.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => setImage(Number(button.dataset.index), { userTriggered: true }));
  });
}

function renderColorPicker() {
  el.colorPickerGrid.innerHTML = variants.map((variant, index) => `
    <button class="picker-option ${index === selectedColorIndex ? 'active' : ''}" data-index="${index}" type="button">
      <img src="${variant.image}" alt="${variant.name}">
      <div>
        <strong>${variant.name}</strong>
        <span>طقم كبيرة + متوسطة • 329 DH</span>
      </div>
    </button>
  `).join('');

  el.colorPickerGrid.querySelectorAll('.picker-option').forEach((button) => {
    button.addEventListener('click', () => {
      selectColor(Number(button.dataset.index));
      closeColorModal();
    });
  });
}

function updateWhatsAppLinks() {
  const selected = getSelectedColor();
  const base = `سلام، بغيت نطلب طقم الحقائب ChadiStyle\nاللون: ${selected.name}\nالمنتج: حقيبة كبيرة + حقيبة متوسطة\nالثمن: 329 DH`;
  const url = `https://wa.me/212622566694?text=${encodeURIComponent(base)}`;
  el.floatingWa.href = url;
  el.heroWhatsapp.href = url;
}

function updateSelectedColorUI() {
  const selected = getSelectedColor();
  el.selectedColorLabel.textContent = selected.name;
  el.selectedColorValue.value = selected.name;
  el.summarySet.textContent = selected.name;
  updateWhatsAppLinks();
  renderColorPicker();
}

function setImage(index, options = {}) {
  const { userTriggered = false } = options;
  activeImageIndex = (index + variants.length) % variants.length;
  const image = getActiveImage();

  el.galleryStage.classList.add('is-changing');
  setTimeout(() => {
    el.mainImage.src = image.image;
    el.mainImage.alt = `طقم حقائب ChadiStyle ${image.name}`;
    el.lightboxImage.src = image.image;
    el.lightboxImage.alt = `صورة مكبرة ${image.name}`;
    el.galleryStage.classList.remove('is-changing');
  }, 100);

  renderThumbs();
  renderDots();

  if (userTriggered) {
    restartAutoplay();
    document.querySelector('.thumb-rail button.active')?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function selectColor(index) {
  selectedColorIndex = (index + variants.length) % variants.length;
  updateSelectedColorUI();
}

function nextSlide() { setImage(activeImageIndex + 1); }
function prevSlide() { setImage(activeImageIndex - 1); }

function startAutoplay() {
  stopAutoplay();
  autoSlide = setInterval(() => {
    if (!lightboxOpen && !el.colorModal.classList.contains('show')) setImage(activeImageIndex + 1);
  }, 3200);
}

function stopAutoplay() {
  if (autoSlide) {
    clearInterval(autoSlide);
    autoSlide = null;
  }
}

function restartAutoplay() {
  stopAutoplay();
  startAutoplay();
}

function initTouchSwipe() {
  el.galleryStage?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  el.galleryStage?.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) > 45) delta < 0 ? nextSlide() : prevSlide();
    startAutoplay();
  }, { passive: true });
}

function initCountdown() {
  const countdown = document.getElementById('countdown');
  const update = () => {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = end - now;
    if (diff <= 0) {
      countdown.textContent = '⏳ آخر لحظات العرض';
      return;
    }
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    countdown.textContent = `⏳ ${hours}س ${minutes}د ${seconds}ث`;
  };
  update();
  setInterval(update, 1000);
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
}

function initMenu() {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('mobileNav');
  btn?.addEventListener('click', () => nav.classList.toggle('show'));
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('show')));
}

function initScrollButtons() {
  document.querySelectorAll('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function normalizePhone(value) {
  let v = (value || '').replace(/\s+/g, '').replace(/[^0-9]/g, '');
  if (v.startsWith('212')) v = '0' + v.slice(3);
  if (v.length > 10) v = v.slice(0, 10);
  return v;
}

function buildWhatsAppMessage() {
  const name = document.getElementById('customerName')?.value.trim() || '';
  const phone = normalizePhone(document.getElementById('customerPhone')?.value || '');
  const city = document.getElementById('customerCity')?.value.trim() || '';
  const address = document.getElementById('customerAddress')?.value.trim() || '';
  const selected = getSelectedColor();

  return [
    'سلام، بغيت نطلب طقم الحقائب ChadiStyle ✅',
    `اللون: ${selected.name}`,
    'المنتج: حقيبة كبيرة + حقيبة متوسطة',
    'الثمن: 329 DH',
    name ? `الاسم: ${name}` : null,
    phone ? `الهاتف: ${phone}` : null,
    city ? `المدينة: ${city}` : null,
    address ? `العنوان: ${address}` : null,
    'الدفع عند الاستلام'
  ].filter(Boolean).join('\n');
}

function initWhatsAppButton() {
  el.whatsappBtn?.addEventListener('click', () => {
    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/212622566694?text=${message}`, '_blank', 'noopener');
  });
}

function initForm() {
  const form = document.getElementById('orderForm');
  const phoneInput = document.getElementById('customerPhone');

  phoneInput?.addEventListener('input', () => {
    phoneInput.value = normalizePhone(phoneInput.value);
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    el.submitBtn.disabled = true;
    el.submitBtn.textContent = 'جاري إرسال الطلب...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        window.location.href = 'thankyou.html';
        return;
      }

      throw new Error('submit-failed');
    } catch (error) {
      el.submitBtn.disabled = false;
      el.submitBtn.textContent = 'تأكيد الطلب الآن';
      alert('وقع مشكل صغير فالإرسال. تقدر تعاود المحاولة أو تطلب مباشرة عبر واتساب.');
    }
  });
}

function initGalleryButtons() {
  document.getElementById('nextSlide')?.addEventListener('click', () => {
    nextSlide();
    restartAutoplay();
  });

  document.getElementById('prevSlide')?.addEventListener('click', () => {
    prevSlide();
    restartAutoplay();
  });

  el.galleryStage?.addEventListener('mouseenter', stopAutoplay);
  el.galleryStage?.addEventListener('mouseleave', startAutoplay);
}

function openColorModal() {
  el.colorModal.classList.add('show');
  el.colorModal.setAttribute('aria-hidden', 'false');
  el.colorPickerTrigger.setAttribute('aria-expanded', 'true');
  stopAutoplay();
}

function closeColorModal() {
  el.colorModal.classList.remove('show');
  el.colorModal.setAttribute('aria-hidden', 'true');
  el.colorPickerTrigger.setAttribute('aria-expanded', 'false');
  startAutoplay();
}

function initColorPickerModal() {
  el.colorPickerTrigger?.addEventListener('click', openColorModal);
  el.closeColorModal?.addEventListener('click', closeColorModal);
  document.querySelectorAll('[data-close-color-modal]').forEach((item) => {
    item.addEventListener('click', closeColorModal);
  });
}

function openLightbox() {
  const image = getActiveImage();
  lightboxOpen = true;
  el.lightboxImage.src = image.image;
  el.lightboxImage.alt = `صورة مكبرة ${image.name}`;
  el.lightbox.classList.add('show');
  el.lightbox.setAttribute('aria-hidden', 'false');
  stopAutoplay();
}

function closeLightbox() {
  lightboxOpen = false;
  el.lightbox.classList.remove('show');
  el.lightbox.setAttribute('aria-hidden', 'true');
  startAutoplay();
}

function initLightbox() {
  el.openLightbox?.addEventListener('click', openLightbox);
  el.mainImage?.addEventListener('click', openLightbox);
  el.closeLightbox?.addEventListener('click', closeLightbox);
  el.lightbox?.addEventListener('click', (e) => {
    if (e.target === el.lightbox) closeLightbox();
  });
}

function initEscapeKey() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (el.colorModal.classList.contains('show')) closeColorModal();
      if (el.lightbox.classList.contains('show')) closeLightbox();
    }
  });
}

renderThumbs();
renderDots();
renderColorPicker();
updateSelectedColorUI();
setImage(0);
initCountdown();
initReveal();
initMenu();
initScrollButtons();
initTouchSwipe();
initWhatsAppButton();
initForm();
initGalleryButtons();
initColorPickerModal();
initLightbox();
initEscapeKey();
startAutoplay();
