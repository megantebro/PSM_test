import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

const data = fs.readFileSync('PSMrawdata.csv');
const records = parse(data);

let price_range = {"expensive":[],"cheap":[],"too_expensive":[],"too_cheap":[]};
let types = ["expensive","cheap","too_expensive","too_cheap"]

for (const record of records) {
    for(const type of types){
        if(type == "expensive"){
            price_range[type].push(Math.round(Number(record[1])/10)*10)
        }else if(type =="cheap"){
            price_range[type].push(Math.round(Number(record[2])/10)*10)
        }else if(type == "too_expensive"){
            price_range[type].push(Math.round(Number(record[3])/10)*10)
        }else{
            price_range[type].push(Math.round(Number(record[4])/10)*10)
        }
    }
}

let percents = {"expensive":{},"cheap":{},"too_expensive":{},"too_cheap":{}};

for(const type of types){
    get_percents(type)
}


console.log("最高価格:" + String(get_cross_point("too_expensive","cheap")) + "円")
console.log("妥協価格:" + String(get_cross_point("expensive","cheap")) + "円")
console.log("理想価格:" + String(get_cross_point("too_expensive","too_cheap")) + "円")
console.log("最低品質保証価格:" + String(get_cross_point("expensive","too_cheap")) + "円")

function get_percents(type){
    for(let i = 0; i <= 600; i+= 10){
    let count = 0
    for(const price of price_range[type]){
        if(type == "expensive" || type == "too_expensive"){
            if(i >= price){
                count++;
            }
        }else if(i <= price){
            count++
        }
    }
        percents[type][String(i)] = count / (price_range[type].length - 1)
    }
}


function get_cross_point(type1,type2){
    for(let i = 0; i <= 600;i+=10){
        if(percents[type1][String(i)] >= percents[type2][String(i)]){
            let b1 = percents[type1][String(i - 10)]
            let b2 = percents[type2][String(i - 10)]
            let a1 = (percents[type1][String(i)] - b1) / 10
            let a2 = (percents[type2][String(i)] - b2) / 10
            for(let j = 0;j <= 10;j++){
                let y1 = a1*j + b1
                let y2 = a2*j + b2
                if(y1 >= y2){
                    return i + j
                }
            }
        }
    }
}

