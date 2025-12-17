'use strict';

(() => {
  const el = (id) => document.getElementById(id);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const now = () => performance.now();
  const isVisible = (id) => {
    const node = el(id);
    return !!(node && !node.classList.contains('hidden'));
  };

  const CSV_HEADERS = [
    'phase',
    'participant_name',
    'pid',
    'set_index',
    'set_size',
    'trial_in_set',
    'sentence',
    'target',
    'is_plausible',
    'response',
    'rt_ms',
    'speed_error',
    'recall_answers',
    'recall_partial',
    'recall_absolute',
    'processing_accuracy'
  ];

  const CRITERION = 0.8;

  const NAME_POOL = [
    'Mary',
    'Tom',
    'Anna',
    'David',
    'Julia',
    'Kevin',
    'Emma',
    'John',
    'Alice',
    'Peter',
    'Linda',
    'Brian',
    'Lisa',
    'Mark',
    'Sarah',
    'James'
  ];

  const LETTER_POOL = ['F', 'H', 'J', 'K', 'L', 'N', 'P', 'Q', 'R', 'S', 'T', 'Y'];

  const PLAUSIBLE_TEMPLATES = [
    { template: 'NAME opened the small door.', target: 'door' },
    { template: 'NAME visited the quiet museum.', target: 'museum' },
    { template: 'NAME washed the old car.', target: 'car' },
    { template: 'NAME carried the heavy box.', target: 'box' },
    { template: 'NAME cleaned the long table.', target: 'table' },
    { template: 'NAME fixed the wooden chair.', target: 'chair' },
    { template: 'NAME painted the white fence.', target: 'fence' },
    { template: 'NAME bought the fresh bread.', target: 'bread' },
    { template: 'NAME prepared the warm soup.', target: 'soup' },
    { template: 'NAME enjoyed the short movie.', target: 'movie' },
    { template: 'NAME studied the easy lesson.', target: 'lesson' },
    { template: 'NAME wrote the long letter.', target: 'letter' },
    { template: 'NAME read the short book.', target: 'book' },
    { template: 'NAME watered the small garden.', target: 'garden' },
    { template: 'NAME cooked the simple dinner.', target: 'dinner' },
    { template: 'NAME closed the wide window.', target: 'window' },
    { template: 'NAME swept the quiet room.', target: 'room' },
    { template: 'NAME walked along the calm river.', target: 'river' },
    { template: 'NAME repaired the old bridge.', target: 'bridge' },
    { template: 'NAME waited inside the warm house.', target: 'house' },
    { template: 'NAME guided the new student.', target: 'student' },
    { template: 'NAME helped the busy teacher.', target: 'teacher' },
    { template: 'NAME attended the short meeting.', target: 'meeting' },
    { template: 'NAME planned the next project.', target: 'project' },
    { template: 'NAME coached the local team.', target: 'team' },
    { template: 'NAME finished the daily report.', target: 'report' },
    { template: 'NAME organized the clean office.', target: 'office' },
    { template: 'NAME visited the busy market.', target: 'market' },
    { template: 'NAME opened the new shop.', target: 'shop' },
    { template: 'NAME played the weekend game.', target: 'game' },
    { template: 'NAME listened to the soft music.', target: 'music' },
    { template: 'NAME enjoyed the sunny park.', target: 'park' },
    { template: 'NAME walked through the green forest.', target: 'forest' },
    { template: 'NAME drew the simple picture.', target: 'picture' },
    { template: 'NAME framed the family photo.', target: 'photo' },
    { template: 'NAME watered the young tree.', target: 'tree' },
    { template: 'NAME greeted the new neighbor.', target: 'neighbor' },
    { template: 'NAME visited the local library.', target: 'library' },
    { template: 'NAME reviewed the travel plan.', target: 'plan' },
    { template: 'NAME packed the travel bag.', target: 'bag' },
    { template: 'NAME folded the clean shirt.', target: 'shirt' },
    { template: 'NAME arranged the empty cup.', target: 'cup' },
    { template: 'NAME refilled the cold bottle.', target: 'bottle' },
    { template: 'NAME repaired the old elevator.', target: 'elevator' },
    { template: 'NAME painted the bright wall.', target: 'wall' },
    { template: 'NAME cleaned the empty classroom.', target: 'classroom' },
    { template: 'NAME reviewed the weekly schedule.', target: 'schedule' },
    { template: 'NAME served the warm coffee.', target: 'coffee' },
    { template: 'NAME delivered the morning mail.', target: 'mail' },
    { template: 'NAME checked the train ticket.', target: 'ticket' }
  ];

  const IMPLAUSIBLE_TEMPLATES = [
    { template: 'NAME planted the small phone.', target: 'phone' },
    { template: 'NAME washed the quiet fire.', target: 'fire' },
    { template: 'NAME read the hot soup.', target: 'soup' },
    { template: 'NAME drove the long window.', target: 'window' },
    { template: 'NAME painted the cold sandwich.', target: 'sandwich' },
    { template: 'NAME carried the heavy cloud.', target: 'cloud' },
    { template: 'NAME opened the sleeping forest.', target: 'forest' },
    { template: 'NAME cooked the dry letter.', target: 'letter' },
    { template: 'NAME burned the green water.', target: 'water' },
    { template: 'NAME repaired the soft rain.', target: 'rain' },
    { template: 'NAME folded the loud river.', target: 'river' },
    { template: 'NAME froze the warm beach.', target: 'beach' },
    { template: 'NAME parked the bright house.', target: 'house' },
    { template: 'NAME watered the silent lamp.', target: 'lamp' },
    { template: 'NAME mailed the tired horse.', target: 'horse' },
    { template: 'NAME ironed the busy road.', target: 'road' },
    { template: 'NAME polished the silent wind.', target: 'wind' },
    { template: 'NAME boiled the hard book.', target: 'book' },
    { template: 'NAME grew the quiet chair.', target: 'chair' },
    { template: 'NAME refilled the cold sun.', target: 'sun' },
    { template: 'NAME counted the flying smoke.', target: 'smoke' },
    { template: 'NAME stored the wild storm.', target: 'storm' },
    { template: 'NAME dried the wet teacher.', target: 'teacher' },
    { template: 'NAME memorized the cold coffee.', target: 'coffee' },
    { template: 'NAME sharpened the soft pillow.', target: 'pillow' },
    { template: 'NAME erased the loud dinner.', target: 'dinner' },
    { template: 'NAME weighed the flying story.', target: 'story' },
    { template: 'NAME fed the hungry engine.', target: 'engine' },
    { template: 'NAME built the tiny idea.', target: 'idea' },
    { template: 'NAME sailed the quiet office.', target: 'office' },
    { template: 'NAME charged the empty hill.', target: 'hill' },
    { template: 'NAME threw the gentle mountain.', target: 'mountain' },
    { template: 'NAME measured the early dream.', target: 'dream' },
    { template: 'NAME borrowed the short shadow.', target: 'shadow' },
    { template: 'NAME taught the sleeping stone.', target: 'stone' },
    { template: 'NAME invited the cold snow.', target: 'snow' },
    { template: 'NAME sang the heavy table.', target: 'table' },
    { template: 'NAME climbed the quiet floor.', target: 'floor' },
    { template: 'NAME pushed the soft sky.', target: 'sky' },
    { template: 'NAME brushed the deep desert.', target: 'desert' },
    { template: 'NAME combed the bright ceiling.', target: 'ceiling' },
    { template: 'NAME knitted the large bridge.', target: 'bridge' },
    { template: 'NAME rode the quiet desk.', target: 'desk' },
    { template: 'NAME dug the wide music.', target: 'music' },
    { template: 'NAME caught the early market.', target: 'market' },
    { template: 'NAME cooked the fresh paper.', target: 'paper' },
    { template: 'NAME washed the new news.', target: 'news' },
    { template: 'NAME planted the blue street.', target: 'street' },
    { template: 'NAME painted the loud weather.', target: 'weather' },
    { template: 'NAME stored the sweet station.', target: 'station' }
  ];

  const fillTemplate = (template, name) => template.replace('NAME', name);
  const randomLetter = () => LETTER_POOL[(Math.random() * LETTER_POOL.length) | 0];

  function buildStimuli() {
    const rows = [];
    let nameIndex = 0;
    for (const tpl of PLAUSIBLE_TEMPLATES) {
      const name = NAME_POOL[nameIndex % NAME_POOL.length];
      rows.push({
        sentence: fillTemplate(tpl.template, name),
        is_plausible: 1,
        target: tpl.target
      });
      nameIndex += 1;
    }
    nameIndex = 0;
    for (const tpl of IMPLAUSIBLE_TEMPLATES) {
      const name = NAME_POOL[nameIndex % NAME_POOL.length];
      rows.push({
        sentence: fillTemplate(tpl.template, name),
        is_plausible: 0,
        target: tpl.target
      });
      nameIndex += 1;
    }
    return shuffle(rows);
  }

  const STIM_BANK = buildStimuli();

  // Fixed practice-only items (not used in the main test)
  const PRACTICE_STAGE1_ITEMS = [
    { sentence: 'Mia stirred the warm tea.', is_plausible: 1, target: 'tea' },
    { sentence: 'Liam repaired the dusty shelf.', is_plausible: 1, target: 'shelf' },
    { sentence: 'Noah watered the tall cactus.', is_plausible: 1, target: 'cactus' },
    { sentence: 'Emma closed the heavy suitcase.', is_plausible: 1, target: 'suitcase' },
    { sentence: 'Olivia wiped the wet counter.', is_plausible: 1, target: 'counter' },
    { sentence: 'Ethan painted the small mailbox.', is_plausible: 1, target: 'mailbox' },
    { sentence: 'Sofia folded the soft scarf.', is_plausible: 1, target: 'scarf' },
    { sentence: 'Logan ironed the sleepy sandwich.', is_plausible: 0, target: 'sandwich' },
    { sentence: 'Ava brushed the noisy pillow.', is_plausible: 0, target: 'pillow' },
    { sentence: 'Jacob planted the silver laptop.', is_plausible: 0, target: 'laptop' },
    { sentence: 'Henry boiled the wooden spoon.', is_plausible: 0, target: 'spoon' },
    { sentence: 'Grace repaired the hungry violin.', is_plausible: 0, target: 'violin' },
    { sentence: 'Chloe parked the quiet umbrella.', is_plausible: 0, target: 'umbrella' },
    { sentence: 'Lucas knitted the sharp mirror.', is_plausible: 0, target: 'mirror' },
    { sentence: 'Zoe baked the plastic newspaper.', is_plausible: 0, target: 'newspaper' }
  ];

  const PRACTICE_STAGE2_ITEMS = [
    { sentence: 'Caleb lifted the broken lamp.', is_plausible: 1, target: 'lamp' },
    { sentence: 'Nora washed the muddy boots.', is_plausible: 1, target: 'boots' },
    { sentence: 'Eli carried the cold pillow.', is_plausible: 1, target: 'pillow' },
    { sentence: 'Ruby counted the flying sofa.', is_plausible: 0, target: 'sofa' },
    { sentence: 'Mason froze the smiling calendar.', is_plausible: 0, target: 'calendar' },
    { sentence: 'Ivy measured the sleepy thunder.', is_plausible: 0, target: 'thunder' },
    { sentence: 'Owen watered the loud blanket.', is_plausible: 0, target: 'blanket' }
  ];

  const S = {
    participantName: '',
    pid: '',
    setSizes: [3, 4, 5, 6, 7],
    trialsPerSize: 3,
    deadlineMs: 2500,
    practiceRTs: [],
    log: [],
    _trialSeq: [],
    _curr: {},
    _setIndex: 0,
    practiceCompleted: false,
    practiceStage: 0,
    latestSummary: null,
    autoExported: false
  };

  window.RSPAN_STATE = S;

  function updatePracticeButtons() {
    const stage1Btn = el('btnPractice');
    const stage2Btn = el('btnPracticePhase2');
    if (!stage1Btn || !stage2Btn) return;
    const stage = S.practiceStage;
    if (stage === 0) {
      stage1Btn.classList.remove('hidden');
      stage1Btn.textContent = 'フェーズ1（判断練習）を開始';
      stage1Btn.disabled = false;
      stage2Btn.classList.add('hidden');
      stage2Btn.disabled = true;
    } else if (stage === 1) {
      stage1Btn.classList.add('hidden');
      stage1Btn.disabled = true;
      stage2Btn.classList.remove('hidden');
      stage2Btn.textContent = 'フェーズ2（系列想起練習）を開始';
      stage2Btn.disabled = false;
    } else {
      stage1Btn.classList.remove('hidden');
      stage1Btn.textContent = '練習を最初からやり直す';
      stage1Btn.disabled = false;
      stage2Btn.classList.add('hidden');
      stage2Btn.disabled = true;
    }
  }

  function setPracticeGuidanceVisible(show = true) {
    const guidance = el('practiceGuidance');
    if (!guidance) return;
    if (show) guidance.classList.remove('hidden');
    else guidance.classList.add('hidden');
  }

  function resetPracticeProgress({ resetLogs = false } = {}) {
    if (resetLogs) {
      S.log = [];
    } else {
      S.log = S.log.filter((row) => row.phase !== 'practice' && row.phase !== 'practice_recall');
    }
    S.practiceStage = 0;
    S.practiceCompleted = false;
    S.practiceRTs = [];
    const status = el('practiceStatus');
    if (status) {
      status.innerHTML = 'フェーズ1（判断練習・15文）を開始してください。True ボタン = Jキー ／ False ボタン = Fキー でも回答できます。';
    }
    setPracticeGuidanceVisible(true);
    el('btnStart').disabled = true;
    updatePracticeButtons();
  }

  function resetForNewParticipant() {
    S.deadlineMs = 2500;
    S._trialSeq = [];
    S._curr = {};
    S._setIndex = 0;
    S.latestSummary = null;
    S.autoExported = false;
    resetPracticeProgress({ resetLogs: true });
  }

  const beforeUnloadHandler = (event) => {
    event.preventDefault();
    event.returnValue = '進行中のデータが失われる可能性があります。';
  };
  const enableUnloadWarning = () => window.addEventListener('beforeunload', beforeUnloadHandler);
  const disableUnloadWarning = () => window.removeEventListener('beforeunload', beforeUnloadHandler);

  function buildPractice(n = 15) {
    return PRACTICE_STAGE1_ITEMS.slice(0, n);
  }

  function buildRecallPracticeBlocks(sizes = [2, 2, 3]) {
    const total = sizes.reduce((acc, s) => acc + s, 0);
    const sample = PRACTICE_STAGE2_ITEMS.slice(0, total);
    const blocks = [];
    let idx = 0;
    for (const size of sizes) {
      const items = sample.slice(idx, idx + size).map((item) => ({ ...item, letter: randomLetter() }));
      blocks.push({ size, items });
      idx += size;
    }
    return blocks;
  }

  function logSentence({ stim, practice, correct, rt, speedError }) {
    S.log.push({
      phase: practice ? 'practice' : 'main',
      participant_name: S.participantName,
      pid: S.pid,
      set_index: practice ? '' : S._setIndex + 1,
      set_size: practice ? '' : S._curr.size,
      trial_in_set: practice ? '' : S._curr.trial,
      sentence: stim.sentence,
      target: (stim.letter || '').toUpperCase(),
      is_plausible: stim.is_plausible,
      response: correct === null ? '' : correct ? 1 : 0,
      rt_ms: typeof rt === 'number' ? rt : '',
      speed_error: speedError,
      recall_answers: '',
      recall_partial: '',
      recall_absolute: '',
      processing_accuracy: ''
    });
  }

  function downloadCSV(filename, rows) {
    const esc = (value) => {
      const str = String(value ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    };
    const dataLines = rows.map((row) => CSV_HEADERS.map((field) => esc(row[field])).join(','));
    const csvText = [CSV_HEADERS.join(','), ...dataLines].join('\n');
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function flashLetter(letter) {
    const holder = el('letterFlash');
    if (!holder) return;
    holder.textContent = letter ? letter.toUpperCase() : '';
    if (!letter) return;
    await sleep(800);
    holder.textContent = '';
  }

  function clearStimulusArea() {
    const holder = el('letterFlash');
    const feedback = el('feedback');
    const sentence = el('sentence');
    if (holder) holder.textContent = '';
    if (feedback) feedback.textContent = '';
    if (sentence) sentence.textContent = '';
  }

  async function prepareFixation(isFirst = false) {
    clearStimulusArea();
    await showFixation(isFirst ? 2000 : 500);
  }

  async function showFixation(ms = 500) {
    const holder = el('letterFlash');
    if (!holder) return;
    holder.textContent = '+';
    await sleep(ms);
    holder.textContent = '';
  }

  async function presentSentence(
    stim,
    idx,
    total,
    { practice = false, showFeedback = true, letter = '', collectRT = practice && !S.practiceCompleted } = {}
  ) {
    return new Promise((resolve) => {
      const targetLetter = (letter || stim.letter || '').toUpperCase();
      stim.letter = targetLetter;
      el('phase').textContent = practice ? '練習' : '本試行';
      el('progress').textContent = `${idx} / ${total}`;
      const deadlineLabel = practice && !S.practiceCompleted ? '—' : S.deadlineMs || '—';
      el('deadline').textContent = `締切: ${deadlineLabel} ms`;
      el('feedback').textContent = '';
      el('sentence').textContent = stim.sentence;
      const letterHolder = el('letterFlash');
      if (letterHolder) letterHolder.textContent = '';

      let responded = false;
      let correct = null;
      let rt = null;
      let speedError = 0;
      let keyHandler;
      const t0 = now();

      const limit = practice && !S.practiceCompleted ? 999999 : S.deadlineMs || 999999;
      const timer = setTimeout(() => {
        if (!responded) {
          responded = true;
          correct = false;
          speedError = 1;
          rt = Math.round(now() - t0);
          if (showFeedback) el('feedback').innerHTML = '<span class="ng">時間切れ</span>';
          else el('feedback').textContent = '';
          finish();
        }
      }, limit);

      const finish = async () => {
        if (keyHandler) window.removeEventListener('keydown', keyHandler);
        clearTimeout(timer);
        if (collectRT && typeof rt === 'number') {
          S.practiceRTs.push(rt);
        }
        logSentence({ stim, practice, correct, rt, speedError });
        if (targetLetter) {
          await flashLetter(targetLetter);
        }
        if (showFeedback) {
          await sleep(500); // keep feedback visible briefly before next fixation
        }
        resolve();
      };

      const onTrue = () => {
        if (responded) return;
        responded = true;
        rt = Math.round(now() - t0);
        correct = stim.is_plausible === 1;
        if (showFeedback) {
          el('feedback').innerHTML = correct ? '<span class="ok">正解</span>' : '<span class="ng">不正解</span>';
        } else {
          el('feedback').textContent = '';
        }
        finish();
      };

      const onFalse = () => {
        if (responded) return;
        responded = true;
        rt = Math.round(now() - t0);
        correct = stim.is_plausible === 0;
        if (showFeedback) {
          el('feedback').innerHTML = correct ? '<span class="ok">正解</span>' : '<span class="ng">不正解</span>';
        } else {
          el('feedback').textContent = '';
        }
        finish();
      };

      keyHandler = (event) => {
        const key = (event.key || '').toLowerCase();
        if (key === 'j') {
          event.preventDefault();
          onTrue();
        } else if (key === 'f') {
          event.preventDefault();
          onFalse();
        }
      };

      window.addEventListener('keydown', keyHandler);

      el('btnTrue').onclick = onTrue;
      el('btnFalse').onclick = onFalse;
    });
  }

  function computeDeadline() {
    const samples = S.practiceRTs.length ? S.practiceRTs : [S.deadlineMs || 2500];
    const mean = samples.reduce((acc, val) => acc + val, 0) / samples.length;
    const variance = samples.reduce((acc, val) => acc + (val - mean) ** 2, 0) / samples.length;
    const sd = Math.sqrt(variance);
    const adaptive = Math.round(mean + 2.5 * sd);
    S.deadlineMs = Math.max(1500, Math.min(5000, adaptive));
  }

  async function runPracticeStage1() {
    if (!S.participantName || !S.pid) {
      alert('先に氏名と参加者IDを入力してください。');
      return;
    }
    if (S.practiceStage !== 0) return;
    const stage1Btn = el('btnPractice');
    const stage2Btn = el('btnPracticePhase2');
    stage1Btn.disabled = true;
    if (stage2Btn) stage2Btn.disabled = true;
    el('btnStart').disabled = true;
    const status = el('practiceStatus');
    if (status) status.textContent = 'フェーズ1（判断練習）を実施しています…';

    S.practiceCompleted = false;
    S.practiceRTs = [];
    S.log = S.log.filter((row) => row.phase !== 'practice' && row.phase !== 'practice_recall');

    el('instructions').classList.add('hidden');
    el('task').classList.remove('hidden');
    clearStimulusArea();
    const items = buildPractice(15);
    let firstTrial = true;
    for (let i = 0; i < items.length; i += 1) {
      await prepareFixation(firstTrial);
      firstTrial = false;
      S._curr = { size: '', trial: i + 1 };
      await presentSentence(items[i], i + 1, items.length, { practice: true, showFeedback: true });
    }

    el('task').classList.add('hidden');
    el('instructions').classList.remove('hidden');

    S.practiceStage = 1;
    if (status) {
      status.innerHTML = '<span class="ok">フェーズ1完了</span> 次は文字系列想起の練習です。True = Jキー／False = Fキーを確認したら、「フェーズ2（系列想起練習）を開始」を押してください。';
    }
    updatePracticeButtons();
  }

  async function runPracticeStage2() {
    if (S.practiceStage !== 1) return;
    const stage2Btn = el('btnPracticePhase2');
    if (stage2Btn) stage2Btn.disabled = true;
    el('btnStart').disabled = true;
    const status = el('practiceStatus');
    if (status) status.textContent = 'フェーズ2（系列想起練習）を実施しています…';

    el('instructions').classList.add('hidden');
    el('task').classList.remove('hidden');
    clearStimulusArea();

    const blocks = buildRecallPracticeBlocks();
    let firstTrial = true;
    for (let b = 0; b < blocks.length; b += 1) {
      const block = blocks[b];
      S._curr = { size: block.size, trial: 0 };
      for (let i = 0; i < block.size; i += 1) {
        await prepareFixation(firstTrial);
        firstTrial = false;
        S._curr.trial = i + 1;
        await presentSentence(block.items[i], i + 1, block.size, {
          practice: true,
          showFeedback: true,
          letter: block.items[i].letter,
          collectRT: false
        });
      }
      await recallSet(block, true);
    }

    el('task').classList.add('hidden');
    el('instructions').classList.remove('hidden');

    computeDeadline();

    S.practiceStage = 2;
    S.practiceCompleted = true;
    setPracticeGuidanceVisible(false);
    if (status) {
      status.innerHTML = `<span class="ok">練習完了</span> 個別締切: ${S.deadlineMs}ms (平均+2.5SD)。本試行ではフィードバックなしですが、True = Jキー / False = Fキーは同じです。準備ができたら「本試行を開始」を押してください。`;
    }
    el('btnStart').disabled = false;
    updatePracticeButtons();
  }

  function buildMainSequence() {
    const totalNeeded = S.setSizes.reduce((sum, size) => sum + size * S.trialsPerSize, 0);
    const pool = shuffle(STIM_BANK.slice());
    while (pool.length < totalNeeded) {
      pool.push(...shuffle(STIM_BANK));
    }
    let idx = 0;
    const blocks = [];
    for (const size of S.setSizes) {
      for (let t = 0; t < S.trialsPerSize; t += 1) {
        if (idx + size > pool.length) {
          pool.push(...shuffle(STIM_BANK));
        }
        const items = pool.slice(idx, idx + size).map((item) => ({ ...item, letter: randomLetter() }));
        blocks.push({ size, items });
        idx += size;
      }
    }
    return shuffle(blocks);
  }

  async function recallSet(block, practice = false) {
    el('task').classList.add('hidden');
    el('recall').classList.remove('hidden');
    el('recallInfo').textContent = practice
      ? `練習セット（${block.size} 文）：提示順に表示された文字を英大文字1文字ずつ入力してください。わからない場合は空欄でも構いません。スペースバーを押して解答を送信します。`
      : `セット長 ${block.size}：提示順に表示された文字を英大文字1文字ずつ入力してください。わからない場合は空欄でも構いません。スペースバーを押して解答を送信します。`;
    const trueTargets = block.items.map((item) => (item.letter || '').toUpperCase());
    const container = el('inputs');
    container.innerHTML = '';
    const fields = [];
    for (let i = 0; i < block.size; i += 1) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `#${i + 1} letter`;
      input.className = 'mono';
      input.spellcheck = false;
      input.autocomplete = 'off';
      input.autocapitalize = 'none';
      input.setAttribute('autocorrect', 'off');
      input.inputMode = 'latin';
      input.lang = 'en';
      input.maxLength = 1;
      input.pattern = '[A-Za-z]';
      input.addEventListener('compositionstart', (e) => e.preventDefault());
      input.addEventListener('beforeinput', (e) => {
        if (e.data && !/[a-zA-Z]/.test(e.data)) {
          e.preventDefault();
        }
        if (e.inputType === 'insertCompositionText') {
          e.preventDefault();
        }
      });
      input.addEventListener('input', () => {
        const match = (input.value || '').toUpperCase().match(/[A-Z]/);
        input.value = match ? match[0] : '';
      });
      container.appendChild(input);
      fields.push(input);
    }

    return new Promise((resolve) => {
      let submitted = false;
      const submit = async () => {
        if (submitted) return;
        submitted = true;
        const answers = fields.map((f) => (f.value.trim().toUpperCase()[0] || ''));
        let correctPositions = 0;
        for (let i = 0; i < block.size; i += 1) {
          if (answers[i] === trueTargets[i]) correctPositions += 1;
        }
        const partial = block.size ? correctPositions / block.size : 0;
        const absolute = partial === 1 ? 1 : 0;
        S.log.push({
          phase: practice ? 'practice_recall' : 'recall',
          participant_name: S.participantName,
          pid: S.pid,
          set_index: practice ? '' : S._setIndex + 1,
          set_size: block.size,
          trial_in_set: '',
          sentence: '',
          target: trueTargets.join(' '),
          is_plausible: '',
          response: '',
          rt_ms: '',
          speed_error: 0,
          recall_answers: answers.join(' '),
          recall_partial: partial,
          recall_absolute: absolute,
          processing_accuracy: ''
        });
        window.removeEventListener('keydown', keyHandler, true);
        el('recall').classList.add('hidden');
        el('task').classList.remove('hidden');
        clearStimulusArea();
        await showFixation(1000); // 1s fixation before next set
        resolve();
      };

      const keyHandler = (event) => {
        const key = event.key || '';
        if (key === ' ' || key === 'Spacebar') {
          event.preventDefault();
          submit();
        }
      };

      window.addEventListener('keydown', keyHandler, true);
    });
  }

  async function runMain() {
    if (!S.participantName || !S.pid) {
      alert('先に氏名と参加者IDを入力してください。');
      return;
    }
    if (!S.practiceCompleted) {
      alert('本試行を開始する前に練習を完了してください。');
      return;
    }
    S.latestSummary = null;
    S.autoExported = false;
    S.log = S.log.filter((row) => row.phase === 'practice' || row.phase === 'practice_recall');

    el('instructions').classList.add('hidden');
    el('summary').classList.add('hidden');
    el('task').classList.remove('hidden');
    clearStimulusArea();

    S._trialSeq = buildMainSequence();
    S._setIndex = 0;

    let firstTrial = true;
    for (let b = 0; b < S._trialSeq.length; b += 1) {
      const block = S._trialSeq[b];
      S._curr = { size: block.size, trial: 0 };
      for (let i = 0; i < block.size; i += 1) {
        await prepareFixation(firstTrial);
        firstTrial = false;
        S._curr.trial = i + 1;
        await presentSentence(block.items[i], i + 1, block.size, { practice: false, showFeedback: false, letter: block.items[i].letter });
      }
      await recallSet(block);
      S._setIndex += 1;
    }

    el('task').classList.add('hidden');
    summarize();
  }

  function computeSummaryMetrics() {
    const mainRows = S.log.filter((row) => row.phase === 'main');
    const judged = mainRows.filter((row) => row.response !== '' && row.response !== null);
    const procAcc = judged.reduce((acc, row) => acc + (Number(row.response) === 1 ? 1 : 0), 0) / Math.max(1, judged.length);

    const recallAgg = computeRecallAggregates();
    const recallCount = recallAgg.recallCount;
    const pcMean = recallCount ? recallAgg.partialSum / recallCount : 0; // Partial-credit unit (set-level mean)
    const pcLoad = recallAgg.loadSum; // Partial-credit load: total correct letters
    const pcLoadProp = recallAgg.totalItems ? pcLoad / recallAgg.totalItems : 0;

    return {
      procAcc,
      judgedCount: judged.length,
      pcMean,
      pcLoad,
      pcLoadProp,
      absSum: recallAgg.absSetCount,
      absItemSum: recallAgg.absItemSum,
      maxSpan: recallAgg.maxSpan,
      recallCount,
      totalItems: recallAgg.totalItems
    };
  }

  function summarize() {
    const metrics = computeSummaryMetrics();
    S.latestSummary = metrics;
    const accNote = metrics.procAcc < CRITERION
      ? '<span class="ng">処理課題の正答率が80%未満です。再試行やデータ解釈に注意してください。</span>'
      : '<span class="ok">処理課題の正答率が基準（80%）以上でした。</span>';

    el('summary').classList.remove('hidden');
    el('sumText').innerHTML = `
      <div class="big">結果（${S.participantName} / ID: <b>${S.pid}</b>）</div>
      <ul>
        <li>処理課題 正答率：<b>${(metrics.procAcc * 100).toFixed(1)}%</b>（${metrics.judgedCount} 試行）</li>
        <li>Partial-credit unit（セット平均）：<b>${metrics.pcMean.toFixed(3)}</b>（${metrics.recallCount} セット）</li>
        <li>Partial-credit load（総正答文字数）：<b>${metrics.pcLoad}</b> / ${metrics.totalItems}（${(metrics.pcLoadProp * 100).toFixed(1)}%）</li>
        <li>Absolute（完全正答セット数）：<b>${metrics.absSum}</b> / ${metrics.recallCount} ｜ スパン上限：<b>${metrics.maxSpan}</b> ｜ 完全正答文字：<b>${metrics.absItemSum}</b></li>
        <li>個別締切（平均+2.5SD）：<b>${S.deadlineMs}ms</b></li>
      </ul>
      <div>${accNote}</div>
      <div class="muted">Partial-credit unit＝各セット正答率平均（Conway+2005）。Partial-credit load＝総正答文字数／全提示文字数（Unsworth+2005）。Absolute＝完全正答セット数と最大セット長。</div>
    `;
    if (!S.autoExported) {
      const success = exportAll();
      if (success) S.autoExported = true;
    }
  }

  function computePracticeStats() {
    const rts = Array.isArray(S.practiceRTs) ? S.practiceRTs : [];
    if (!rts.length) return { mean: '', sd: '', n: 0 };
    const mean = rts.reduce((acc, v) => acc + v, 0) / rts.length;
    const variance = rts.reduce((acc, v) => acc + (v - mean) ** 2, 0) / rts.length;
    const sd = Math.sqrt(variance);
    return { mean: Math.round(mean), sd: Math.round(sd), n: rts.length };
  }

  function computeRecallAggregates() {
    const recallRows = S.log.filter((row) => row.phase === 'recall');
    const bySize = {};
    let loadSum = 0;
    let totalItems = 0;
    let partialSum = 0;
    let absSetCount = 0;
    let absItemSum = 0;
    let maxSpan = 0;
    for (const row of recallRows) {
      const size = Number(row.set_size || 0);
      const partial = Number(row.recall_partial || 0);
      const abs = Number(row.recall_absolute || 0);
      totalItems += size;
      loadSum += partial * size;
      partialSum += partial;
      if (abs === 1) {
        absSetCount += 1;
        absItemSum += size;
        if (size > maxSpan) maxSpan = size;
      }
      if (!size) continue;
      if (!bySize[size]) bySize[size] = { n: 0, partialSum: 0, absCount: 0 };
      bySize[size].n += 1;
      bySize[size].partialSum += partial;
      bySize[size].absCount += abs;
    }
    return {
      bySize,
      loadSum,
      totalItems,
      partialSum,
      absSetCount,
      absItemSum,
      maxSpan,
      recallRows,
      recallCount: recallRows.length
    };
  }

  function exportAll() {
    if (typeof XLSX === 'undefined') {
      alert('Excel出力用のXLSXライブラリが読み込まれていません。');
      return false;
    }
    const metrics = S.latestSummary || computeSummaryMetrics();
    const practiceStats = computePracticeStats();
    const recallAgg = computeRecallAggregates();
    const rows = S.log.filter((row) => row.phase !== 'summary');

    const trialData = [CSV_HEADERS, ...rows.map((row) => CSV_HEADERS.map((field) => row[field] ?? ''))];
    const wsTrials = XLSX.utils.aoa_to_sheet(trialData);

    const summaryRows = [
      ['participant_name', S.participantName],
      ['pid', S.pid],
      ['processing_accuracy', metrics.procAcc],
      ['processing_accuracy_percent', (metrics.procAcc * 100).toFixed(1)],
      ['judged_trials', metrics.judgedCount],
      ['partial_credit_unit_mean', metrics.pcMean],
      ['partial_credit_load_total_correct', metrics.pcLoad],
      ['partial_credit_load_proportion', metrics.pcLoadProp],
      ['absolute_set_count', metrics.absSum],
      ['absolute_item_total', metrics.absItemSum],
      ['max_span_perfect', metrics.maxSpan],
      ['recall_sets', metrics.recallCount],
      ['total_presented_letters', metrics.totalItems],
      ['deadline_ms', S.deadlineMs],
      ['practice_rt_mean_ms', practiceStats.mean],
      ['practice_rt_sd_ms', practiceStats.sd],
      ['practice_trials', practiceStats.n],
      ['partial_credit_mean_legacy', metrics.pcMean],
      ['absolute_total_legacy', metrics.absSum],
      ['load_based_total_legacy', metrics.pcLoad],
      ['max_span_legacy', metrics.maxSpan],
      ['exported_at', new Date().toISOString()]
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet([['metric', 'value'], ...summaryRows]);

    const setStatsHeader = ['set_size', 'n_sets', 'partial_mean', 'absolute_count'];
    const setStatsRows = Object.keys(recallAgg.bySize)
      .map((k) => Number(k))
      .sort((a, b) => a - b)
      .map((size) => {
        const info = recallAgg.bySize[size];
        const partialMean = info.n ? info.partialSum / info.n : 0;
        return [size, info.n, partialMean, info.absCount];
      });
    const wsSetStats = XLSX.utils.aoa_to_sheet([setStatsHeader, ...setStatsRows]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsTrials, 'trial_log');
    XLSX.utils.book_append_sheet(wb, wsSummary, 'summary');
    XLSX.utils.book_append_sheet(wb, wsSetStats, 'set_stats');

    const clean = (str, fallback) => {
      const s = (str || '').trim();
      if (!s) return fallback;
      return s.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '');
    };
    const nowDt = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = `${nowDt.getFullYear()}${pad(nowDt.getMonth() + 1)}${pad(nowDt.getDate())}-${pad(nowDt.getHours())}${pad(nowDt.getMinutes())}${pad(nowDt.getSeconds())}`;
    const filename = `ReadingSpan_${clean(S.participantName, 'Unknown')}_${clean(S.pid, 'ID')}_${stamp}.xlsx`;
    XLSX.writeFile(wb, filename);
    return true;
  }

  el('btnContinue').onclick = () => {
    const name = el('pname').value.trim();
    const pid = el('pid').value.trim();
    if (!name || !pid) {
      alert('氏名と参加者IDを入力してください。');
      return;
    }
    S.participantName = name;
    S.pid = pid;
    resetForNewParticipant();
    enableUnloadWarning();
    el('welcome').classList.add('hidden');
    el('instructions').classList.remove('hidden');
  };

  el('btnPractice').onclick = async () => {
    if (S.practiceStage === 0) {
      await runPracticeStage1();
    } else {
      const confirmed = window.confirm('練習を最初からやり直しますか？締切の計算も再実施されます。');
      if (!confirmed) return;
      resetPracticeProgress({ resetLogs: false });
    }
  };

  el('btnPracticePhase2').onclick = async () => {
    await runPracticeStage2();
  };

  updatePracticeButtons();

  el('btnStart').onclick = () => {
    runMain();
  };

  el('btnExport2').onclick = () => {
    exportAll();
  };

  document.addEventListener('keydown', (event) => {
    const key = event.key || '';
    if (key !== ' ' && key !== 'Spacebar') return;
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
    if (isVisible('task') || isVisible('recall')) return;
    event.preventDefault();
    if (isVisible('welcome')) {
      const btn = el('btnContinue');
      if (btn && !btn.disabled) btn.click();
      return;
    }
    if (isVisible('instructions')) {
      const candidates = [el('btnStart'), el('btnPracticePhase2'), el('btnPractice')];
      for (const btn of candidates) {
        if (btn && !btn.disabled && !btn.classList.contains('hidden')) {
          btn.click();
          return;
        }
      }
    }
    if (isVisible('summary')) {
      const btn = el('btnExport2');
      if (btn && !btn.disabled) btn.click();
    }
  });
})();
