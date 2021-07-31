
let ul;
let loading;
let pvElem;
pvElem = document.getElementById('previously-searched');
ul = document.getElementById('list');

loading = document.getElementById('loading');
loading.style.display = 'none';

async function fetchWordCount(url) {
    let wordCount;
    document.getElementById('url').value = url;
    loading.style.display = 'block';
    url = url.replaceAll('/', '%2F')
    await fetch('http://localhost:3000/' + url).then(res => res.json()).then(res => {
        wordCount = res
        loading.style.display = 'none';

        let previouslyVisted = JSON.parse(localStorage.getItem("pv")) || [];
        if (!previouslyVisted.includes(url)) {
            pushUrlButton(url);
        }
    });


    let wordCountTexts = [];
    for (let key of Object.keys(wordCount)) {
        wordCountTexts.push(key + ': ' + wordCount[key]);
    }

    wordCountTexts.sort((a, b) => Number.parseInt(b.split(': ')[1]) - Number.parseInt(a.split(': ')[1]))

    for (let each of wordCountTexts.splice(0, 100)) {
        let li = document.createElement('li');
        li.innerText = each;
        ul.append(li);
    }

}

function pushUrlButton(url) {
    let previouslyVisted = JSON.parse(localStorage.getItem("pv")) || [];
    if (!previouslyVisted.includes(url)) {
        previouslyVisted.push(url);
        localStorage.setItem("pv", JSON.stringify(previouslyVisted));
    }

    let button = document.createElement('button');
    button.innerText = url;
    button.onclick = () => { removeAllChildNodes(ul); fetchWordCount(url); }
    pvElem.append(button);
}

function init() {
    setTimeout(() => {
        let previouslyVisted = JSON.parse(localStorage.getItem("pv")) || [];
        for (let each of previouslyVisted) {
            pushUrlButton(each);
        }
    }, 100);
}

function search() {
    removeAllChildNodes(ul);
    fetchWordCount(document.getElementById('url').value);
}


function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

init();