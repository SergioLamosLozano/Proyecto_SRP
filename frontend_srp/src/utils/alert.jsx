import Swal from "sweetalert2";

export const Alert = (state, description, title = "") => {
  return Swal.fire({
    icon: state,
    title: title,
    text: description,
    timer: 3000,
    showConfirmButton: false,
    timerProgressBar: true,
  });
};
