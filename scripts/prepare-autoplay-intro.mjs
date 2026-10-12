import fs from 'node:fs';

const manifestPath = new URL('../src/components/portfolio/tour/manifest.ts', import.meta.url);
const source = fs.readFileSync(manifestPath, 'utf8');
const chapters = JSON.parse(source.slice(source.indexOf('= [') + 2).trim().replace(/;$/, ''));
const intro = chapters[0];
// Play the complete supplied introduction, including the spoken button
// instruction. TourProvider opens the choice popup only after this clip ends.
const duration = 12.009;
const file = new URL('../public/audio/laura/intro-with-choice-20261012.mp3', import.meta.url);
const original = new URL('../public/audio/laura/intro-20261012.mp3', import.meta.url);
fs.copyFileSync(original, file);
intro.src = '/audio/laura/intro-with-choice-20261012.mp3';
intro.duration = duration;
const opening = intro.captions.filter(cue => cue.start < 7.98);
opening.at(-1).end = 7.98;
intro.captions = [...opening,
  { text: 'Choose Continue tour for a quick look around,', emphasis: ['Continue tour'], start: 7.98, end: 10.109 },
  { text: 'or Skip to explore on your own.', emphasis: ['Skip'], start: 10.109, end: duration },
];
delete intro.choiceAt;
let offset = 0;
for (const chapter of chapters) { chapter.offset = Number(offset.toFixed(3)); offset += chapter.duration; }
const types = source.slice(0, source.indexOf('// October'));
fs.writeFileSync(manifestPath, types + '// October 12 recording: spoken Continue/Skip instruction, then the intro choice popup.\nexport const CHAPTERS: Chapter[] = ' + JSON.stringify(chapters,null,2) + ';\n');
fs.writeFileSync(new URL('../public/audio/laura/transcript.txt', import.meta.url), chapters.map(chapter => chapter.title + '\n' + chapter.captions.map(cue => cue.text).join(' ')).join('\n\n'));
console.log(`Spoken-choice intro: ${duration}s; ${chapters.length} chapters; total ${offset.toFixed(3)}s.`);
