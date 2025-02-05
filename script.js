const flipCards = document.querySelectorAll('.flip-card')

flipCards.forEach((obj) => {
    obj.addEventListener('click', ()=> {
        obj.classList.toggle('flipped')
    })
})