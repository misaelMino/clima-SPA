export default function CitySelect({ cities = [], value, onChange, disabled }) {
  const maxLength = Math.max(...cities.map((c) => c.nombre.length), 20);

  return (
    <div className="w-full max-w-48">
      <div className="relative">
        <select
          className="block rounded-xl border-2 border-white/20 bg-white/90 backdrop-blur-md px-4 py-3 pr-4 text-sm font-medium shadow-lg
                     focus:outline-none focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 transition-all duration-200
                     hover:bg-white/95 hover:border-white/30 hover:shadow-xl"
          style={{ minWidth: `${Math.max(maxLength * 6, 120)}px` }}
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? null : Number(v));
          }}
          disabled={disabled}
        >
          <option value="">
            {disabled ? "Cargando..." : "Seleccioná una ciudad…"}
          </option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
