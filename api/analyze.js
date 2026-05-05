export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const body = req.body;
    const d = body.simData;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        max_tokens: 4000,
        messages: [{ role: 'user', content: `Sei un esperto consulente fotovoltaico italiano aggiornato al 2025/2026. Dati simulazione: consumi ${d.consumo} kWh/anno, bolletta €${d.bolletta}/mese, potenza ${d.potenza} kWp, zona ${d.zona}, costo €${d.costo}, produzione ${d.prod} kWh, autoconsumo ${d.autoc} kWh (${d.cop}%), immessa ${d.immessa} kWh, risparmio €${d.risp}/anno, payback ${d.pb} anni, risparmio 25 anni €${d.r25}. Fornisci analisi dettagliata e COMPLETA in HTML con queste 5 sezioni, ognuna con almeno 150 parole: <div class="pr-section"><h4>TITOLO</h4><p>testo</p></div> per: 1.VALUTAZIONE TAGLIA IMPIANTO 2.BATTERIA DI ACCUMULO 3.DETRAZIONE FISCALE 2025/2026 (aggiornata: detrazione 50% per prime case in corso di proroga, 36% per seconde case, Conto Termico 2.0 per aziende, incentivi GSE) 4.CONSIGLI MIRATI 5.ERRORI DA EVITARE. Usa i numeri reali della simulazione. Concludi SEMPRE il punto 5 con un paragrafo di incoraggiamento. Non troncare mai il testo.` }]
      })
    });

    const data = await response.json();
    console.log('Stato risposta antropica:', response.status);
    console.log('Dati antropici:', JSON.stringify(data));
    
    const text = data?.content?.[0]?.text || '';
    return res.status(200).json({ result: text });
  } catch (err) {
    console.log('Errore:', err.message);
    return res.status(500).json({ error: 'Errore: ' + err.message });
  }
}
