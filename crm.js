const initialClientes = [
    { name: "Unilever Andina Colombia", group: "Unilever", orders: 130, volume: 394220, recency: 0, score: 10.0, segment: "Fiel" },
    { name: "Quala S.A.", group: "Quala", orders: 81, volume: 160853, recency: 0, score: 10.0, segment: "Fiel" },
    { name: "Nestlé de Colombia", group: "Nestlé", orders: 33, volume: 137889, recency: 5, score: 10.0, segment: "Fiel" },
    { name: "UL Costa Rica SCC", group: "Unilever", orders: 48, volume: 138440, recency: 12, score: 9.4, segment: "Fiel" },
    { name: "Colombina S.A.", group: "Colombina", orders: 34, volume: 23578, recency: 2, score: 9.2, segment: "Fiel" },
    { name: "Induhuila S.A.", group: "Induhuila", orders: 6, volume: 15000, recency: 7, score: 8.6, segment: "Fiel" },
    { name: "Colgate-Palmolive", group: "Colgate-Palmolive", orders: 7, volume: 6880, recency: 11, score: 8.4, segment: "Fiel" },
    { name: "Reckitt Benckiser", group: "Reckitt", orders: 8, volume: 11000, recency: 14, score: 8.0, segment: "Fiel" },
    { name: "Unilever Andina Ecuador", group: "Unilever", orders: 16, volume: 31760, recency: 38, score: 7.6, segment: "Leal" },
    { name: "Solla S.A.", group: "Solla", orders: 4, volume: 20000, recency: 18, score: 7.4, segment: "Leal" },
    { name: "Nestlé México", group: "Nestlé", orders: 2, volume: 6000, recency: 24, score: 6.6, segment: "Leal" },
    { name: "Riopaila Castilla S.A.", group: "Riopaila", orders: 2, volume: 41000, recency: 35, score: 6.4, segment: "Leal" },
    { name: "Levapan S.A.", group: "Levapan", orders: 4, volume: 9100, recency: 19, score: 6.0, segment: "Leal" },
    { name: "Nutrimenti de Colombia", group: "Nutrimenti", orders: 4, volume: 9100, recency: 37, score: 6.0, segment: "Leal" },
    { name: "Quala Dominicana", group: "Quala", orders: 4, volume: 3800, recency: 32, score: 5.8, segment: "Reconexión" },
    { name: "Panamericana Alimentos", group: "Panamericana", orders: 3, volume: 4000, recency: 19, score: 5.8, segment: "Reconexión" },
    { name: "Federación Cafeteros Colombia", group: "Cafeteros", orders: 2, volume: 3353, recency: 24, score: 5.8, segment: "Reconexión" },
    { name: "Impresos CI S.A.S.", group: "Impresos", orders: 2, volume: 10000, recency: 46, score: 5.6, segment: "Reconexión" },
    { name: "Peruplast S.A.", group: "AF AFLA", orders: 1, volume: 5000, recency: 31, score: 4.8, segment: "Reconexión" },
    { name: "Procter and Gamble Colombia", group: "P&G", orders: 1, volume: 3000, recency: 27, score: 4.6, segment: "Reconexión" },
    { name: "Centurion Foods S.A.S", group: "Centurion", orders: 1, volume: 14867, recency: 100, score: 4.4, segment: "Reconexión" },
    { name: "Tecnoquímicas S.A.", group: "TQ", orders: 2, volume: 631, recency: 38, score: 4.4, segment: "Reconexión" },
    { name: "Federal S.A.S.", group: "Federal", orders: 1, volume: 900, recency: 25, score: 3.2, segment: "Pérdida" },
    { name: "Uniphos Colombia", group: "Uniphos", orders: 1, volume: 869, recency: 38, score: 3.2, segment: "Pérdida" },
    { name: "Kern S Y CIA", group: "Kern", orders: 1, volume: 2467, recency: 48, score: 2.8, segment: "Pérdida" },
    { name: "Cooperativa Colanta", group: "Colanta", orders: 1, volume: 4000, recency: 69, score: 2.8, segment: "Pérdida" },
    { name: "C.I Upfield Colombia", group: "Upfield", orders: 2, volume: 2200, recency: 72, score: 2.6, segment: "Pérdida" },
    { name: "J G B S.A.", group: "JGB", orders: 1, volume: 1450, recency: 33, score: 2.6, segment: "Pérdida" },
    { name: "Tecnofar TQ S.A.S.", group: "TQ", orders: 1, volume: 800, recency: 40, score: 2.6, segment: "Pérdida" }
];

