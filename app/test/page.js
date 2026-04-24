export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 text-white text-4xl font-bold mb-6 shadow-lg">
          B
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Boom Plus
          <span className="block text-blue-600 mt-2">Marketplace</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          วิดีโอช้อปไทย · ค่าส่งทุน · ค่าธรรมเนียม 2%
        </p>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <p className="text-lg text-gray-700 mb-4">
            🚀 <strong>กำลังพัฒนา...</strong>
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>✅ Database: 42 tables</div>
            <div>✅ Security: 138 RLS policies</div>
            <div>✅ Auth: Configured</div>
            <div>✅ 10 Franchise branches</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          
            href="/signup"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            สมัครสมาชิก
          </a>
          
            href="/login"
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            เข้าสู่ระบบ
          </a>
          
            href="/test"
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            ทดสอบระบบ
          </a>
        </div>
        <p className="text-sm text-gray-500 mt-8">
          © 2026 Boom Plus Shop Co., Ltd.
        </p>
      </div>
    </main>
  )
}