type BannerProps = { title: string };

export default function Banner({ title }: BannerProps) {
  return (
    <header className="bg-indigo-600 py-6 text-center text-white shadow">
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
