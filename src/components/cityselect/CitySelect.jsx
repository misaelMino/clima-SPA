export default function CitySelect({ cities = [], value, onChange, disabled }) {
  return (
    <div className="w-full max-w-sm">
      <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
      <div className="relative">
        <select
          className="block w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2 pr-9 text-sm shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
        >
          <option value="" disabled>{disabled ? "Cargando..." : "Seleccioná una ciudad…"}</option>
          {cities.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}
