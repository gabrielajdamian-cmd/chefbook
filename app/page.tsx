import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si el usuario ya está autenticado, lo enviamos al panel de recetas
  if (user) {
    redirect("/recetas");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
            📖 Chefbook
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Tu recetario digital personal. Guarda, organiza y calcula las proporciones de tus ingredientes fácilmente.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/login"
            className="flex w-full justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Crear una Cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
