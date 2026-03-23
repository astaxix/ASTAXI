
import { ContactFormData } from "@/types";

/**
 * Nutzt die kostenlose Nominatim API (OpenStreetMap) für Adressvorschläge.
 * Funktioniert ohne API-Key.
 */
/**
 * Hilfsfunktion zum Formatieren der Nominatim-Daten
 */
const formatNominatimData = (data: any[], userInput: string) => {
  // Extrahiere mögliche Hausnummer aus dem User-Input (Zahl am Ende)
  const inputNumberMatch = userInput.match(/\s(\d+[a-zA-Z]?)$/);
  const inputNumber = inputNumberMatch ? inputNumberMatch[1] : null;

  return data.map((item: any) => {
    const addr = item.address || {};
    let street = addr.road || addr.pedestrian || addr.cycleway || addr.path || "";
    let houseNumber = addr.house_number || "";
    
    const displayNameParts = item.display_name.split(',').map((p: string) => p.trim());
    const firstPart = displayNameParts[0];

    // 1. Wenn Nominatim keine explizite house_number hat, prüfen ob der erste Teil eine ist
    if (!houseNumber && /^\d+[a-zA-Z]?$/.test(firstPart)) {
      houseNumber = firstPart;
    }
    
    // 2. Wenn immer noch keine Hausnummer da ist, aber der User eine getippt hat
    if (!houseNumber && inputNumber && street && !street.includes(inputNumber)) {
       houseNumber = inputNumber;
    }

    let label = street;
    if (houseNumber) {
      if (label) {
        if (!label.includes(houseNumber)) {
          label += " " + houseNumber;
        }
      } else {
        label = houseNumber;
      }
    }
    
    if (!label || label.length < 3) {
      label = firstPart;
    }

    // Stadt / Ortsteil / Gemeinde hinzufügen
    const city = addr.city || addr.town || addr.village || addr.hamlet || "";
    const suburb = addr.suburb || addr.neighbourhood || addr.district || "";
    const municipality = addr.municipality || "";
    
    let locationName = "";
    const isBingen = (city + municipality + addr.county).toLowerCase().includes("bingen");

    if (isBingen) {
      locationName = "Bingen";
      // Wenn es ein spezieller Ortsteil ist (außer dem Zentrum), fügen wir ihn hinzu
      if (suburb && !["bingen", "innenstadt", "zentrum", "altstadt"].includes(suburb.toLowerCase())) {
        // Spezialfall: Fruchtmarkt ist Zentrum, Nominatim ordnet es manchmal falsch zu
        if (street.toLowerCase().includes("fruchtmarkt")) {
          // Bleibt bei "Bingen"
        } else {
          locationName += `-${suburb}`;
        }
      }
    } else {
      locationName = suburb || city || municipality || firstPart;
    }

    if (locationName && !label.includes(locationName)) {
      label += `, ${locationName}`;
    }
    
    // Postleitzahl zur Eindeutigkeit (hilft bei Stromberger Str. in Weiler vs Bingerbrück)
    if (addr.postcode && !label.includes(addr.postcode)) {
      label += ` (${addr.postcode})`;
    }

    return {
      label: label.trim(),
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon)
    };
  });
};

/**
 * Nutzt die Nominatim API für Adressvorschläge mit verbesserter Hausnummern-Unterstützung.
 */
export const fetchPlaceSuggestions = async (input: string): Promise<{label: string, lat: number, lon: number}[]> => {
  if (!input || input.length < 2) return [];

  try {
    // Bingen am Rhein Koordinaten Bereich für Priorisierung (Viewbox)
    // Wir machen die Viewbox etwas größer, um das Umland (Weiler, Münster-Sarmsheim) besser einzuschließen
    const viewbox = "7.70,50.05,8.10,49.85";
    
    // 1. Grundlegende Bereinigung: Ersetze gängige Abkürzungen
    let cleanInput = input.trim();
    cleanInput = cleanInput.replace(/\bstr\b\.?/gi, "straße");
    cleanInput = cleanInput.replace(/\bpl\b\.?/gi, "platz");
    
    // 2. Query-Normalisierung
    let normalizedQuery = cleanInput;
    const lowerInput = normalizedQuery.toLowerCase();
    
    // Spezialfall: Wenn der User mit "Bingen..." anfängt, stellen wir es um
    const bingenRegex = /^bingen\s+/i;
    if (bingenRegex.test(normalizedQuery)) {
      normalizedQuery = normalizedQuery.replace(bingenRegex, "").trim();
      // Wir hängen " Bingen" locker an, damit Nominatim in der Region sucht
      if (!normalizedQuery.toLowerCase().includes("bingen")) {
        normalizedQuery += " Bingen";
      }
    } else {
      // Wenn kein Ort genannt wurde, hängen wir NICHTS an, sondern verlassen uns auf die Viewbox
      // Das verhindert, dass Ergebnisse aus Weiler (die nicht "Bingen" im Namen haben) unterdrückt werden.
      // Nur wenn der Input sehr kurz ist, geben wir einen Tipp.
      const knownCities = ["bingen", "mainz", "ingelheim", "bad kreuznach", "gensingen", "büdesheim", "gaulsheim", "kempten", "dietersheim", "sponsheim", "weiler", "münster-sarmsheim"];
      const hasCity = knownCities.some(city => lowerInput.includes(city));
      
      if (!hasCity && cleanInput.length < 15) {
        // Wir probieren es erst mal ohne Suffix, aber mit Viewbox
        normalizedQuery = cleanInput;
      }
    }

    // 3. Suche ausführen - Limit auf 20 erhöht für maximale Auswahl
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(normalizedQuery)}&addressdetails=1&limit=20&countrycodes=de&viewbox=${viewbox}&bounded=0`;
    
    const response = await fetch(url, {
      headers: { 
        'Accept-Language': 'de',
        'User-Agent': 'AS-Mietwagen-Service-App-v5'
      }
    });
    
    if (!response.ok) throw new Error("Network response was not ok");
    
    let data = await response.json();

    // 4. Fallback: Wenn nichts gefunden wurde oder zu wenig Ergebnisse, probiere es mit " Bingen" Suffix
    if (!data || data.length < 3) {
      const retryQuery = `${cleanInput} Bingen`;
      const retryUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(retryQuery)}&addressdetails=1&limit=10&countrycodes=de&viewbox=${viewbox}&bounded=0`;
      const retryResponse = await fetch(retryUrl, {
        headers: { 
          'Accept-Language': 'de',
          'User-Agent': 'AS-Mietwagen-Service-App-v5'
        }
      });
      
      if (retryResponse.ok) {
        const retryData = await retryResponse.json();
        if (retryData && retryData.length > 0) {
          // Kombiniere Ergebnisse, vermeide Dubletten
          const existingIds = new Set(data.map((d: any) => d.place_id));
          retryData.forEach((d: any) => {
            if (!existingIds.has(d.place_id)) {
              data.push(d);
            }
          });
        }
      }
    }

    if (data && data.length > 0) {
      return formatNominatimData(data, input);
    }

    return [];
  } catch (error) {
    console.error("Nominatim Search Error:", error);
    return [];
  }
};
