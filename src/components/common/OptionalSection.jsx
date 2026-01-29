"use client"


export default function OptionalSection({
  title,
  question,
  value,
  onChange,
  children,
  name,
  register,
  errors,
  getFieldError,
  isFieldTouched,
  fieldPath,
}) {
  const hasError = getFieldError && fieldPath && getFieldError(fieldPath) && isFieldTouched || isFieldTouched(fieldPath)

 
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            {question} <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-6">
            <label className="flex items-center space-x-2 space-x-reverse cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200">
              <input
                type="radio"
                name={name}
                value="نعم"
                checked={value === true}
                onChange={() => onChange(true)}
                className={`h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 ${
                  hasError ? "border-red-500" : "border-gray-300"
                }`}
              />
              <span className="text-sm font-medium leading-none text-gray-700">نعم</span>
            </label>

            <label className="flex items-center space-x-2 space-x-reverse cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200">
              <input
                type="radio"
                name={name}
                value="لا"
                checked={(value === false)}
                onChange={() => onChange(false)}
                className={`h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 ${
                  hasError ? "border-red-500" : "border-gray-300"
                }`}
              />
              <span className="text-sm font-medium leading-none text-gray-700">لا</span>
            </label>
          </div>

          <div className="min-h-[20px]">
            {hasError && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span>
                {getFieldError(fieldPath)}
              </p>
            )}
          </div>
        </div>

        {value === true && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">{children}</div>
        )}
      </div>
    </div>
  )
}
