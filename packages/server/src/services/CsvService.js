import stringify from 'csv-stringify';
import parse from 'csv-parse';
import _ from 'lodash'
import fs from 'fs'


async function generate(data){
    return new Promise((resolve, reject) => {
        const dataProcessed = _.map(data, (i) => {
            const res = _.pick(i, ['layerName', 'type', 'displayName', 'required'])
            res.source = null;
            return res
        })
        stringify(dataProcessed, {header: true}, (err, out) => {
            if(err) return reject(err);
            resolve(out)
        })
    })
    
}

async function read(path){
    let data;
    try {
        data = fs.readFileSync(path, 'utf8')
    } catch (err) {
        console.error(err)
        return null
    }
    return await parseCSV(data)
}

async function parseCSV(input){
    return new Promise((resolve, reject) => {
        parse(input, function(err, output){
            if (err) return reject(err)
            const keys = _.take(output)[0]
            const e = _.map(output, (i) => {
                return _.fromPairs(_.unzip([keys, i]))
            })
            e.shift()
            _.each(e, (i) => {
                i.required = i.required === '1'
            })
            
            return resolve(e)
          })
    })
}

// generateCSV(data)

export default {
    generate,
    read,
    parseCSV
}