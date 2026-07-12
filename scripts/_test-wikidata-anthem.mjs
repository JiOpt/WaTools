/** Quick Wikidata anthem name probe */
const ISO2 = ['tw', 'us', 'jp', 'af', 'xk'];
const values = ISO2.map((c) => `"${c.toUpperCase()}"`).join(' ');
const query = `
SELECT ?iso2 ?countryLabel ?anthemLabel ?anthemLabelEn ?anthemLabelZh WHERE {
  VALUES ?iso2 { ${values} }
  ?country wdt:P297 ?iso2 .
  OPTIONAL { ?country wdt:P85 ?anthem . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "zh,en". }
}
`;
const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
const res = await fetch(url, { headers: { Accept: 'application/sparql-results+json', 'User-Agent': 'Kawatool/1.0' } });
console.log(JSON.stringify(await res.json(), null, 2));
