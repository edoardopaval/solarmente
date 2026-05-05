export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { simData: d } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: `Sei un esperto consulente fotovoltaico italiano. Dati simulazione: consumi ${d.consumo} kWh/anno, bolletta €${d.bolletta}/mese, potenza ${d.potenza} kWp, zona ${d.zona}, costo €${d.costo}, produzione ${d.prod} kWh, autoconsumo ${d.autoc} kWh (${d.cop}%), immessa ${d.immessa} kWh, risparmio €${d.risp}/anno, payback ${d.pb} anni, risparmio 25 anni €${d.r25}. Fornisci analisi dettagliata in HTML con sezioni: <div class="pr-section"><h4>TITOLO</h4><p>testo</p></div> per: 1.VALUTAZIONE TAGLIA 2.BATTERIA ACCUMULO 3.DETRAZIONE IRPEF 50% 4.CONSIGLI MIRATI 5.ERRORI DA EVITARE. Usa numeri reali della simulazione.` }]
      })
    });
    const data = await response.json();
    const text = data.content?.find(b => b.type === 'text')?.text || '';
    return res.status(200).json({ result: text });
  } catch (err) {
    return res.status(500).json({ error: 'Errore: ' + err.message });
  }
}
