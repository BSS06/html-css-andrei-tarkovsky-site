# Andrei Tarkovsky Films

A small static website about the seven feature films of the Soviet director Andrei Tarkovsky (1932–1986). It has a biography, a filmography you can search and filter, a video for every film, and a screening reservation form that saves bookings in the browser.

The site was built as a student information project by a team of two: planned, prototyped, implemented and tested.

## Features

- **Home**: a full-screen hero with a montage video that fades from sepia to colour, a short biography, a timeline of the seven films, a still gallery with an image viewer, the project team and the project stages.
- **Films**: all seven features (1962–1986) with original titles, summaries, runtimes, countries and themes.
  - Search by title, year or theme, and filter by Memory, Faith, History and war, Science fiction or Exile.
  - A video for every film: five full films with English subtitles from Mosfilm's official YouTube channel, and official trailers for *Nostalghia* (Kino Lorber) and *The Sacrifice* (MUBI).
  - Short local clips for *Andrei Rublev* and *Stalker*, which you can switch to with the "Short clip" button.
  - YouTube players load only after you press play, through the privacy-enhanced `youtube-nocookie.com` domain. Each video also has an "Open on YouTube" link.
- **Reservations**: a validated booking form (name, email, film, date, tickets, seat type, notes). Bookings are saved in `localStorage` and listed below the form. The page also has contacts, further reading links, the user journey, scenarios, a risk register and a cost estimate.
- Responsive from 320 px phones to wide desktops, keyboard accessible (skip link, visible focus, accessible tabs and dialog) and respects `prefers-reduced-motion`.

## Videos

| Year | Film | Video | Source |
|------|------|-------|--------|
| 1962 | Ivan's Childhood | Full film | Mosfilm |
| 1966 | Andrei Rublev | Full film, plus local clip | Mosfilm |
| 1972 | Solaris | Full film | Mosfilm |
| 1975 | Mirror | Full film | Mosfilm |
| 1979 | Stalker | Full film, plus local clip | Mosfilm |
| 1983 | Nostalghia | Official trailer | Kino Lorber |
| 1986 | The Sacrifice | Official trailer | MUBI |

## Project structure

```
Andrei-Tarkovsky-Films/
├── index.html              Home page
├── pages/
│   ├── films.html          Filmography with videos
│   └── reservations.html   Booking form, contacts and project details
├── css/
│   └── style.css           All styles
├── js/
│   └── main.js             All interactive behaviour
├── images/                 Film stills and portrait (JPEG, max 1600 px)
├── video/                  Hero montage and two short clips (MP4, H.264)
└── README.md
```

## Running locally

The site is plain HTML, CSS and JavaScript, with no build step and no dependencies.

Run it through a local web server, because YouTube does not play embedded videos on pages opened straight from disk (`file://`).

```bash
cd Andrei-Tarkovsky-Films
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

Other options: the VS Code **Live Server** extension, or `npx serve .`.

## Deployment

Upload the folder to any static host, such as GitHub Pages, Netlify, Vercel or a university web server. No server-side code is needed.

## Technologies

- HTML5 with semantic markup and ARIA where needed
- CSS3: custom properties, Grid, Flexbox, `aspect-ratio`, `backdrop-filter` and media queries
- Vanilla JavaScript (ES2020), with no frameworks
- Google Fonts: Spectral and Commissioner
- YouTube embeds (`youtube-nocookie.com`)

Code identifiers (CSS classes, IDs and JavaScript names) are in Romanian, the team's working language. All site content is in English.

## Browser support

The latest versions of Chrome, Edge, Firefox and Safari, on desktop and mobile.

## Credits

Film stills and clips belong to their rights holders (Mosfilm, Sovexportfilm, RAI, Swedish Film Institute and others). Embedded videos are hosted on YouTube by their official publishers. This is a non-commercial educational project.
