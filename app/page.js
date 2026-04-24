import AuthButton from "@/components/AuthButton"

export default function HomePage() {
  return (
    <main style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #eff6ff, #ffffff)", padding: "1rem"}}>
      <div style={{maxWidth: "600px", width: "100%", textAlign: "center"}}>
        <div style={{display: "inline-flex", alignItems: "center", justifyContent: "center", width: "80px", height: "80px", borderRadius: "16px", background: "#2563eb", color: "white", fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1.5rem"}}>
          B
        </div>
        <h1 style={{fontSize: "3rem", fontWeight: "bold", color: "#111827", marginBottom: "1rem"}}>
          Boom Plus Marketplace
        </h1>
        <p style={{fontSize: "1.25rem", color: "#4b5563", marginBottom: "2rem"}}>
          Video shopping Thailand
        </p>
        <div style={{background: "white", borderRadius: "12px", border: "1px solid #f3f4f6", padding: "1.5rem", marginBottom: "2rem"}}>
          <p style={{fontSize: "1.125rem", color: "#374151", marginBottom: "1rem"}}>
            <strong>Status: In Development</strong>
          </p>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.875rem", color: "#4b5563"}}>
            <div>Database: 42 tables</div>
            <div>Security: 138 policies</div>
            <div>Auth: Working</div>
            <div>10 Branches</div>
          </div>
        </div>
        
        <AuthButton />
        
        <p style={{fontSize: "0.875rem", color: "#6b7280", marginTop: "2rem"}}>
          Boom Plus Shop Co., Ltd.
        </p>
      </div>
    </main>
  )
}