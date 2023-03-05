const fs = require('fs');

const basefilename = 'dataset';

const d = fs.readFileSync(`./src/${basefilename}.csv`, 'utf8');

const main = (d) => {

  let res = {
    "rain": {
      "labels": [],
      "datasets": [{
         "label": "降水量",
         "data": [],
         "borderWidth": 1
      }]
    },
    "wind": {
      "labels": [],
      "datasets": [{
         "label": "風速",
         "data": [],
         "borderWidth": 1
      }]
    }
  }
  
  d.split("\n").forEach( line => {
    if(!line) return;
    
    const c = line.split("\t");
    
    const y = c[0];
    const m = c[1];
    const d = c[2];
    const h = c[4];
    
    const time = `${y}/${m}/${d} ${h}:00`;
    
    const targetPoint = c[3];
    
    const rain = c[7].match(/\d/) ? +c[7] : 0;
    const wind = c[12].match(/\d/) ? +c[12] : 0;
    
    res.rain.labels.push(time);
    res.rain.datasets[0].data.push(rain);
    res.wind.labels.push(time);
    res.wind.datasets[0].data.push(wind);
    
    if(targetPoint){
      res.rain.datasets[0].label = `降水量@${targetPoint}`;
      res.wind.datasets[0].label = `風速@${targetPoint}`;
    }
    
  });
  
  return res;
}

const res = main(d);

fs.writeFileSync(`./dat/${basefilename}.json`, JSON.stringify(res, null, 2));
