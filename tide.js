const fs = require('fs');

const basefilename = 'tide';

const d = fs.readFileSync(`./src/${basefilename}.txt`, 'utf8');

const main = (d) => {

  let res = {
    "tide": {
      "labels": [],
      "datasets": [{
         "label": "潮位",
         "data": [],
         "borderWidth": 1
      }]
    }
  }
  
  d.split("\n").forEach( line => {
    if(!line) return;
    
    const c = line.split("\t");
    
    const targetPoint = c[0];
    
    const y = +c[1];
    const m = +c[2];
    const d = +c[3];
    
    for( let i = 4; i < 28; i++){
      const h = (i - 4).toString().padStart(2, '0');
      const v = +c[i];
      const time = `${y}/${m}/${d} ${h}:00`;
      res.tide.labels.push(time);
      res.tide.datasets[0].data.push(v);
    }
    
    if(targetPoint){
      res.tide.datasets[0].label = `潮位@${targetPoint}`;
    }
    
  });
  
  return res;
}

const res = main(d);

fs.writeFileSync(`./dat/${basefilename}.json`, JSON.stringify(res, null, 2));
