const axios = require("axios");
const elasticsearch = require('elasticsearch')

    // create and connect elasticsearch client to local instance.
    const client = new elasticsearch.Client({
        host: '127.0.0.1:9200',
        log: 'error'
     });
    
     // test elasticsearch
    client.ping({ requestTimeout: 30000 }, function(error) {
        if (error) {
            console.error('elasticsearch cluster is down!');
        } else {
            console.log('Everything is ok');
        }
    });
    
module.exports.getAll = async (req, res) => {

    const index = 'photoindex';
    const type = 'photos';

    try {
        const count  = await client.indices.exists({index: index});
        if (count) {
            const data = await client.search({index: index, body: {
                size: 5000,
                from: 0,
                query: {
                  match_all: {}
                }
              }
            });
            return res.json({ source: 'elasticsearch', data: data.hits.hits })
        } else {
            let response = await axios('https://jsonplaceholder.typicode.com/photos');
    
            // create index
            bulkIndex(index, type, response.data);
    
            return res.json({ source: 'api', data: response.data })
        }
    } catch(err) {
        console.log("err", err);
    }
}

const bulkIndex = async function bulkIndex(index, type, data) {
    console.log("index, type, data", index, type, data);
    let bulkBody = [];
  
    data.forEach(item => {
      bulkBody.push({
        index: {
          _index: index,
          _type: type,
          _id: item.id
        }
      });
  
      bulkBody.push(item);
    });
  
    try {
        await client.bulk({body: bulkBody})
    } catch(err) {
        console.log("++++++err++++++", err);
    }
  };