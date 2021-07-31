const fetch = require('node-fetch');
var htmlparser = require("htmlparser");
var checkWord = require('check-word'),
    cw = checkWord('en');

module.exports = function (url) {
    return new Promise((resolve, reject) => {
        if (url.includes('http')) fetchUrlData(url, resolve, reject).catch(err => { reject(err) });
        else fetchUrlData('https://' + url, resolve, reject)
            .catch(err => {
                fetchUrlData('http://' + url, resolve, reject)
                    .catch(err => reject(err))
            });

    })
}

function fetchUrlData(url, resolve, reject) {
    return fetch(url)
        .then(res => res.text())
        .then(res => {
            if (!url.includes('.txt')) {
                resolve(wordCount(htmlWords(res)));
            } else {
                resolve(textWords(res))
            }
        });
}

function wordCount(words) {
    let wc = {};
    for (let i = 0; i < words.length; i++) {
        let w = words[i].toLowerCase();
        if (!wc[w]) wc[w] = 1;
        else wc[w] += 1;
    }
    return wc;
}

function textWords(txt) {
    txt = txt.replace(/\n/g, " ")
    txt = txt.replace(/[^A-Za-z]/g, ' ')
    return wordCount(txt.split(' ').filter((each) => {
        return each.match(/[A-Za-z]/g) !== null
    }));
}

function htmlWords(html) {
    let text = [];
    let handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error)
            console.log(error)
        else {
            parseNode(dom, text);
        }
    });
    let parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    text = filterOutCode(text);
    return text;
}

function filterOutCode(text) {
    text = text.filter(each => {
        if (text.includes(';')) return false;
        if (text.includes('{')) return false;
        return each.match(/[a-zA-Z]/g) != null
    })

    let words = [];
    for (let i = 0; i < text.length; i++) {
        if (text[i].includes('{')) continue;
        let each = text[i].split(' ');
        for (let word of each) {
            if (typeof word === 'string') {
                const len = word.trim().length;
                if (len === 0 || len === 1) continue;
                if (word.match(/[^a-zA-Z]/g) == null) {
                    words.push(word);
                }
            }
        }
    }
    return words;
}

function parseNode(dom, text) {
    for (let each of dom) {
        if (each.type === 'text' && !each.data.includes('function(')) text.push(each.data);
        if (each.children) parseNode(each.children, text);
    }
}