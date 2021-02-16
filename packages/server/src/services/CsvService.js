import stringify from 'csv-stringify';
import parse from 'csv-parse';
import _ from 'lodash'

async function generate(data){
    return new Promise((resolve, reject) => {
        const dataProcessed = _.map(data, (i) => {
            const res = _.pick(i, ['layerName', 'type', 'displayName', 'required'])
            res.Source = null;
            return res
        })
        stringify(dataProcessed, {header: true}, (err, out) => {
            if(err) return reject(err);
            resolve(out)
        })
    })
    
}

function prs(input){
    parse(input, function(err, output){
        const keys = _.take(output)[0]
        const e = _.map(output, (i) => {
            console.log([keys, i])
            return _.fromPairs(_.unzip([keys, i]))
        })
        
        _.each(e, (i) => {
            i.required = i.required === '1'
        })
        console.log(e)
      })
}

// generateCSV(data)

export default {
    generate
}