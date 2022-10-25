const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const axios = require('axios')
const { JSDOM } = require('jsdom')



const url = (category) => `https://www.jumia.com.ng/${category}`;

const fetchCatgories = async () => {
    const url = 'https://www.jumia.com.ng'
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

    console.log(document.querySelector('.sub'))
    Array.from(document.querySelector('.flyout').children).forEach(elem => {
        let length = elem.href.split('/').length
        categories.push({
            name: elem.href.split("/")[length - 2]
        })

    })

    return categories
}



const fetchProducts = async (category) => {
    const { data } = await axios.get(url(category), {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            pragma: 'no-cache',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
        }
    })
    // instance of the jsdom class
    const dom = new JSDOM(data)
    const document = dom.window.document

    const productLinks = []
    Array.from(document.querySelectorAll('.core')).forEach(elem => {


        elem.href !== "" && productLinks.push({
            name: elem.dataset.name,
            category: elem.dataset.category,
            link: `https://www.jumia.com.ng${elem.href}`,
            price: Array.from(elem.children)[1].children[1].textContent,
            img: elem.children[0].firstChild.dataset.src


        })
    })

    return productLinks;

}


app.use(bodyParser.json())

app.get('/products', async (req, res) => {
    try {
        const data = await fetchProducts('beauty-tools-accessories/')
        res.json({
            data,
            totalProducts: data.length
        })
    } catch (err) {
        res.json({
            err
        })
    }
})


app.get('/categories', async (req, res) => {

    const data = await fetchCatgories()
    res.json(data)

})


app.post('/products/category/', async (req, res) => {

    const category = req.body.category;
    try {
        const data = await fetchProducts(category)
        res.json({
            data,
            totalProducts: data.length
        })
    }
    catch (err) {
        res.status(400)
        res.json(err)
    }
})

app.post('/products/search', async (req, res) => {
    try {
        const query = req.body.query;
        const data = await fetchProducts(`catalog/?q=${query.replace(/ /, '+')}`)
        res.status(200)
        res.json(data)
    }
    catch (err) {
        res.status(400)
        res.json(err)
    }

})

app.listen(3000, () => console.log('Server is running on http://localhost:3000'))


module.exports = app