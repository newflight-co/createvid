import stringify from 'csv-stringify';
import parse from 'csv-parse';
import _ from 'lodash'

async function generate(data){
    return new Promise((resolve, reject) => {
        stringify(data, {header: true},function(err, output){
            if(err) reject(err);
            resolve(output)
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

const data = [ // example transformations / displayName = frontend field label / chapterMarker = preview timecode
    { type: "text", layerName: "CLIENT_NAME", property: "Source Text", displayName: "Customer Name", titleField: true, required: true, chapterMarker: "1.5" },
    { type: "image", layerName: "clientLogo.png", composition: "*", displayName: "Customer Logo", required: true, chapterMarker: "1.5" },
    { type: "colour", layerName: "BRAND_PRIMARY", property: "Source Text", displayName: "Primary Background", required: true, chapterMarker: "19" },
    { type: "audio", layerName: "audio_intro.wav", composition: "*", displayName: "Introduction Audio", required: true },
    { type: "image", layerName: "mobileLogin.jpg", composition: "*", displayName: "Mobile Login", required: true, chapterMarker: "25"}
]

// generateCSV(data)

export default {
    generate
}