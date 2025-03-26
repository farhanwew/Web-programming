document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const menuCategories = document.querySelectorAll(".menu-category");

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            const filter = this.getAttribute("data-filter");

            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            menuCategories.forEach(category => {
                if (filter === "all" || category.getAttribute("data-category") === filter) {
                    category.style.display = "block";
                } else {
                    category.style.display = "none";
                }
            });
        });
    });
});
