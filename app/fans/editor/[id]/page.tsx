type Props = {
  params: { id: string };
};

export default function EditorPage({ params }: Props) {
  return (
    <div>
      <h1>Editor for article: {params.id}</h1>
      <p>Editor component coming soon...</p>
    </div>
  );
}
