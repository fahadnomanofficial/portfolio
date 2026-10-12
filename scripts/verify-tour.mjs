import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CHAPTERS } from '../src/components/portfolio/tour/manifest.ts';
import { isPlaybackLocked } from '../src/components/portfolio/tour/tour-policy.ts';

for (const status of ['idle','loading','playing','blocked','paused','choice','complete','error']) {
  assert.equal(isPlaybackLocked(false,status), false, 'Never lock a visitor before playback has actually started');
}
for (const status of ['playing','loading','paused','blocked','choice']) assert.equal(isPlaybackLocked(true,status), true, 'Keep the tour lock across buffering, intro choice and chapter changes');
for (const status of ['idle','complete','error']) assert.equal(isPlaybackLocked(true,status), false, 'Skip, completion and error release the page');
assert.deepEqual(CHAPTERS.map(chapter => chapter.id), ['top','services','work','automation-examples','about','contact']);
assert.equal(CHAPTERS[0].duration,12.009);
assert.equal(CHAPTERS[0].src,'/audio/laura/intro-with-choice-20261012.mp3');
assert.equal(CHAPTERS[0].captions.slice(-2).map(cue => cue.text).join(' '),'Choose Continue tour for a quick look around, or Skip to explore on your own.');
let offset = 0;
for (const chapter of CHAPTERS) {
  assert.equal(chapter.choiceAt,undefined, 'No obsolete choice gate');
  assert.ok(Math.abs(chapter.offset - offset) < .001);
  offset += chapter.duration;
  assert.equal(chapter.captions[0].start,0);
  for (let i=0; i<chapter.captions.length; i++) {
    const cue = chapter.captions[i];
    assert.ok(cue.start < cue.end && cue.end <= chapter.duration);
    assert.equal(cue.end,chapter.captions[i+1]?.start ?? chapter.duration);
  }
  const path = fileURLToPath(new URL(`../public${chapter.src}`,import.meta.url));
  const duration = Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',path],{encoding:'utf8'}));
  assert.ok(Math.abs(duration-chapter.duration)<.12, `${chapter.id}: exported audio matches its timing`);
}
assert.ok(Math.abs(offset-148.92)<.001);
assert.equal(new Set(CHAPTERS[1].captions.map(cue => cue.serviceId).filter(Boolean)).size,8);
assert.deepEqual(CHAPTERS[2].captions.map(cue => cue.highlight).filter(Boolean),['infix','kendor','onereal','campbell','reliance','smiles','bdproperty']);
const portrait = fs.readFileSync(new URL('../public/fahad-portrait-20261012.png',import.meta.url));
assert.equal(portrait.readUInt32BE(16),1122);
assert.equal(portrait.readUInt32BE(20),1402);
console.log('Tour checks passed: interaction and intro-choice lock lifecycle, six audio chapters, cue highlights, and portrait asset.');
