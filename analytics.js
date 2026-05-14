// =====================================================
//  ANALYTICS TRACKER
//  On tracked pages:
//    <script type="module">
//      import { trackVisit } from './analytics.js';
//      trackVisit();
//    </script>
//
//  On analytics.html:
//    <script type="module">
//      import { renderDashboard, clearData } from './analytics.js';
//      renderDashboard();
//      window.clearData = clearData;
//    </script>
// =====================================================

const STORAGE_KEY = 'site_analytics';

export async function trackVisit() {
  let country = 'Unknown';
  let city = 'Unknown';
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    country = data.country_name || 'Unknown';
    city = data.city || 'Unknown';
  } catch (e) {
    // offline or CORS on localhost, skip
  }

  const visit = {
    id: crypto.randomUUID(),
    time: new Date().toISOString(),
    country,
    city,
    device: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    screen: `${screen.width}x${screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || 'Direct',
    page: window.location.pathname,
  };

  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  existing.unshift(visit);
  if (existing.length > 200) existing.splice(200);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  return visit;
}

export function renderDashboard() {
  const visits = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  document.getElementById('total-visits').textContent = visits.length;
  const uniqueDevices = new Set(visits.map(v => `${v.screen}-${v.os}`)).size;
  document.getElementById('unique-devices').textContent = uniqueDevices;
  const countries = new Set(visits.map(v => v.country).filter(c => c !== 'Unknown'));
  document.getElementById('total-countries').textContent = countries.size;

  renderBars('country-bars', countBy(visits, 'country'), '#c8f45a');
  renderBars('device-bars', countBy(visits, 'device'), '#5af4a0');
  renderBars('browser-bars', countBy(visits, 'browser'), '#5ab4f4');

  const list = document.getElementById('visitor-list');
  if (visits.length === 0) {
    list.innerHTML = '<div class="empty">No visits recorded yet.</div>';
    return;
  }
  list.innerHTML = visits.slice(0, 50).map(v => `
    <div class="visitor-row">
      <div class="v-item"><span class="k">Time: </span><span class="v">${formatTime(v.time)}</span></div>
      <div class="v-item"><span class="k">Country: </span><span class="v">${v.country}</span></div>
      <div class="v-item"><span class="k">Device: </span><span class="v">${v.device}</span></div>
      <div class="v-item"><span class="k">Browser: </span><span class="v">${v.browser}</span></div>
      <div class="v-item"><span class="k">OS: </span><span class="v">${v.os}</span></div>
      <div class="v-item"><span class="k">Screen: </span><span class="v">${v.screen}</span></div>
      <div class="v-item full"><span class="k">Timezone: </span><span class="v">${v.timezone}</span></div>
      <div class="v-item full"><span class="k">Referrer: </span><span class="v">${v.referrer}</span></div>
    </div>
  `).join('');
}

export function clearData() {
  if (confirm('Clear all analytics data?')) {
    localStorage.removeItem(STORAGE_KEY);
    renderDashboard();
  }
}

function renderBars(containerId, counts, color) {
  const container = document.getElementById(containerId);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = sorted[0]?.[1] || 1;
  if (sorted.length === 0) {
    container.innerHTML = '<div class="empty" style="padding:0.5rem">No data yet</div>';
    return;
  }
  container.innerHTML = sorted.map(([label, count]) => `
    <div class="bar-row">
      <div class="bar-label">${label}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${(count/max)*100}%; background:${color}"></div>
      </div>
      <div class="bar-count">${count}</div>
    </div>
  `).join('');
}

function countBy(arr, key) {
  return arr.reduce((acc, item) => {
    const val = item[key] || 'Unknown';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  return 'Other';
}

function getOS() {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Other';
}