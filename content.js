
function getaddress()
{
    const meta = document.querySelector('meta[name = "description"]');
    if (!meta)
    {
        console.log("[Restaurant Inspector] Meta description tag not found")
        return null;
    }
    const meta_text = meta.getAttribute("content");
    if (!meta_text) return null;
    const zip = meta_text.match(/\b\d{5}\b/)?.[0];
    const street = meta_text.match(/\d+\s+[A-Za-z0-9\s\.\#]+(?:St|Ave|Blvd|Rd|Ln|Dr|Way|Pl|Ct|Ter|Sq|Pkwy|Hwy|Expy|Cir)(?:\s+[NSEW]|Northeast|Northwest|Southeast|Southwest)?/i)?.[0];
    
    let normalized_street = street.toUpperCase()
    .replace(/\bST\.?\s+(MARKS|JOHNS|NICHOLAS|ANDREWS|MARY|PAUL|CLAIRE)\b/g, "SAINT $1")
    .replace(/(\d+)(ST|ND|RD|TH)\b/g, "$1")
    .replace(/\bN\b/g, "NORTH")
    .replace(/\bS\b/g, "SOUTH")
    .replace(/\bE\b/g, "EAST")
    .replace(/\bW\b/g, "WEST")
    .replace(/\bNE\b/g, "NORTHEAST")
    .replace(/\bNW\b/g, "NORTHWEST")
    .replace(/\bSE\b/g, "SOUTHEAST")
    .replace(/\bSW\b/g, "SOUTHWEST")
    .replace(/\bST\b/g, "STREET")
    .replace(/\bAVE\b/g, "AVENUE") 
    .replace(/\bBLVD\b/g, "BOULEVARD")
    .replace(/\bRD\b/g, "ROAD")
    .replace(/\bDR\b/g, "DRIVE") 
    .replace(/\bLN\b/g, "LANE")
    .replace(/\bPL\b/g, "PLACE")
    .replace(/\bSQ\b/g, "SQUARE")
    .replace(/[^A-Z0-9\s]/g, "") // Remove periods, commas, hashes
    .replace(/\s+/g, " ")        // Collapse multiple spaces into one
    .trim();

    console.log("Extracted Street:", normalized_street);
    console.log("Extracted Zip Code:", zip);
    
    const fulladdress = `${normalized_street} ${zip}`;

    console.log("Extracted full address:", fulladdress);
    


    return fulladdress;




}

//const extracted_address =  getaddress();

//console.log("[Restaurant Inspection] Detected Address:", extracted_address);

function getname()
{
     const meta = document.querySelector('meta[name = "description"]');
    if (!meta)
    {
        console.log("[Restaurant Inspector] Meta description tag not found")
        return null;
    }
    const meta_text = meta.getAttribute("content");
    const name = meta_text.split("-")[0];
    let normalized_name = name.toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
   
    console.log("[Restaurat Name] Deteced Name:",normalized_name)

    return normalized_name;
   
}



/* THIS IS A FUNCTION TOTEST THAT THE JSON WAS LOADED OR NOT  */
async function fecthjson()
{
    console.log("STARTING TEST");

    const jsonurl = chrome.runtime.getURL("restaurant_inspection.json")
    console.log("chrome generated URl:", jsonurl);

    try
    {
        const response = await fetch(jsonurl);

        if(!response.ok)
        {
            throw new Error(`HTTP status ${response.status}`);
        }
      
        const data = await response.json();
        console.log("TEST SUCCESS");
        console.log(`Total Records Loaded: ${data.length}`);
        console.log("First Record Sample:", data[0]);
        return data;
    }
    catch(error)
    {
        console.log("TEST FAILED");
        console.log("Could not fetch JSON File", error);
        return []; //returning an empty array so that the .find() does not crash
    }
}

function filtermatch(yelpaddress, dataset) {
  if (!yelpaddress || !Array.isArray(dataset)) return null;

  // Exact string comparison
  const matches = dataset.filter(record => record.full_address === yelpaddress);

  return matches || null;
}

function findalloptions(yelpAddress,dataset,yelpName)
{
  if(!yelpAddress || !Array.isArray(dataset)) return null;
  const matches = dataset.filter(record => record.full_address === yelpAddress)
  
  const distinct_names = [...new Set(matches.map(record =>record.DBA))]
  if(distinct_names.length === 0) return null;
  if(distinct_names.length === 1)
  {
     matches.sort((a,b) => {
    const dateA = new Date(a["INSPECTION DATE"] || 0);
    const dateB = new Date(b["INSPECTION DATE"] || 0);
    return dateB - dateA;

    
  });
  return matches[0]
  }
  if(distinct_names.length > 1)
  {
  
    const nameMatches = matches.filter(record => {
      if (!record.DBA || !yelpName) return false;
      return record.DBA.trim().toUpperCase() === yelpName.trim().toUpperCase();
    });

    // Step 2: Sort the matched records by INSPECTION DATE (newest first)
    nameMatches.sort((a, b) => {
      const dateA = new Date(a["INSPECTION DATE"] || 0);
      const dateB = new Date(b["INSPECTION DATE"] || 0);
      return dateB - dateA;
    });

    return nameMatches[0]; // returns matching records sorted newest -> oldest
  }
}
  

function findBestmatch(yelpAddress,dataset)
{
 if(!yelpAddress || !Array.isArray(dataset)) return null;
 const matches = dataset.filter(record => record.full_address === yelpAddress)
  if(matches.length === 0 ) return null;
  if(matches.length === 1) return matches[0];

  matches.sort((a,b) => {
    const dateA = new Date(a["INSPECTION DATE"] || 0);
    const dateB = new Date(b["INSPECTION DATE"] || 0);
    return dateB - dateA;
    
  });

  return matches[0];




}


async function loadmatched()
{

    const src = chrome.runtime.getURL('Inspectionpopup.js');
    const { createInspectionPopup } = await import(src);

    const extracted_address =  getaddress();
    console.log("[Restaurant Inspection] Detected Address:", extracted_address);

    const dataset = await fecthjson();

    const matched = findBestmatch(extracted_address,dataset);
    console.log("Matched Record", matched)

    if (matched) {
    const popup = createInspectionPopup(matched);
    if (popup) {
      document.body.appendChild(popup);
    }
  }

   

}

loadmatched();



/*
/**
 * Fetches the local restaurant_inspection.json file packaged with the extension.
 
async function loadInspectionData() {
  try {
    const jsonUrl = chrome.runtime.getURL("restaurant_inspection.json");
    const response = await fetch(jsonUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[Yelp Inspector] Failed to load inspection dataset:", error);
    return [];
  }
}

/**
 * Searches the dataset for a restaurant matching the extracted Yelp address.
 * @param {string} targetAddress - The normalized address string (e.g., "202 MOTT ST 10012")
 
async function findInspectionRecord(targetAddress) {
  if (!targetAddress) return null;

  console.log(`[Yelp Inspector] Searching dataset for: "${targetAddress}"`);
  
  const dataset = await loadInspectionData();
  if (!dataset.length) {
    console.log("[Yelp Inspector] Dataset is empty or failed to load.");
    return null;
  }

  // 1. Try Exact Match on full_address
  let match = dataset.find(record => record.full_address === targetAddress);

  // 2. Fallback: Check if targetAddress contains the record's street & zip (partial match)
  if (!match) {
    match = dataset.find(record => {
      if (!record.full_address) return false;
      return targetAddress.includes(record.full_address) || record.full_address.includes(targetAddress);
    });
  }

  if (match) {
    console.log("[Yelp Inspector] Match Found! 🎉", match);
  } else {
    console.log("[Yelp Inspector] No inspection record found for this address.");
  }

  return match;
}
*/

/**
 * Looks up an exact address match in the JSON dataset.
 * @param {string} yelpAddress - Normalized address extracted from Yelp (e.g., "202 MOTT ST 10012")
 * @param {Array} dataset - Array of restaurant objects loaded from restaurant_inspection.json
 * @returns {Object|null} The matched record object or null
 */
function findExactMatch(yelpAddress, dataset) {
  if (!yelpAddress || !Array.isArray(dataset)) return null;

  // Exact string comparison
  const match = dataset.find(record => record.full_address === yelpAddress);

  return match || null;
}