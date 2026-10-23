"use strict";
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
const CHEIE_REZERVARI = "rezervariTarkovski";
const LIMITA_REZERVARI = 8;
const miscareRedusa = window.matchMedia("(prefers-reduced-motion: reduce)");
const afiseazaNotificare = (mesaj) => {
  const notificare = $("#notificare");
  if (!notificare) return;
  notificare.textContent = mesaj;
  notificare.classList.add("vizibila");
  window.clearTimeout(afiseazaNotificare.temporizator);
  afiseazaNotificare.temporizator = window.setTimeout(() => notificare.classList.remove("vizibila"), 3000);
};
const dataLocala = (data = new Date()) => {
  const an = data.getFullYear();
  const luna = String(data.getMonth() + 1).padStart(2, "0");
  const zi = String(data.getDate()).padStart(2, "0");
  return `${an}-${luna}-${zi}`;
};
const formateazaData = (text) => {
  const [an, luna, zi] = String(text).split("-").map(Number);
  if (!an || !luna || !zi) return text;
  return new Date(an, luna - 1, zi).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};
const initializeazaAntet = () => {
  const antet = $("#antet");
  const navigare = $("#navigare");
  const comutator = $("#comutator-meniu");
  const butonSus = $("#sus");
  const inchideMeniu = () => {
    if (!navigare || !comutator) return;
    navigare.classList.remove("deschisa");
    comutator.setAttribute("aria-expanded", "false");
    comutator.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("meniu-deschis");
  };
  if (navigare && comutator) {
    comutator.addEventListener("click", () => {
      const deschis = navigare.classList.toggle("deschisa");
      comutator.setAttribute("aria-expanded", String(deschis));
      comutator.setAttribute("aria-label", deschis ? "Close menu" : "Open menu");
      document.body.classList.toggle("meniu-deschis", deschis);
    });
    navigare.addEventListener("click", (eveniment) => {
      if (eveniment.target.closest("a")) inchideMeniu();
    });
    document.addEventListener("keydown", (eveniment) => {
      if (eveniment.key === "Escape" && navigare.classList.contains("deschisa")) {
        inchideMeniu();
        comutator.focus();
      }
    });
    window.matchMedia("(min-width: 721px)").addEventListener("change", (interogare) => {
      if (interogare.matches) inchideMeniu();
    });
  }
  if (butonSus) {
    butonSus.addEventListener("click", () => window.scrollTo({ top: 0, behavior: miscareRedusa.matches ? "auto" : "smooth" }));
  }
  const actualizeazaDerulare = () => {
    const pozitie = window.scrollY;
    if (antet) antet.classList.toggle("derulat", pozitie > 24);
    if (butonSus) butonSus.classList.toggle("vizibil", pozitie > 700);
  };
  actualizeazaDerulare();
  window.addEventListener("scroll", actualizeazaDerulare, { passive: true });
};
const initializeazaErou = () => {
  const video = $("#erou-video");
  if (!video) return;
  const coloreaza = () => document.body.classList.add("erou-colorat");
  if (miscareRedusa.matches) {
    video.removeAttribute("autoplay");
    video.pause();
    coloreaza();
    return;
  }
  const porneste = video.play();
  if (porneste && typeof porneste.catch === "function") porneste.catch(() => {});
  if (video.readyState >= 2) {
    window.setTimeout(coloreaza, 400);
  } else {
    video.addEventListener("loadeddata", () => window.setTimeout(coloreaza, 400), { once: true });
    window.setTimeout(coloreaza, 2500);
  }
};
const initializeazaGalerie = () => {
  const legaturi = $$(".galerie-element");
  if (!legaturi.length) return;
  const dialog = document.createElement("dialog");
  dialog.className = "lumina";
  dialog.setAttribute("aria-label", "Image viewer");
  const imagine = document.createElement("img");
  const legenda = document.createElement("p");
  legenda.className = "lumina-legenda";
  const inchide = document.createElement("button");
  inchide.type = "button";
  inchide.className = "lumina-inchide";
  inchide.setAttribute("aria-label", "Close image");
  inchide.textContent = "×";
  dialog.append(inchide, imagine, legenda);
  document.body.appendChild(dialog);
  let ultimaLegatura = null;
  const inchideDialog = () => {
    if (dialog.open) dialog.close();
  };
  dialog.addEventListener("close", () => {
    document.body.classList.remove("fara-derulare");
    if (ultimaLegatura) ultimaLegatura.focus();
  });
  legaturi.forEach((legatura) => {
    legatura.addEventListener("click", (eveniment) => {
      if (typeof dialog.showModal !== "function") return;
      eveniment.preventDefault();
      ultimaLegatura = legatura;
      imagine.src = legatura.getAttribute("href");
      imagine.alt = $("img", legatura)?.alt || "";
      legenda.textContent = legatura.dataset.titlu || "";
      dialog.showModal();
      document.body.classList.add("fara-derulare");
      inchide.focus();
    });
  });
  inchide.addEventListener("click", inchideDialog);
  dialog.addEventListener("click", (eveniment) => {
    if (eveniment.target === dialog) inchideDialog();
  });
};
const initializeazaArhiva = () => {
  const filme = $$(".film");
  if (!filme.length) return;
  const filtre = $$(".filtru");
  const cautare = $("#cautare-film");
  const numar = $("#numar-filme");
  const gol = $("#niciun-rezultat");
  const reseteaza = $("#reseteaza-filtre");
  let filtruActiv = "toate";
  const aplicaFiltre = () => {
    const interogare = (cautare?.value || "").trim().toLowerCase();
    let vizibile = 0;
    filme.forEach((film) => {
      const categorii = (film.dataset.categorie || "").split(" ");
      const potrivireFiltru = filtruActiv === "toate" || categorii.includes(filtruActiv);
      const text = `${film.dataset.cautare || ""} ${film.textContent}`.toLowerCase();
      const potrivireCautare = !interogare || text.includes(interogare);
      const afisat = potrivireFiltru && potrivireCautare;
      film.hidden = !afisat;
      if (!afisat) opresteVideoclipuri(film);
      if (afisat) vizibile += 1;
    });
    if (numar) numar.textContent = vizibile === filme.length ? `All ${vizibile} films` : `${vizibile} of ${filme.length} films`;
    if (gol) gol.hidden = vizibile !== 0;
  };
  const seteazaFiltru = (valoare) => {
    filtruActiv = valoare;
    filtre.forEach((buton) => buton.setAttribute("aria-pressed", String(buton.dataset.filtru === valoare)));
    aplicaFiltre();
  };
  filtre.forEach((buton) => buton.addEventListener("click", () => seteazaFiltru(buton.dataset.filtru)));
  if (cautare) cautare.addEventListener("input", aplicaFiltre);
  if (reseteaza) {
    reseteaza.addEventListener("click", () => {
      if (cautare) cautare.value = "";
      seteazaFiltru("toate");
      cautare?.focus();
    });
  }
  aplicaFiltre();
};
const opresteVideoclipuri = (container) => {
  $$("video", container).forEach((video) => video.pause());
  $$(".ecran[data-youtube]", container).forEach((ecran) => reseteazaEcran(ecran));
};
const reseteazaEcran = (ecran) => {
  const cadru = $("iframe", ecran);
  if (!cadru) return;
  cadru.remove();
  ecran.classList.remove("ruleaza");
  $$(".ecran-coperta, .ecran-pornire", ecran).forEach((element) => { element.hidden = false; });
};
const pornesteEcran = (ecran) => {
  const id = ecran.dataset.youtube;
  if (!id || $("iframe", ecran)) return;
  $$(".ecran[data-youtube]").forEach((altul) => { if (altul !== ecran) reseteazaEcran(altul); });
  $$(".film-video video").forEach((video) => video.pause());
  const cadru = document.createElement("iframe");
  cadru.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  cadru.title = `${ecran.dataset.titlu || "Film"} video player`;
  cadru.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  cadru.referrerPolicy = "strict-origin-when-cross-origin";
  cadru.allowFullscreen = true;
  $$(".ecran-coperta, .ecran-pornire", ecran).forEach((element) => { element.hidden = true; });
  ecran.classList.add("ruleaza");
  ecran.appendChild(cadru);
  cadru.focus();
};
const initializeazaEcrane = () => {
  $$(".ecran[data-youtube]").forEach((ecran) => {
    const buton = $(".ecran-pornire", ecran);
    if (buton) buton.addEventListener("click", () => pornesteEcran(ecran));
  });
  $$(".film-video").forEach((zona) => {
    const butoane = $$(".comutator-video button", zona);
    const ecranFilm = $(".ecran[data-youtube]", zona);
    const ecranLocal = $(".ecran-local", zona);
    const videoLocal = ecranLocal ? $("video", ecranLocal) : null;
    if (videoLocal) {
      videoLocal.addEventListener("play", () => {
        $$(".ecran[data-youtube]").forEach((ecran) => reseteazaEcran(ecran));
        $$(".film-video video").forEach((altul) => { if (altul !== videoLocal) altul.pause(); });
      });
    }
    if (!butoane.length || !ecranFilm || !ecranLocal) return;
    butoane.forEach((buton) => {
      buton.addEventListener("click", () => {
        const clip = buton.dataset.mod === "clip";
        butoane.forEach((element) => element.setAttribute("aria-pressed", String(element === buton)));
        ecranFilm.hidden = clip;
        ecranLocal.hidden = !clip;
        if (clip) reseteazaEcran(ecranFilm);
        else if (videoLocal) videoLocal.pause();
      });
    });
  });
};
const citesteRezervari = () => {
  try {
    const date = JSON.parse(window.localStorage.getItem(CHEIE_REZERVARI) || "[]");
    return Array.isArray(date) ? date : [];
  } catch (eroare) {
    return [];
  }
};
const salveazaRezervari = (rezervari) => {
  try {
    window.localStorage.setItem(CHEIE_REZERVARI, JSON.stringify(rezervari));
    return true;
  } catch (eroare) {
    return false;
  }
};
const creeazaElement = (eticheta, clasa, text) => {
  const element = document.createElement(eticheta);
  if (clasa) element.className = clasa;
  if (text !== undefined) element.textContent = text;
  return element;
};
const afiseazaRezervari = () => {
  const lista = $("#lista-rezervari");
  const butonSterge = $("#sterge-rezervari");
  if (!lista) return;
  const rezervari = citesteRezervari();
  lista.replaceChildren();
  if (butonSterge) butonSterge.hidden = rezervari.length === 0;
  if (!rezervari.length) {
    lista.appendChild(creeazaElement("p", "lista-goala", "You have no reservations yet. Book a screening with the form above and it will appear here."));
    return;
  }
  rezervari.forEach((rezervare) => {
    const bilete = Number(rezervare.bilete) || 1;
    const card = creeazaElement("article", "rezervare-card");
    card.append(
      creeazaElement("h3", "", rezervare.film),
      creeazaElement("p", "rezervare-data", formateazaData(rezervare.data)),
      creeazaElement("p", "", `${bilete} ${bilete === 1 ? "ticket" : "tickets"}, ${rezervare.loc}`),
      creeazaElement("p", "rezervare-nume", rezervare.nume)
    );
    lista.appendChild(card);
  });
};
const valideazaRezervare = (date) => {
  const erori = {};
  const azi = dataLocala();
  const bilete = Number(date.bilete);
  if (!date.nume || date.nume.trim().length < 3) erori.nume = "Enter your full name, at least 3 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((date.email || "").trim())) erori.email = "Enter an email address like name@example.com.";
  if (!date.film) erori.film = "Choose the film you want to see.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date.data || "") || date.data < azi) erori.data = "Choose today or a later date.";
  if (!Number.isInteger(bilete) || bilete < 1 || bilete > 10) erori.bilete = "Book between 1 and 10 tickets.";
  return erori;
};
const afiseazaEroriCampuri = (formular, erori) => {
  $$(".camp", formular).forEach((camp) => {
    const control = $("input, select, textarea", camp);
    const vechi = $(".eroare-camp", camp);
    if (vechi) vechi.remove();
    if (!control) return;
    const mesaj = erori[control.name];
    control.setAttribute("aria-invalid", mesaj ? "true" : "false");
    if (mesaj) {
      const eroare = creeazaElement("p", "eroare-camp", mesaj);
      eroare.id = `eroare-${control.name}`;
      control.setAttribute("aria-describedby", eroare.id);
      camp.appendChild(eroare);
    } else {
      control.removeAttribute("aria-describedby");
    }
  });
};
const initializeazaRezervari = () => {
  const formular = $("#formular-rezervare");
  if (!formular) return;
  const stare = $("#stare-formular");
  const butonSterge = $("#sterge-rezervari");
  const campData = formular.elements.data;
  const seteazaStare = (text, tip) => {
    if (!stare) return;
    stare.textContent = text;
    stare.className = `stare-formular ${tip}`;
  };
  if (campData) campData.min = dataLocala();
  afiseazaRezervari();
  formular.addEventListener("submit", (eveniment) => {
    eveniment.preventDefault();
    const date = Object.fromEntries(new FormData(formular).entries());
    const erori = valideazaRezervare(date);
    afiseazaEroriCampuri(formular, erori);
    if (Object.keys(erori).length) {
      seteazaStare("Some fields need attention. Check the messages under each field.", "eroare");
      const primul = $("[aria-invalid='true']", formular);
      if (primul) primul.focus();
      return;
    }
    const rezervari = citesteRezervari();
    rezervari.unshift({
      nume: date.nume.trim(),
      email: date.email.trim(),
      film: date.film,
      data: date.data,
      bilete: Number(date.bilete),
      loc: date.loc,
      mesaj: (date.mesaj || "").trim(),
      creata: new Date().toISOString()
    });
    if (!salveazaRezervari(rezervari.slice(0, LIMITA_REZERVARI))) {
      seteazaStare("This browser blocks local storage, so the reservation could not be saved. Call the box office to book.", "eroare");
      return;
    }
    formular.reset();
    if (campData) campData.min = dataLocala();
    seteazaStare(`Seats booked for ${date.film} on ${formateazaData(date.data)}.`, "succes");
    afiseazaRezervari();
    afiseazaNotificare("Seats booked");
  });
  if (butonSterge) {
    butonSterge.addEventListener("click", () => {
      if (!window.confirm("Clear all saved reservations from this browser?")) return;
      salveazaRezervari([]);
      afiseazaRezervari();
      seteazaStare("All reservations cleared.", "succes");
      afiseazaNotificare("Reservations cleared");
    });
  }
};
const initializeazaFile = () => {
  const file = $$(".fila");
  if (!file.length) return;
  const activeaza = (fila, focalizeaza) => {
    file.forEach((element) => {
      const activa = element === fila;
      element.setAttribute("aria-selected", String(activa));
      element.tabIndex = activa ? 0 : -1;
      const panou = document.getElementById(element.getAttribute("aria-controls"));
      if (panou) panou.hidden = !activa;
    });
    if (focalizeaza) fila.focus();
  };
  file.forEach((fila, index) => {
    fila.addEventListener("click", () => activeaza(fila, false));
    fila.addEventListener("keydown", (eveniment) => {
      const directii = { ArrowRight: 1, ArrowLeft: -1 };
      if (eveniment.key in directii) {
        eveniment.preventDefault();
        activeaza(file[(index + directii[eveniment.key] + file.length) % file.length], true);
      } else if (eveniment.key === "Home") {
        eveniment.preventDefault();
        activeaza(file[0], true);
      } else if (eveniment.key === "End") {
        eveniment.preventDefault();
        activeaza(file[file.length - 1], true);
      }
    });
  });
};
const initializeazaImagini = () => {
  $$("img").forEach((imagine) => {
    const marcheaza = () => {
      const parinte = imagine.closest(".ecran, .galerie-element, .biografie-portret") || imagine.parentElement;
      if (parinte) parinte.classList.add("imagine-lipsa");
      imagine.hidden = true;
    };
    if (imagine.complete && imagine.naturalWidth === 0 && imagine.getAttribute("src")) marcheaza();
    else imagine.addEventListener("error", marcheaza, { once: true });
  });
};
const initializeazaAnul = () => {
  $$("#anul-curent").forEach((element) => { element.textContent = String(new Date().getFullYear()); });
};
document.addEventListener("DOMContentLoaded", () => {
  initializeazaAntet();
  initializeazaErou();
  initializeazaGalerie();
  initializeazaArhiva();
  initializeazaEcrane();
  initializeazaRezervari();
  initializeazaFile();
  initializeazaImagini();
  initializeazaAnul();
});
