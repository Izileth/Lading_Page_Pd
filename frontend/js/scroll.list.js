document.addEventListener("DOMContentLoaded", function () {
    const scrollContainer = document.querySelector(".cd-bar-ct");
    const cdBar = document.querySelector(".cd-bar");

    scrollContainer.addEventListener("scroll", function () {
        if (scrollContainer.scrollLeft > 10) {
        cdBar.classList.add("scrolled-right");
        } else {
        cdBar.classList.remove("scrolled-right");
        }
        const isAtEnd =
        scrollContainer.scrollLeft + scrollContainer.clientWidth >=
        scrollContainer.scrollWidth - 10;
        if (isAtEnd) {
        cdBar.classList.add("scrolled-end");
        } else {
        cdBar.classList.remove("scrolled-end");
        }
    });
});
