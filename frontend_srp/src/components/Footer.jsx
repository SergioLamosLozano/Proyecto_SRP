import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section logo-section">
          <img src="./Logo.png" alt="Logo Universidad del Valle" />
        </div>

        <div className="footer-section contact-section">
          <div>
            <strong>Institucion Educativa RP</strong>
            <p>Sede Tulua</p>
          </div>
        </div>

        <div className="footer-section addresses-section">
          <div>
            <strong>Dirección:</strong>
            <p>Carrera 14 No 4 - 48</p>
          </div>
        </div>

        <div className="footer-section addresses-section">
          <div>
            <strong>PBX:</strong>
            <p>602 2165472</p>
          </div>
          <div>
            <strong>Celular:</strong>
            <p>+57 3237274398</p>
          </div>
        </div>

        <div className="footer-section social-section">
          <div>
            <strong>Síguenos en redes sociales</strong>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/irafaelpombo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/facebook.png"
                  alt="Facebook"
                  className="social-icon"
                />
              </a>
              <a
                href="https://www.instagram.com/institutorafaelpombotulua/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/instagram.png"
                  alt="Instagram"
                  className="social-icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Rafael Pombo - Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
