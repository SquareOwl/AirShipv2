import Link from "next/link";

export default async function IntakeThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Request received</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Your shipment request has been submitted.
      </p>
      {id ? <p>Request ID: {id}</p> : null}
      <p>
        <Link href="/intake">Submit another</Link>
      </p>
    </main>
  );
}
