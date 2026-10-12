import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const manifestPath = new URL('../src/components/portfolio/tour/manifest.ts', import.meta.url);
const source = fs.readFileSync(manifestPath, 'utf8');
const chapters = JSON.parse(source.slice(source.indexOf('= [') + 2).trim().replace(/;$/, ''));
const intro = chapters[0];
// Keep the choice popup silent. The measured pause after "customers" is
// 7.634–7.895s; cut inside it, before the first sound of "Choose".
const cutoff = Math.min(intro.choiceAt ?? intro.duration, 7.76);
const file = new URL('../public/audio/laura/intro-silent-choice-20261012.mp3', import.meta.url);
const original = new URL('../public/audio/laura/intro-20261012.mp3', import.meta.url);
execFileSync('ffmpeg', ['-hide_banner','-loglevel','error','-y','-i',fileURLToPath(original),'-t',String(cutoff),'-ac','1','-ar','24000','-codec:a','libmp3lame','-b:a','64k',fileURLToPath(file)]);
intro.src = '/audio/laura/intro-silent-choice-20261012.mp3';
intro.duration = cutoff;
intro.captions = intro.captions.filter(cue => cue.start < cutoff).map(cue => ({ ...cue, end:Math.min(cue.end, cutoff) }));
delete intro.choiceAt;
let offset = 0;
for (const chapter of chapters) { chapter.offset = Number(offset.toFixed(3)); offset += chapter.duration; }
const types = source.slice(0, source.indexOf('// October'));
fs.writeFileSync(manifestPath, types + '// October 12 recording: intro ends in silence before the Continue/Skip instruction.\nexport const CHAPTERS: Chapter[] = ' + JSON.stringify(chapters,null,2) + ';\n');
fs.writeFileSync(new URL('../public/audio/laura/transcript.txt', import.meta.url), chapters.map(chapter => chapter.title + '\n' + chapter.captions.map(cue => cue.text).join(' ')).join('\n\n'));
console.log(`Automatic intro: ${cutoff}s; ${chapters.length} chapters; total ${offset.toFixed(3)}s.`);
