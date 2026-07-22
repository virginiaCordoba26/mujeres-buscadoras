document.addEventListener('DOMContentLoaded', function(){

  var yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  /* ---- mobile menu ---- */
  var tabsNav = document.getElementById('tabsNav');
  var menuToggle = document.getElementById('menuToggle');
  if(menuToggle && tabsNav){
    menuToggle.addEventListener('click', function(){
      var open = tabsNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---- dropdown menus (Quiénes somos / Nuestro trabajo) ---- */
  var navDrops = document.querySelectorAll('.nav-drop');
  function closeAllDrops(except){
    navDrops.forEach(function(d){
      if(d !== except){
        d.classList.remove('open');
        d.querySelector('.nav-drop-btn').setAttribute('aria-expanded','false');
      }
    });
  }
  navDrops.forEach(function(drop){
    var btn = drop.querySelector('.nav-drop-btn');
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var willOpen = !drop.classList.contains('open');
      closeAllDrops();
      drop.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function(){ closeAllDrops(); });

  /* close mobile menu when a nav link is clicked */
  document.querySelectorAll('nav.tabs a').forEach(function(a){
    a.addEventListener('click', function(){
      if(tabsNav){ tabsNav.classList.remove('open'); }
      closeAllDrops();
    });
  });

  /* ---- hero carousel (only on index.html) ---- */
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('#heroDots button');
  var currentSlide = 0;
  var heroTimer;
  function goToSlide(i){
    currentSlide = (i + slides.length) % slides.length;
    slides.forEach(function(s, idx){ s.classList.toggle('active', idx === currentSlide); });
    dots.forEach(function(d, idx){ d.classList.toggle('active', idx === currentSlide); });
  }
  function restartAutoplay(){
    clearInterval(heroTimer);
    heroTimer = setInterval(function(){ goToSlide(currentSlide + 1); }, 7000);
  }
  var heroPrev = document.getElementById('heroPrev');
  var heroNext = document.getElementById('heroNext');
  if(heroPrev){ heroPrev.addEventListener('click', function(){ goToSlide(currentSlide - 1); restartAutoplay(); }); }
  if(heroNext){ heroNext.addEventListener('click', function(){ goToSlide(currentSlide + 1); restartAutoplay(); }); }
  dots.forEach(function(d){
    d.addEventListener('click', function(){ goToSlide(parseInt(d.getAttribute('data-goto'), 10)); restartAutoplay(); });
  });
  if(slides.length){ restartAutoplay(); }

  /* ---- search popover ---- */
  var searchToggle = document.getElementById('searchToggle');
  var searchPop = document.getElementById('searchPop');
  if(searchToggle && searchPop){
    searchToggle.addEventListener('click', function(e){
      e.stopPropagation();
      searchPop.classList.toggle('open');
      if(searchPop.classList.contains('open')){ searchPop.querySelector('input').focus(); }
    });
    document.addEventListener('click', function(e){
      if(!searchPop.contains(e.target) && e.target !== searchToggle){ searchPop.classList.remove('open'); }
    });
  }

  /* ---- contact form (contacto.html) -> envía a Formspree ---- */
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var self = this;
      var btn = this.querySelector('.submit-btn');
      var original = btn.textContent;
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      var data = new FormData(self);
      data.append('_replyto', data.get('correo'));

      fetch(self.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function(response){
        if(response.ok){
          btn.textContent = '¡Mensaje enviado!';
          self.reset();
        } else {
          btn.textContent = 'Error, intenta de nuevo';
        }
      }).catch(function(){
        btn.textContent = 'Error, intenta de nuevo';
      }).finally(function(){
        setTimeout(function(){ btn.textContent = original; btn.disabled = false; }, 2600);
      });
    });
  }

  /* ---- reveal on scroll ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

});

