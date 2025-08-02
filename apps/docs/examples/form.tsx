import { Button } from '@repo/shadcn-ui/components/ui/button';
import { Input } from '@repo/shadcn-ui/components/ui/input';
import { Label } from '@repo/shadcn-ui/components/ui/label';

export default function FormExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <form className="space-y-4 w-full max-w-sm">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter your password" />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
