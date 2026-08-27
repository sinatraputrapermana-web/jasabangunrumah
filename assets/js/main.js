/**
 * JASA BANGUN RUMAH — main.js
 * Interaksi ringan: efek navbar solid saat halaman di-scroll.
 * Ditulis dengan vanilla JS agar tetap ringan tanpa dependency tambahan.
 */
document.addEventListener("DOMContentLoaded", function () {
  var mainNav = document.getElementById("mainNav");
  var isMenuOpen = false;

  function toggleNavbarBackground() {
    // Baca scrollY sekali untuk menghindari forced reflow berulang
    var scrolled = window.scrollY > 60 || isMenuOpen;
    var hasClass = mainNav.classList.contains("navbar-scrolled");
    // Hanya ubah DOM jika state benar-benar berubah
    if (scrolled && !hasClass) {
      mainNav.classList.add("navbar-scrolled");
    } else if (!scrolled && hasClass) {
      mainNav.classList.remove("navbar-scrolled");
    }
  }

  // Jalankan sekali saat load, lalu setiap kali user scroll
  toggleNavbarBackground();
  window.addEventListener("scroll", toggleNavbarBackground, { passive: true });

  // Tambahkan background saat menu mobile dibuka
  var navbarToggler = document.querySelector(".navbar-toggler");
  if (navbarToggler) {
    navbarToggler.addEventListener("click", function () {
      isMenuOpen = !isMenuOpen;
      mainNav.classList.toggle("menu-open");
      toggleNavbarBackground();
    });
  }

  /**
   * Back to Top Button
   */
  var backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    }, { passive: true });

    backToTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /**
   * Filter Galeri (halaman galeri.html)
   * Menyaring item portofolio berdasarkan kategori tanpa reload halaman.
   */
  var filterButtons = document.querySelectorAll(".gallery-filter .filter-btn");
  var galleryItems = document.querySelectorAll(".gallery-grid [data-category]");

  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-filter");

        filterButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        galleryItems.forEach(function (item) {
          var category = item.getAttribute("data-category");
          var show = target === "semua" || target === category;
          item.style.display = show ? "" : "none";
        });
      });
    });
  }

  /**
   * Pagination Blog (halaman blog.html)
   */
  var blogItems = document.querySelectorAll(".blog-list-card");
  var paginationContainer = document.getElementById("blogPagination");
  var itemsPerPage = 5;
  var currentPage = 1;

  if (blogItems.length > 0 && paginationContainer) {
    var totalPages = Math.ceil(blogItems.length / itemsPerPage);

    function renderPagination() {
      paginationContainer.innerHTML = "";

      // Previous Button
      var prevLi = document.createElement("li");
      prevLi.className = "page-item" + (currentPage === 1 ? " disabled" : "");
      prevLi.innerHTML = '<a class="page-link" href="#" tabindex="-1" aria-disabled="' + (currentPage === 1) + '">Sebelumnya</a>';
      prevLi.addEventListener("click", function(e) {
        e.preventDefault();
        if (currentPage > 1) {
          currentPage--;
          showPage(currentPage);
        }
      });
      paginationContainer.appendChild(prevLi);

      // Page Numbers
      var maxPagesToShow = 5;
      var startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      var endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (var i = startPage; i <= endPage; i++) {
        var pageLi = document.createElement("li");
        pageLi.className = "page-item" + (i === currentPage ? " active" : "");
        if (i === currentPage) {
          pageLi.setAttribute("aria-current", "page");
        }
        
        var pageLink = document.createElement("a");
        pageLink.className = "page-link page-num";
        pageLink.href = "#";
        pageLink.textContent = i;
        
        (function(pageNum) {
          pageLink.addEventListener("click", function(e) {
            e.preventDefault();
            currentPage = pageNum;
            showPage(currentPage);
          });
        })(i);

        pageLi.appendChild(pageLink);
        paginationContainer.appendChild(pageLi);
      }

      // Next Button
      var nextLi = document.createElement("li");
      nextLi.className = "page-item" + (currentPage === totalPages ? " disabled" : "");
      nextLi.innerHTML = '<a class="page-link" href="#">Berikutnya</a>';
      nextLi.addEventListener("click", function(e) {
        e.preventDefault();
        if (currentPage < totalPages) {
          currentPage++;
          showPage(currentPage);
        }
      });
      paginationContainer.appendChild(nextLi);
    }

    function showPage(page) {
      var start = (page - 1) * itemsPerPage;
      var end = start + itemsPerPage;

      blogItems.forEach(function (item, index) {
        if (index >= start && index < end) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });

      renderPagination();

      // Scroll to top of blog section
      var blogSection = document.getElementById("blog-heading");
      if (blogSection) {
        var yOffset = -100; 
        var y = blogSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
      }
    }

    // Initialize first page
    showPage(currentPage);
  }
});
