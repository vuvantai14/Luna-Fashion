import { initCommonLayout } from "./common.js";
import { initCartControls } from "./cart.js";

function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");
  if (!contactForm || !formMessage) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    formMessage.className = "form-message";

    if (!fullName || !email || !message) {
      formMessage.textContent = "Vui lòng nhập đầy đủ họ tên, email và nội dung.";
      formMessage.classList.add("error");
      return;
    }

    if (!email.includes("@")) {
      formMessage.textContent = "Email chưa đúng định dạng.";
      formMessage.classList.add("error");
      return;
    }

    formMessage.textContent = "Gửi liên hệ thành công. Luna Fashion sẽ phản hồi bạn sớm!";
    formMessage.classList.add("success");
    contactForm.reset();
  });
}

initCommonLayout();
initCartControls();
initContactForm();
