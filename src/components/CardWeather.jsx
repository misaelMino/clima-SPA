export default function CardWeather({ title, temperature, description }) {
  return (
    <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <p className="text-5xl font-extrabold text-blue-600 mt-3">
        {temperature}°C
      </p>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
