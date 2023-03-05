const fs = require('fs');

const basefilename = 'route';

const d = fs.readFileSync(`./src/${basefilename}.txt`, 'utf8');

const main = (d) => {

  let tmp = {
    "month": null,
    "date": null,
    "ns": "N",
    "ew": "E"
  };

  let res = "";
  let ls = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": []
      },
      "properties": {
        "name": "台風ルート",
        "reference": "",
        "_color":  "#FF0000",
        "_opacity": 1,
        "_weight": 2
      }
    }]
  };
  let pt = {
    "type": "FeatureCollection",
    "features": []
  };

  d.split("\n").forEach( line => {
    if(!line) return;
    
    const m = line.match(/^(\S*)\s?(\S*)\s?(\d\d)\s(\d+\.\d+)\s?(N?S?)\s(\d+\.\d+)\s?(E?W?)\s(\d+)\s([-0-9]+)\s(.*)/);
    if(!m) return;
    
    //console.log(`${m[1]}月${m[2]}日${m[3]}時, lnlat=[${m[4]}${m[5]}, ${m[6]}${m[7]}], ${m[8]} hPa, ${m[9]} m/s | ${m[10]}`);
    
    if(m[1] && m[2]) tmp.month = +m[1];
    if(m[1] && !m[2]) tmp.date = +m[1];
    if(m[2]) tmp.date = +m[2];
    if(m[5]) tmp.ns = m[5];
    if(m[7]) tmp.ew = m[7];
    
    const lat = +m[4] * ( tmp.ns == "S" ? -1 : 1 );
    const lng = +m[6] * ( tmp.ew == "W" ? -1 : 1 );
    
    const feature = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ lng, lat ]
      },
      "properties": {
        "month": tmp.month,
        "date": tmp.date,
        "hour": +m[3],
        "atm": +m[8],
        "max-wind": +m[9],
        //"other": m[10],
        "original": line,
        //"test": m,
      }
    }
    
    const pr = feature.properties;
    feature.properties.name = `${pr.month}月${pr.date}日${pr.hour}時`;
    
    const other = m[10];
    
    //暴風域
    const boufu = {
      "direction": [],
      "range": []
    };
    
    const m1 = other.match(/^([0-9]+)\s/);
    const m2 = other.match(/^(E|S|NE|NW|W|N|SW|SE):\s(\d+)\s(E|S|NE|NW|W|N|SW|SE):\s(\d+)\s/);
    
    if(m1){
      boufu.direction.push("-");
      boufu.range.push(+m1[1]);
    }
    
    if(m2){
      boufu.direction.push(m2[1]);
      boufu.range.push(+m2[2]);
      boufu.direction.push(m2[3]);
      boufu.range.push(+m2[4]);
    }
    
    if(boufu.range.length < 1){
      boufu.direction.push("-");
      boufu.range.push(+0);
    }
    
    //console.log(boufu.range);
    
    //アイコンの種類
    const iconType = "Icon";
    if(iconType == "Icon"){
    
      feature.properties._markerType = "Icon";
      feature.properties._iconUrl = "https://maps.gsi.go.jp/portal/sys/v4/symbols/076.png";
      feature.properties._iconSize = [ 10, 10 ];
      feature.properties._iconAnchor = [ 5, 5 ];
    
    }else if(iconType == "Circle"){
    
      feature.properties._markerType = "Circle";
      feature.properties._color = "#FF0000";
      feature.properties._opacity = 0.5;
      feature.properties._weight = 3;
      feature.properties._fillColor = "#FFEEEE";
      feature.properties._fillOpacity = 0.1;
      feature.properties._radius = Math.max(...boufu.range) * 1000;
    
    }else{
    
      feature.properties._markerType = "DivIcon";
      feature.properties._html = `<div style="color:#FF0000;">${pr.month}月${pr.date}日${pr.hour}時</div>`;
    
    }
    
    
    pt.features.push(feature);
    ls.features[0].geometry.coordinates.push([ lng, lat ]);
    
    res += `${tmp.month}月${tmp.date}日${m[3]}時,${lng},${lat},${m[8]},${m[9]},${Math.max(...boufu.range)||"NA"}` + "\n"
    
  });
  
  return {
    "csv": res,
    "point": pt,
    "line": ls
  };
  
}

const res = main(d);

const geojson = {
  "type": "FeatureCollection",
  "features": [...res.line.features, ...res.point.features]
};

fs.writeFileSync(`./dat/${basefilename}.json`, JSON.stringify(geojson, null, 2));