let state = {
    clientes: [],
    history: [],
    volumenChart: null,
    isInit: false
};

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTLBXrqiOxc0rdGjaatpEAeL0-irMHIlLg9JThPA-NAaQoFO400Cfw_AVNaFk7WRpL6q-osFqOziGRq/pub?output=csv';

// Initialize State
async function init() {
    let clientMap = new Map();
    // 1. Cargar la data original como base
    initialClientes.forEach(c => clientMap.set(c.name.toLowerCase().trim(), { ...c }));

    // 2. Traer CSV de Google Sheets en tiempo real
    try {
        let response = await fetch(CSV_URL);
        let csvText = await response.text();
        let rows = csvText.split('\n').map(r => r.trim()).filter(r => r);
        let headers = rows[0].split(',');
        
        let c_idx = headers.indexOf('empresa');
        let m_idx = headers.indexOf('correo');
        
        for(let i=1; i<rows.length; i++) {
            let cols = rows[i].split(',');
            if (cols.length < 2) continue;
            let company = cols[c_idx] ? cols[c_idx].trim() : 'Lead Web Anonimo';
            let email = cols[m_idx] ? cols[m_idx].trim() : '';
            let key = company.toLowerCase();
            
            if (clientMap.has(key)) {
                // Actualizar correo del cliente existente
                clientMap.get(key).realEmail = email; 
            } else {
                // Crear un cliente Nuevo desde el Lead de HubSpot
                clientMap.set(key, {
                    name: company,
                    group: 'Lead Web',
                    orders: 0,
                    volume: 0,
                    recency: 0,
                    score: 0.0,
                    segment: 'Nuevo',
                    realEmail: email
                });
            }
        }
    } catch(err) {
        console.error("Error cargando Google Sheets:", err);
    }

    let rank = 1;
    state.clientes = Array.from(clientMap.values()).map(c => {
        let interval = c.orders > 1 ? Math.floor(c.recency + 2 + Math.random() * 20) : 30; // Fake interval logic
        let daysUntil = interval - c.recency;
        
        let nextContactDate = new Date();
        nextContactDate.setDate(nextContactDate.getDate() + daysUntil);

        return {
            ...c,
            id: 'CLI-' + Math.floor(Math.random()*100000),
            rank: rank++,
            interval: interval,
            daysUntilContact: daysUntil,
            nextContactDate: nextContactDate,
            deliveredVol: Math.floor(c.volume * (0.95 + Math.random() * 0.05)),
            email: c.realEmail || (c.name.toLowerCase().replace(/[^a-z]/g, '') + '@ejemplo.com'),
            lastTrigger: null 
        }
    });

    calculateGlobalQuantiles();
    renderAll();
    initChart();
    state.isInit = true;
}

function calculateGlobalQuantiles() {
    // Calculamos R, F, M por deciles estáticos
    let sortedR = [...state.clientes].sort((a,b) => a.recency - b.recency); // menor recencia = mejor R
    let sortedF = [...state.clientes].sort((a,b) => b.orders - a.orders); // más ordenes = mejor F
    let sortedM = [...state.clientes].sort((a,b) => b.volume - a.volume); // más vol = mejor M

    state.clientes.forEach(c => {
        c.r_score = 10 - Math.floor((sortedR.indexOf(c) / sortedR.length) * 10);
        if (c.r_score < 1) c.r_score = 1;
        
        c.f_score = 10 - Math.floor((sortedF.indexOf(c) / sortedF.length) * 10);
        if (c.f_score < 1) c.f_score = 1;
        
        c.m_score = 10 - Math.floor((sortedM.indexOf(c) / sortedM.length) * 10);
        if (c.m_score < 1) c.m_score = 1;

        // Si es nuevo su score R,F,M  y Score total es 0
        if (c.segment === 'Nuevo') {
            c.r_score = 0; c.f_score = 0; c.m_score = 0; c.score = 0.0;
        }
    });
}

