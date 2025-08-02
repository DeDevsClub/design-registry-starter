import { MyButton } from '@repo/ui/components/my-button';

export default function MyButtonExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <MyButton>Default</MyButton>
      <MyButton variant="secondary">Secondary</MyButton>
      <MyButton size="sm">Small</MyButton>
      <MyButton size="lg">Large</MyButton>
    </div>
  );
}
