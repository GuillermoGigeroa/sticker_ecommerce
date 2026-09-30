# 🖼️ Cuadro Vivo — Espejo Interactivo y Cabina de Fotos con Marcos Decorativos

Una aplicación web temporal, elegante y funcional que transforma tu cámara web en un cuadro interactivo con marcos decorativos, filtros en tiempo real y función de captura fotográfica descargable en PNG.

---

## ✨ Características Principales

1. **Espejo y Cámara en Vivo:**
   - Visualización fluida mediante `getUserMedia` de HTML5.
   - Botón para encender y apagar la cámara en cualquier momento.
   - **Modo Espejo (On/Off):** Inversión horizontal para verse de forma natural como en un espejo real.

2. **6 Marcos Decorativos Seleccionables:**
   - 📸 **Polaroid Retro:** Borde blanco clásico con pie de foto personalizable (puedes escribir tu propio texto en tiempo real) y fecha automática.
   - 🏛️ **Museo Clásico Dorado:** Moldura dorada con sombras talladas, paspartú crema y placa inferior grabada.
   - 🌼 **Flores & Margaritas:** Esquinas ornamentadas con margaritas y tonos primaverales cálidos.
   - ⚡ **Neón Cyber:** Bordes animados con iluminación neón cian/rosa y estética cyberpunk.
   - 🪵 **Madera Rústica:** Portarretratos acogedor con bisel y textura de madera noble.
   - 🪟 **Cristal Moderno:** Efecto glassmorphism contemporáneo con transparencias y bordes suaves.

3. **Filtros Visuales en Tiempo Real:**
   - Natural
   - Blanco y Negro dramático
   - Sepia Vintage
   - Atardecer Cálido (Golden Hour)
   - Cian & Frío (Cyber)
   - Retrato Suave

4. **Cabina de Fotos (Snapshot):**
   - Temporizador de 3 segundos con cuenta regresiva en pantalla y beeps audibles.
   - Animación de flash fotográfico.
   - Renderizado completo en Canvas de alta resolución con el marco exacto, decoraciones, textos y filtros aplicados.
   - Vista previa emergente y botón para **Descargar en PNG**.

---

## 🚀 Cómo Usar Localmente

1. Puedes abrir directamente el archivo `index.html` en cualquier navegador moderno (Google Chrome, Firefox, Edge, Safari).
2. O bien, si usas **Visual Studio Code**:
   - Abre la carpeta `camara-cuadro-decorativo`.
   - Haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.
3. Al abrir la página, el navegador te solicitará permiso para acceder a la cámara web. Haz clic en **Permitir**.

---

## 🌐 Publicación en GitHub Pages (Opcional)

Si deseas dejar esta página en línea para acceder desde cualquier dispositivo:

1. Crea un repositorio en GitHub (ej. `mi-cuadro-camara`).
2. Sube los archivos:
   ```bash
   git init
   git add .
   git commit -m "feat: pagina de camara en cuadro decorativo"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/mi-cuadro-camara.git
   git push -u origin main
   ```
3. En GitHub, ve a **Settings > Pages** y activa el despliegue desde la rama `main` en la carpeta `/ (root)`.