function formatNumber(num) { return new Intl.NumberFormat('es-CO').format(num); }
function formatDate(dateObj) { return dateObj.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }); }
function getBadgeClass(segment) { return 'badge-' + segment.toLowerCase().replace('é', 'e').replace('ó', 'o'); }
function getProgressClass(segment) { return 'progress-' + segment.toLowerCase().replace('é', 'e').replace('ó', 'o'); }

// --- RENDERING VIEWS ---

function renderAll() {
    renderDashboard();
    renderClientes();
    renderRFM();
    renderKPIs();
    renderTriggers();
}

function renderDashboard() {
    let totalClientes = state.clientes.length;
    let totalPedidos = state.clientes.reduce((acc, c) => acc + c.orders, 0);
    let totalVolumen = state.clientes.reduce((acc, c) => acc + c.volume, 0);
    let totalDelivered = state.clientes.reduce((acc, c) => acc + c.deliveredVol, 0);
    let percEntrega = totalVolumen > 0 ? ((totalDelivered / totalVolumen) * 100).toFixed(1) : 0;

    document.getElementById('dash-kpi-clientes').textContent = formatNumber(totalClientes);
    document.getElementById('dash-kpi-pedidos').textContent = formatNumber(totalPedidos);
    document.getElementById('dash-kpi-volumen').textContent = formatNumber(totalVolumen);
    document.getElementById('dash-kpi-entrega').textContent = percEntrega + '%';

    let counts = { Fiel: 0, Leal: 0, Reconexión: 0, Pérdida: 0 };
    state.clientes.forEach(c => { if(counts[c.segment] !== undefined) counts[c.segment]++; });
    
    document.getElementById('dash-seg-fiel').textContent = counts.Fiel;
    document.getElementById('dash-seg-leal').textContent = counts.Leal;
    document.getElementById('dash-seg-reconexion').textContent = counts['Reconexión'];
    document.getElementById('dash-seg-perdida').textContent = counts['Pérdida'];

    // Top 5
    let top5 = [...state.clientes].sort((a,b) => b.volume - a.volume).slice(0, 5);
    let top5html = top5.map((c, i) => `
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">${i+1}</div>
                <div>
                    <p class="font-semibold text-gray-800 text-sm truncate w-48">${c.name}</p>
                    <span class="text-xs px-2 py-0.5 rounded-full ${getBadgeClass(c.segment)}">${c.segment}</span>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold text-gray-800 text-sm">${formatNumber(c.volume)} kg</p>
            </div>
        </div>
    `).join('');
    document.getElementById('dash-top5').innerHTML = top5html;

    if (state.isInit) updateChart();
}

function renderClientes() {
    let tbody = document.getElementById('clientes-tbody');
    let search = document.getElementById('search-client').value.toLowerCase();
    let filter = document.getElementById('filter-segment').value;
    let sortBy = document.getElementById('sort-by').value;

    let filtered = state.clientes.filter(c => {
        let textMatch = c.name.toLowerCase().includes(search) || c.group.toLowerCase().includes(search);
        let segmentMatch = filter === 'all' || c.segment === filter;
        return textMatch && segmentMatch;
    });

    filtered.sort((a, b) => {
        if (sortBy === 'score') return b.score - a.score;
        if (sortBy === 'volumen') return b.volume - a.volume;
        if (sortBy === 'frecuencia') return b.orders - a.orders;
    });

    tbody.innerHTML = filtered.map((c, i) => {
        let isUrgent = c.daysUntilContact <= 0;
        let rowClass = isUrgent ? 'bg-orange-50' : 'hover:bg-gray-50';
        let initials = c.name.substring(0,2).toUpperCase();
        
        let scorePct = (c.score / 10) * 100;
        let lastTriggerIcon = c.lastTrigger ? `<span class="material-icons text-green-500 text-sm" title="${c.lastTrigger}">check_circle</span>` : `<span class="material-icons text-gray-300 text-sm">remove</span>`;

        return `
        <tr class="transition-colors ${rowClass}">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">${initials}</div>
                    <div>
                        <p class="font-semibold text-gray-800">${c.name}</p>
                        <p class="text-xs text-gray-500">${c.group}</p>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">${c.orders}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">${formatNumber(c.volume)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">${c.recency} d</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                    <span class="w-8 text-right font-bold text-gray-700">${c.score.toFixed(1)}</span>
                    <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full rounded-full ${getProgressClass(c.segment)}" style="width: ${scorePct}%"></div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(c.segment)}">${c.segment}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${isUrgent ? 'text-orange-600 font-bold' : 'text-gray-500'}">
                ${isUrgent ? '¡Contactar hoy!' : formatDate(c.nextContactDate)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
                ${lastTriggerIcon}
            </td>
        </tr>
        `;
    }).join('');
}


