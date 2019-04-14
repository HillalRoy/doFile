document.querySelectorAll("nav li a")
    .forEach((a,i,l)=>{
    if(a.innerText.toLocaleLowerCase() 
        === document.title.toLocaleLowerCase())
        return l[i].classList.add("active");
});
navSwipe($("#navul"));



loaded();

(function initNav(){
    const navRect = $("nav").getBoundingClientRect()

    $("main").style.marginTop = `${navRect.height}px`;
    $("#navul").style.top = `${navRect.height + navRect.top}px`;
}());

let maping = {
    eliments: [],
    colloms: [],
    correntPos: {
        x: 0,
        y: 0
    }
}


function mapItems() {
    const a = document.querySelectorAll('a');
    maping.eliments = a;
    let arry = [];


    a.forEach(items => {
        const rect = items.getBoundingClientRect();
        const width = rect.width;
        const top = rect.top;
        if (width != 0) {
            arry.push(top);
        }
    });


    function coundDublicates(arry) {
        let newArry = [], o = 0, value, found = 1;


        arry.forEach((v, i, a) => {
            newArry[o] = found;
            if (v === value) {
                newArry[o] = ++found;
            } else if (i != 0 && v != value) {
                found = 1;
                o++;
            }
            value = v;
        })
        return newArry;
    }


    maping.colloms = coundDublicates(arry);
    maping.eliments[0].focus();
}

function keydown(e){


    function yPos(){
        let total = 0;
        let y = 0;
        for (let i = 0; i < maping.colloms.length; i++) {
            total += maping.colloms[i];
            if (maping.correntPos.x < total)
                return y = i;
        }
        return y;
    }


    const isFirstEliment = maping.correntPos.x === 0;
    const isFirstCollom = yPos() === 0;
    const isLastEliment = maping.correntPos.x === maping.eliments.length - 1;
    const isLastCollom = yPos() === maping.colloms.length - 1;


    if(maping.eliments.length !== 0)
    switch (e.keyCode) {

        case 37:
            // Left
            e.preventDefault();

            if (!isFirstEliment) {
                maping.correntPos.x -= 1;
                maping.eliments[maping.correntPos.x].focus();
            }

            break;


        case 40:
            // Down
            e.preventDefault()

            if (!isLastEliment && !isLastCollom) {
                maping.colloms[maping.correntPos.y]
                maping.correntPos.x += maping.colloms[yPos()];
                if (!maping.eliments[maping.correntPos.x])
                    maping.correntPos.x = maping.eliments.length - 1;
                maping.eliments[maping.correntPos.x].focus();
            }
            break;


        case 39:
            // Right
            e.preventDefault()

            if (!isLastEliment) {
                maping.correntPos.x += 1;
                maping.eliments[maping.correntPos.x].focus();
            }
            break;


        case 38:
            // Up
            e.preventDefault()

            if (!isFirstEliment && !isFirstCollom) {
                maping.correntPos.x -= maping.colloms[yPos() - 1];
                maping.eliments[maping.correntPos.x].focus();
            }
            break;
    }
}
// Navigetion Button Listener
addEventListener("keydown", keydown)
mapItems()
