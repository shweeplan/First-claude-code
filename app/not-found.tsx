export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ background: "#0b0b0c", color: "#f2efe9", fontFamily: "system-ui", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontWeight: 300, fontSize: "2.5rem" }}>404</h1>
          <p style={{ color: "#a39e94" }}>This road leads nowhere · هذه الصفحة غير موجودة</p>
          <p><a href="/en" style={{ color: "#c9a96e" }}>Home</a> · <a href="/ar" style={{ color: "#c9a96e" }}>الرئيسية</a></p>
        </div>
      </body>
    </html>
  );
}
