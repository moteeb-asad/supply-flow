type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="mb-1 text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm font-medium text-gray-500">{subtitle}</p>
    </div>
  );
}
