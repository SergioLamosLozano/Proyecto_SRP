/**
 * Utilidad para controlar la navegación del navegador
 * Deshabilita los botones de adelante/atrás para forzar el uso de breadcrumbs
 */

class NavigationControl {
  constructor() {
    this.isEnabled = false;
    this.originalPushState = null;
    this.originalReplaceState = null;
  }

  /**
   * Habilita el control de navegación
   * Deshabilita los botones de adelante/atrás del navegador
   */
  enable() {
    if (this.isEnabled) return;

    // Guardar métodos originales
    this.originalPushState = window.history.pushState;
    this.originalReplaceState = window.history.replaceState;

    // Agregar estado inicial para prevenir navegación hacia atrás
    window.history.pushState(null, null, window.location.pathname);

    // Interceptar eventos de navegación
    window.addEventListener("popstate", this.handlePopState);
    window.addEventListener("beforeunload", this.handleBeforeUnload);

    // Interceptar métodos de history para mantener control
    window.history.pushState = this.controlledPushState.bind(this);
    window.history.replaceState = this.controlledReplaceState.bind(this);

    this.isEnabled = true;
    console.log(
      "🚫 Navegación del navegador deshabilitada. Usa breadcrumbs para navegar."
    );
  }

  /**
   * Deshabilita el control de navegación
   * Restaura el comportamiento normal del navegador
   */
  disable() {
    if (!this.isEnabled) return;

    // Remover event listeners
    window.removeEventListener("popstate", this.handlePopState);
    window.removeEventListener("beforeunload", this.handleBeforeUnload);

    // Restaurar métodos originales
    if (this.originalPushState) {
      window.history.pushState = this.originalPushState;
    }
    if (this.originalReplaceState) {
      window.history.replaceState = this.originalReplaceState;
    }

    this.isEnabled = false;
    console.log("✅ Navegación del navegador habilitada.");
  }

  /**
   * Maneja el evento popstate (botones adelante/atrás)
   */
  handlePopState = (event) => {
    event.preventDefault();

    // Mostrar notificación al usuario
    this.showNavigationWarning();

    // Mantener la página actual
    window.history.pushState(null, null, window.location.pathname);
  };

  /**
   * Maneja el evento beforeunload
   */
  handleBeforeUnload = (event) => {
    // Opcional: mostrar confirmación al cerrar/recargar
    const message = "Los cambios no guardados se perderán. ¿Estás seguro?";
    event.returnValue = message;
    return message;
  };

  /**
   * Versión controlada de pushState
   */
  controlledPushState(state, title, url) {
    // Permitir navegación programática (como React Router)
    this.originalPushState.call(window.history, state, title, url);
    // Agregar estado adicional para mantener control
    this.originalPushState.call(window.history, null, null, url);
  }

  /**
   * Versión controlada de replaceState
   */
  controlledReplaceState(state, title, url) {
    this.originalReplaceState.call(window.history, state, title, url);
  }

  /**
   * Muestra advertencia de navegación
   */
  showNavigationWarning() {
    // Crear notificación personalizada
    const notification = document.createElement("div");
    notification.className = "navigation-warning";
    notification.innerHTML = `
            <div class="warning-content">
                <span class="warning-icon">🧭</span>
                <span class="warning-text">Usa las breadcrumbs para navegar</span>
            </div>
        `;

    // Estilos inline para la notificación
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f39c12;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            animation: slideIn 0.3s ease-out;
        `;

    // Agregar animación CSS
    if (!document.querySelector("#navigation-warning-styles")) {
      const style = document.createElement("style");
      style.id = "navigation-warning-styles";
      style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .warning-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .warning-icon {
                    font-size: 18px;
                }
            `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remover notificación después de 3 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }

  /**
   * Permite navegación programática específica (para breadcrumbs)
   */
  allowNavigation(callback) {
    const wasEnabled = this.isEnabled;
    if (wasEnabled) {
      this.disable();
    }

    callback();

    if (wasEnabled) {
      // Re-habilitar después de un pequeño delay
      setTimeout(() => this.enable(), 100);
    }
  }
}

// Crear instancia singleton
const navigationControl = new NavigationControl();

export default navigationControl;

// Funciones de conveniencia
export const disableBrowserNavigation = () => navigationControl.enable();
export const enableBrowserNavigation = () => navigationControl.disable();
export const allowNavigation = (callback) =>
  navigationControl.allowNavigation(callback);
