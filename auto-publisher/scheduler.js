#!/usr/bin/env node
/**
 * SwissWayExplorer Auto-Publisher Scheduler
 * 
 * Her 3 saatte bir (09:00, 12:00, 15:00, 18:00, 21:00 TR)
 * içerik üretimini tetikler
 * 
 * CRON: 0 9,12,15,18,21 * * * (her 3 saatte bir, TR timezone)
 */

const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

const TASK_QUEUE_FILE = path.join(__dirname, 'task-queue.json');
const PUBLISH_LOG_FILE = path.join(__dirname, 'publish-log.json');
const DRAFTS_INDEX_FILE = path.join(__dirname, 'yesterday-drafts.json');

const TR_TIMEZONE = 'Europe/Istanbul';
const SLOTS = [
  { time: '09:00', slot: 1, priority: 'D01-D04 (Geneva/Zurich/Basel/Lugano)' },
  { time: '12:00', slot: 2, priority: 'G01-G03 (7-day, Best Time, Budget)' },
  { time: '15:00', slot: 3, priority: 'G04-G07 (Spring vs Summer, Transport)' },
  { time: '18:00', slot: 4, priority: 'G08-G09 (yeni guide lar)' },
  { time: '21:00', slot: 5, priority: 'Seasonal veya eksik destination' },
];

// Simple date helper for TR timezone
function getTRDate() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: TR_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  return formatter.format(now);
}

function getTRHour() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: TR_TIMEZONE,
    hour: '2-digit',
    hour12: false,
  });
  return parseInt(formatter.format(now));
}

