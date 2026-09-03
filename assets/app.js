/* Três coisas, só. Revelar cada bloco quando ele entra na tela, mostrar a barra
   fixa depois que o hero sai, e escondê-la enquanto um botão do Direct já está
   à vista. Nada preso ao scroll: isso engasga na WebView do Instagram. */
(function () {
  'use strict';

  var root    = document.documentElement;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var blocks  = document.querySelectorAll('.sec, .foot');
  var hasIO   = 'IntersectionObserver' in window;

  /* Entrada do hero, escalonada, no primeiro quadro depois da pintura. */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add('is-ready'); });
  });

  /* Rede de segurança: se a aba estiver em segundo plano, o navegador não
     entrega os avisos do observador e nada apareceria. Passado o tempo da
     animação, tudo é revelado de qualquer jeito. */
  var showAll = function () {
    root.classList.add('is-ready');
    [].forEach.call(blocks, function (b) { b.classList.add('is-in'); });
  };
  setTimeout(showAll, 1600);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) requestAnimationFrame(showAll);
  });

  /* Cada bloco entra inteiro; o escalonamento entre os filhos é do CSS. */
  if (!hasIO || reduced) {
    [].forEach.call(blocks, function (b) { b.classList.add('is-in'); });
  } else {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        reveal.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    [].forEach.call(blocks, function (b) { reveal.observe(b); });
  }

  /* Barra fixa. Um limiar, não um movimento preso ao scroll: só liga e desliga
     uma classe, com o cálculo agrupado num quadro. */
  var bar  = document.getElementById('bar');
  var hero = document.querySelector('.hero');
  if (!bar || !hero) return;
  bar.hidden = false;

  var ctas = document.querySelectorAll('#cta .btn, #filtro .btn-2');
  var queued = false;

  function update() {
    queued = false;
    var pastHero = hero.getBoundingClientRect().bottom <= 0;

    /* Se um botão do Direct já está na tela, a barra sai: o mesmo convite não
       precisa aparecer duas vezes ao mesmo tempo. */
    var ctaOnScreen = false;
    for (var i = 0; i < ctas.length; i++) {
      var r = ctas[i].getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) { ctaOnScreen = true; break; }
    }
    bar.classList.toggle('is-on', pastHero && !ctaOnScreen);
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    /* Em segundo plano o navegador congela requestAnimationFrame. */
    if (document.hidden) setTimeout(update, 0);
    else requestAnimationFrame(update);
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  update();
})();
