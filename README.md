# 🏥 Burn Calculator - Calculadora de Analgesia para Quemaduras Pediátricas

## Descripción

Aplicación web responsiva diseñada para calcular las dosis apropiadas de analgésicos para pacientes pediátricos que han sufrido quemaduras. Esta herramienta ayuda a los profesionales de la salud a determinar rápidamente las dosis correctas basadas en la edad, peso, y área afectada del paciente.

## Características

### Campos de Entrada
- **Edad del Paciente**: Tres rangos de edad
  - Menor de 1 año
  - 1 a 5 años
  - 5 a 10 años
- **Peso del Paciente**: En kilogramos (2-50 kg)
- **Hora del Accidente**: Para calcular el tiempo transcurrido
- **Servicio Hospitalario**: 
  - Emergencia
  - UCI Pediátrica
  - Unidad de Quemados
  - Cirugía Pediátrica
  - Internación General
- **Zonas Afectadas**: Selección múltiple de partes del cuerpo
  - Cabeza y Cuello
  - Tórax
  - Abdomen
  - Espalda
  - Brazos (Derecho e Izquierdo)
  - Piernas (Derecha e Izquierda)

### Cálculos Realizados
La aplicación calcula las dosis de:
1. **Paracetamol (Acetaminofén)**: Para dolor leve a moderado
2. **Ibuprofeno**: Como antiinflamatorio para dolor moderado
3. **Morfina**: Para dolor severo (cuando aplique)

Las dosis se ajustan automáticamente según:
- Peso del paciente
- Edad (con multiplicadores específicos)
- Número de zonas afectadas (nivel de dolor estimado)

### Resultados Mostrados
- Dosis recomendada por medicamento
- Dosis máxima permitida
- Vía de administración
- Frecuencia de dosificación
- Dosis máxima diaria
- Recomendaciones específicas según el servicio hospitalario
- Recomendaciones basadas en el tiempo transcurrido desde el accidente

## Uso

### Instalación Local
1. Clone el repositorio:
```bash
git clone https://github.com/facuhump2409/burn-calculator.git
cd burn-calculator
```

2. Abra el archivo `index.html` en su navegador web preferido:
```bash
# En sistemas Unix/Linux/Mac
open index.html

# En Windows
start index.html

# O simplemente haga doble clic en el archivo index.html
```

### Uso de la Aplicación
1. Seleccione el rango de edad del paciente
2. Ingrese el peso en kilogramos
3. Ingrese la hora del accidente
4. Seleccione el servicio hospitalario
5. Marque todas las zonas del cuerpo afectadas por quemaduras
6. Haga clic en "Calcular Dosis de Analgesia"
7. Revise los resultados detallados mostrados

## Diseño Responsivo

La aplicación está optimizada para:
- 📱 **Móviles**: Diseño adaptado para pantallas pequeñas
- 💻 **Tablets**: Layout flexible para pantallas medianas
- 🖥️ **Desktop**: Interfaz completa para pantallas grandes

Breakpoints:
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: 
  - Diseño responsivo con media queries
  - Flexbox y CSS Grid
  - Gradientes y animaciones
  - Mobile-first approach
- **JavaScript (Vanilla)**: 
  - Cálculos de dosis
  - Validación de formularios
  - Manipulación del DOM
  - Gestión de tiempo

## Advertencias Importantes

⚠️ **Esta herramienta es solo para fines educativos e informativos.**

- Las dosis calculadas deben ser verificadas por un profesional médico calificado antes de su administración
- Siempre considere las comorbilidades y alergias del paciente
- Ajuste las dosis según la respuesta clínica del paciente
- Mantenga monitoreo continuo de signos vitales, especialmente con opioides
- Esta calculadora no reemplaza el juicio clínico profesional

## Características de Seguridad

- Validación de rangos de peso (2-50 kg)
- Multiplicadores de seguridad por edad
- Advertencias claras sobre verificación médica
- Límites de dosis máximas calculados
- Recomendaciones específicas por servicio

## Compatibilidad

La aplicación funciona en todos los navegadores modernos:
- ✅ Chrome/Edge (versiones recientes)
- ✅ Firefox (versiones recientes)
- ✅ Safari (versiones recientes)
- ✅ Opera (versiones recientes)

## Estructura del Proyecto

```
burn-calculator/
├── index.html          # Aplicación principal (HTML, CSS, JS integrados)
└── README.md           # Documentación
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Cree una rama para su feature (`git checkout -b feature/AmazingFeature`)
3. Commit sus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abra un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Contacto

Desarrollado como herramienta educativa para profesionales de la salud.

## Disclaimer

Esta herramienta NO debe utilizarse como única fuente para decisiones médicas. Siempre consulte con profesionales médicos calificados y siga los protocolos establecidos en su institución.
