export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Post ID: {params.id}</h1>
      <p>This is a minimal page for debugging Vercel build errors.</p>
    </div>
  );
}
