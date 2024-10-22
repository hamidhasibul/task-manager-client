type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <div className="w-full bg-blue-100-50 border border-blue-300 py-2 rounded mb-4">
      <h3 className="text-danube-950 text-xl font-semibold text-center">
        {title}
      </h3>
    </div>
  );
}
