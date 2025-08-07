export default function WeeklyMealSchedule({ meals }) {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-8 px-2">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Weekly Meal Schedule</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {meals.map((day, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-xl border border-gray-200 p-6 flex flex-col"
          >
            <h2 className="text-2xl font-bold text-orange-600 mb-4">{day.day}</h2>
            <ul className="space-y-3">
              {day.meals.map((meal, mIdx) => (
                <li key={mIdx} className="bg-orange-50 rounded-lg p-4 shadow text-gray-900 font-semibold">
                  <span className="block text-lg">{meal.time}: <span className="font-bold">{meal.name}</span></span>
                  <span className="block text-sm text-gray-700">{meal.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}