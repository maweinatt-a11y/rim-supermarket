export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">

      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md">

        <h1 className="text-7xl font-bold text-blue-600 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-bold mb-3">
          الصفحة غير موجودة
        </h2>

        <p className="text-gray-600 mb-8">
          عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم حذفها.
        </p>

        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          العودة إلى الرئيسية
        </a>

      </div>

    </main>
  );
}