function renderRFM() {
    let count = state.clientes.length;
    let avgScore = state.clientes.reduce((acc, c) => acc + c.score, 0) / count;
    let totalVol = state.clientes.reduce((acc, c) => acc + c.volume, 0);
    let avgVol = totalVol / count;
    let avgRecency = state.clientes.reduce((acc, c) => acc + c.recency, 0) / count;
    let avgFreq = state.clientes.reduce((acc, c) => acc + c.orders, 0) / count;
    
    let topClient = [...state.clientes].sort((a,b) => b.score - a.score)[0];

    document.getElementById('rfm-recencia').textContent = Math.round(avgRecency) + ' d';
    document.getElementById('rfm-frecuencia').textContent = Math.round(avgFreq) + ' ped';
    document.getElementById('rfm-volprom').textContent = formatNumber(Math.round(avgVol));
    document.getElementById('rfm-score').textContent = avgScore.toFixed(2);
    document.getElementById('rfm-top1').textContent = topClient.name;
    document.getElementById('rfm-voltotal').textContent = formatNumber(totalVol) + ' kg';

    let sortedRFM = [...state.clientes].sort((a,b) => b.score - a.score);
    document.getElementById('rfm-tbody').innerHTML = sortedRFM.map((c, i) => `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-3 font-bold text-gray-500">${i+1}</td>
            <td class="px-6 py-3 font-semibold text-gray-800">${c.name}</td>
            <td class="px-6 py-3 text-center"><span class="px-2 py-1 bg-gray-100 rounded text-gray-700 text-xs font-mono">${c.r_score}</span></td>
            <td class="px-6 py-3 text-center"><span class="px-2 py-1 bg-gray-100 rounded text-gray-700 text-xs font-mono">${c.f_score}</span></td>
            <td class="px-6 py-3 text-center"><span class="px-2 py-1 bg-gray-100 rounded text-gray-700 text-xs font-mono">${c.m_score}</span></td>
            <td class="px-6 py-3 text-center font-bold text-amcor bg-blue-50/50">${c.score.toFixed(1)}</td>
            <td class="px-6 py-3"><span class="px-2 py-1 rounded text-xs font-semibold ${getBadgeClass(c.segment)}">${c.segment}</span></td>
        </tr>
    `).join('');
}


function renderKPIs() {
    let cList = state.clientes;
    let count = cList.length;
    let tVol = cList.reduce((acc, c) => acc + c.volume, 0);
    let tDel = cList.reduce((acc, c) => acc + c.deliveredVol, 0);
    
    let fielLeal = cList.filter(c => c.segment === 'Fiel' || c.segment === 'Leal').length;
    let perdida = cList.filter(c => c.segment === 'Pérdida').length;
    let pctFielLeal = (fielLeal / count) * 100;
    let pctPerdida = (perdida / count) * 100;
    let pctDelivery = (tDel / tVol) * 100;

    document.getElementById('kpi-1').textContent = count;
    document.getElementById('kpi-2').textContent = pctFielLeal.toFixed(1) + '%';
    document.getElementById('kpi-3').textContent = pctPerdida.toFixed(1) + '%';
    document.getElementById('kpi-4').textContent = pctDelivery.toFixed(1) + '%';
    
    document.getElementById('kpi-5').textContent = (cList.reduce((acc, c) => acc + c.score, 0) / count).toFixed(2);
    document.getElementById('kpi-6').textContent = Math.round(cList.reduce((acc, c) => acc + c.orders, 0) / count);
    document.getElementById('kpi-7').textContent = formatNumber(Math.round(tVol / count));
    document.getElementById('kpi-8').textContent = Math.round(cList.reduce((acc, c) => acc + c.recency, 0) / count) + ' días';

    let topVolClient = [...cList].sort((a,b)=>b.volume - a.volume)[0];
    document.getElementById('kpi-9').textContent = topVolClient ? topVolClient.name : '--';

    // Concentration Table
    let segments = ['Fiel', 'Leal', 'Reconexión', 'Pérdida', 'Nuevo'];
    let stData = segments.map(seg => {
        let segGroup = cList.filter(c => c.segment === seg);
        let sVol = segGroup.reduce((acc, c) => acc + c.volume, 0);
        return { 
            segment: seg, 
            qty: segGroup.length, 
            vol: sVol, 
            pct: tVol > 0 ? (sVol / tVol)*100 : 0 
        };
    });

    document.getElementById('kpi-tbody').innerHTML = stData.filter(s => s.qty > 0).map(s => `
        <tr>
            <td class="px-6 py-3"><span class="px-2 py-1 rounded text-xs font-semibold ${getBadgeClass(s.segment)}">${s.segment}</span></td>
            <td class="px-6 py-3 text-right font-medium text-gray-700">${s.qty}</td>
            <td class="px-6 py-3 text-right font-medium text-gray-700">${formatNumber(s.vol)}</td>
            <td class="px-6 py-3 text-right font-bold text-gray-800">${s.pct.toFixed(2)}%</td>
        </tr>
    `).join('');
}


