const turf = require('@turf/turf');
const places=[
  { name:"San Pablo Huitzo, Oaxaca, Mexico", lat:17.2667, lng:-96.8833 },
  { name:"San Francisco Telixtlahuaca, Oaxaca, Mexico", lat:17.3167, lng:-96.9000 },
  { name:"Santiago Suchilquitongo, Oaxaca, Mexico", lat:17.2333, lng:-96.8667 },
  { name:"San Pablo Villa de Mitla, Oaxaca, Mexico", lat:16.9261, lng:-96.3597 },
  { name:"La Unión Zapata, Oaxaca, Mexico", lat:17.1000, lng:-96.8000 },
  { name:"Villa Díaz Ordaz, Oaxaca, Mexico", lat:17.2000, lng:-96.7500 },
  { name:"San Juan Bautista Guelache, Oaxaca, Mexico", lat:17.1833, lng:-96.8167 },
  { name:"San Miguel Etla, Oaxaca, Mexico", lat:17.2000, lng:-96.8000 },
  { name:"Tlalixtac de Cabrera, Oaxaca, Mexico", lat:17.1167, lng:-96.6833 },
  { name:"San Antonio de la Cal, Oaxaca, Mexico", lat:17.0833, lng:-96.7167 },
  { name:"San Agustín de las Juntas, Oaxaca, Mexico", lat:17.0667, lng:-96.7333 },
  { name:"San Marcos Tlapazola, Oaxaca, Mexico", lat:16.9500, lng:-96.7000 },
  { name:"San Bartolomé Quialana, Oaxaca, Mexico", lat:16.8833, lng:-96.6167 },
  { name:"San Gabriel Etla, Oaxaca, Mexico", lat:17.2136, lng:-96.7692 }
];
const fcPoints={type:'FeatureCollection',features:places.map(p=>({type:'Feature',geometry:{type:'Point',coordinates:[p.lng,p.lat]},properties:{name:p.name}}))};
let polyConcave=null, polyConvex=null;
try{polyConcave=turf.concave(fcPoints,{maxEdge:20,units:'kilometers'});}catch(e){ console.log("Concave error:", e.message); }
try{polyConvex=turf.convex(fcPoints);}catch(e){ console.log("Convex error:", e.message); }
if(!polyConcave){
  console.log("Fallback to union");
  const bufs=fcPoints.features.map(pt=>turf.buffer(pt,2,{units:'kilometers'}));
  let uni=bufs[0]; 
  for(let i=1;i<bufs.length;i++) {
    try {
      uni=turf.union(uni,bufs[i]); 
    } catch(err) {
      console.log("Union error at i=" + i, err.message);
      process.exit(1);
    }
  }
  polyConcave=uni;
}
console.log("polyConcave valid?", polyConcave ? true : false);
