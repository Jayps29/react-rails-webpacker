import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", function () {
  let notice = document.querySelector("meta[name='notice-message']");
  let alert = document.querySelector("meta[name='alert-message']");

  if (notice && notice.content.trim() !== "") {
    Swal.fire({
      title: "Success!",
      text: notice.content,
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  }

  if (alert && alert.content.trim() !== "") {
    Swal.fire({
      title: "Error!",
      text: alert.content,
      icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: "OK",
    });
  }
});
