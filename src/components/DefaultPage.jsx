export function DefaultPage({ title }) {
  return (
    <>
      <h1 className="text-2xl font-bold text-primary-900 mb-4">{title}</h1>
      <div className="bg-white p-8 rounded-lg shadow-md border border-primary-200">
        <p className="text-gray-600 text-center">محتوى هذه الصفحة قيد التطوير...</p>
      </div>
    </>
  )
}
