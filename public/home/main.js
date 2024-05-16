// change navbar styles on scroll

window.addEventListener('scroll', () => {
    document.querySelector('nav').classList.toggle
    ('window-scroll',window.scrollY > 0)
})


// show/hide faq answer
const faqs = document.querySelectorAll('.faq');
faqs.forEach(faq => {
    faq.addEventListener('click', () =>{
        faq.classList.toggle('open');

        //change icon
        const icon = faq.querySelector('.faq_icon i');
        if(icon.className === 'uil uil-plus'){
            icon.className = "uil uil-minus";
        }
        else{
            icon.className = "uil uil-plus";
        }
    })
})


// show/close nav menu
const menu = document.querySelector(".nav_menu");
const menuBtn = document.querySelector("#open-menu-btn");
const closeBtn = document.querySelector("#close-menu-btn");

menuBtn.addEventListener('click', () => {
    menu.computedStyleMap.display = 'flex';
    closeBtn.computedStyleMap.display = "inline-block";
    menuBtn.computedStyleMap.display = "none";
})

// close nav menu
closeBtn.addEventListener('click', closeNav)
const closeNav = () =>{
    menu.computedStyleMap.display = "none";
    closeBtn.computedStyleMap.display = "none";
    menuBtn.computedStyleMap.display = "inline-block";
}

