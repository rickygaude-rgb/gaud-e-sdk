/**
 * GAUD-E — C++ Native Bridge Direct Integration
 * ================================================================
 * Motor: gaude-bridge (C++, 93% C++)  →  127.0.0.1:19724
 * Repo:  github.com/rickygaude-rgb/C---Gps-2-Bim
 *
 * Binarios del motor:
 *   gps2bim        — IFC 2X3 generation    (~50ms, 40× vs Python)
 *   gaude-pipeline — 7-agent Claude pipeline
 *   gaude-bridge   — HTTP bridge server
 *
 * Este ejemplo muestra cómo llamar directamente al motor C++
 * sin pasar por api.gaude.ai (uso local/offline).
 * ================================================================
 */

const BRIDGE_URL = 'http://127.0.0.1:19724';

// ── 1. Health check del motor C++ ──────────────────────────────
async function checkBridgeHealth() {
  const res = await fetch(`${BRIDGE_URL}/health`);
  const data = await res.json();
  console.log('[GAUD-E C++ Bridge]', data);
  // { status: "ok", motor: "gaude-bridge", version: "2.0.0", language: "C++", built: "..." }
  return data.status === 'ok';
}

// ── 2. Generar IFC desde JSON BIM (motor C++ directo) ───────────
async function generateIFC(bimJson) {
  const start = performance.now();

  const res = await fetch(`${BRIDGE_URL}/generate/ifc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bimJson),
  });

  if (!res.ok) throw new Error(`C++ bridge error: ${res.status}`);

  const ifcBuffer = await res.arrayBuffer();
  const elapsed = Math.round(performance.now() - start);
  console.log(`[GAUD-E] IFC generado en ${elapsed}ms (motor C++)`);

  return ifcBuffer; // IFC 2X3 listo para Revit / ArchiCAD
}

// ── 3. Enviar modelo a ArchiCAD via bridge C++ ──────────────────
async function sendToArchiCAD(bimJson) {
  const res = await fetch(`${BRIDGE_URL}/send/archicad`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bimJson),
  });
  return res.json();
  // { status: "ok", elements_created: 142, time_ms: 38 }
}

// ── 4. Enviar modelo a Revit via bridge C++ ─────────────────────
async function sendToRevit(bimJson) {
  const res = await fetch(`${BRIDGE_URL}/send/revit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bimJson),
  });
  return res.json();
}

// ── 5. Correr pipeline completo (7 agentes IA + export C++) ─────
async function runFullPipeline(prompt, coordinates) {
  const res = await fetch(`${BRIDGE_URL}/pipeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,          // "Casa minimalista 200m2 con piscina, 3 dormitorios"
      coordinates,     // { lat: -33.4489, lng: -70.6693 }
      output: ['ifc', 'gltf', 'json-bim'],
    }),
  });

  // Stream de progreso (SSE)
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(Boolean);
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const event = JSON.parse(line.slice(5));
        console.log(`[Agent ${event.agent}] ${event.phase}: ${event.status}`);
        // [Agent 1] Phase 1: Enhancing instructions...
        // [Agent 2] Phase 1: Designing spatial layout...
        // [Agent 7] Phase 4: Exporting IFC via C++ motor (~50ms)...
      }
    }
  }
}

// ── Ejemplo completo ─────────────────────────────────────────────
async function main() {
  console.log('GAUD-E GPS-2-BIM — Motor C++ (93% C++)');
  console.log('Repo: github.com/rickygaude-rgb/C---Gps-2-Bim');
  console.log('');

  const healthy = await checkBridgeHealth();
  if (!healthy) {
    console.error('Motor C++ no disponible en puerto 19724');
    console.error('Instalar: github.com/rickygaude-rgb/C---Gps-2-Bim');
    process.exit(1);
  }

  await runFullPipeline(
    'Edificio de oficinas sustentable 5 pisos, fachada vidrio, estructura acero',
    { lat: -33.4489, lng: -70.6693 } // Santiago, Chile
  );
}

main().catch(console.error);
