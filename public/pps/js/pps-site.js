/* === PPS Universal Site JS ===
   Sprachumschaltung (Google Translate Integration) + PPS-Cookie/State-Handling.
   Extrahiert aus dem Original-JS-Bundle. Universal fuer alle Seiten unter /content/ nutzbar.
   Voraussetzung im HTML: <div id="google_translate_element"></div> irgendwo im <body>
   und die Google-Translate-Ladezeile ganz unten in dieser Datei (per <script> im HTML
   oder hier als dynamischer Loader). */

var PPS_ORIGINAL="de";var PPS_SUPPORTED=["de","en","fr","es","pt","it","el","ja"];var PPS_COOKIE_DOMAIN=".prophotoskills.com";function ppsGetCookie(name){var match=document.cookie.match(new RegExp("(^| )"+name+"=([^;]+)"));return match?decodeURIComponent(match[2]):null}
function ppsSetLanguage(lang){if(lang===PPS_ORIGINAL){document.cookie="googtrans=; path=/; domain="+PPS_COOKIE_DOMAIN+"; expires=Thu, 01 Jan 1970 00:00:00 GMT";document.cookie="googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";localStorage.setItem("pps_lang","de");location.reload();return}
document.cookie="googtrans=/de/"+lang+"; path=/; domain="+PPS_COOKIE_DOMAIN;localStorage.setItem("pps_lang",lang);ppsApplyTranslation(lang);ppsUpdateActiveFlag(lang)}
function ppsApplyTranslation(lang){var tries=0;var interval=setInterval(function(){var combo=document.querySelector("select.goog-te-combo");if(combo){combo.value=lang;combo.dispatchEvent(new Event("change"));clearInterval(interval)}
if(++tries>40)clearInterval(interval);},250)}
function ppsUpdateActiveFlag(lang){document.querySelectorAll(".flags .flag-btn").forEach(function(btn){btn.classList.toggle("active",btn.getAttribute("data-lang")===lang)})}
function ppsToggleNav(){var nav=document.querySelector(".pps-site-header nav");var btn=document.querySelector(".pps-site-header .nav-toggle");if(!nav||!btn)return;var isOpen=nav.classList.toggle("open");btn.classList.toggle("open",isOpen);btn.setAttribute("aria-expanded",isOpen?"true":"false");btn.setAttribute("aria-label",isOpen?"Menü schließen":"Menü öffnen")}
document.addEventListener("click",function(e){var nav=document.querySelector(".pps-site-header nav");var btn=document.querySelector(".pps-site-header .nav-toggle");if(!nav||!nav.classList.contains("open"))return;if(nav.contains(e.target)||btn.contains(e.target))return;nav.classList.remove("open");btn.classList.remove("open");btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-label","Menü öffnen")});function ppsDetectLang(){var stored=localStorage.getItem("pps_lang")||ppsGetCookie("googtrans");if(stored){var m=stored.match(/\/([a-z]{2})$/);if(m&&PPS_SUPPORTED.includes(m[1]))return m[1];if(PPS_SUPPORTED.includes(stored))return stored}
var browserLang=(navigator.language||"en").toLowerCase().split("-")[0];return PPS_SUPPORTED.includes(browserLang)?browserLang:"en"}
function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:"de",includedLanguages:PPS_SUPPORTED.join(","),autoDisplay:!1},"google_translate_element");var lang=ppsDetectLang();ppsUpdateActiveFlag(lang);if(lang!==PPS_ORIGINAL){ppsApplyTranslation(lang)}}


/* Google Translate Widget laden + Callback registrieren */
(function() {
  var s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  document.head.appendChild(s);
})();

/* === PPS Mobile-Menü Toggle ===
   Ersatz fuer Divis eigene (jQuery-gebundene) Menu-Duplizierungslogik, die
   nicht sauber isoliert extrahierbar war. Repliziert das Kernverhalten
   ohne jQuery-Abhaengigkeit: klont das Desktop-Nav in ein mobiles Dropdown,
   oeffnet/schliesst es per Klick auf den Hamburger-Button. */
(function () {
  function initMobileMenu() {
    document.querySelectorAll('.et_pb_menu__wrap, .et_pb_menu').forEach(function (menuWrap) {
      var desktopList = menuWrap.querySelector('.et-menu, .et_pb_menu__menu nav ul');
      var mobileNavWrap = menuWrap.querySelector('.et_mobile_nav_menu');
      if (!desktopList || !mobileNavWrap) return;

      var mobileNav = mobileNavWrap.querySelector('.mobile_nav');
      var bar = mobileNavWrap.querySelector('.mobile_menu_bar');
      if (!mobileNav || !bar) return;

      // Mobiles Menue einmalig erzeugen (Klon des Desktop-Nav)
      var mobileMenu = mobileNavWrap.querySelector('.et_mobile_menu');
      if (!mobileMenu) {
        mobileMenu = desktopList.cloneNode(true);
        mobileMenu.classList.add('et_mobile_menu');
        mobileMenu.removeAttribute('id');
        mobileMenu.style.display = 'none';
        mobileNavWrap.appendChild(mobileMenu);

        // Klick auf einen mobilen Menuepunkt schliesst das Menue wieder
        mobileMenu.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function () {
            mobileNav.classList.remove('opened');
            mobileNav.classList.add('closed');
            mobileMenu.style.display = 'none';
          });
        });
      }

      bar.addEventListener('click', function (e) {
        e.preventDefault();
        var isClosed = mobileNav.classList.contains('closed');
        if (isClosed) {
          mobileNav.classList.remove('closed');
          mobileNav.classList.add('opened');
          mobileMenu.style.display = 'block';
        } else {
          mobileNav.classList.remove('opened');
          mobileNav.classList.add('closed');
          mobileMenu.style.display = 'none';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
