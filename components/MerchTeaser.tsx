export function MerchTeaser() {
  return (
    <section className="merch" aria-labelledby="merch-title">
      <div className="merch-starburst" aria-hidden="true">SOON!</div>
      <div className="merch-copy">
        <p>YOU LOOK TERRIBLE.</p>
        <h2 id="merch-title">DRESS ACCORDINGLY.</h2>
        <span>Extremely official garments for unofficial people.</span>
      </div>
      <div className="shirt" aria-label="Black T-shirt reading 2 Studs 1 Chud">
        <div className="shirt-sleeve left" />
        <div className="shirt-body"><span>2 STUDS</span><strong>1 CHUD</strong></div>
        <div className="shirt-sleeve right" />
      </div>
      <button type="button" disabled>MERCH SOON</button>
    </section>
  );
}
