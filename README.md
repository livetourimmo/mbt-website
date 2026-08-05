# MBT — Lebendige Führung

Website für Markus Tappolet: MBT-Consulting (Unternehmensentwicklung) und MBT-Coaching (Führungscoaching), getragen vom gemeinsamen Kern "Lebendige Führung".

Konzept, Content und Design-Tokens: siehe [HANDOFF.md](./HANDOFF.md).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Deployment: Vercel, via GitHub

## Entwicklung

```bash
npm install
npm run dev
```

Öffnet [http://localhost:3000](http://localhost:3000).

## Struktur

```
/                    Einstieg — Wahl zwischen Consulting und Coaching
/consulting          Startseite MBT-Consulting
/coaching            Startseite MBT-Coaching
/lebendige-fuehrung   Gemeinsame Vertiefungsseite
/ueber-mich           Über Markus Tappolet
/kontakt              Kennenlerngespräch
```