function renderTriggers() {
    let sortedIntervals = [...state.clientes].sort((a,b) => a.daysUntilContact - b.daysUntilContact);
    
    // Interval panel
    document.getElementById('intervals-tbody').innerHTML = sortedIntervals.map(c => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3"><p class="font-semibold text-gray-800 text-sm truncate w-40" title="${c.name}">${c.name}</p></td>
            <td class="px-4 py-3 text-center font-mono text-sm">${c.interval} d</td>
            <td class="px-4 py-3 text-center">
                <button onclick="dispararTrigger3('${c.id}')" class="text-amcor hover:bg-blue-50 p-1.5 rounded-full transition-colors flex mx-auto">
                    <span class="material-icons text-[18px]">send</span>
                </button>
            </td>
        </tr>
    `).join('');

    // History Table
    let tbody = document.getElementById('history-tbody');
    if (state.history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">No hay correos registrados en esta sesión.</td></tr>`;
    } else {
        tbody.innerHTML = state.history.map(h => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-3 text-xs text-gray-500">${h.date}</td>
                <td class="px-6 py-3 font-semibold text-gray-800">${h.clientName}</td>
                <td class="px-6 py-3"><span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">${h.type}</span></td>
                <td class="px-6 py-3 text-sm text-gray-600 truncate max-w-[200px]">${h.subject}</td>
                <td class="px-6 py-3 text-center"><span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">Enviado</span></td>
            </tr>
        `).reverse().join('');
    }
}


// --- LÓGICA DE TRIGGERS ---

function registrarTrigger(clientId, type, subject) {
    let c = state.clientes.find(cli => cli.id === clientId);
    if(c) c.lastTrigger = type;

    state.history.push({
        date: new Date().toLocaleString('es-CO'),
        clientName: c ? c.name : 'Unknown',
        type: type,
        subject: subject
    });
    renderTriggers();
    renderClientes(); // para icono visual
}

// T1 - Cotización
function dispararTrigger1(clientId) {
    if(!document.getElementById('t-config-1').checked) return;
    let c = state.clientes.find(cli => cli.id === clientId);
    if(!c) return;

    let subject = "Amcor AF Cali — Recibimos tu solicitud de cotización";
    let body = `Hola equipo de ${c.name},\n\nConfirmamos que recibimos tu solicitud de cotización para nueva línea de empaque. Nuestro equipo comercial la está revisando y nos pondremos en contacto contigo muy pronto con todos los detalles.\n\nGracias por confiar en Amcor AF Cali.`;
    
    registrarTrigger(c.id, 'T1 - Cotización', subject);
    window.open(`mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

// T3 - Recompra
function dispararTrigger3(clientId) {
    if(!document.getElementById('t-config-3').checked) return;
    let c = state.clientes.find(cli => cli.id === clientId);
    if(!c) return;

    let subject = "Amcor AF Cali — ¿Listo para tu próximo pedido?";
    let body = `Hola equipo de ${c.name},\n\nSegún tu historial de compras con nosotros sueles hacer un nuevo pedido aproximadamente cada ${c.interval} días y ya se cumple ese tiempo.\n\n¿Estás listo para tu próximo pedido? Podemos agilizar el proceso si nos confirmas las mismas especificaciones de tu pedido anterior o si necesitas ajustar volumen o referencia.\n\nResponde este correo y con gusto lo gestionamos de inmediato.\n\nEquipo Amcor AF Cali.`;
    
    registrarTrigger(c.id, 'T3 - Recompra', subject);
    window.open(`mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

// T2 - Entrega (simulado, se llama externamente o manual)
function dispararTrigger2(clientId) {
    if(!document.getElementById('t-config-2').checked) return;
    let c = state.clientes.find(cli => cli.id === clientId);
    let subject = "Amcor AF Cali — Tu pedido fue entregado";
    let dateStr = new Date().toLocaleDateString('es-CO');
    let body = `Hola equipo de ${c.name},\n\nConfirmamos que tu pedido fue entregado el ${dateStr}. Esperamos que todo haya llegado en perfectas condiciones.\n\nSi tienes alguna observación no dudes en escribirnos. Quedamos atentos.\n\nEquipo Amcor AF Cali.`;
    registrarTrigger(c.id, 'T2 - Entrega', subject);
    window.open(`mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

// --- HUBSPOT INTEGRATION ---

window.recibirClienteHubSpot = function(company, email, phone, city, firstname, lastname) {
    let nuevoCli = {
        id: 'HS-' + Date.now(),
        name: company,
        group: 'Lead Web',
        orders: 0,
        volume: 0,
        recency: 0,
        score: 0.0,
        segment: 'Nuevo',
        interval: 30,
        daysUntilContact: 30, // next contact
        nextContactDate: new Date(Date.now() + 30*24*60*60*1000),
        deliveredVol: 0,
        email: email,
        lastTrigger: null
    };

    state.clientes.push(nuevoCli);
    calculateGlobalQuantiles();
    
    // UI Update reactivo
    renderAll();
    
    // Auto-fire Trigger 1
    setTimeout(() => { dispararTrigger1(nuevoCli.id); }, 500);

    alert(`¡Webhook Exitoso! Lead de ${company} procesado como Nuevo Cliente en el CRM.`);
}

function executeHubSpotSimulation() {
    let company = document.getElementById('hs-company').value;
    let email = document.getElementById('hs-email').value;
    let first = document.getElementById('hs-first').value;
    let last = document.getElementById('hs-last').value;
    closeHubSpotModal();
    window.recibirClienteHubSpot(company, email, '555-0000', 'Cali', first, last);
    // Cambiar a pestaña de clientes para visualizarlo
    openTab('clientes', document.querySelectorAll('.nav-link')[1]);
}

// --- UTILIDADES ---

function openTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('active', 'bg-white/10', 'text-white', 'font-semibold', 'border-l-4');
        el.classList.add('text-white/80', 'border-transparent');
    });
    btn.classList.add('active', 'bg-white/10', 'text-white', 'font-semibold');
    btn.classList.replace('border-transparent', 'border-white');

    let titles = { 'dashboard':'Dashboard', 'clientes':'Directorio de Clientes', 'rfm':'Análisis RFM', 'kpis':'Métricas y KPIs', 'triggers':'Triggers Automáticos de Correo' };
    document.getElementById('page-title').textContent = titles[tabId];
}

function showHubSpotModal() { document.getElementById('modal-hubspot').classList.remove('hidden'); document.getElementById('modal-hubspot').classList.add('flex'); }
function closeHubSpotModal() { document.getElementById('modal-hubspot').classList.add('hidden'); document.getElementById('modal-hubspot').classList.remove('flex'); }

function initChart() {
    let ctx = document.getElementById('volumenChart').getContext('2d');
    let months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    // Random bars logic
    let dataSimulated = Array.from({length: 12}, () => 20000 + (Math.random() * 50000));
    
    state.volumenChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: months, datasets: [{ label: 'Volumen Mensual (kg)', data: dataSimulated, backgroundColor: '#1a3a5c', borderRadius: 4 }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } } }
    });
}
function updateChart() {
    if(state.volumenChart) {
        // Just increment slightly based on total to simulate reactivity
        let tVol = state.clientes.reduce((acc,c)=>acc+c.volume,0);
        state.volumenChart.data.datasets[0].data[11] += tVol * 0.05; // sumar al ultimo mes
        state.volumenChart.update();
    }
}

// Bootstrap
window.onload = init;
