import Lightbulb from "./Lightbulb";

interface NavbarProps {
  onInitialLoad?: () => void;
}

export default function Navbar({ onInitialLoad }: NavbarProps) {
  return (
    <div className="w-full flex flex-row">
      <div className="inline-block ml-auto">
        <Lightbulb onInitialLoad={onInitialLoad} />
      </div>
    </div>
  );
}
