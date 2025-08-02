import { Toaster } from '@repo/shadcn-ui/components/ui/toaster';

export default function ToasterExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Toaster>
        Example Toaster
      </Toaster>
    </div>
  );
}
