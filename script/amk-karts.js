document.addEventListener("DOMContentLoaded", function () {
  /* ================= FILTER ================= */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");
  const cookieBanner = document.querySelector(".cookie-banner");
  const cookieAccept = document.getElementById("cookieAccept");

  /* ================= MODAL ================= */
  const enquiryModal = document.getElementById("enquiryModal");
  const enquiryButtons = document.querySelectorAll(".btn-enquire");
  const closeModal = document.getElementById("closeModal");
  const enquiryForm = document.getElementById("enquiryForm");

  /* ================= OPEN MODAL ================= */
  enquiryButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      enquiryModal.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  });

  /* ================= CLOSE MODAL ================= */
  function closeEnquiryModal() {
    enquiryModal.classList.remove("show");
    document.body.style.overflow = "auto";
    enquiryForm.reset();
  }

  closeModal.addEventListener("click", closeEnquiryModal);

  enquiryModal.addEventListener("click", function (e) {
    if (e.target === enquiryModal) {
      closeEnquiryModal();
    }
  });

  /* ================= FORM SUBMIT ================= */
  enquiryForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = enquiryForm.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = {
      customer_name: document.getElementById("name").value.trim(),
      customer_email: document.getElementById("email").value.trim(),
      customer_mobile: document.getElementById("mobile").value.trim(),
      days_to_buy: document.getElementById("days").value,
      kart_category: document.getElementById("category").value,
      customer_message:
        document.getElementById("message").value.trim() || "No message",
    };

    // Validation
    if (
      !formData.customer_name ||
      !formData.customer_email ||
      !formData.customer_mobile ||
      !formData.days_to_buy ||
      !formData.kart_category
    ) {
      alert("Please fill all required fields");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customer_email)) {
      alert("Enter a valid email");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }

    if (formData.customer_mobile.replace(/\D/g, "").length < 10) {
      alert("Enter a valid mobile number");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }

    // SEND EMAIL
    emailjs
      .send("service_gt44tfc", "template_kevltr9", formData)
      .then(function (response) {
        console.log("Email sent", response);

        const successMsg = document.createElement("div");
        successMsg.className = "success-message";
        successMsg.textContent =
          "Thank you! Your enquiry has been sent successfully.";
        enquiryForm.prepend(successMsg);

        // Backup in localStorage
        const enquiries = JSON.parse(
          localStorage.getItem("amkEnquiries") || "[]"
        );
        enquiries.push({ ...formData, time: new Date().toISOString() });
        localStorage.setItem("amkEnquiries", JSON.stringify(enquiries));

        setTimeout(closeEnquiryModal, 2000);
      })
      .catch(function (error) {
        console.error("Email failed", error);

        const errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.textContent = "Failed to send enquiry. Please try again.";
        enquiryForm.prepend(errorMsg);
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  });

  /* ================= FILTER ================= */
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      productCards.forEach((card) => {
        if (filter === "all" || card.dataset.category === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* ================= COOKIES ================= */
  function showCookieBanner() {
    if (!localStorage.getItem("cookieAccepted")) {
      cookieBanner.classList.add("show");
    }
  }

  cookieAccept.addEventListener("click", function () {
    localStorage.setItem("cookieAccepted", "true");
    cookieBanner.classList.remove("show");
  });

  setTimeout(showCookieBanner, 1000);

  /* ================= SMOOTH SCROLL ================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ================= ANIMATION ================= */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeIn 0.6s ease-out forwards";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  productCards.forEach((card) => observer.observe(card));
});

/* ================= FADE-IN CSS ================= */
const style = document.createElement("style");
style.textContent = `
@keyframes fadeIn {
  from { opacity:0; transform:translateY(20px); }
  to { opacity:1; transform:translateY(0); }
}`;
document.head.appendChild(style);