async function loadTaskQueue() {
  try {
    const data = await fs.readFile(TASK_QUEUE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { date: null, tasks: [], keywords: null };
  }
}

async function saveTaskQueue(queue) {
  await fs.writeFile(TASK_QUEUE_FILE, JSON.stringify(queue, null, 2));
}

async function loadPublishLog() {
  try {
    const data = await fs.readFile(PUBLISH_LOG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function savePublishLog(log) {
  await fs.writeFile(PUBLISH_LOG_FILE, JSON.stringify(log, null, 2));
}

async function loadDraftsIndex() {
  try {
    const data = await fs.readFile(DRAFTS_INDEX_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveDraftsIndex(index) {
  await fs.writeFile(DRAFTS_INDEX_FILE, JSON.stringify(index, null, 2));
}

async function askKeywords(trDate) {
  console.log(`\n[${trDate}] KEYWORD SORUSU`);
  console.log('========================================');
  console.log('Bugün için arama kelimelerini yapıştırın.');
  console.log('Yoksa "atla" yazın, sistem Google dan araştıracak.\n');
  
  const message = `*SwissWayExplorer — Günlük Kelime İsteği*\n\n📅 ${trDate}\n\nBugün için arama kelimeleri:\n(Semrush ta arama yapın, sonuçları buraya yapıştırın)\n\n_yazınca "atla" derseniz sistem otomatik araştırma yapar_`;
  
  // Canopy üzerinden gönder
  return sendCanopyMessage('swisswayexplorer', message);
}

async function sendCanopyMessage(channel, message) {
  // Terminal üzerinden canopy-send kullan
  const { execSync } = require('child_process');
  try {
    const cmd = `canopy-send ${channel} "${message.replace(/"/g, '\\"')}"`;
    execSync(cmd, { encoding: 'utf-8' });
    return true;
  } catch (e) {
    console.error('Canopy mesajı gönderilemedi:', e.message);
    return false;
  }
}

async function notifyReady(slot, topic, draftId) {
  console.log(`\n[READY] Slot ${slot}: ${topic}`);
  
  const message = `✅ *İçerik Hazır — Slot ${slot}*\n\n📌 *${topic}*\n\n📋 Draft ID: \`${draftId}\`\n🔍 Sanity Studio: https://sanity.io/manage\n\n_Yayınlamak için "onay" yazın_\n_Revize için "revize [ne değişeceğini]" yazın_`;
  
  return sendCanopyMessage('swisswayexplorer', message);
}

async function processSlot(slotInfo, keywords, draftsIndex) {
  const { slot, priority } = slotInfo;
  
  console.log(`\n[${getTRDate()}] Processing Slot ${slot}...`);
  console.log(`Priority: ${priority}`);
  console.log(`Keywords: ${keywords || '(otomatik araştırma)'}`);
  
  // Producer ı çağır
  const producer = require('./producer');
  
  try {
    const result = await producer.generateContent({
      slot,
      priority,
      keywords,
      excludeDrafts: draftsIndex,
    });
    
    if (result.success) {
      await notifyReady(slot, result.topic, result.draftId);
      return { success: true, draftId: result.draftId, topic: result.topic };
    } else {
      console.error(`Slot ${slot} failed:`, result.error);
      return { success: false, error: result.error };
    }
  } catch (e) {
    console.error(`Slot ${slot} exception:`, e.message);
    return { success: false, error: e.message };
  }
}

async function initializeDay() {
  const trDate = getTRDate().split(',')[0]; // sadece tarih
  
  let queue = await loadTaskQueue();
  
  // Eğer bugün için zaten initialized ise, devam et
  if (queue.date === trDate) {
    console.log('Bugün zaten initialize edilmiş, devam ediliyor...');
    return queue;
  }
  
  console.log(`\n[YENİ GÜN] ${trDate}`);
  
  // Eski draft ları yesterday e taşı
  if (queue.tasks && queue.tasks.length > 0) {
    const draftsIndex = queue.tasks
      .filter(t => t.status === 'PUBLISHED' && t.draftId)
      .map(t => t.draftId);
    await saveDraftsIndex(draftsIndex);
  }
  
  // Yeni gün için initialize et
  queue = {
    date: trDate,
    initializedAt: new Date().toISOString(),
    tasks: SLOTS.map(s => ({
      slot: s.slot,
      time: s.time,
      priority: s.priority,
      status: 'PENDING',
      topic: null,
      draftId: null,
      keywords: null,
      result: null,
    })),
    keywords: null,
  };
  
  await saveTaskQueue(queue);
  
  // Kullanıcıdan kelime iste
  await askKeywords(trDate);
  
  return queue;
}

async function runScheduler() {
  console.log('===========================================');
  console.log('SwissWayExplorer Auto-Publisher Scheduler');
  console.log(`Started: ${getTRDate()}`);
  console.log('===========================================');
  
  // Her saat başı kontrol et
  const schedule = '0 * * * *'; // her saat başı
  
  cron.schedule(schedule, async () => {
    const hour = getTRHour();
    
    // 06:30 — Gün başlatma + kelime isteme
    if (hour === 6) {
      await initializeDay();
      return;
    }
    
    // 09, 12, 15, 18, 21 — İçerik üretimi
    if ([9, 12, 15, 18, 21].includes(hour)) {
      const queue = await loadTaskQueue();
      const slot = hour === 9 ? 1 : hour === 12 ? 2 : hour === 15 ? 3 : hour === 18 ? 4 : 5;
      
      const task = queue.tasks.find(t => t.slot === slot);
      if (task && task.status === 'PENDING') {
        task.status = 'IN_PROGRESS';
        await saveTaskQueue(queue);
        
        const draftsIndex = await loadDraftsIndex();
        const result = await processSlot(
          SLOTS.find(s => s.slot === slot),
          queue.keywords,
          draftsIndex
        );
        
        task.status = result.success ? 'READY_FOR_REVIEW' : 'FAILED';
        task.result = result;
        await saveTaskQueue(queue);
      }
    }
    
    // 21:30 — Günlük rapor
    if (hour === 21) {
      await sendDailyReport();
    }
  }, {
    timezone: TR_TIMEZONE,
  });
  
  console.log(`\nScheduler running...`);
  console.log(`Next slots: 09:00, 12:00, 15:00, 18:00, 21:00 (TR)`);
  console.log(`\nPress Ctrl+C to stop\n`);
}

async function sendDailyReport() {
  const queue = await loadTaskQueue();
  const trDate = getTRDate();
  
  const published = queue.tasks.filter(t => t.status === 'PUBLISHED').length;
  const ready = queue.tasks.filter(t => t.status === 'READY_FOR_REVIEW').length;
  const failed = queue.tasks.filter(t => t.status === 'FAILED').length;
  const pending = queue.tasks.filter(t => t.status === 'PENDING').length;
  
  let report = `📊 *Günlük Rapor — ${trDate}*\n\n`;
  report += `✅ Yayımlandı: ${published}/5\n`;
  report += `👀 Onay Bekliyor: ${ready}/5\n`;
  report += `❌ Başarısız: ${failed}/5\n`;
  report += `⏳ Bekliyor: ${pending}/5\n\n`;
  
  if (ready > 0) {
    report += `*Onay Bekleyenler:*\n`;
    queue.tasks
      .filter(t => t.status === 'READY_FOR_REVIEW')
      .forEach(t => {
        report += `• Slot ${t.slot} (${t.time}): ${t.topic || t.priority}\n`;
      });
  }
  
  report += `\n_22:00 da kapanır, kalanlar iptal_`;
  
  await sendCanopyMessage('swisswayexplorer', report);
  
  // Log a
  const log = await loadPublishLog();
  log.push({
    date: trDate,
    published,
    ready,
    failed,
    pending,
    tasks: queue.tasks,
  });
  await savePublishLog(log);
}

// CLI handlers
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--now')) {
    // Hemen çalıştır (test için)
    (async () => {
      const queue = await initializeDay();
      console.log('Queue:', JSON.stringify(queue, null, 2));
    })();
  } else if (args.includes('--report')) {
    // Rapor göster
    (async () => {
      const log = await loadPublishLog();
      const queue = await loadTaskQueue();
      console.log('=== Günlük Rapor ===');
      console.log(JSON.stringify(queue, null, 2));
      console.log('\n=== Son Yayınlar ===');
      console.log(JSON.stringify(log.slice(-5), null, 2));
    })();
  } else if (args.includes('--slot')) {
    // Belirli slot u çalıştır
    const slotNum = parseInt(args[args.indexOf('--slot') + 1]) || 1;
    (async () => {
      const queue = await loadTaskQueue();
      const draftsIndex = await loadDraftsIndex();
      await processSlot(
        SLOTS.find(s => s.slot === slotNum),
        queue.keywords,
        draftsIndex
      );
    })();
  } else {
    // Scheduler ı başlat
    runScheduler();
  }
}

module.exports = { runScheduler, processSlot, initializeDay };
