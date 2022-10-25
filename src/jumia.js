const axios = require('axios')
const { JSDOM } = require('jsdom')
const fetchCatgories = async () => {
    const url = 'https://www.jumia.com.ng/groceries'
    const { data } = await axios.get(url, {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            pragma: 'no-cache',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
        }
    })

    const dom = new JSDOM(data)
    const document = dom.window.document
    const categories = []


    console.log(document.querySelector('.name'))
}

fetchCatgories()