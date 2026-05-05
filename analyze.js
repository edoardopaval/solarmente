export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { simData: d } = await req.json();

  const prompt = `Sei un esperto consulente in impianti fotovoltaici residenziali italiani. Un cliente ha effettuato una simulazione con questi dati:

- Consumi annui: ${d.consumo} kWh/anno
- Bolletta mensile attuale: €${d.bolletta}
- Tariffa media energia: €${(+d.tariffa).toFixed(3)}/kWh
- Potenza impianto scelto: ${d.potenza} kWp
- Zona geografica: ${d.zona}
- Costo impianto preventivato: €${d.costo}
- Produzione stimata: ${d.prod} kWh/anno
- Autoconsumo: ${d.autoc} kWh (${d.cop}% dei consumi)
- Energia immessa in rete: ${d.immessa} kWh
- Risparmio annuo stimato: €${d.risp}
- Tempo di ritorno investimento: ${d.pb} anni
- Risparmio netto in 25 anni: €${d.r25}
- CO2 evitata: ${d.co2} kg/anno

Fornisci un analisi approfondita e personalizzata in italiano, strutturata con queste sezioni HTML (usa SOLO tag <div class="pr-section"><h4>TITOLO</h4><p>testo</p></div> o liste <ul><li>):

1. VALUTAZIONE DELLA TAGLIA
2. BATTERIA DI ACCUMULO
3. DETRAZIONE IRPEF 50%
4. CONSIGLI MIRATI
5. ERRORI DA EVITARE

Sii diretto e specifico con i numeri reali della simulazione.`;

  try {
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
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content?.find(b => b.type === 'text')?.text || '';

    return new Response(JSON.stringify({ result: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Errore nella generazione.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
