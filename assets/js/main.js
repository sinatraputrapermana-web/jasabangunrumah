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
  var paginationLinks = document.querySelectorAll(".pagination .page-link");
  var itemsPerPage = 5;
  var currentPage = 1;

  if (blogItems.length > 0 && paginationLinks.length > 0) {
    var totalPages = Math.ceil(blogItems.length / itemsPerPage);

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

      // Update active state on pagination
      document.querySelectorAll(".pagination .page-item").forEach(function (li) {
        li.classList.remove("active");
        li.classList.remove("disabled");
      });

      // Handle Previous button
      var prevBtn = document.querySelector(".pagination .page-item:first-child");
      if (page === 1) {
        prevBtn.classList.add("disabled");
      }

      // Handle Next button
      var nextBtn = document.querySelector(".pagination .page-item:last-child");
      if (page === totalPages) {
        nextBtn.classList.add("disabled");
      }

      // Handle Number buttons
      document.querySelectorAll(".pagination .page-item").forEach(function (li, index) {
        if (index > 0 && index <= totalPages) {
          if (index === page) {
            li.classList.add("active");
          }
        }
      });
    }

    // Initialize first page
    showPage(currentPage);

    // Add click events to pagination links
    paginationLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var text = this.textContent.trim();

        if (text === "Sebelumnya") {
          if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
          }
        } else if (text === "Berikutnya") {
          if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
          }
        } else {
          var pageNum = parseInt(text);
          if (!isNaN(pageNum)) {
            currentPage = pageNum;
            showPage(currentPage);
          }
        }
        
        // Scroll to top of blog section
        var blogSection = document.getElementById("blog-heading");
        if (blogSection) {
          var yOffset = -100; 
          var y = blogSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({top: y, behavior: 'smooth'});
        }
      });
    });
  }
});
