import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Loginpage.css";
import "../styles/PasswordRecovery.css";

const PasswordRecovery = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1: Enter ID, 2: Confirm email, 3: Reset password
  const [formData, setFormData] = useState({
    identification: "",
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleIdSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call to get associated email
    // In a real implementation, this would call your backend API
    setTimeout(() => {
      // Mock response with email
      setFormData({
        ...formData,
        email: "usuario@example.com" // This would come from the backend in reality
      });
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending recovery email
    // In a real implementation, this would call your backend API
    setTimeout(() => {
      setLoading(false);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Correo enviado",
        text: "Se ha enviado un correo de recuperación a su dirección de correo asociada. (Simulación: use el código 123456)",
        timer: 4000,
        showConfirmButton: false
      });
      setStep(3);
    }, 1000);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate code verification
    setTimeout(() => {
      setLoading(false);
      if (formData.code === "123456" || formData.code.trim() !== "") {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Código verificado",
          text: "El código es correcto. Ahora puede establecer su nueva contraseña.",
          timer: 2000,
          showConfirmButton: false
        });
        setStep(4);
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Código inválido",
          text: "El código ingresado no es correcto. Intente con 123456.",
        });
      }
    }, 1000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    setLoading(true);

    // Simulate password reset
    // In a real implementation, this would call your backend API
    setTimeout(() => {
      setLoading(false);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Éxito",
        text: "Su contraseña ha sido restablecida correctamente.",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        onClose();
      });
    }, 1000);
  };

  return (
    <div className="password-recovery-modal">
      <div className="password-recovery-container">
        <div className="password-recovery-header">
          <h2>Recuperar Contraseña</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {step === 1 && (
          <div className="recovery-step">
            <p>Ingrese su número de identificación para comenzar el proceso de recuperación de contraseña.</p>
            <form onSubmit={handleIdSubmit}>
              <input
                type="text"
                name="identification"
                placeholder="Número de identificación"
                className="Login-Inputs"
                value={formData.identification}
                onChange={handleInputChange}
                required
              />
              <button
                type="submit"
                className="Login-buttons"
                disabled={loading}
              >
                {loading ? "Verificando..." : "Continuar"}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="recovery-step">
            <p>Se ha encontrado una cuenta asociada con esta identificación:</p>
            <div className="email-display">
              <strong>{formData.email}</strong>
            </div>
            <p>¿Desea enviar un correo de recuperación a esta dirección?</p>
            <div className="recovery-buttons">
              <button
                className="Login-buttons"
                onClick={handleSendEmail}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Correo"}
              </button>
              <button
                className="Login-buttons secondary"
                onClick={() => setStep(1)}
              >
                Cambiar Identificación
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="recovery-step">
            <h2>Verificar Código</h2>
            <p>Hemos enviado un código de recuperación a su correo electrónico. Por favor, ingréselo a continuación.</p>
            <form onSubmit={handleVerifyCode}>
              <input
                type="text"
                name="code"
                placeholder="Ingrese el código (ej. 123456)"
                className="Login-Inputs"
                value={formData.code}
                onChange={handleInputChange}
                required
              />
              <button
                type="submit"
                className="Login-buttons"
                disabled={loading}
              >
                {loading ? "Verificando..." : "Verificar Código"}
              </button>
              <div 
                className="resend-link"
                onClick={() => {
                  Swal.fire("Reenviado", "Se ha reenviado el código a su correo.", "info");
                }}
              >
                ¿No recibió el código? Reenviar
              </div>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="recovery-step">
            <h2>Establecer nueva contraseña</h2>
            <p>Ingrese su nueva contraseña:</p>
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                name="newPassword"
                placeholder="Nueva contraseña"
                className="Login-Inputs"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar nueva contraseña"
                className="Login-Inputs"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <button
                type="submit"
                className="Login-buttons"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Restablecer Contraseña"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordRecovery;