export const Card = ({ title, value }) => {
  return (
    <div className="bg-purple-800 text-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-sm text-purple-200 mb-1">{title}</h2>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}

