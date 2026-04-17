#!/usr/bin/env node
/**
 * SwissWayExplorer Auto-Publisher User Handler
 * 
 * Kullanıcıdan gelen mesajları işler:
 * - Kelime gönderimi
 * - Onay / Revizyon isteği
 * - Slot iptali
 */

const fs = require('fs').promises;
const path = require('path');

const TASK_QUEUE_FILE = path.join(__dirname, 'task-queue.json');
const PUBLISH_LOG_FILE = path.join(__dirname, 'publish-log.json');

const TR_TIMEZONE = 'Europe/Istanbul';

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

async function loadTaskQueue() {
  try {
    const data = await fs.readFile(TASK_QUEUE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { date: null, tasks: [] };
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

function sendCanopyMessage(channel, message) {
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

async function handleKeywordInput(message) {
  // Kullanıcı kelime gönderdi
  const queue = await loadTaskQueue();
  
  // Kelimeleri kaydet
  queue.keywords = message;
  
  // Task ları işaretle
  queue.tasks.forEach(t => {
    if (t.status === 'PENDING') {
      t.keywords = message;
    }
  });
  
  await saveTaskQueue(queue);
  
  console.log(`[KEYWORDS] Kaydedildi: ${message.substring(0, 50)}...`);
  
  return `✅ Kelimeler kaydedildi.\n\nBugün şu slotlarda içerik üretilecek:\n${queue.tasks.map(t => `• ${t.time} — ${t.priority}`).join('\n')}`;
}

async function handleApproval(slot) {
  // Kullanıcı onayladı → publish et
  const queue = await loadTaskQueue();
  const task = queue.tasks.find(t => t.slot === slot);
  
  if (!task) {
    return `❌ Slot ${slot} bulunamadı.`;
  }
  
  if (task.status !== 'READY_FOR_REVIEW') {
    return `⏳ Slot ${slot} henüz hazır değil. Mevcut durum: ${task.status}`;
  }
  
  if (!task.draftId) {
    return `❌ Slot ${slot} için draft ID yok.`;
  }
  
  // Publish et
  const producer = require('./producer');
  try {
    await producer.publishDraft(task.draftId);
    
    task.status = 'PUBLISHED';
    task.publishedAt = new Date().toISOString();
    await saveTaskQueue(queue);
    
    return `✅ *Slot ${slot} yayımlandı!*\n\n📌 ${task.topic}\n🔗 https://swisswayexplorer.com`;
  } catch (e) {
    return `❌ Publish hatası: ${e.message}`;
  }
}

async function handleRevision(slot, revisionText) {
  // Kullanıcı revizyon istedi
  const queue = await loadTaskQueue();
  const task = queue.tasks.find(t => t.slot === slot);
  
  if (!task) {
    return `❌ Slot ${slot} bulunamadı.`;
  }
  
  if (task.status !== 'READY_FOR_REVIEW') {
    return `⏳ Slot ${slot} hazır değil.`;
  }
  
  // Task ı revizyon moduna al
  task.status = 'REVISION_REQUESTED';
  task.revisionNote = revisionText;
  await saveTaskQueue(queue);
  
  console.log(`[REVISION] Slot ${slot} revizyon istendi: ${revisionText}`);
  
  return `✅ Revizyon notu kaydedildi.\n\n📝 "${revisionText}"\n\nSlot ${slot} tekrar üretilecek.`;
}

async function handleSkip(slot) {
  // Slot u atla
  const queue = await loadTaskQueue();
  const task = queue.tasks.find(t => t.slot === slot);
  
  if (!task) {
    return `❌ Slot ${slot} bulunamadı.`;
  }
  
  task.status = 'SKIPPED';
  task.skippedAt = new Date().toISOString();
  await saveTaskQueue(queue);
  
  return `⏭️ Slot ${slot} atlandı.`;
}

async function handleStatus() {
  // Mevcut durumu göster
  const queue = await loadTaskQueue();
  
  let msg = `📊 *Mevcut Durum — ${getTRDate()}*\n\n`;
  
  for (const task of queue.tasks) {
    const emoji = {
      'PENDING': '⏳',
      'IN_PROGRESS': '🔄',
      'READY_FOR_REVIEW': '👀',
      'APPROVED': '✅',
      'PUBLISHED': '🎉',
      'FAILED': '❌',
      'SKIPPED': '⏭️',
      'REVISION_REQUESTED': '🔁',
    }[task.status] || '❓';
    
    msg += `${emoji} Slot ${task.slot} (${task.time})\n`;
    msg += `   ${task.topic || task.priority}\n`;
    msg += `   Durum: ${task.status}\n\n`;
  }
  
  return msg;
}

async function handleList() {
  // Konu listesini göster
  const queue = await loadTaskQueue();
  
  let msg = `📋 *Bugünkü Konular*\n\n`;
  
  queue.tasks.forEach(t => {
    msg += `*Slot ${t.slot} (${t.time})*\n`;
    msg += `${t.topic || t.priority}\n`;
    if (t.keywords) {
      msg += `🔑 Kelimeler: ${t.keywords.substring(0, 50)}...\n`;
    }
    msg += '\n';
  });
  
  return msg;
}

// Ana handler — mesajı parse et ve uygun fonksiyonu çağır
async function handleMessage(message) {
  const msg = message.trim().toLowerCase();
  
  // Kelime gönderimi — uzun bir string (Semrush çıktısı gibi)
  if (msg.length > 20 && !msg.startsWith('onay') && !msg.startsWith('revize') && !msg.startsWith('atla') && !msg.startsWith('durum') && !msg.startsWith('liste')) {
    return await handleKeywordInput(message);
  }
  
  // Onay
  const onayMatch = msg.match(/^onay\s*(\d+)?/);
  if (onayMatch) {
    const slot = onayMatch[1] ? parseInt(onayMatch[1]) : null;
    
    if (!slot) {
      // Hangi slot onaylanacak? İlk READY_FOR_REVIEW olanı bul
      const queue = await loadTaskQueue();
      const ready = queue.tasks.find(t => t.status === 'READY_FOR_REVIEW');
      if (ready) {
        return await handleApproval(ready.slot);
      }
      return '👀 Onay bekleyen slot yok.';
    }
    
    return await handleApproval(slot);
  }
  
  // Revizyon
  const revizeMatch = msg.match(/^revize\s*(\d+)?\s*(.+)?/);
  if (revizeMatch) {
    const slot = revizeMatch[1] ? parseInt(revizeMatch[1]) : null;
    const note = revizeMatch[2] || 'Genel revizyon';
    
    if (!slot) {
      const queue = await loadTaskQueue();
      const ready = queue.tasks.find(t => t.status === 'READY_FOR_REVIEW');
      if (ready) {
        return await handleRevision(ready.slot, note);
      }
      return '👀 Revizyon istenebilecek slot yok.';
    }
    
    return await handleRevision(slot, note);
  }
  
  // Atla
  const atlaMatch = msg.match(/^atla\s*(\d+)?/);
  if (atlaMatch) {
    const slot = atlaMatch[1] ? parseInt(atlaMatch[1]) : null;
    
    if (!slot) {
      return '⚠️ Slot numarası belirtin: "atla 3"';
    }
    
    return await handleSkip(slot);
  }
  
  // Durum
  if (msg.startsWith('durum')) {
    return await handleStatus();
  }
  
  // Liste
  if (msg.startsWith('liste')) {
    return await handleList();
  }
  
  return `❓ Anlamadım. Komutlar:\n\n` +
    `• Kelime yapıştır → Bugün için kelime kaydet\n` +
    `• onay [slot] → Yayımla\n` +
    `• revize [slot] [not] → Revizyon iste\n` +
    `• atla [slot] → Slot u atla\n` +
    `• durum → Mevcut durumu göster\n` +
    `• liste → Bugünkü konuları listele`;
}

// CLI test
if (require.main === module) {
  const args = process.argv.slice(2);
  const message = args.join(' ');
  
  if (message) {
    (async () => {
      const result = await handleMessage(message);
      console.log(result);
    })();
  } else {
    console.log('Kullanım: node user-handler.js "onay 1"');
    console.log('         node user-handler.js "revize 2 parazit sorunu var"');
    console.log('         node user-handler.js "kelimeler buraya yapistir..."');
  }
}

module.exports = { handleMessage, handleApproval, handleRevision, handleSkip, handleStatus };
