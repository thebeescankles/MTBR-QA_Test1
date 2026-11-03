# Estudio de factibilidad — Automatización de "New User" (registro)

## 1. Alcance analizado

La funcionalidad "New User" corresponde al formulario de registro accesible
desde la página de login (`/register`) de DemoQA. El formulario solicita:
nombre, apellido, nombre de usuario, contraseña y requiere resolver un
**Google reCAPTCHA v2** antes de enviarlo.

## 2. Veredicto

**Automatización E2E del flujo completo: NO aplica.**
**Automatización parcial (validaciones del formulario): aplica, con límites.**

## 3. Justificación técnica

- **Bloqueador principal: reCAPTCHA.** El envío del formulario está protegido
  por un CAPTCHA con claves de producción. Resolverlo mediante automatización
  implicaría eludir un mecanismo antifraude, lo cual viola los términos de
  servicio de Google y de DemoQA. No es una limitación técnica superable de
  forma legítima; es una exclusión deliberada del diseño.
- **Verificaciones previas al captcha sí son automatizables:** campos vacíos,
  política de contraseña (mayúscula, minúscula, dígito, carácter especial,
  longitud mínima), y usuario duplicado. Todas producen mensajes visibles
  antes de intervenir el captcha.
- **Nota relevante:** el endpoint `POST /Account/v1/User` de la API de DemoQA
  **no exige captcha** (la propia suite de este entregable lo usa para
  provisionar usuarios de prueba). Por tanto, registrar un usuario vía API
  es totalmente automatizable; lo que NO se puede validar por esa vía es el
  formulario UI en sí (incluyendo el captcha), que es justamente el núcleo
  del riesgo.

## 4. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Captcha no resoluble de forma legítima | Bloquea el happy path E2E | Excluir el envío; cubrir solo validaciones previas |
| Usuarios residuales en el entorno compartido | Contaminación de datos | Teardown vía API (delete) cuando el usuario llegue a crearse |
| Inestabilidad del entorno demo (el registro ha llegado a deshabilitarse en el pasado por abuso) | Falsos fallos | Marcar los casos como `@flaky-risk` y monitorizar |
| Selectores frágiles si cambia el formulario | Mantenimiento | POM centraliza los localizadores |

## 5. Dependencias

- Claves de prueba de reCAPTCHA controladas por el equipo dueño del entorno
  (no disponibles en DemoQA, que es un entorno público sin control nuestro).
- Confirmación del dueño del producto de que registrar usuarios reales en un
  entorno demo es aceptable como efecto secundario de las pruebas.

## 6. Recomendación final

Automatizar únicamente las **validaciones negativas del formulario** (campos
obligatorios, política de contraseña, usuario duplicado) y el **flujo de
login posterior** usando un usuario creado vía API. Dejar el envío exitoso
del registro como **prueba manual/exploratoria** y documentar la exclusión
del captcha como decisión explícita. Si el objetivo de negocio cambia a
"registrar usuarios de forma masiva", el camino correcto es la API
(`POST /Account/v1/User`), no la UI.