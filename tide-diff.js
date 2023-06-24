const fs = require('fs');

const basefilename = 'tide-diff';
const title = '毎時潮位偏差';
const keyName = 'tidediff';

const d = fs.readFileSync(`./src/${basefilename}.txt`, 'utf8');

const main = (d) => {

  let res = {};
  res[keyName] = {
    "labels": [],
    "datasets": [{
       "label": `${title}`,
       "data": [],
       "borderWidth": 1
    }]
  };
  
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
      res[keyName].labels.push(time);
      res[keyName].datasets[0].data.push(v);
    }
    
    if(targetPoint){
      res[keyName].datasets[0].label = `${title}@${targetPoint}`;
    }
    
  });
  
  return res;
}

const res = main(d);

fs.writeFileSync(`./dat/${basefilename}.json`, JSON.stringify(res, null, 2));
