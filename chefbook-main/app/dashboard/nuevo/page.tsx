export default function NuevaRecetaPage() {
  return (
    <div>
      <h1>Nueva Receta</h1>

      <form>
        <input
          type="text"
          placeholder="Título"
        />

        <br />

        <textarea
          placeholder="Descripción"
        ></textarea>

        <br />

        <button>
          Guardar receta
        </button>
      </form>
    </div>
  );

  {/* Formulario para publicar nueva receta */}
}