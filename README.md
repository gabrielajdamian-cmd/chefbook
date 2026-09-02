https://chefbook-gamma.vercel.app/login

#  ChefBook

ChefBook es una aplicación web moderna desarrollada con **Next.js** para la gestión e interacción de recetas culinarias, consumo de APIs externas de cocina y control de usuarios con Supabase.

---

##  Tecnologías Utilizadas

* **Framework:** [Next.js](https://nextjs.org/) (React Framework con App Router)
* **Lenguaje:** TypeScript
* **Base de Datos y Autenticación:** Supabase
* **API Externa:** [TheMealDB](https://www.themealdb.com/)
* **Despliegue:** Vercel

---

##  Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

* Node.js (versión 18 o superior)
* npm o yarn

---

##  Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/chefbook.git](https://github.com/tu-usuario/chefbook.git)
   cd chefbook

   Instalar dependencias:
   npm install

   Configurar variables de entorno:
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

Ejecutar el servidor de desarrollo:

npm run dev

Abrir la aplicación:
Accede a http://localhost:3000 en tu navegador.

Correo: daniela_pilco22@hotmail.com
Contraseña:12345678
Rol:Lector

Correo: esteban_simbana22@hotmail.com
Contraseña:12345678
Rol:chef

Rutas Principales
/ - Página de bienvenida.

/login - Inicio de sesión y registro con Supabase.

/recetas - Catálogo interactivo de recetas obtenidas mediante la API externa.