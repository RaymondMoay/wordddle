Test answers: "bay", "hawk", "local", "toggle", "achieve", "academic"
Try it out at: [wordddle.com](https://www.wordddle.com)

## What is it

My take on Wordle. The twist is (1) the addition of levels and (2) hints.

Every level introduces a new word with +1 number of letters (tries remain the same at 6x). Just like wordle, it refreshes daily. Users can get 1 hint per word at the expense of 1 additional try.

## Tech stack

Super simple tech stack and really just a react UI exercise here. A sunday-fun-day coding exercise. The site will be statically generated with regeneration happening every day to download the latest word levels.

- NextJS + React + Typescript
- Google Sheets API (My super basic CMS to manually key in words... for now)
- Vercel
- Tailwind

## Todos:

- [x] Move on to next level
- [ ] Get hint: removes 1 try.
- [ ] Store past answers for summary page
- [ ] Connect to GSheet API + getStaticProps to load data and regenerate everyday
- [ ] Overlay component for
  - [ ] Game over
  - [ ] Game won
  - [ ] Game instructions
