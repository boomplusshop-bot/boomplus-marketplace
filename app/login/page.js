import { Suspense } from "react"
import Link from "next/link"
import LoginForm from "./LoginForm"

export default function LoginPage() {
  return (
    <main style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #eff6ff, #ffffff)", padding: "1rem"}}>
      <style>{`
        input::placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
          font-weight: 400 !important;
        }
        input:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        input:hover:not(:focus) {
          border-color: #9ca3af !important;
        }
      `}</style>

      <div style={{maxWidth: "440px", width: "100%"}}>
        
        <Link href="/" style={{display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", textDecoration: "none"}}>
          <div style={{width: "64px", height: "64px", borderRadius: "16px", background: "#2563eb", color: "white", fontSize: "2rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"}}>
            B
          </div>
        </Link>

        <Suspense fallback={
          <div style={{background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "2.5rem 2rem", textAlign: "center"}}>
            <p style={{color: "#6b7280"}}>กำลังโหลด...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p style={{textAlign: "center", fontSize: "0.8rem", color: "#6b7280", marginTop: "1.5rem"}}>
          Boom Plus Marketplace © 2026
        </p>

      </div>
    </main>
  )
}