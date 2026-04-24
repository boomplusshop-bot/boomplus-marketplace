import { createClient } from '@/lib/supabase/server';

export default async function TestPage() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('connection_test')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            ❌ Connection Failed
          </h1>
          <div className="bg-red-100 rounded-lg p-4 mb-4">
            <p className="font-mono text-sm text-red-900 break-all">
              {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white text-2xl">
              ✓
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Supabase Connected!
              </h1>
              <p className="text-sm text-gray-500">
                Boom Plus Marketplace · Day 1
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              🎉 Foundation พร้อมใช้งาน! เว็บของคุณคุยกับ database ได้แล้ว
            </p>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-3">
            📊 Data from Supabase:
          </h2>

          <div className="space-y-2">
            {data.map((row) => (
              <div
                key={row.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <p className="text-gray-900 font-medium">{row.message}</p>
                  <span className="text-xs text-gray-400">#{row.id}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(row.created_at).toLocaleString('th-TH')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-bold text-gray-800 mb-3">
            ✅ Infrastructure Status
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Next.js + Tailwind CSS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Supabase Database (Singapore)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Authentication Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Server Components</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Row Level Security Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}