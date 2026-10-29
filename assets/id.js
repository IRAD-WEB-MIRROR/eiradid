/* e-Irad ID (id.e-irad.org). Nothing typed here is sent or stored; answers are worked out from the input.
   There is no password, card or ID-number field anywhere on this site. */
(function () {
  "use strict";
  var LANGS = ["ir", "ru", "en"], LANG = "en";
  try { var sv = localStorage.getItem("eirad_lang"); if (LANGS.indexOf(sv) >= 0) LANG = sv; } catch (e) {}
  var q = new URLSearchParams(location.search); if (LANGS.indexOf(q.get("lang")) >= 0) LANG = q.get("lang");
  var PAGE = document.body.getAttribute("data-page");
  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function L(o, v) { var s = typeof o === "string" ? o : (o[LANG] != null ? o[LANG] : o.en); return v ? String(s).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }) : s; }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function now() { var n = new Date(); return new Date(n.getTime() + n.getTimezoneOffset() * 60000 + 6 * 3600000); }
  function today() { var d = now(); return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); }
  function addDays(d, n) { return new Date(d.getTime() + n * 864e5); }
  var MON = { en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], ir: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr"], ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"] };
  function fmtD(d) { var m = MON[LANG][d.getUTCMonth()]; return LANG === "ir" ? d.getUTCDate() + "-" + m + " " + d.getUTCFullYear() : d.getUTCDate() + " " + m + " " + d.getUTCFullYear(); }
  function norm(s) { return String(s || "").toUpperCase().replace(/[\s\-\/\.]/g, ""); }
  function kv(rows) { return '<table class="kv">' + rows.map(function (r) { return "<tr><td>" + esc(r[0]) + "</td><td>" + r[1] + "</td></tr>"; }).join("") + "</table>"; }
  function msg(o, cls, v) { return '<div class="msg ' + (cls || "") + '">' + esc(L(o, v)) + "</div>"; }

  var T = {
    t1: { en: "e-Irad ID", ir: "e-Irad ID", ru: "e-Irad ID" },
    t2: { en: "Unified identification system for state services · pilot", ir: "Mamlekettik kızmattar üchün biriktirilgen identifikatsiya sistemasy · sınoo", ru: "Единая система идентификации для государственных услуг · пилот" },
    pilot: { en: "Pilot service. Sign-in to e-Irad is not yet available. Services that do not need sign-in work as usual.", ir: "Sınoo kızmatı. e-Iradga kirüü azırıncha jok. Kirüünü talap kılbagan kızmattar adattagıday ishteyt.", ru: "Пилотный режим. Вход в e-Irad пока недоступен. Услуги, не требующие входа, работают в обычном режиме." },
    nos: { en: "Services without sign-in", ir: "Kirüüsüz kızmattar", ru: "Услуги без входа" },
    l_pass: { en: "Is my passport ready?", ir: "Pasportum dayarbı?", ru: "Готов ли мой паспорт?" },
    l_ver: { en: "Check a document", ir: "Dokumentti tekshirüü", ru: "Проверить документ" },
    l_card: { en: "The e-Irad card", ir: "e-Irad kartası", ru: "Карта e-Irad" },
    l_back: { en: "← Back to e-Irad", ir: "← e-Iradga kaytuu", ru: "← Вернуться на e-Irad" },
    l_home: { en: "Sign-in", ir: "Kirüü", ru: "Вход" },
    ft: { en: "© 2026 Digital Services Directorate, Department of Infrastructure and Communications. e-Irad ID version 0.9.4 (pilot). Recommended browsers: Internet Explorer 11, Google Chrome 49 or later, Mozilla Firefox 52 or later. Screen resolution 1024×768 or higher.", ir: "© 2026 Sanarip kızmattar direktsiyası, Infrastruktura jana baylanısh departamenti. e-Irad ID 0.9.4 versiyası (sınoo). Sunushtalgan brauzerler: Internet Explorer 11, Google Chrome 49 je jañıraak, Mozilla Firefox 52 je jañıraak. Ekrandın chechimi 1024×768 je andan jogoru.", ru: "© 2026 Дирекция цифровых услуг, Департамент инфраструктуры и связи. e-Irad ID версия 0.9.4 (пилот). Рекомендуемые браузеры: Internet Explorer 11, Google Chrome 49 и выше, Mozilla Firefox 52 и выше. Разрешение экрана 1024×768 и выше." },
    never: { en: "e-Irad never asks for your password, card number or PIN by telephone, SMS or e-mail.", ir: "e-Irad ech kachan sırsözüñüzdü, karta nomeriñizdi je PIN-kodduñuzdu telefon, SMS je e-pochta arkıluu surabayt.", ru: "e-Irad никогда не запрашивает пароль, номер карты или PIN-код по телефону, SMS или электронной почте." }
  };

  function chrome() {
    document.documentElement.lang = { en: "en", ir: "ky-Latn", ru: "ru" }[LANG];
    var names = { ir: "Irad tili", ru: "Русский", en: "English" };
    $("#top").innerHTML = '<div class="crim"></div><div class="box"><div class="hd"><a href="/"><img src="/assets/logo.svg" alt="e-Irad"></a><div><div class="t1">' + esc(L(T.t1)) + '</div><div class="t2">' + esc(L(T.t2)) + '</div></div><div class="langs">' +
      LANGS.map(function (l) { return '<a href="?lang=' + l + '" data-l="' + l + '"' + (l === LANG ? ' class="on"' : "") + ">" + names[l] + "</a>"; }).join("") + '</div></div><div class="pilot">' + esc(L(T.pilot)) + '</div><div class="in" id="app"></div></div>';
    $("#bottom").innerHTML = '<div class="ft">' + esc(L(T.ft)) + "<br>" + esc(L(T.never)) + "</div>";
    Array.prototype.forEach.call(document.querySelectorAll("[data-l]"), function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); LANG = a.getAttribute("data-l"); try { localStorage.setItem("eirad_lang", LANG); } catch (x) {} render(); });
    });
  }
  function links(skip) {
    var all = [["/", T.l_home], ["/passport.html", T.l_pass], ["/verify.html", T.l_ver], ["/card.html", T.l_card]];
    return '<div class="links"><b>' + esc(L(T.nos)) + ":</b><br>" + all.filter(function (x) { return x[0] !== skip; }).map(function (x) { return '<a href="' + x[0] + '">' + esc(L(x[1])) + "</a>"; }).join("") + '<br><a href="https://e-irad.org/">' + esc(L(T.l_back)) + "</a></div>";
  }

  /* ---------- sign-in ---------- */
  var S = {
    h: { en: "Sign in to e-Irad", ir: "e-Iradga kirüü", ru: "Вход в e-Irad" },
    p: { en: "Choose how to identify yourself. After sign-in you return to the service you came from.", ir: "Özüñüzdü kantip tastıktoonu tandañız. Kirgenden kiyin kelgen kızmatıñızga kaytasız.", ru: "Выберите способ идентификации. После входа вы вернётесь к услуге, с которой пришли." },
    tabs: [{ en: "e-Irad card", ir: "e-Irad kartası", ru: "Карта e-Irad" }, { en: "Tulpar ID", ir: "Tulpar ID", ru: "Tulpar ID" }, { en: "Login and password", ir: "Login jana sırsöz", ru: "Логин и пароль" }],
    c1: { en: "Insert your e-Irad card into the card reader and press “Sign in with card”. The e-Irad Signer module must be installed on this computer.", ir: "e-Irad kartañızdı karta okuguchka salıp, “Karta menen kirüü” baskıchın basıñız. Bul kompyuterde e-Irad Signer modulu ornotulgan bolushu kerek.", ru: "Вставьте карту e-Irad в считыватель и нажмите «Войти по карте». На компьютере должен быть установлен модуль e-Irad Signer." },
    cbtn: { en: "Sign in with card", ir: "Karta menen kirüü", ru: "Войти по карте" },
    dl: { en: "Download e-Irad Signer 0.9 (Windows XP SP3, 7, 8.1, 10; requires Java 8 Update 151)", ir: "e-Irad Signer 0.9 jüktöö (Windows XP SP3, 7, 8.1, 10; Java 8 Update 151 kerek)", ru: "Скачать e-Irad Signer 0.9 (Windows XP SP3, 7, 8.1, 10; требуется Java 8 Update 151)" },
    nosig: { en: "Signer module not found (error 0x0E21). Install e-Irad Signer, restart the browser and try again.", ir: "Signer modulu tabılgan jok (0x0E21 katası). e-Irad Signerdi ornotup, brauzerdi kayra jürgüzüp, kayra araket kılıñız.", ru: "Модуль подписи не найден (ошибка 0x0E21). Установите e-Irad Signer, перезапустите браузер и повторите попытку." },
    nodl: { en: "During the pilot, e-Irad Signer is installed only by staff at the Public Service Centres, together with the card. e-Irad cards are not yet issued.", ir: "Sınoo mezgilinde e-Irad Signerdi Kalkka kızmat körsötüü borborlorunun kızmatkerleri karta menen birge gana ornotot. e-Irad kartaları azırıncha berilbeyt.", ru: "В пилотном режиме e-Irad Signer устанавливают только сотрудники Центров обслуживания населения вместе с выдачей карты. Карты e-Irad пока не выдаются." },
    t1: { en: "Sign in with your Tulpar account. Only your name and Tulpar number are passed to e-Irad.", ir: "Tulpar akkauntuñuz menen kiriñiz. e-Iradga atıñız jana Tulpar nomeriñiz gana berilet.", ru: "Вход через аккаунт Tulpar. В e-Irad передаются только ваше имя и номер Tulpar." },
    tbtn: { en: "Continue with Tulpar", ir: "Tulpar menen ulantuu", ru: "Продолжить с Tulpar" },
    tsus: { en: "Sign-in by Tulpar ID is suspended pending review (Notice No. 3 of 9 October 2026). No date has been set for its return. Your Tulpar account is not affected.", ir: "Tulpar ID arkıluu kirüü tekshirüügö cheyin toktotuldu (2026-jıldın 9-oktyabrındagı №3 bildirüü). Kayra achıluu datası belgilene elek. Tulpar akkauntuñuzga tiyishpeyt.", ru: "Вход через Tulpar ID приостановлен до завершения проверки (Уведомление № 3 от 9 октября 2026 года). Дата возобновления не назначена. Ваш аккаунт Tulpar не затронут." },
    tread: { en: "Read the notice", ir: "Bildirüünü okuu", ru: "Читать уведомление" },
    p1: { en: "Logins and passwords for e-Irad are issued in person at the Public Service Centres in Talas, Nurzhan and Iyık Janyl, with your ID card, from 2027. Self-registration on this page is not provided.", ir: "e-Irad üchün login jana sırsöz 2027-jıldan baslap Talas, Nurzhan jana Iyık Janıldagı Kalkka kızmat körsötüü borborlorunda jeke kuböölük menen özüñüzgö berilet. Bul bette özü kattaluu karalgan emes.", ru: "Логины и пароли для e-Irad выдаются лично в Центрах обслуживания населения в Таласе, Нуржане и Ийык-Джаныле при предъявлении удостоверения личности, с 2027 года. Самостоятельная регистрация на этой странице не предусмотрена." }
  };
  function pageSignin() {
    document.title = L(S.h) + " | e-Irad ID";
    $("#app").innerHTML = "<h1>" + esc(L(S.h)) + "</h1><p>" + esc(L(S.p)) + '</p><div class="tabs" role="tablist">' + S.tabs.map(function (x, i) { return '<button type="button" data-t="' + i + '">' + esc(L(x)) + "</button>"; }).join("") + '</div><div class="pane" id="pane"></div>' + links("/");
    var panes = [
      function () { return "<p>" + esc(L(S.c1)) + '</p><p><button class="btn" id="cb">' + esc(L(S.cbtn)) + '</button></p><p class="small"><a href="#" id="dl">' + esc(L(S.dl)) + '</a></p><div id="cm"></div>'; },
      function () { return "<p>" + esc(L(S.t1)) + '</p><p><button class="btn tul" id="tb"><img src="/assets/tulpar.svg" alt="">' + esc(L(S.tbtn)) + '</button></p><div id="tm"></div>'; },
      function () { return '<div class="dis"><label>Login</label><div style="border:1px solid #9eb0c2;width:260px;max-width:100%;height:26px;background:#eee"></div></div><p>' + esc(L(S.p1)) + "</p>"; }
    ];
    function show(i) {
      Array.prototype.forEach.call(document.querySelectorAll("[data-t]"), function (b) { b.className = b.getAttribute("data-t") === String(i) ? "on" : ""; });
      $("#pane").innerHTML = panes[i]();
      if (i === 0) {
        $("#cb").addEventListener("click", function () { $("#cm").innerHTML = msg(S.nosig); });
        $("#dl").addEventListener("click", function (e) { e.preventDefault(); $("#cm").innerHTML = msg(S.nodl, "info"); });
      }
      if (i === 1) $("#tb").addEventListener("click", function () { $("#tm").innerHTML = msg(S.tsus) + '<p><a href="/notice.html">' + esc(L(S.tread)) + " →</a></p>"; });
    }
    Array.prototype.forEach.call(document.querySelectorAll("[data-t]"), function (b) { b.addEventListener("click", function () { show(+b.getAttribute("data-t")); }); });
    show(q.get("m") === "tulpar" ? 1 : 0);
  }

  /* ---------- passport readiness ---------- */
  var OFF = { TL: { en: "Talas City Passport Office, Liberty Boulevard", ir: "Talas shaardık pasport bölümü, Erkindik bulvarı", ru: "Паспортный стол города Таласа, бульвар Свободы" }, NZ: { en: "Nurzhan City Passport Office, Azatlık Prospect", ir: "Nurzhan shaardık pasport bölümü, Azattık prospekti", ru: "Паспортный стол города Нуржана, проспект Азатлык" }, IJ: { en: "Iyık Janyl City Passport Office, Lower Town", ir: "Iyık Janıl shaardık pasport bölümü, Tömönkü shaar", ru: "Паспортный стол Ийык-Джаныла, Нижний город" }, KA: { en: "Kara-Buura District office, Kyzyl-Adyr", ir: "Kara-Buura aymaktık keñsesi, Kızıl-Adır", ru: "Отдел Кара-Бууринского района, Кызыл-Адыр" }, KB: { en: "Talas District office, Kara-Bulak", ir: "Talas aymaktık keñsesi, Kara-Bulak", ru: "Отдел Таласского района, Кара-Булак" }, MK: { en: "Chu District office, Merke", ir: "Chüy aymaktık keñsesi, Merke", ru: "Отдел Чуйского района, Мерке" }, TK: { en: "Lower Naryn District office, Tash-Kömür", ir: "Tömönkü Narın aymaktık keñsesi, Tash-Kömür", ru: "Отдел Нижненарынского района, Таш-Кумыр" } };
  var P = {
    h: { en: "Is my passport ready?", ir: "Pasportum dayarbı?", ru: "Готов ли мой паспорт?" },
    p: { en: "Enter the application number from the receipt you were given at the passport office. It applies to passports and ID cards applied for since 1 January 2026.", ir: "Pasport bölümündö berilgen tilkattagı arız nomerin jazıñız. 2026-jıldın 1-yanvarınan beri berilgen pasport jana jeke kuböölük arızdarına tiyishtüü.", ru: "Введите номер заявления с квитанции, выданной в паспортном столе. Проверка доступна для паспортов и удостоверений личности, заявленных с 1 января 2026 года." },
    no: { en: "Application number", ir: "Arızdın nomeri", ru: "Номер заявления" },
    ph: { en: "e.g. PRS-TL-26-041733", ir: "mısalı: PRS-TL-26-041733", ru: "например, PRS-TL-26-041733" },
    btn: { en: "Check", ir: "Tekshirüü", ru: "Проверить" },
    bad: { en: "Application numbers look like PRS-TL-26-041733: PRS, the office code (TL, NZ, IJ, KA, KB, MK, TK), the year and six digits. Queue numbers (TL-P-0417) are not application numbers.", ir: "Arızdın nomeri PRS-TL-26-041733 sıyaktuu bolot: PRS, bölümdün kodu (TL, NZ, IJ, KA, KB, MK, TK), jılı jana altı sıfra. Kezek nomerleri (TL-P-0417) arız nomeri emes.", ru: "Номер заявления выглядит как PRS-TL-26-041733: PRS, код отдела (TL, NZ, IJ, KA, KB, MK, TK), год и шесть цифр. Номер очереди (TL-P-0417) не является номером заявления." },
    old: { en: "Applications made before 2026 cannot be checked online. Ask at the office where you applied.", ir: "2026-jılga cheyin berilgen arızdardı onlayn tekshirüügö bolboyt. Arız bergen bölümüñüzdön surañız.", ru: "Заявления, поданные до 2026 года, онлайн не проверяются. Обратитесь в отдел, где вы подавали заявление." },
    nf: { en: "No application with this number was found. Check the number on your receipt. Applications appear here up to ten working days after they are made.", ir: "Bul nomerdegi arız tabılgan jok. Tilkattagı nomerdi tekshiriñiz. Arızdar berilgenden kiyin on ish kündün ichinde bul jerde payda bolot.", ru: "Заявление с таким номером не найдено. Проверьте номер на квитанции. Заявления появляются здесь в течение десяти рабочих дней после подачи." },
    st: { en: "Status", ir: "Abalı", ru: "Статус" },
    off: { en: "Office", ir: "Bölüm", ru: "Отдел" },
    upd: { en: "Last change", ir: "Akırkı özgörüü", ru: "Последнее изменение" },
    s: [
      { en: "Accepted. The application is being checked against the residence records.", ir: "Kabıl alındı. Arız jashoo jayı jazuuları menen salıshtırılıp jatat.", ru: "Принято. Заявление проверяется по данным регистрации." },
      { en: "Sent to the Passport Production Centre, Talas.", ir: "Talastagı Pasport dayardoo borboruna jönötüldü.", ru: "Направлено в Центр изготовления паспортов, Талас." },
      { en: "In production.", ir: "Dayardalıp jatat.", ru: "Изготавливается." },
      { en: "Ready for collection. Bring the receipt and your old passport or ID card. Uncollected documents are kept for 60 days.", ir: "Alıp ketüügö dayar. Tilkattı jana eski pasportuñuzdu je jeke kuböölügüñüzdü ala keliñiz. Alınbagan dokumentter 60 kün saktalat.", ru: "Готов к выдаче. Возьмите квитанцию и старый паспорт или удостоверение. Невостребованные документы хранятся 60 дней." },
      { en: "Collected.", ir: "Alındı.", ru: "Выдан." },
      { en: "Returned to the office: the photograph does not meet the requirements. Come to the office to have a new photograph taken; you will not need to queue again.", ir: "Bölümgö kaytarıldı: süröt talaptarga ılayık emes. Jañı süröt tartıruu üchün bölümgö keliñiz; kayra kezek kütüünün keregi jok.", ru: "Возвращено в отдел: фотография не соответствует требованиям. Придите в отдел для повторного фотографирования; повторно стоять в очереди не нужно." },
      { en: "Additional check. The application has been sent for an additional check by the Ministry of Internal Security. The office will contact you. Do not apply again.", ir: "Kosumcha tekshirüü. Arız Ichki koopsuzduk ministrligine kosumcha tekshirüügö jönötüldü. Bölüm sizge özü kayrılat. Kayra arız berbeñiz.", ru: "Дополнительная проверка. Заявление направлено на дополнительную проверку в Министерство внутренней безопасности. Отдел свяжется с вами. Повторно заявление не подавайте." }
    ],
    ready: { en: "Collect from", ir: "Alıp ketüü ordu", ru: "Где получить" },
    hrs: { en: "Monday to Friday 9:00–13:00 (collection only); Saturday 9:00–12:00.", ir: "Düyshömbüdön jumaga cheyin 9:00–13:00 (alıp ketüü gana); ishembi 9:00–12:00.", ru: "Понедельник–пятница 9:00–13:00 (только выдача); суббота 9:00–12:00." },
    q: { en: "Need a queue number to apply? Take one on e-Irad.", ir: "Arız berüü üchün kezek nomeri kerekpi? e-Iraddan alıñız.", ru: "Нужен номер очереди для подачи заявления? Возьмите его на e-Irad." }
  };
  function pagePassport() {
    document.title = L(P.h) + " | e-Irad ID";
    $("#app").innerHTML = "<h1>" + esc(L(P.h)) + "</h1><p>" + esc(L(P.p)) + '</p><form id="f"><label for="n">' + esc(L(P.no)) + '</label><input type="text" id="n" maxlength="22" autocomplete="off" placeholder="' + esc(L(P.ph)) + '"> <button class="btn" type="submit">' + esc(L(P.btn)) + '</button></form><div id="r" aria-live="polite"></div><p class="small"><a href="https://e-irad.org/service.html?id=passport">' + esc(L(P.q)) + "</a></p>" + links("/passport.html");
    $("#f").addEventListener("submit", function (e) {
      e.preventDefault();
      var n = norm($("#n").value), m = /^PRS(TL|NZ|IJ|KA|KB|MK|TK)(\d{2})(\d{6})$/.exec(n);
      if (!m) { $("#r").innerHTML = msg(P.bad, "warn"); return; }
      var cy = now().getFullYear() % 100;
      if (+m[2] < 26) { $("#r").innerHTML = msg(P.old, "warn"); return; }
      if (+m[2] > cy) { $("#r").innerHTML = msg(P.nf, "warn"); return; }
      var h = hash("prs" + n), r = h % 100, st;
      if (r < 8) { $("#r").innerHTML = msg(P.nf, "warn"); return; }
      st = r < 18 ? 0 : r < 30 ? 1 : r < 46 ? 2 : r < 74 ? 3 : r < 88 ? 4 : r < 96 ? 5 : 6;
      var d = addDays(today(), -((h >>> 8) % (st === 4 ? 40 : 9)));
      var rows = [["No.", esc("PRS-" + m[1] + "-" + m[2] + "-" + m[3])], [L(P.off), esc(L(OFF[m[1]]))], [L(P.st), "<b>" + esc(L(P.s[st])) + "</b>"], [L(P.upd), esc(fmtD(d))]];
      if (st === 3) rows.push([L(P.ready), esc(L(OFF[m[1]])) + "<br>" + esc(L(P.hrs))]);
      $("#r").innerHTML = '<div class="msg ' + (st === 3 || st === 4 ? "ok" : st >= 5 ? "warn" : "info") + '">' + kv(rows) + "</div>";
    });
  }

  /* ---------- verify a document ---------- */
  var V = {
    h: { en: "Check a document prepared on e-Irad", ir: "e-Iradda dayardalgan dokumentti tekshirüü", ru: "Проверка документа, подготовленного на e-Irad" },
    p: { en: "Applications, payment orders and queue numbers printed from e-Irad carry a reference number. Enter it to see whether such a document was prepared.", ir: "e-Iraddan basılgan arızdardın, tölöm tapshırmalarının jana kezek nomerlerinin maalımat nomeri bar. Oshondoy dokument dayardalganın bilüü üchün anı jazıñız.", ru: "На заявлениях, платёжных поручениях и номерах очереди, распечатанных с e-Irad, есть регистрационный номер. Введите его, чтобы проверить, готовился ли такой документ." },
    no: { en: "Reference number", ir: "Maalımat nomeri", ru: "Регистрационный номер" },
    ph: { en: "e.g. TL-AR-26-04172", ir: "mısalı: TL-AR-26-04172", ru: "например, TL-AR-26-04172" },
    btn: { en: "Check", ir: "Tekshirüü", ru: "Проверить" },
    bad: { en: "This does not look like an e-Irad reference number. Numbers have two to four groups of letters and digits, for example TL-AR-26-04172, MP-TL-26-00317 or TL-P-0417.", ir: "Bul e-Irad maalımat nomerine okshoboyt. Nomerler tamga jana sıfralardın ekiden törtkö cheyinki toptorunan turat, mısalı TL-AR-26-04172, MP-TL-26-00317 je TL-P-0417.", ru: "Это не похоже на регистрационный номер e-Irad. Номер состоит из двух–четырёх групп букв и цифр, например TL-AR-26-04172, MP-TL-26-00317 или TL-P-0417." },
    yes: { en: "A document with this number was prepared on e-Irad on {d}.", ir: "Bul nomerdegi dokument e-Iradda {d} dayardalgan.", ru: "Документ с этим номером подготовлен на e-Irad {d}." },
    note: { en: "A document prepared on e-Irad is a draft until the issuing office stamps it. This check does not show who prepared the document or what it contains.", ir: "e-Iradda dayardalgan dokument bergen bölüm mör baskanga cheyin dolboor bolup sanalat. Bul tekshirüü dokumentti kim dayardaganın je anda emne jazılganın körsötpöyt.", ru: "Документ, подготовленный на e-Irad, является проектом, пока его не заверит выдающий отдел. Проверка не показывает, кто подготовил документ и что в нём содержится." },
    no2: { en: "No document with this number was prepared on e-Irad. If you were given this paper as an official document, report it to the office named on it.", ir: "Bul nomerdegi dokument e-Iradda dayardalgan emes. Eger bul kagaz sizge rasmiy dokument katarı berilse, anda körsötülgön bölümgö kabarlañız.", ru: "Документ с таким номером на e-Irad не готовился. Если эта бумага выдана вам как официальный документ, сообщите в указанный на ней отдел." }
  };
  function pageVerify() {
    document.title = L(V.h) + " | e-Irad ID";
    $("#app").innerHTML = "<h1>" + esc(L(V.h)) + "</h1><p>" + esc(L(V.p)) + '</p><form id="f"><label for="n">' + esc(L(V.no)) + '</label><input type="text" id="n" maxlength="24" autocomplete="off" placeholder="' + esc(L(V.ph)) + '"> <button class="btn" type="submit">' + esc(L(V.btn)) + '</button></form><div id="r" aria-live="polite"></div>' + links("/verify.html");
    $("#f").addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = String($("#n").value).toUpperCase().trim().replace(/\s+/g, "");
      if (!/^[A-Z0-9]{1,4}(-[A-Z0-9]{1,6}){1,3}$/.test(raw) || !/\d/.test(raw)) { $("#r").innerHTML = msg(V.bad, "warn"); return; }
      var h = hash("ver" + raw);
      if (h % 10 === 0) { $("#r").innerHTML = msg(V.no2); return; }
      var d = addDays(today(), -(h >>> 6) % 28);
      if (d < new Date(Date.UTC(2026, 9, 1))) d = new Date(Date.UTC(2026, 9, 1 + (h % 20)));
      $("#r").innerHTML = msg(V.yes, "ok", { d: fmtD(d) }) + '<p class="small muted">' + esc(L(V.note)) + "</p>";
    });
  }

  /* ---------- the card ---------- */
  var C = {
    h: { en: "The e-Irad card", ir: "e-Irad kartası", ru: "Карта e-Irad" },
    p: { en: "The e-Irad card is a chip card that will let residents of the ISEZ sign in to e-Irad and sign applications electronically. It does not replace the ID card or the passport.", ir: "e-Irad kartası, IAEZ turguundarına e-Iradga kirip, arızdarga elektronduk kol koyuuga mümkündük bere turgan chip kartası. Al jeke kuböölüktün je pasporttun ordun baspayt.", ru: "Карта e-Irad — это карта с чипом, которая позволит жителям ОЭЗИ входить в e-Irad и подписывать заявления электронно. Она не заменяет удостоверение личности или паспорт." },
    sample: { en: "SAMPLE", ir: "ÜLGÜ", ru: "ОБРАЗЕЦ" },
    rows: [
      [{ en: "Issued", ir: "Berilet", ru: "Выдача" }, { en: "After the pilot. The date will be announced on e-Irad.", ir: "Sınoo mezgilinen kiyin. Datası e-Iradda jarıyalanat.", ru: "После пилотного периода. Дата будет объявлена на e-Irad." }],
      [{ en: "Where", ir: "Kayda", ru: "Где" }, { en: "Public Service Centres: Talas, Liberty Boulevard 14; Nurzhan, Azatlık Prospect 31; Iyık Janyl, City Hall.", ir: "Kalkka kızmat körsötüü borborloru: Talas, Erkindik bulvarı 14; Nurzhan, Azattık prospekti 31; Iyık Janıl, meriya.", ru: "Центры обслуживания населения: Талас, бульвар Свободы, 14; Нуржан, проспект Азатлык, 31; Ийык-Джаныл, мэрия." }],
      [{ en: "Fee", ir: "Akısı", ru: "Стоимость" }, { en: "IS 150 (pensioners and persons with disabilities free). Card reader for home use IS 1,200 at Attelkom service points.", ir: "150 som (pensionerler jana mümkünchülügü chektelgen adamdar üchün akısız). Üy üchün karta okuguch Attelkomdun kızmat punkttarında 1 200 som.", ru: "150 сомов (пенсионерам и лицам с инвалидностью бесплатно). Считыватель для дома — 1 200 сомов в пунктах обслуживания «Аттелкома»." }],
      [{ en: "Valid", ir: "Möönötü", ru: "Срок действия" }, { en: "Five years. The PIN is given in a sealed envelope; three wrong PINs block the card.", ir: "Besh jıl. PIN-kod jabık konvertte berilet; üch jolu kata PIN kartanı bögöttöyt.", ru: "Пять лет. PIN-код выдаётся в запечатанном конверте; три неверных ввода блокируют карту." }],
      [{ en: "Bring", ir: "Ala keliñiz", ru: "При себе" }, { en: "Your ID card or passport and proof of registered address.", ir: "Jeke kuböölügüñüzdü je pasportuñuzdu jana kattalgan darek tuuraluu kagazdı.", ru: "Удостоверение личности или паспорт и подтверждение адреса регистрации." }]
    ],
    faqH: { en: "Questions", ir: "Suroolor", ru: "Вопросы" },
    faq: [
      [{ en: "Can I use my bank card instead?", ir: "Anın ordu bank kartamdı koldonsom bolobu?", ru: "Можно ли вместо неё использовать банковскую карту?" }, { en: "No. Bank cards, including Talasbank cards, cannot be used to sign in to state services.", ir: "Jok. Bank kartaları, anın ichinde Talasbanktın kartaları da, mamlekettik kızmattarga kirüü üchün koldonulbayt.", ru: "Нет. Банковские карты, в том числе карты «Таласбанка», для входа в государственные услуги не используются." }],
      [{ en: "Will it work on a phone?", ir: "Al telefondo ishteybi?", ru: "Будет ли она работать на телефоне?" }, { en: "The card needs a card reader connected to a computer with Windows. A mobile version is under study.", ir: "Kartaga Windows ornotulgan kompyuterge tutashtırılgan karta okuguch kerek. Mobildik versiyası izildenip jatat.", ru: "Для карты нужен считыватель, подключённый к компьютеру с Windows. Мобильная версия изучается." }],
      [{ en: "Who can get one?", ir: "Anı kim ala alat?", ru: "Кто может её получить?" }, { en: "Citizens and residents of the ISEZ aged 16 and over with a registered address in the ISEZ.", ir: "IAEZde kattalgan daregi bar, 16 jashtan jogorku IAEZ jarandarı jana turguundarı.", ru: "Граждане и жители ОЭЗИ с 16 лет, имеющие адрес регистрации в ОЭЗИ." }]
    ]
  };
  function cardSvg() {
    return '<svg class="card" viewBox="0 0 340 214" role="img" aria-label="e-Irad card"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a6aaa"/><stop offset="1" stop-color="#17436f"/></linearGradient></defs><rect width="340" height="214" rx="12" fill="url(#g)"/><path d="M0 196h340v6q0 12-12 12H12q-12 0-12-12z" fill="#8e1b26"/>' +
      '<g opacity=".09" fill="#fff"><circle cx="300" cy="40" r="80"/><circle cx="300" cy="40" r="55" fill="#17436f"/></g><image href="/assets/logo.svg" x="16" y="14" width="34" height="34"/><text x="58" y="30" fill="#fff" font-family="Tahoma,Verdana,sans-serif" font-size="15" font-weight="bold">e-Irad</text><text x="58" y="45" fill="#cfe0f7" font-family="Tahoma,Verdana,sans-serif" font-size="8">IRAD ATAYIN EKONOMIKALIK ZONASI</text><text x="58" y="56" fill="#cfe0f7" font-family="Tahoma,Verdana,sans-serif" font-size="8">IRAD SPECIAL ECONOMIC ZONE</text>' +
      '<rect x="22" y="72" width="44" height="34" rx="6" fill="#d9b04c"/><path d="M22 89h44M44 72v34M33 72v12M55 94v12" stroke="#a8862f" stroke-width="1.2" fill="none"/><rect x="250" y="64" width="70" height="88" fill="#dfe6ee"/><circle cx="285" cy="95" r="17" fill="#b7c3cf"/><path d="M257 152c4-22 52-22 56 0z" fill="#b7c3cf"/>' +
      '<text x="22" y="132" fill="#fff" font-family="Tahoma,Verdana,sans-serif" font-size="12" font-weight="bold">ÜLGÜ / SAMPLE</text><text x="22" y="150" fill="#cfe0f7" font-family="Courier New,monospace" font-size="11">No. 0000 000000</text><text x="22" y="166" fill="#cfe0f7" font-family="Courier New,monospace" font-size="10">VALID / JARAKTUU: 00.00.0000</text>' +
      '<text x="170" y="120" fill="#fff" fill-opacity=".35" font-family="Tahoma,Verdana,sans-serif" font-size="30" font-weight="bold" text-anchor="middle" transform="rotate(-18 170 120)">' + esc(L(C.sample)) + "</text></svg>";
  }
  function pageCard() {
    document.title = L(C.h) + " | e-Irad ID";
    $("#app").innerHTML = "<h1>" + esc(L(C.h)) + "</h1><p>" + esc(L(C.p)) + "</p>" + cardSvg() + kv(C.rows.map(function (r) { return [L(r[0]), esc(L(r[1]))]; })) + "<h2>" + esc(L(C.faqH)) + "</h2>" + C.faq.map(function (f) { return "<p><b>" + esc(L(f[0])) + "</b><br>" + esc(L(f[1])) + "</p>"; }).join("") + links("/card.html");
  }

  /* ---------- notice on Tulpar ID ---------- */
  var N = {
    h: { en: "Notice No. 3", ir: "№3 bildirüü", ru: "Уведомление № 3" },
    title: { en: "on the suspension of sign-in to state services by Tulpar ID", ir: "mamlekettik kızmattarga Tulpar ID arkıluu kirüünü toktotuu tuuraluu", ru: "о приостановлении входа в государственные услуги через Tulpar ID" },
    place: { en: "Talas, 9 October 2026", ir: "Talas, 2026-jıldın 9-oktyabrı", ru: "Талас, 9 октября 2026 года" },
    body: [
      { en: "1. In view of the notice of the Bank of Irad of 29 September 2026 and the instruction of the Department of Public Information on the Tulparcoin service, sign-in to e-Irad and other state services by Tulpar ID is suspended from 9 October 2026 pending a review of the service's compliance with the conditions for state services, including the storage of the personal data of residents of the ISEZ.", ir: "1. Irad bankinin 2026-jıldın 29-sentyabrındagı bildirüüsün jana Kogomduk maalımat departamentinin Tulparcoin kızmatı boyuncha tapshırmasın eske alıp, 2026-jıldın 9-oktyabrınan baslap e-Iradga jana bashka mamlekettik kızmattarga Tulpar ID arkıluu kirüü kızmattın mamlekettik kızmattar üchün shartarga, anın ichinde IAEZ turguundarının jeke maalımattarın saktoo shartarına ılayıktuulugu tekshirilgenge cheyin toktotulat.", ru: "1. С учётом уведомления Банка Ирада от 29 сентября 2026 года и поручения Департамента общественной информации по сервису Tulparcoin вход в e-Irad и другие государственные услуги через Tulpar ID приостанавливается с 9 октября 2026 года до проверки соответствия сервиса условиям для государственных услуг, включая хранение персональных данных жителей ОЭЗИ." },
      { en: "2. The suspension does not affect the use of the Tulpar application by residents, nor the Official channel of e-Irad on Tulpar.", ir: "2. Toktotuu turguundardın Tulpar tirkemesin koldonuusuna jana e-Iraddın Tulpardagı rasmiy kanalına tiyishpeyt.", ru: "2. Приостановление не затрагивает использование жителями приложения Tulpar и официальный канал e-Irad в Tulpar." },
      { en: "3. Services that do not need sign-in remain available. Applications that need identification are completed at the counter with an ID card.", ir: "3. Kirüünü talap kılbagan kızmattar ishtey beret. Identifikatsiyanı talap kılgan arızdar jeke kuböölük menen kassada bütkörülöt.", ru: "3. Услуги, не требующие входа, остаются доступными. Заявления, требующие идентификации, оформляются в окне при предъявлении удостоверения личности." },
      { en: "4. The date of resumption will be announced separately.", ir: "4. Kayra achıluu datası özünchö jarıyalanat.", ru: "4. О дате возобновления будет сообщено дополнительно." }
    ],
    sign: { en: "Director, Digital Services Directorate", ir: "Sanarip kızmattar direktsiyasının direktoru", ru: "Директор Дирекции цифровых услуг" }
  };
  function pageNotice() {
    document.title = L(N.h) + " | e-Irad ID";
    $("#app").innerHTML = '<div class="notice"><p class="no">' + esc(L(N.h)) + "<br>" + esc(L(N.title)) + '</p><p style="text-align:right">' + esc(L(N.place)) + "</p>" + N.body.map(function (b) { return "<p>" + esc(L(b)) + "</p>"; }).join("") + '<p style="text-align:right;margin-top:24px">' + esc(L(N.sign)) + "</p></div>" + links("");
  }

  function render() { chrome(); ({ signin: pageSignin, passport: pagePassport, verify: pageVerify, card: pageCard, notice: pageNotice }[PAGE] || pageSignin)(); }
  render();
})();
