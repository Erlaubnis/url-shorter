let input = document.getElementById('url');
let button = document.getElementById('create');

input.addEventListener('click', () => {
    input.select();
    input.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
});

const showData = (data) => {
    if(data != 500) {
        let div = document.createElement('div');
        div.classList.add('data');
    
        let p = document.createElement('p');
    
        input.value = window.location+data.short;

        p.innerHTML = 'Dein neuer Short Link:<br> <a target="_blank" href="'+window.location+'/'+data.short+'">'+window.location+data.short+'</a>!';
    
        div.appendChild(p);
        document.body.appendChild(div);
    
        input.disabled = true;
        button.disabled = true;

    }
};

button.addEventListener('click', () => {
    if(url.value && url.value.match(/^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)
           (?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/)) {
        (async () => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        
        const body = `{"url":"${input.value}"}`;

        const init = {
            method: 'POST',
            headers,
            body
        };
        
        const response = await fetch('http://localhost:3000/url', init);
        console.log(`response status is ${response.status}`);
        const mediaType = response.headers.get('content-type');
        let data;
        if (mediaType.includes('json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        showData(data);
        })();
    }
    
});
