type Props = {
  params: { slug: string };
};

export default function FanArticlePage({ params }: Props) {
  return (
    <div>
      <h1>Article: {params.slug}</h1>
      <p>Coming soon...</p>
    </div>
  );
}
