const PORT = process.env.PORT || 3000
const express  = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express()


const newspaperArticles = [
    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'www.telegraph.co.uk'
    },
    
]

const artitle = [];

// ---------
newspaperArticles.forEach(newspaperarticle => {
    axios.get(newspaperarticle.address)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html)
        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            artitle.push({
                title,
                url: newspaperarticle.base + url,
                source: newspaperarticle.name
            });
        });
        // res.json(artitle);
    }).catch((error) => console.log(error));
})
// ---------

app.get('/', (req, res) => {
    res.json('Creepy Crawler, News API')
})

app.get('/news', (req, res) => {
    res.json(artitle)
})

app.get('/news/:newspaperarticleId', (req, res) => {
    // res.json(artitle)
    const newspaperarticleId =  req.params.newspaperarticleId;
    const newspaperAddress = newspaperArticles.filter(newspaperarticle => newspaperarticle.name == newspaperarticleId)[0].address;
    const newspaperBase = newspaperArticles.filter(newspaperarticle => newspaperarticle.name == newspaperarticleId)[0].base;
    console.log(newspaperAddress);

    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html)
        const specificArticle = [];
        
        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticle.push({
                title,
                url: newspaperBase + url,
                source: newspaperarticleId
            });
        }); 
        res.json(specificArticle)
    }).catch(err => console.log(err))
})

// Making the name hkfoga kk

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))